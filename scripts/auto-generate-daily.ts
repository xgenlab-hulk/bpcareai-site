// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  getTopicsInventory,
  getTotalTopicsCount,
  selectRandomTopics,
  distributeTargetAcrossTopics,
  selectRandomTopicsForGeneration,
  type TopicWithSource,
} from '../lib/topics/manager';
import { replenishMultipleTopics } from '../lib/topics/replenish';
import { generateArticleMarkdown } from '../lib/llm/qwen-articles';
import { findSimilarArticlesForTopic } from '../lib/embeddings/similarity';
import { addEmbeddingForNewArticle } from '../lib/embeddings/incremental';
import { slugify } from '../lib/utils/slugify';
import type { ArticleFrontmatter } from '../lib/llm/qwen-articles';

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
    topics: string[];
    totalMinThreshold: number;
    targetReplenishAmount: number;
    topicsPerReplenish: number;
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
  const { topics, totalMinThreshold, targetReplenishAmount, topicsPerReplenish, replenishConfig } =
    config.topicManagement;

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Topic Inventory Check                          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 统计所有 topics 的总标题数
  const inventory = getTopicsInventory(topics);
  const totalCount = getTotalTopicsCount(topics);

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
  console.log(`   Strategy: Randomly select ${topicsPerReplenish} topics\n`);

  // 随机选择 topics
  const selectedTopics = selectRandomTopics(topics, topicsPerReplenish);
  console.log(`🎲 Randomly selected topics:`);
  selectedTopics.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t}`);
  });
  console.log('');

  // 分配目标数量
  const distribution = distributeTargetAcrossTopics(targetReplenishAmount, selectedTopics);

  // 执行补充
  const results = await replenishMultipleTopics(distribution, replenishConfig);

  // 返回实际补充的数量
  return results.reduce((sum, r) => sum + r.acceptedCount, 0);
}

/**
 * 将 frontmatter 对象转为 YAML 字符串
 */
function frontmatterToYAML(frontmatter: ArticleFrontmatter): string {
  const lines = [
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `slug: "${frontmatter.slug}"`,
    `description: "${frontmatter.description.replace(/"/g, '\\"')}"`,
    `date: "${frontmatter.date}"`,
    `updated: "${frontmatter.updated}"`,
    `tags: [${frontmatter.tags.map((t) => `"${t}"`).join(', ')}]`,
    `primaryKeyword: "${frontmatter.primaryKeyword}"`,
    `topicCluster: "${frontmatter.topicCluster}"`,
    `image: "${frontmatter.image}"`,
    `relatedSlugs: [${frontmatter.relatedSlugs.map((s) => `"${s}"`).join(', ')}]`,
  ];

  return `---\n${lines.join('\n')}\n---`;
}

/**
 * 生成指定数量的文章（从多个 topics 随机选择）
 */
async function generateArticles(
  config: AutomationConfig,
  count: number
): Promise<{ success: number; failed: number }> {
  const { topics } = config.topicManagement;

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Article Generation                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 从所有 topics 中随机选择标题
  const selectedTopics = selectRandomTopicsForGeneration(topics, count);

  if (selectedTopics.length === 0) {
    console.error('❌ No topics available for generation!');
    return { success: 0, failed: 0 };
  }

  console.log(`📚 Selected ${selectedTopics.length} topics from mixed sources:\n`);

  // 按来源统计
  const bySource = new Map<string, number>();
  selectedTopics.forEach((t) => {
    bySource.set(t.source, (bySource.get(t.source) || 0) + 1);
  });

  console.log('Distribution:');
  bySource.forEach((count, source) => {
    console.log(`   - ${source}: ${count} articles`);
  });
  console.log('\n' + '─'.repeat(60) + '\n');

  // 生成文章
  let successCount = 0;
  let failedCount = 0;
  const generatedSlugs = new Set<string>();

  for (let i = 0; i < selectedTopics.length; i++) {
    const topic = selectedTopics[i];
    const progress = `[${i + 1}/${selectedTopics.length}]`;

    try {
      console.log(`${progress} Processing: "${topic.title}"`);
      console.log(`   Source: ${topic.source}`);

      // 生成文章
      const article = await generateArticleMarkdown(topic);

      // 查找相关文章
      try {
        const similarArticles = await findSimilarArticlesForTopic({
          title: topic.title,
          description: topic.description,
          primaryKeyword: topic.primaryKeyword,
          topK: 3,
          minSimilarity: 0.6,
        });

        if (similarArticles.length > 0) {
          article.frontmatter.relatedSlugs = similarArticles.map((a) => a.slug);
          console.log(`   🔗 Found ${similarArticles.length} related articles`);
        }
      } catch (linkError) {
        console.warn(`   ⚠️  Failed to find related articles: ${linkError instanceof Error ? linkError.message : String(linkError)}`);
      }

      // 写入 Markdown 文件
      const articlesDir = path.join(process.cwd(), 'content', 'articles');
      if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
      }

      const filePath = path.join(articlesDir, `${article.slug}.md`);
      const yamlFrontmatter = frontmatterToYAML(article.frontmatter);
      const fileContent = `${yamlFrontmatter}\n\n${article.body}\n`;

      fs.writeFileSync(filePath, fileContent, 'utf8');

      // 立即保存 embedding
      try {
        await addEmbeddingForNewArticle({
          slug: article.slug,
          title: topic.title,
          description: topic.description,
          primaryKeyword: topic.primaryKeyword,
          topicCluster: topic.topicCluster,
        });
      } catch (embeddingError) {
        console.warn(`   ⚠️  Failed to save embedding: ${embeddingError instanceof Error ? embeddingError.message : String(embeddingError)}`);
      }

      generatedSlugs.add(slugify(topic.title));
      successCount++;
      console.log(`   ✅ Written to: content/articles/${article.slug}.md\n`);

      // 速率限制
      if (i < selectedTopics.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failedCount++;
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  // 更新 planned-topics 文件（移除已成功生成的标题）
  if (successCount > 0) {
    console.log('🔄 Updating planned-topics files...\n');

    const inventory = getTopicsInventory(topics);

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

  return { success: successCount, failed: failedCount };
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

  // 4. 检查库存（补充前）
  const topicsInventoryBefore = getTotalTopicsCount(config.topicManagement.topics);

  // 5. 补充 topics（如果需要）
  const topicsReplenished = await replenishTopicsIfNeeded(config);

  // 6. 检查库存（补充后）
  const topicsInventoryAfter = getTotalTopicsCount(config.topicManagement.topics);

  // 7. 生成文章
  const { success, failed } = await generateArticles(config, articlesCount);

  // 8. 重建索引
  if (success > 0) {
    rebuildArticlesIndex();
  }

  // 9. 统计结果
  const endTime = Date.now();
  const durationMin = ((endTime - startTime) / 1000 / 60).toFixed(1);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Daily Generation Summary                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`📅 Day: ${daysSinceStart}`);
  console.log(`📌 Stage: ${stage}`);
  console.log(`🎯 Target: ${articlesCount} articles`);
  console.log(`✅ Generated: ${success} articles`);
  console.log(`❌ Failed: ${failed} articles`);
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
