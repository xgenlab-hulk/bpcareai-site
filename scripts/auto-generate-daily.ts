// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  getTopicsInventory,
  getTotalTopicsCount,
  selectTopicsForReplenishment,
  selectRandomTopicsForGeneration,
  type TopicWithSource,
} from '../lib/topics/manager';
import { replenishMultipleTopics } from '../lib/topics/replenish';
import { generateArticleMarkdown } from '../lib/llm/qwen-articles';
import { findSimilarArticlesForTopic, cosineSimilarity } from '../lib/embeddings/similarity';
import { generateEmbeddingForText } from '../lib/embeddings/qwen';
import { addEmbeddingForNewArticle } from '../lib/embeddings/incremental';
import {
  addBidirectionalLinkSmart,
  loadArticleEmbeddings,
} from '../lib/embeddings/internal-linking';
import { slugify } from '../lib/utils/slugify';
import type { ArticleFrontmatter } from '../lib/llm/qwen-articles';
import type { ArticleEmbedding } from '../lib/embeddings/types';

/** 去重相似度阈值 — 超过此值的文章被丢弃 */
const DEDUP_SIMILARITY_THRESHOLD = 0.80;

/**
 * 自动化配置
 */
interface AutomationConfig {
  projectStartDate: string;
  stages: {
    dayRange: [number, number];
    articlesPerDay: number;
    description: string;
  }[];
  topicManagement: {
    coreTopics?: {
      keyword: string;
      angles: string[];
    }[];
    totalMinThreshold: number;
    targetReplenishAmount: number;
    replenishConfig: {
      maxAttempts: number;
      duplicateThreshold: number;
      expectedPassRate: number;
      delayBetweenAttempts: number;
    };
  };
}

/**
 * 生成结果统计
 */
interface GenerationResult {
  daysSinceStart: number;
  stage: string;
  targetArticles: number;
  articlesGenerated: number;
  articlesFailed: number;
  topicsInventoryBefore: number;
  topicsInventoryAfter: number;
  topicsReplenished: number;
  success: boolean;
}

/**
 * 加载配置文件
 */
function loadConfig(): AutomationConfig {
  const configPath = path.join(process.cwd(), 'automation-config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(content);
}

/**
 * 计算自项目开始以来的天数
 */
function calculateDaysSinceStart(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();

  // 重置到当天 00:00:00
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Day 1, Day 2, etc.
}

/**
 * 根据天数确定当前阶段和文章数量
 */
function determineArticlesCount(
  config: AutomationConfig,
  daysSinceStart: number
): { articlesCount: number; stage: string } {
  const { stages } = config;

  // 检查是否在有效范围内
  if (daysSinceStart < 1) {
    console.warn(`⚠️  Warning: daysSinceStart (${daysSinceStart}) is less than 1.`);
    console.warn(`   This usually means the current date is before the projectStartDate.`);
    console.warn(`   Using the first stage configuration as fallback.\n`);
    const firstStage = stages[0];
    return {
      articlesCount: firstStage.articlesPerDay,
      stage: `${firstStage.description} (fallback - before start date)`,
    };
  }

  for (const stage of stages) {
    const [minDay, maxDay] = stage.dayRange;
    if (daysSinceStart >= minDay && daysSinceStart <= maxDay) {
      return {
        articlesCount: stage.articlesPerDay,
        stage: stage.description,
      };
    }
  }

  // 如果没有匹配的阶段，使用最后一个阶段的配置
  const lastStage = stages[stages.length - 1];
  return {
    articlesCount: lastStage.articlesPerDay,
    stage: lastStage.description,
  };
}

/**
 * 检查并补充 topics（如果需要）
 */
async function replenishTopicsIfNeeded(config: AutomationConfig): Promise<number> {
  const { totalMinThreshold, targetReplenishAmount, replenishConfig } =
    config.topicManagement;

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Topic Inventory Check                          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 统计所有 topics 的总标题数（自动扫描 data 目录）
  const inventory = getTopicsInventory();
  const totalCount = getTotalTopicsCount();

  console.log('📊 Current inventory:');
  inventory.forEach((item) => {
    console.log(`   - ${item.topic}: ${item.count} topics`);
  });
  console.log(`   ${'━'.repeat(40)}`);
  console.log(`   Total: ${totalCount} topics\n`);

  // 判断是否需要补充
  if (totalCount >= totalMinThreshold) {
    console.log(`✅ Inventory sufficient (${totalCount} >= ${totalMinThreshold})\n`);
    return 0;
  }

  console.log(`⚠️  Low inventory detected (${totalCount} < ${totalMinThreshold})`);
  console.log(`🔄 Starting auto-replenishment process...\n`);
  console.log(`   Target: Add ${targetReplenishAmount} new valid topics`);
  console.log(`   Strategy: Smart selection based on inventory levels\n`);

  // 智能选择并分配（按库存量优先补充）
  const distribution = selectTopicsForReplenishment(targetReplenishAmount);

  console.log(`🎯 Smart distribution plan:`);
  distribution.forEach((count, topic) => {
    const currentCount = inventory.find(item => item.topic === topic)?.count || 0;
    console.log(`   - ${topic}: ${currentCount} → ${currentCount + count} (+${count})`);
  });
  console.log('');

  // 为每个topic查找对应的angles配置
  const coreTopics = config.topicManagement.coreTopics || [];

  // 执行补充（每个topic携带其angles）
  const results = await replenishMultipleTopics(distribution, {
    ...replenishConfig,
  }, coreTopics);

  // 返回实际补充的数量
  return results.reduce((sum, r) => sum + r.acceptedCount, 0);
}

/**
 * 清理文本字段，确保不含会破坏 YAML 的字符
 */
function sanitizeForYAML(text: string): string {
  return text
    .replace(/\n/g, ' ')     // 移除换行
    .replace(/\r/g, '')      // 移除回车
    .replace(/\t/g, ' ')     // Tab 替换为空格
    .replace(/\s+/g, ' ')    // 多空格合并
    .trim();
}

/**
 * 将 frontmatter 对象转为 YAML 字符串
 * v2.1: 使用 >- 折叠格式 + sanitize，确保 YAML 绝对安全
 */
function frontmatterToYAML(frontmatter: ArticleFrontmatter): string {
  // 安全清理所有文本字段
  const title = sanitizeForYAML(frontmatter.title);
  const description = sanitizeForYAML(frontmatter.description);
  const primaryKeyword = sanitizeForYAML(frontmatter.primaryKeyword);
  const slug = frontmatter.slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const topicCluster = frontmatter.topicCluster.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

  // 使用 >- 格式写入长文本字段
  const relatedSlugsYAML = frontmatter.relatedSlugs.length > 0
    ? `relatedSlugs:\n${frontmatter.relatedSlugs.map((s) => `  - >-\n    ${sanitizeForYAML(s)}`).join('\n')}`
    : `relatedSlugs: []`;

  const lines = [
    `title: >-`,
    `  ${title}`,
    `slug: ${slug}`,
    `description: >-`,
    `  ${description}`,
    `date: '${frontmatter.date}'`,
    `updated: '${frontmatter.updated}'`,
    `primaryKeyword: >-`,
    `  ${primaryKeyword}`,
    `topicCluster: ${topicCluster}`,
    `image: '${frontmatter.image}'`,
    relatedSlugsYAML,
  ];

  const yaml = `---\n${lines.join('\n')}\n---`;

  // 最终安全检查：验证生成的 YAML 不含连续 --- （除了首尾分隔符）
  const innerContent = yaml.slice(4, -4); // 去掉首尾 ---
  if (innerContent.includes('---')) {
    console.error('   ❌ YAML safety check failed: inner content contains ---');
    throw new Error('YAML safety check failed');
  }

  return yaml;
}

/**
 * 生成后去重检查：用优化后的metadata生成embedding，与已有文章对比
 * 返回最高相似度和最相似的文章slug
 */
async function checkArticleDuplicate(
  title: string,
  description: string,
  primaryKeyword: string,
  existingEmbeddings: ArticleEmbedding[]
): Promise<{ maxSimilarity: number; mostSimilarSlug: string; embedding: number[] }> {
  const inputText = `${title}\n${description}\nPrimary keyword: ${primaryKeyword}`;
  const newEmbedding = await generateEmbeddingForText(inputText);

  let maxSimilarity = 0;
  let mostSimilarSlug = '';

  for (const article of existingEmbeddings) {
    const similarity = cosineSimilarity(newEmbedding, article.embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarSlug = article.slug;
    }
  }

  return { maxSimilarity, mostSimilarSlug, embedding: newEmbedding };
}

/**
 * 读取紧急选题（线2：突发趋势触发的选题）
 * 返回未过期的紧急选题，转为TopicWithSource格式
 */
function loadUrgentTopics(): TopicWithSource[] {
  const urgentPath = path.join(process.cwd(), 'data', 'seo', 'urgent-topics.json');
  if (!fs.existsSync(urgentPath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(urgentPath, 'utf8'));
    const now = new Date().toISOString();

    return data
      .filter((t: any) => t.expiresAt > now)
      .map((t: any) => ({
        title: t.title || `Article about: ${t.query}`,
        description: t.description || t.reason || '',
        primaryKeyword: t.primaryKeyword || t.query,
        topicCluster: t.topicCluster || 'gsc-trending',
        coreKeyword: t.query,
        createdAt: t.createdAt,
        source: 'gsc-urgent' as const,
        perplexityQuestions: t.perplexityQuestions || [],
      }));
  } catch {
    return [];
  }
}

/**
 * 清除已消费的紧急选题
 */
function clearConsumedUrgentTopics(consumedPKs: Set<string>): void {
  const urgentPath = path.join(process.cwd(), 'data', 'seo', 'urgent-topics.json');
  if (!fs.existsSync(urgentPath)) return;

  try {
    const data = JSON.parse(fs.readFileSync(urgentPath, 'utf8'));
    const remaining = data.filter((t: any) => !consumedPKs.has(t.suggestedPK));
    fs.writeFileSync(urgentPath, JSON.stringify(remaining, null, 2), 'utf8');
  } catch { /* ignore */ }
}

/**
 * 生成指定数量的文章（紧急选题优先 + 均衡选取 + 生成后去重 + 备选替补）
 */
async function generateArticles(
  config: AutomationConfig,
  count: number
): Promise<{ success: number; failed: number; dedupDiscarded: number }> {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Article Generation                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 检查紧急选题（线2）
  const urgentTopics = loadUrgentTopics();
  if (urgentTopics.length > 0) {
    console.log(`🚨 Found ${urgentTopics.length} urgent topics from GSC trends\n`);
    for (const ut of urgentTopics) {
      console.log(`   → "${ut.primaryKeyword}"`);
    }
    console.log('');
  }

  // 从选题库取常规选题 + 备选
  const regularPoolSize = count + 3 - urgentTopics.length;
  const regularPool = selectRandomTopicsForGeneration(Math.max(regularPoolSize, count));

  // 合并：紧急选题排在前面
  const topicPool = [...urgentTopics, ...regularPool];

  if (topicPool.length === 0) {
    console.error('❌ No topics available for generation!');
    return { success: 0, failed: 0, dedupDiscarded: 0 };
  }

  console.log(`📚 Selected ${topicPool.length} topics (${count} target + ${topicPool.length - count} backup):\n`);

  // 按来源统计
  const bySource = new Map<string, number>();
  topicPool.forEach((t) => {
    bySource.set(t.source, (bySource.get(t.source) || 0) + 1);
  });
  console.log('Distribution:');
  bySource.forEach((cnt, source) => {
    console.log(`   - ${source}: ${cnt} topics`);
  });
  console.log('\n' + '─'.repeat(60) + '\n');

  // 预加载已有文章的embedding（用于去重检查）
  let existingEmbeddings: ArticleEmbedding[] = [];
  try {
    existingEmbeddings = loadArticleEmbeddings();
    console.log(`📊 Loaded ${existingEmbeddings.length} existing embeddings for dedup check\n`);
  } catch (err) {
    console.warn(`⚠️  Could not load embeddings for dedup: ${err instanceof Error ? err.message : String(err)}`);
    console.warn(`   Dedup check will be skipped\n`);
  }

  // 生成文章（逐篇生成，去重失败则从备选池取下一个）
  let successCount = 0;
  let failedCount = 0;
  let dedupDiscarded = 0;
  let topicIndex = 0;
  const generatedSlugs = new Set<string>();

  while (successCount < count && topicIndex < topicPool.length) {
    const topic = topicPool[topicIndex];
    topicIndex++;

    const progress = `[${successCount + 1}/${count}]`;

    try {
      console.log(`${progress} Processing: "${topic.title}"`);
      console.log(`   Source: ${topic.source}`);

      // Step 1: 生成文章
      const article = await generateArticleMarkdown(topic);

      // Step 2: 生成后去重检查
      if (existingEmbeddings.length > 0) {
        console.log(`   🔍 Dedup check...`);
        const { maxSimilarity, mostSimilarSlug, embedding: articleEmbedding } = await checkArticleDuplicate(
          article.frontmatter.title,
          article.frontmatter.description,
          article.frontmatter.primaryKeyword,
          existingEmbeddings
        );

        console.log(`   📊 Max similarity: ${maxSimilarity.toFixed(3)} (threshold: ${DEDUP_SIMILARITY_THRESHOLD})`);

        if (maxSimilarity > DEDUP_SIMILARITY_THRESHOLD) {
          console.log(`   ⚠️  Too similar to "${mostSimilarSlug}" (${maxSimilarity.toFixed(3)})`);
          console.log(`   🔄 Regenerating with different angle...`);

          // 保留选题，但告诉LLM换角度重新写
          const retryTopic = {
            ...topic,
            title: topic.title,
            description: `Write a DIFFERENT angle from the existing article "${mostSimilarSlug}". ${topic.description}`,
          };

          try {
            const retryArticle = await generateArticleMarkdown(retryTopic);

            // 再次去重
            const { maxSimilarity: retrySim, embedding: retryEmbedding } = await checkArticleDuplicate(
              retryArticle.frontmatter.title,
              retryArticle.frontmatter.description,
              retryArticle.frontmatter.primaryKeyword,
              existingEmbeddings
            );

            if (retrySim > DEDUP_SIMILARITY_THRESHOLD) {
              console.log(`   🚫 Retry still too similar (${retrySim.toFixed(3)}), skipping this topic\n`);
              dedupDiscarded++;
              generatedSlugs.add(slugify(topic.title));
              continue;
            }

            // 重试成功，用新文章替换
            console.log(`   ✅ Retry passed (${retrySim.toFixed(3)})`);
            Object.assign(article, retryArticle);

            // 追加重试文章的embedding到对比池，防止同批次重复
            existingEmbeddings.push({
              slug: article.slug,
              title: retryArticle.frontmatter.title,
              primaryKeyword: retryArticle.frontmatter.primaryKeyword,
              topicCluster: retryArticle.frontmatter.topicCluster,
              embedding: retryEmbedding,
            });
          } catch (retryErr: any) {
            console.log(`   ❌ Retry failed: ${retryErr.message}, skipping\n`);
            dedupDiscarded++;
            generatedSlugs.add(slugify(topic.title));
            continue;
          }
        } else {
          // 去重通过，追加embedding到对比池，防止同批次后续文章重复
          existingEmbeddings.push({
            slug: article.slug,
            title: article.frontmatter.title,
            primaryKeyword: article.frontmatter.primaryKeyword,
            topicCluster: article.frontmatter.topicCluster,
            embedding: articleEmbedding,
          });
        }
        console.log(`   ✅ Dedup passed`);
      }

      // Step 3: 智能内链 — 使用优化后的metadata
      try {
        const similarArticles = await findSimilarArticlesForTopic({
          title: article.frontmatter.title,
          description: article.frontmatter.description,
          primaryKeyword: article.frontmatter.primaryKeyword,
          topK: 5,
          minSimilarity: 0.5,
        });

        const selectedArticles = similarArticles.slice(0, Math.max(3, Math.min(5, similarArticles.length)));

        if (selectedArticles.length > 0) {
          article.frontmatter.relatedSlugs = selectedArticles.map((a) => a.slug);
          console.log(`   🔗 Found ${selectedArticles.length} related articles`);

          const allEmbeddings = loadArticleEmbeddings();
          let bidirectionalCount = 0;

          for (const oldArticle of selectedArticles) {
            try {
              const success = addBidirectionalLinkSmart(
                oldArticle.slug,
                article.slug,
                allEmbeddings,
                5
              );
              if (success) bidirectionalCount++;
            } catch (reverseError) {
              console.warn(`   ⚠️  Failed reverse link for ${oldArticle.slug}: ${reverseError instanceof Error ? reverseError.message : String(reverseError)}`);
            }
          }

          if (bidirectionalCount > 0) {
            console.log(`   ↔️  Bidirectional links: ${bidirectionalCount}/${selectedArticles.length}`);
          }
        } else {
          console.warn(`   ⚠️  No similar articles found`);
          article.frontmatter.relatedSlugs = [];
        }
      } catch (linkError) {
        console.warn(`   ⚠️  Internal linking failed: ${linkError instanceof Error ? linkError.message : String(linkError)}`);
        article.frontmatter.relatedSlugs = [];
      }

      // Step 4: 写入文件
      const articlesDir = path.join(process.cwd(), 'content', 'articles');
      if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
      }

      const filePath = path.join(articlesDir, `${article.slug}.md`);
      const yamlFrontmatter = frontmatterToYAML(article.frontmatter);
      const fileContent = `${yamlFrontmatter}\n\n${article.body}\n`;

      fs.writeFileSync(filePath, fileContent, 'utf8');

      // Step 5: 保存 embedding（用优化后的metadata）
      try {
        await addEmbeddingForNewArticle({
          slug: article.slug,
          title: article.frontmatter.title,
          description: article.frontmatter.description,
          primaryKeyword: article.frontmatter.primaryKeyword,
          topicCluster: article.frontmatter.topicCluster,
        });
      } catch (embeddingError) {
        console.warn(`   ⚠️  Failed to save embedding: ${embeddingError instanceof Error ? embeddingError.message : String(embeddingError)}`);
      }

      generatedSlugs.add(slugify(topic.title));
      successCount++;
      console.log(`   ✅ Written to: content/articles/${article.slug}.md\n`);

      // 速率限制
      await new Promise((resolve) => setTimeout(resolve, 1000));

    } catch (error) {
      failedCount++;
      generatedSlugs.add(slugify(topic.title)); // 失败的也从选题库移除
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  if (successCount < count) {
    console.warn(`\n⚠️  Only generated ${successCount}/${count} articles (pool exhausted)`);
  }

  // 更新 planned-topics 文件（移除已消耗+被丢弃的选题）
  if (generatedSlugs.size > 0) {
    console.log('🔄 Updating planned-topics files...\n');

    const inventory = getTopicsInventory();

    inventory.forEach((item) => {
      const remainingTopics = item.topics.filter((t) => !generatedSlugs.has(slugify(t.title)));

      if (remainingTopics.length !== item.topics.length) {
        fs.writeFileSync(item.filePath, JSON.stringify(remainingTopics, null, 2), 'utf8');
        const removed = item.topics.length - remainingTopics.length;
        console.log(`   ✅ ${item.topic}: ${removed} topics consumed, ${remainingTopics.length} remaining`);
      }
    });

    console.log('');
  }

  // 去重统计
  if (dedupDiscarded > 0) {
    console.log(`📊 Dedup summary: ${dedupDiscarded} articles discarded (similarity > ${DEDUP_SIMILARITY_THRESHOLD})\n`);
  }

  return { success: successCount, failed: failedCount, dedupDiscarded };
}

/**
 * 重建文章索引
 */
function rebuildArticlesIndex(): void {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Rebuilding Articles Index                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    execSync('npm run build:articles-index', { stdio: 'inherit' });
    console.log('\n✅ Articles index rebuilt successfully\n');
  } catch (error) {
    console.error('\n❌ Failed to rebuild articles index:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main(): Promise<GenerationResult> {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║      Daily Article Generation Automation              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  // 1. 加载配置
  const config = loadConfig();
  console.log(`📅 Project start date: ${config.projectStartDate}`);

  // 2. 计算天数
  const daysSinceStart = calculateDaysSinceStart(config.projectStartDate);
  console.log(`📊 Days since start: Day ${daysSinceStart}\n`);

  // 3. 确定今天的文章数量
  let articlesCount: number;
  let stage: string;

  // 检查是否有环境变量覆盖（用于手动执行）
  const overrideCount = process.env.ARTICLES_COUNT_OVERRIDE;
  if (overrideCount && !isNaN(parseInt(overrideCount, 10))) {
    articlesCount = parseInt(overrideCount, 10);
    stage = 'Manual override';
    console.log(`🔧 Manual override detected!`);
    console.log(`📌 Stage: ${stage}`);
    console.log(`🎯 Target articles: ${articlesCount} (overridden)\n`);
  } else {
    const result = determineArticlesCount(config, daysSinceStart);
    articlesCount = result.articlesCount;
    stage = result.stage;
    console.log(`📌 Current stage: ${stage}`);
    console.log(`🎯 Target articles: ${articlesCount}\n`);
  }

  // 4. 检查库存（补充前）- 自动扫描 data 目录
  const topicsInventoryBefore = getTotalTopicsCount();

  // 5. 补充 topics（如果需要）
  const topicsReplenished = await replenishTopicsIfNeeded(config);

  // 6. 检查库存（补充后）- 自动扫描 data 目录
  const topicsInventoryAfter = getTotalTopicsCount();

  // 7. 生成文章
  const { success, failed, dedupDiscarded } = await generateArticles(config, articlesCount);

  // 8. 重建索引
  if (success > 0) {
    rebuildArticlesIndex();
  }

  // 9. 统计结果
  const endTime = Date.now();
  const durationMinutes = (endTime - startTime) / 1000 / 60;
  const durationMin = durationMinutes.toFixed(1);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Daily Generation Summary                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`📅 Day: ${daysSinceStart}`);
  console.log(`📌 Stage: ${stage}`);
  console.log(`🎯 Target: ${articlesCount} articles`);
  console.log(`✅ Generated: ${success} articles`);
  console.log(`❌ Failed: ${failed} articles`);
  console.log(`🚫 Dedup discarded: ${dedupDiscarded} articles`);
  console.log(`📚 Topics inventory: ${topicsInventoryBefore} → ${topicsInventoryAfter}`);
  console.log(`➕ Topics replenished: ${topicsReplenished}`);
  console.log(`⏱️  Duration: ${durationMin} minutes\n`);

  const result: GenerationResult = {
    daysSinceStart,
    stage,
    targetArticles: articlesCount,
    articlesGenerated: success,
    articlesFailed: failed,
    topicsInventoryBefore,
    topicsInventoryAfter,
    topicsReplenished,
    success: success === articlesCount && failed === 0,
  };

  console.log('═'.repeat(60));
  console.log(result.success ? '✨ Daily generation completed successfully!' : '⚠️  Daily generation completed with issues');
  console.log('═'.repeat(60));
  console.log('');

  return result;
}

// 执行主函数
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
