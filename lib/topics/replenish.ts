import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '../articles/types';
import type { ArticleEmbedding } from '../embeddings/types';
import { generateTopicCandidatesForKeyword } from '../llm/qwen-topics';
import { checkTopicDuplicateWithExtra, buildTopicInputText } from '../embeddings/similarity';
import { generateEmbeddingForText } from '../embeddings/qwen';
import { cacheTopicEmbedding } from './embedding-cache';
import { slugify } from '../utils/slugify';
import type { PlannedTopic } from './manager';

/**
 * 补充结果
 */
export interface ReplenishResult {
  topic: string;
  targetCount: number;
  candidatesGenerated: number;
  acceptedCount: number;
  duplicateCount: number;
  attempts: number;
  success: boolean;
}

/**
 * 补充配置
 */
export interface ReplenishConfig {
  maxAttempts?: number;           // 最大尝试次数，默认 10
  duplicateThreshold?: number;    // 语义查重阈值，默认 0.85
  expectedPassRate?: number;      // 预期通过率，默认 0.7
  delayBetweenAttempts?: number;  // 每轮之间的延迟（毫秒），默认 300
  angles?: string[];              // 需要覆盖的子方向（从config读取）
}

/**
 * 为单个 topic 循环补充标题，直到达到目标数量
 */
export async function replenishTopicUntilTarget(
  topic: string,
  targetCount: number,
  config: ReplenishConfig = {}
): Promise<ReplenishResult> {
  const {
    maxAttempts = 10,
    duplicateThreshold = 0.85,
    expectedPassRate = 0.7,
    delayBetweenAttempts = 300,
    angles = [],
  } = config;

  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  Replenishing Topic: ${topic.padEnd(36)}║`);
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`🎯 Target: ${targetCount} valid topics\n`);

  // 1. 准备文件路径
  const dataDir = path.join(process.cwd(), 'data');
  const slug = slugify(topic);
  const topicsFilePath = path.join(dataDir, `planned-topics-${slug}.json`);

  // 2. 加载已有文章数据（用于查重）
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  if (!fs.existsSync(indexPath)) {
    throw new Error('articles-index.json not found. Please run "npm run build:articles-index" first.');
  }

  const articlesData = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);
  const existingTitles = articles.map((a) => a.title);

  // 3. 加载已有的 planned topics（如果存在）
  let existingPlannedTopics: PlannedTopic[] = [];
  if (fs.existsSync(topicsFilePath)) {
    try {
      const content = fs.readFileSync(topicsFilePath, 'utf8');
      existingPlannedTopics = JSON.parse(content);
    } catch (error) {
      console.warn(`⚠️  Failed to read existing planned topics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const initialCount = existingPlannedTopics.length;
  console.log(`📚 Existing planned topics: ${initialCount}`);
  console.log(`📊 Published articles: ${existingTitles.length}\n`);

  // 4. 循环生成直到达到目标
  let totalCandidates = 0;
  let totalAccepted = 0;
  let totalDuplicates = 0;
  let attempts = 0;

  const allPlannedTopics: PlannedTopic[] = [...existingPlannedTopics];
  const plannedTitles = new Set(allPlannedTopics.map((t) => t.title.toLowerCase().trim()));

  // 🔥 新增：维护本次新接受的 topics 的 embeddings（用于查重）
  const newAcceptedEmbeddings: ArticleEmbedding[] = [];

  console.log('─'.repeat(60));

  while (totalAccepted < targetCount && attempts < maxAttempts) {
    attempts++;

    const remaining = targetCount - totalAccepted;
    // 根据预期通过率，计算本轮需要生成的候选数量
    const batchSize = Math.max(10, Math.ceil(remaining / expectedPassRate));

    console.log(`\n🔁 Attempt ${attempts}/${maxAttempts}`);
    console.log(`   Progress: ${totalAccepted}/${targetCount} accepted`);
    console.log(`   Generating ${batchSize} candidates...\n`);

    try {
      // 生成候选（传PK列表和子方向要求）
      const existingPKs = articles.map((a) => a.primaryKeyword).filter(Boolean);
      const candidates = await generateTopicCandidatesForKeyword({
        coreKeyword: topic,
        existingTitles,
        existingPKs,
        alreadyPlannedTitles: Array.from(plannedTitles),
        angles,
        batchSize,
      });

      totalCandidates += candidates.length;

      let acceptedInRound = 0;
      let duplicatesInRound = 0;

      // 检查每个候选
      for (const candidate of candidates) {
        // 如果已达到目标，停止
        if (totalAccepted >= targetCount) {
          break;
        }

        try {
          // 🔥 步骤 1：为候选生成 embedding（用于查重和缓存）
          const candidateText = buildTopicInputText({
            title: candidate.title,
            description: candidate.description,
            primaryKeyword: candidate.primaryKeyword || topic,
          });
          const candidateEmbedding = await generateEmbeddingForText(candidateText);

          // 🔥 步骤 2：语义查重（与已发布文章 + 本轮新接受的 topics 比较）
          const result = await checkTopicDuplicateWithExtra({
            title: candidate.title,
            description: candidate.description,
            primaryKeyword: candidate.primaryKeyword || topic,
            duplicateThreshold,
            extraEmbeddings: newAcceptedEmbeddings,  // 包含本轮新接受的
          });

          if (result.isDuplicate) {
            // 重复，跳过
            duplicatesInRound++;
            const mostSimilar = result.mostSimilar!;
            console.log(
              `   🚫 Duplicate: "${candidate.title.substring(0, 40)}..." ` +
                `(similar to "${mostSimilar.title.substring(0, 30)}..." @ ${result.maxSimilarity.toFixed(2)})`
            );
          } else {
            // 🔥 步骤 3：通过查重，接受该 topic
            const newTopic: PlannedTopic = {
              ...candidate,
              coreKeyword: topic,
              createdAt: new Date().toISOString(),
            };

            allPlannedTopics.push(newTopic);
            plannedTitles.add(newTopic.title.toLowerCase().trim());

            // 🔥 步骤 4：将 embedding 添加到临时列表（供后续查重使用）
            newAcceptedEmbeddings.push({
              slug: slugify(candidate.title),
              title: candidate.title,
              primaryKeyword: candidate.primaryKeyword || topic,
              topicCluster: candidate.topicCluster,
              embedding: candidateEmbedding,
            });

            // 🔥 步骤 5：缓存 embedding（供生成文章时复用）
            try {
              cacheTopicEmbedding(
                candidate.title,
                candidate.primaryKeyword || topic,
                candidateEmbedding
              );
            } catch (cacheError) {
              console.warn(`   ⚠️  Failed to cache embedding: ${cacheError instanceof Error ? cacheError.message : String(cacheError)}`);
            }

            acceptedInRound++;
            totalAccepted++;

            console.log(
              `   ✅ Accepted: "${candidate.title}" ` +
                `(max similarity: ${result.maxSimilarity.toFixed(2)})`
            );
          }

          // 速率限制
          await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
        } catch (error) {
          console.error(
            `   ⚠️  Error checking "${candidate.title}": ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      totalDuplicates += duplicatesInRound;

      console.log(`\n📊 Round ${attempts} summary:`);
      console.log(`   Candidates: ${candidates.length}`);
      console.log(`   Accepted: ${acceptedInRound}`);
      console.log(`   Duplicates: ${duplicatesInRound}`);
      console.log(`   Total accepted: ${totalAccepted}/${targetCount}`);

      // 如果本轮接受率太低（< 10%），可能主题快饱和了
      const passRate = candidates.length > 0 ? acceptedInRound / candidates.length : 0;
      if (passRate < 0.1 && remaining > 10) {
        console.warn(`\n⚠️  Low acceptance rate (${(passRate * 100).toFixed(1)}%)`);
        console.warn(`   Topic "${topic}" may be approaching saturation`);
        console.warn(`   Consider using related subtopics or different angles\n`);
        break;
      }
    } catch (error) {
      console.error(`\n❌ Error in attempt ${attempts}:`, error);
      console.log(`   Continuing to next attempt...\n`);
    }
  }

  console.log('\n' + '─'.repeat(60));

  // 5. 保存结果
  if (totalAccepted > 0) {
    // 确保 data 目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 写入文件（覆盖模式，因为我们已经包含了之前的内容）
    fs.writeFileSync(topicsFilePath, JSON.stringify(allPlannedTopics, null, 2), 'utf8');

    console.log(`\n💾 Saved to: ${path.basename(topicsFilePath)}`);
    console.log(`   Total topics in file: ${allPlannedTopics.length} (${initialCount} + ${totalAccepted})`);
  }

  // 6. 输出结果
  const success = totalAccepted >= targetCount;

  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  if (success) {
    console.log(`║  ✅ TARGET REACHED: ${topic.padEnd(35)}║`);
  } else {
    console.log(`║  ⚠️  PARTIAL SUCCESS: ${topic.padEnd(32)}║`);
  }
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`   Target: ${targetCount} | Accepted: ${totalAccepted}`);
  console.log(`   Attempts: ${attempts} | Duplicates: ${totalDuplicates}`);
  console.log(`   Candidates generated: ${totalCandidates}\n`);

  if (!success && totalAccepted > 0) {
    console.log(`💡 Tip: Consider using related subtopics or different angles for "${topic}"\n`);
  }

  return {
    topic,
    targetCount,
    candidatesGenerated: totalCandidates,
    acceptedCount: totalAccepted,
    duplicateCount: totalDuplicates,
    attempts,
    success,
  };
}

/**
 * CoreTopic 配置（从 automation-config.json 读取）
 */
export interface CoreTopicConfig {
  keyword: string;
  angles: string[];
}

/**
 * 为多个 topics 批量补充标题
 */
export async function replenishMultipleTopics(
  distribution: Map<string, number>,
  config: ReplenishConfig = {},
  coreTopics: CoreTopicConfig[] = []
): Promise<ReplenishResult[]> {
  const results: ReplenishResult[] = [];
  const topics = Array.from(distribution.keys());

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Multi-Topic Replenishment Process              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('📋 Distribution plan:');
  distribution.forEach((count, topic) => {
    console.log(`   - ${topic}: ${count} topics`);
  });
  console.log('');

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const targetCount = distribution.get(topic)!;

    // 查找该topic对应的angles配置
    const topicConfig = coreTopics.find(ct =>
      topic.toLowerCase().includes(ct.keyword.toLowerCase()) ||
      ct.keyword.toLowerCase().includes(topic.toLowerCase())
    );
    const topicAngles = topicConfig?.angles || [];

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Processing ${i + 1}/${topics.length}: "${topic}"`);
    if (topicAngles.length > 0) {
      console.log(`Angles: ${topicAngles.join(', ')}`);
    }
    console.log(`${'═'.repeat(60)}`);

    const result = await replenishTopicUntilTarget(topic, targetCount, {
      ...config,
      angles: topicAngles,
    });
    results.push(result);

    // 延迟一下再处理下一个 topic
    if (i < topics.length - 1) {
      console.log(`\n⏳ Waiting 2 seconds before next topic...\n`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // 汇总结果
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║          Replenishment Summary                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let totalAdded = 0;
  let totalCandidates = 0;

  results.forEach((r) => {
    const status = r.success ? '✅' : '⚠️ ';
    console.log(`${status} ${r.topic}:`);
    console.log(`   Target: ${r.targetCount} | Accepted: ${r.acceptedCount} | Attempts: ${r.attempts}`);
    totalAdded += r.acceptedCount;
    totalCandidates += r.candidatesGenerated;
  });

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✨ Total new topics added: ${totalAdded}`);
  console.log(`📊 Total candidates generated: ${totalCandidates}`);
  console.log(`📈 Overall acceptance rate: ${totalCandidates > 0 ? ((totalAdded / totalCandidates) * 100).toFixed(1) : 0}%`);
  console.log(`${'═'.repeat(60)}\n`);

  return results;
}
