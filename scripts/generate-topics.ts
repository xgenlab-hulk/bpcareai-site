// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '../lib/articles/types';
import { generateTopicCandidatesForKeyword } from '../lib/llm/qwen-topics';
import { checkTopicDuplicate } from '../lib/embeddings/similarity';
import { slugify } from '../lib/utils/slugify';

/**
 * 计划中的选题
 */
interface PlannedTopic {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  coreKeyword: string;
  createdAt: string; // ISO string
}

/**
 * 常量配置
 */
const MAX_ATTEMPTS = 5;           // 最大尝试轮次
const DEFAULT_TARGET_COUNT = 30;  // 默认目标选题数量
const BATCH_SIZE = 30;            // 每轮生成的候选数量
const DUPLICATE_THRESHOLD = 0.85; // 语义查重阈值

/**
 * 打印使用说明
 */
function printUsage() {
  console.log(`
Usage:
  npm run generate:topics -- "coreKeyword" [targetCount] [--replace]

Examples:
  npm run generate:topics -- "blood pressure"
  npm run generate:topics -- "hypertension" 15
  npm run generate:topics -- "heart health" 50 --replace

Arguments:
  - coreKeyword: Required, the main keyword/topic to generate articles about
  - targetCount: Optional, number of topics to generate (default: 30)
  - --replace: Optional, force overwrite existing file (default: append mode)
`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);

  // 检查参数
  if (args.length === 0) {
    console.error('❌ Error: coreKeyword is required\n');
    printUsage();
    process.exit(1);
  }

  // 解析参数
  const coreKeyword = args[0];
  const replaceMode = args.includes('--replace');

  // 过滤掉标志参数，获取 targetCount
  const numericArgs = args.filter(arg => !arg.startsWith('--'));
  const targetCount = numericArgs[1] ? parseInt(numericArgs[1], 10) : DEFAULT_TARGET_COUNT;

  if (isNaN(targetCount) || targetCount <= 0) {
    console.error('❌ Error: targetCount must be a positive number\n');
    printUsage();
    process.exit(1);
  }

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Automatic Topic Generation System              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📌 Core keyword: "${coreKeyword}"`);
  console.log(`🎯 Target count: ${targetCount} topics\n`);

  // 1. 检查必要文件
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ Error: articles-index.json not found');
    console.error('Please run "npm run build:articles-index" first\n');
    process.exit(1);
  }

  if (!fs.existsSync(embeddingsPath)) {
    console.error('❌ Error: articles-embeddings.json not found');
    console.error('Please run the following commands first:');
    console.error('  1. npm run build:articles-index');
    console.error('  2. npm run build:embeddings\n');
    process.exit(1);
  }

  // 2. 加载已有文章数据
  console.log('📚 Loading existing articles...');
  const articlesData = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);
  const existingTitles = articles.map((a) => a.title);
  console.log(`   ✅ Loaded ${existingTitles.length} existing articles\n`);

  // 3. 开始生成选题
  const plannedTopics: PlannedTopic[] = [];
  let attempts = 0;

  console.log('🔄 Starting topic generation loop...\n');

  while (plannedTopics.length < targetCount && attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`${'─'.repeat(60)}`);
    console.log(`🔁 Attempt ${attempts}/${MAX_ATTEMPTS}`);
    console.log(`   Current progress: ${plannedTopics.length}/${targetCount} topics`);

    try {
      // 生成候选标题
      const alreadyPlannedTitles = plannedTopics.map((t) => t.title);
      const candidates = await generateTopicCandidatesForKeyword({
        coreKeyword,
        existingTitles,
        alreadyPlannedTitles,
        batchSize: BATCH_SIZE,
      });

      console.log(`\n🔍 Checking ${candidates.length} candidates for duplicates...\n`);

      let acceptedCount = 0;
      let duplicateCount = 0;

      // 检查每个候选
      for (const candidate of candidates) {
        // 如果已达到目标数量，停止检查
        if (plannedTopics.length >= targetCount) {
          break;
        }

        try {
          // 调用语义查重
          const result = await checkTopicDuplicate({
            title: candidate.title,
            description: candidate.description,
            primaryKeyword: candidate.primaryKeyword || coreKeyword,
            duplicateThreshold: DUPLICATE_THRESHOLD,
          });

          if (result.isDuplicate) {
            // 重复，跳过
            duplicateCount++;
            const mostSimilar = result.mostSimilar!;
            console.log(
              `   🚫 Duplicate: "${candidate.title.substring(0, 50)}..." ` +
              `(similar to "${mostSimilar.title.substring(0, 30)}..." with ${result.maxSimilarity.toFixed(2)})`
            );
          } else {
            // 接受
            acceptedCount++;
            plannedTopics.push({
              ...candidate,
              coreKeyword,
              createdAt: new Date().toISOString(),
            });
            console.log(
              `   ✅ Accepted: "${candidate.title}" ` +
              `(max similarity: ${result.maxSimilarity.toFixed(2)})`
            );
          }

          // 简单的速率限制
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(
            `   ⚠️  Error checking "${candidate.title}": ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      console.log(`\n📊 Round ${attempts} summary:`);
      console.log(`   Candidates: ${candidates.length}`);
      console.log(`   Accepted: ${acceptedCount}`);
      console.log(`   Duplicates: ${duplicateCount}`);
      console.log(`   Total planned: ${plannedTopics.length}/${targetCount}\n`);
    } catch (error) {
      console.error(`\n❌ Error in attempt ${attempts}:`, error);
      console.log(`   Continuing to next attempt...\n`);
    }
  }

  console.log(`${'═'.repeat(60)}\n`);

  // 4. 输出结果
  if (plannedTopics.length < targetCount) {
    console.log(
      `⚠️  Only generated ${plannedTopics.length} topics (target was ${targetCount})`
    );
    console.log(`   Writing partial result...\n`);
  } else {
    console.log(`✅ Target reached: ${plannedTopics.length} topics planned\n`);
  }

  // 5. 准备写入文件
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const slug = slugify(coreKeyword);
  const outputPath = path.join(dataDir, `planned-topics-${slug}.json`);

  let finalTopics: PlannedTopic[] = plannedTopics;
  let existingTopicsCount = 0;
  let newTopicsCount = plannedTopics.length;
  let duplicateTopicsCount = 0;

  // 检查文件是否已存在
  if (fs.existsSync(outputPath)) {
    if (replaceMode) {
      // 覆盖模式：直接使用新生成的选题
      console.log(`📂 Existing file found: ${path.basename(outputPath)}`);
      console.log(`   Mode: REPLACE (overwriting existing file)`);
      console.log(`   Previous topics will be lost\n`);
    } else {
      // 追加模式：合并新旧选题
      console.log(`📂 Existing file found: ${path.basename(outputPath)}`);

      try {
        const existingData = fs.readFileSync(outputPath, 'utf8');
        const existingTopics: PlannedTopic[] = JSON.parse(existingData);
        existingTopicsCount = existingTopics.length;

        console.log(`   Mode: APPEND (merging with existing topics)`);
        console.log(`   Existing topics: ${existingTopicsCount}`);

        // 合并选题，按 title 去重（保留旧的）
        const titleSet = new Set<string>();
        const merged: PlannedTopic[] = [];

        // 先添加所有旧选题
        for (const topic of existingTopics) {
          merged.push(topic);
          titleSet.add(topic.title.toLowerCase().trim());
        }

        // 再添加新选题（跳过重复的 title）
        for (const topic of plannedTopics) {
          const normalizedTitle = topic.title.toLowerCase().trim();
          if (!titleSet.has(normalizedTitle)) {
            merged.push(topic);
            titleSet.add(normalizedTitle);
          } else {
            duplicateTopicsCount++;
          }
        }

        newTopicsCount = merged.length - existingTopicsCount;
        finalTopics = merged;

        console.log(`   New unique topics: ${newTopicsCount}`);
        console.log(`   Duplicates skipped: ${duplicateTopicsCount}`);
        console.log(`   Total after merge: ${finalTopics.length}\n`);
      } catch (error) {
        console.warn(`   ⚠️  Failed to read existing file: ${error instanceof Error ? error.message : String(error)}`);
        console.log(`   Proceeding with new topics only\n`);
      }
    }
  } else {
    console.log(`📂 Creating new file: ${path.basename(outputPath)}\n`);
  }

  // 写入文件
  fs.writeFileSync(outputPath, JSON.stringify(finalTopics, null, 2), 'utf8');

  console.log(`📝 Planned topics written to: ${outputPath}`);
  if (!replaceMode && existingTopicsCount > 0) {
    console.log(`   Summary: ${existingTopicsCount} existing + ${newTopicsCount} new = ${finalTopics.length} total`);
  } else {
    console.log(`   Total topics: ${finalTopics.length}`);
  }
  console.log(`\n${'═'.repeat(60)}`);
  console.log('✨ Topic generation completed!');
  console.log(`${'═'.repeat(60)}\n`);
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
