// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import type { PlannedTopic, ArticleFrontmatter } from '../lib/llm/qwen-articles';
import { generateArticleMarkdown } from '../lib/llm/qwen-articles';
import { slugify } from '../lib/utils/slugify';
import { findSimilarArticlesForTopic } from '../lib/embeddings/similarity';
import { addEmbeddingForNewArticle } from '../lib/embeddings/incremental';
import {
  addBidirectionalLinkSmart,
  loadArticleEmbeddings,
} from '../lib/embeddings/internal-linking';

/**
 * 打印使用说明
 */
function printUsage() {
  console.log(`
Usage:
  npm run generate:articles -- "coreKeyword" [count]

Examples:
  npm run generate:articles -- "blood pressure" 10
  npm run generate:articles -- "blood pressure"

Arguments:
  - coreKeyword: Required, the main keyword (must match planned-topics file)
  - count: Optional, number of articles to generate (default: all remaining topics)
`);
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
    `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`,
    `primaryKeyword: "${frontmatter.primaryKeyword}"`,
    `topicCluster: "${frontmatter.topicCluster}"`,
    `image: "${frontmatter.image}"`,
    `relatedSlugs: [${frontmatter.relatedSlugs.map(s => `"${s}"`).join(', ')}]`,
  ];

  return `---\n${lines.join('\n')}\n---`;
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

  const coreKeyword = args[0];
  const requestedCount = args[1] ? parseInt(args[1], 10) : null;

  if (requestedCount !== null && (isNaN(requestedCount) || requestedCount <= 0)) {
    console.error('❌ Error: count must be a positive number\n');
    printUsage();
    process.exit(1);
  }

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Automatic Article Generation System            ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📌 Core keyword: "${coreKeyword}"`);

  // 1. 读取 planned-topics 文件
  const dataDir = path.join(process.cwd(), 'data');
  const coreSlug = slugify(coreKeyword);
  const topicsFilePath = path.join(dataDir, `planned-topics-${coreSlug}.json`);

  if (!fs.existsSync(topicsFilePath)) {
    console.error(`\n❌ Error: ${path.basename(topicsFilePath)} not found`);
    console.error('Please run "npm run generate:topics" first to create topics\n');
    process.exit(1);
  }

  const topicsData = fs.readFileSync(topicsFilePath, 'utf8');
  const allTopics: PlannedTopic[] = JSON.parse(topicsData);

  if (allTopics.length === 0) {
    console.error('\n❌ Error: No planned topics found in the file');
    console.error(`Please run: npm run generate:topics -- "${coreKeyword}" 30\n`);
    process.exit(1);
  }

  // 2. 确定本轮要生成的数量
  const availableCount = allTopics.length;
  let targetCount: number;
  let mode: string;

  if (requestedCount === null) {
    // 默认模式：生成全部
    targetCount = availableCount;
    mode = 'ALL (clearing queue)';
  } else if (requestedCount > availableCount) {
    // 请求数量超过可用数量
    targetCount = availableCount;
    mode = `${targetCount} (only ${availableCount} available)`;
    console.log(`\n⚠️  Requested count: ${requestedCount}, only ${availableCount} topics available`);
  } else {
    targetCount = requestedCount;
    mode = `${targetCount}`;
  }

  console.log(`📚 Available topics: ${availableCount}`);
  console.log(`🎯 Target articles: ${mode}\n`);

  // 3. 备份 JSON 文件
  const backupPath = `${topicsFilePath}.bak`;
  fs.copyFileSync(topicsFilePath, backupPath);
  console.log(`💾 Backup created: ${path.basename(backupPath)}\n`);

  // 4. 循环生成文章
  const topicsToProcess = allTopics.slice(0, targetCount);
  const successfulTopics: PlannedTopic[] = [];
  const failedTopics: PlannedTopic[] = [];

  console.log('🔄 Starting article generation...\n');
  console.log('─'.repeat(60));

  for (let i = 0; i < topicsToProcess.length; i++) {
    const topic = topicsToProcess[i];
    const progress = `[${i + 1}/${topicsToProcess.length}]`;

    try {
      console.log(`${progress} Processing: "${topic.title}"`);

      // 生成文章
      const article = await generateArticleMarkdown(topic);

      // 智能内链：确保3-5个相关文章
      try {
        const similarArticles = await findSimilarArticlesForTopic({
          title: topic.title,
          description: topic.description,
          primaryKeyword: topic.primaryKeyword,
          topK: 5,              // 提高到5个
          minSimilarity: 0.5,   // 降低阈值，保证能找到足够文章
        });

        // 确保至少3个，最多5个
        const selectedArticles = similarArticles.slice(0, Math.max(3, Math.min(5, similarArticles.length)));

        if (selectedArticles.length > 0) {
          article.frontmatter.relatedSlugs = selectedArticles.map(a => a.slug);
          console.log(`   🔗 Found ${selectedArticles.length} related articles`);

          // 智能双向连接
          const allEmbeddings = loadArticleEmbeddings();
          let bidirectionalCount = 0;

          for (const oldArticle of selectedArticles) {
            try {
              const success = addBidirectionalLinkSmart(
                oldArticle.slug,
                article.slug,
                allEmbeddings,
                5 // 最大链接数
              );
              if (success) {
                bidirectionalCount++;
              }
            } catch (reverseError) {
              // 忽略双向链接失败
            }
          }

          if (bidirectionalCount > 0) {
            console.log(`   ↔️  Bidirectional links: ${bidirectionalCount}/${selectedArticles.length}`);
          }
        } else {
          console.warn(`   ⚠️  No similar articles found, using fallback`);
          article.frontmatter.relatedSlugs = [];
        }
      } catch (linkError) {
        console.warn(`   ⚠️  Failed to calculate related articles: ${linkError instanceof Error ? linkError.message : String(linkError)}`);
        article.frontmatter.relatedSlugs = [];
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

      // 立即为新文章生成并保存 embedding（避免后续全量重建）
      try {
        await addEmbeddingForNewArticle({
          slug: article.slug,
          title: topic.title,
          description: topic.description,
          primaryKeyword: topic.primaryKeyword,
          topicCluster: topic.topicCluster,
        });
      } catch (embeddingError) {
        // Embedding 失败不影响文章生成，只是警告
        console.warn(`   ⚠️  Failed to save embedding: ${embeddingError instanceof Error ? embeddingError.message : String(embeddingError)}`);
        console.warn(`   You can run "npm run build:embeddings" later to generate it`);
      }

      successfulTopics.push(topic);
      console.log(`   ✅ Written to: content/articles/${article.slug}.md`);
      console.log('');

      // 简单的速率限制
      if (i < topicsToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failedTopics.push(topic);
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log('');
    }
  }

  console.log('═'.repeat(60));

  // 5. 统计结果
  const successCount = successfulTopics.length;
  const failureCount = failedTopics.length;

  console.log(`\n📊 Generation Summary:`);
  console.log(`   Attempted: ${topicsToProcess.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failureCount}`);

  // 6. 更新 JSON 文件（消费逻辑）
  if (successCount > 0) {
    // 只要有成功的，就从 JSON 中移除成功的 topics
    const successSlugs = new Set(
      successfulTopics.map(t => slugify(t.title))
    );

    const remainingTopics = allTopics.filter(
      t => !successSlugs.has(slugify(t.title))
    );

    fs.writeFileSync(
      topicsFilePath,
      JSON.stringify(remainingTopics, null, 2),
      'utf8'
    );

    console.log(`\n✅ Planned topics updated (${successCount} topics consumed)`);
    console.log(`   Remaining topics: ${remainingTopics.length}`);

    // 如果有失败的，提示它们保留在队列中
    if (failureCount > 0) {
      console.log(`\n⚠️  ${failureCount} topics failed and remain in the queue for retry`);
    }

    // 提示补充选题
    if (remainingTopics.length < 5) {
      console.log(`\n💡 Remaining topics: ${remainingTopics.length} (<5)`);
      console.log(`   Consider adding more:`);
      console.log(`   npm run generate:topics -- "${coreKeyword}" 30\n`);
    }
  } else {
    console.log(`\n⚠️  No successful generations. All topics remain in the queue.`);
    console.log(`   Please check LLM configuration and API connectivity.`);
    console.log(`   Generated .md files: 0\n`);
  }

  console.log('═'.repeat(60));
  console.log('✨ Article generation completed!');
  console.log('═'.repeat(60));
  console.log('');
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
