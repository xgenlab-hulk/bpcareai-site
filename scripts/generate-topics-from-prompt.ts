// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import type { ArticleMeta } from '../lib/articles/types';
import { extractTopicsFromPrompt, type ExtractedTopic } from '../lib/llm/qwen-topic-extraction';
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
const MAX_ATTEMPTS_PER_TOPIC = 3;  // 每个 topic 最大尝试轮次
const BATCH_SIZE = 30;              // 每轮生成的候选数量
const DUPLICATE_THRESHOLD = 0.85;   // 语义查重阈值

/**
 * 创建 readline 接口
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * 询问用户问题（Promise 封装）
 */
function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * 显示提取的 topics
 */
function displayExtractedTopics(topics: ExtractedTopic[], analysis: string) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           LLM 分析结果 - 提取的 Topics                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`📊 整体分析：${analysis}\n`);

  console.log(`✅ 共提取 ${topics.length} 个相关主题：\n`);

  topics.forEach((topic, index) => {
    console.log(`${index + 1}. 【${topic.keyword}】`);
    console.log(`   热度评分: ${'🔥'.repeat(Math.min(topic.estimatedHeat, 10))} ${topic.estimatedHeat}/10`);
    console.log(`   建议数量: ${topic.suggestedCount} 篇文章`);
    console.log(`   原因说明: ${topic.reasoning}`);
    console.log('');
  });

  console.log('─'.repeat(60));
}

/**
 * 为单个 topic 生成标题
 */
async function generateTitlesForTopic(
  topic: ExtractedTopic,
  existingTitles: string[]
): Promise<PlannedTopic[]> {
  const { keyword, suggestedCount } = topic;
  const plannedTopics: PlannedTopic[] = [];
  let attempts = 0;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📝 正在为 "${keyword}" 生成标题...`);
  console.log(`   目标数量: ${suggestedCount} 篇`);
  console.log(`${'═'.repeat(60)}\n`);

  while (plannedTopics.length < suggestedCount && attempts < MAX_ATTEMPTS_PER_TOPIC) {
    attempts++;
    console.log(`🔁 第 ${attempts}/${MAX_ATTEMPTS_PER_TOPIC} 轮生成`);
    console.log(`   当前进度: ${plannedTopics.length}/${suggestedCount}\n`);

    try {
      // 生成候选标题
      const alreadyPlannedTitles = plannedTopics.map((t) => t.title);
      const candidates = await generateTopicCandidatesForKeyword({
        coreKeyword: keyword,
        existingTitles,
        alreadyPlannedTitles,
        batchSize: BATCH_SIZE,
      });

      console.log(`\n🔍 检查 ${candidates.length} 个候选标题...\n`);

      let acceptedCount = 0;
      let duplicateCount = 0;

      // 检查每个候选
      for (const candidate of candidates) {
        // 如果已达到目标数量，停止检查
        if (plannedTopics.length >= suggestedCount) {
          break;
        }

        try {
          // 调用语义查重
          const result = await checkTopicDuplicate({
            title: candidate.title,
            description: candidate.description,
            primaryKeyword: candidate.primaryKeyword || keyword,
            duplicateThreshold: DUPLICATE_THRESHOLD,
          });

          if (result.isDuplicate) {
            // 重复，跳过
            duplicateCount++;
            const mostSimilar = result.mostSimilar!;
            console.log(
              `   🚫 重复: "${candidate.title.substring(0, 50)}..." ` +
              `(相似度 ${result.maxSimilarity.toFixed(2)} 与 "${mostSimilar.title.substring(0, 30)}...")`
            );
          } else {
            // 接受
            acceptedCount++;
            plannedTopics.push({
              ...candidate,
              coreKeyword: keyword,
              createdAt: new Date().toISOString(),
            });
            console.log(
              `   ✅ 接受: "${candidate.title}" ` +
              `(最大相似度: ${result.maxSimilarity.toFixed(2)})`
            );
          }

          // 简单的速率限制
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(
            `   ⚠️  检查出错 "${candidate.title}": ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      console.log(`\n📊 第 ${attempts} 轮汇总:`);
      console.log(`   候选数: ${candidates.length}`);
      console.log(`   接受数: ${acceptedCount}`);
      console.log(`   重复数: ${duplicateCount}`);
      console.log(`   累计已生成: ${plannedTopics.length}/${suggestedCount}\n`);
    } catch (error) {
      console.error(`\n❌ 第 ${attempts} 轮生成出错:`, error);
      console.log(`   继续下一轮...\n`);
    }
  }

  if (plannedTopics.length < suggestedCount) {
    console.log(
      `\n⚠️  "${keyword}" 只生成了 ${plannedTopics.length} 篇（目标 ${suggestedCount}）`
    );
  } else {
    console.log(`\n✅ "${keyword}" 达到目标: ${plannedTopics.length} 篇\n`);
  }

  return plannedTopics;
}

/**
 * 保存 topics 到文件
 */
function saveTopicsToFile(keyword: string, topics: PlannedTopic[]) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const slug = slugify(keyword);
  const outputPath = path.join(dataDir, `planned-topics-${slug}.json`);

  let finalTopics: PlannedTopic[] = topics;
  let mode = 'CREATE';

  // 检查文件是否已存在
  if (fs.existsSync(outputPath)) {
    mode = 'APPEND';
    try {
      const existingData = fs.readFileSync(outputPath, 'utf8');
      const existingTopics: PlannedTopic[] = JSON.parse(existingData);

      console.log(`\n📂 文件已存在: ${path.basename(outputPath)}`);
      console.log(`   现有标题: ${existingTopics.length} 篇`);
      console.log(`   模式: 追加（APPEND）`);

      // 合并选题，按 title 去重（保留旧的）
      const titleSet = new Set<string>();
      const merged: PlannedTopic[] = [];

      // 先添加所有旧选题
      for (const topic of existingTopics) {
        merged.push(topic);
        titleSet.add(topic.title.toLowerCase().trim());
      }

      // 再添加新选题（跳过重复的 title）
      let duplicateCount = 0;
      for (const topic of topics) {
        const normalizedTitle = topic.title.toLowerCase().trim();
        if (!titleSet.has(normalizedTitle)) {
          merged.push(topic);
          titleSet.add(normalizedTitle);
        } else {
          duplicateCount++;
        }
      }

      const newCount = merged.length - existingTopics.length;

      console.log(`   新增标题: ${newCount} 篇`);
      console.log(`   跳过重复: ${duplicateCount} 篇`);
      console.log(`   合并后总计: ${merged.length} 篇\n`);

      finalTopics = merged;
    } catch (error) {
      console.warn(`   ⚠️  读取现有文件失败: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`   将只保存新生成的标题\n`);
    }
  } else {
    console.log(`\n📂 创建新文件: ${path.basename(outputPath)}\n`);
  }

  // 写入文件
  fs.writeFileSync(outputPath, JSON.stringify(finalTopics, null, 2), 'utf8');

  console.log(`✅ 已保存到: ${outputPath}`);
  console.log(`   模式: ${mode}`);
  console.log(`   总标题数: ${finalTopics.length} 篇`);
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     AI Topic Extraction - 自然语言主题提取工具        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('💡 使用说明：');
  console.log('   输入自然语言描述（如新闻事件、健康趋势等）');
  console.log('   AI 将自动提取相关健康主题并生成文章标题\n');
  console.log('📋 示例：');
  console.log('   "昨天xx明星因为心脏病突发离世了，围绕这个热点输出topics"');
  console.log('   "最近气温骤降，很多老人血压升高，生成相关内容"\n');
  console.log('─'.repeat(60) + '\n');

  // 1. 检查必要文件
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ 错误: 未找到 articles-index.json');
    console.error('请先运行: npm run build:articles-index\n');
    process.exit(1);
  }

  if (!fs.existsSync(embeddingsPath)) {
    console.error('❌ 错误: 未找到 articles-embeddings.json');
    console.error('请先运行以下命令:');
    console.error('  1. npm run build:articles-index');
    console.error('  2. npm run build:embeddings\n');
    process.exit(1);
  }

  // 2. 加载已有文章数据
  console.log('📚 加载现有文章数据...');
  const articlesData = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);
  const existingTitles = articles.map((a) => a.title);
  console.log(`   ✅ 已加载 ${existingTitles.length} 篇现有文章\n`);

  // 3. 创建 readline 接口
  const rl = createReadlineInterface();

  try {
    // 4. 获取用户输入
    const userPrompt = await question(
      rl,
      '🎤 请输入您的自然语言描述（或按 Ctrl+C 退出）:\n> '
    );

    if (!userPrompt) {
      console.log('\n⚠️  输入为空，程序退出。');
      rl.close();
      return;
    }

    // 5. 调用 LLM 提取 topics
    console.log('\n🤖 正在使用 AI 分析您的输入...\n');
    const extracted = await extractTopicsFromPrompt(userPrompt);

    // 6. 显示提取结果
    displayExtractedTopics(extracted.topics, extracted.analysis);

    // 7. 用户确认
    const confirm = await question(
      rl,
      '\n📋 是否继续生成以上主题的文章标题？(y/n): '
    );

    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('\n✋ 用户取消，程序退出。');
      rl.close();
      return;
    }

    // 8. 为每个 topic 生成标题
    console.log('\n🚀 开始生成文章标题...\n');

    for (let i = 0; i < extracted.topics.length; i++) {
      const topic = extracted.topics[i];

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📍 主题 ${i + 1}/${extracted.topics.length}: ${topic.keyword}`);
      console.log(`${'═'.repeat(60)}`);

      // 生成标题
      const plannedTopics = await generateTitlesForTopic(topic, existingTitles);

      // 保存到文件
      if (plannedTopics.length > 0) {
        saveTopicsToFile(topic.keyword, plannedTopics);
      } else {
        console.log(`\n⚠️  "${topic.keyword}" 未生成任何标题，跳过保存。`);
      }

      console.log('\n');
    }

    // 9. 完成
    console.log(`\n${'═'.repeat(60)}`);
    console.log('✨ 所有主题处理完成！');
    console.log(`${'═'.repeat(60)}\n`);

    console.log('📊 汇总：');
    extracted.topics.forEach((topic, i) => {
      const slug = slugify(topic.keyword);
      const filepath = path.join(process.cwd(), 'data', `planned-topics-${slug}.json`);
      if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, 'utf8');
        const topics: PlannedTopic[] = JSON.parse(data);
        console.log(`   ${i + 1}. ${topic.keyword}: ${topics.length} 篇标题`);
      }
    });

    console.log('\n💡 下一步：运行 "npm run generate:articles" 生成文章内容\n');

    rl.close();
  } catch (error) {
    console.error('\n❌ 程序出错:', error);
    rl.close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ 致命错误:', error);
  process.exit(1);
});
