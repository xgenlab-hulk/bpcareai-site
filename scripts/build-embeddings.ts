// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '../lib/articles/types';
import type { ArticleEmbedding } from '../lib/embeddings/types';
import { generateEmbeddingForText } from '../lib/embeddings/qwen';

/**
 * 为文章构造用于生成 embedding 的输入文本
 */
function buildEmbeddingInput(article: ArticleMeta): string {
  let text = `${article.title}\n${article.description}`;

  if (article.primaryKeyword && article.primaryKeyword.trim().length > 0) {
    text += `\nPrimary keyword: ${article.primaryKeyword}`;
  }

  return text;
}

async function buildEmbeddings() {
  console.log('🚀 Starting article embeddings generation...\n');

  // 1. 检查 QWEN_API_KEY 是否设置
  if (!process.env.QWEN_API_KEY) {
    console.error('❌ Error: QWEN_API_KEY is not set in environment variables');
    console.error('Please set it in your .env file or environment');
    process.exit(1);
  }

  // 2. 读取文章索引
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: ${indexPath} not found`);
    console.error('Please run "npm run build:articles-index" first');
    process.exit(1);
  }

  const articlesData = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);

  console.log(`📚 Found ${articles.length} articles to process\n`);

  // 3. 为每篇文章生成 embedding
  const embeddings: ArticleEmbedding[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const progress = `[${i + 1}/${articles.length}]`;

    try {
      console.log(`${progress} Processing: ${article.slug}`);

      // 构造输入文本
      const inputText = buildEmbeddingInput(article);
      console.log(`    Input: "${inputText.substring(0, 60)}..."`);

      // 调用 Qwen API 生成 embedding
      const embedding = await generateEmbeddingForText(inputText);

      // 构造结果对象
      const articleEmbedding: ArticleEmbedding = {
        slug: article.slug,
        title: article.title,
        primaryKeyword: article.primaryKeyword,
        topicCluster: article.topicCluster,
        embedding,
      };

      embeddings.push(articleEmbedding);
      successCount++;

      console.log(`    ✅ Success (embedding dimension: ${embedding.length})\n`);

      // 简单的速率限制：每次请求后延迟 500ms
      if (i < articles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      failureCount++;
      console.error(`    ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
      // 继续处理下一篇文章，不中断整个流程
    }
  }

  // 4. 确保 /data 目录存在
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 5. 写入结果
  const outputPath = path.join(dataDir, 'articles-embeddings.json');
  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2), 'utf8');

  // 6. 输出总结
  console.log('═'.repeat(50));
  console.log('✨ Embeddings generation completed!\n');
  console.log(`📊 Summary:`);
  console.log(`   Total articles: ${articles.length}`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failureCount}`);
  console.log(`\n📝 Output: ${outputPath}`);
  console.log('═'.repeat(50));

  // 如果有失败，以非零状态码退出
  if (failureCount > 0) {
    process.exit(1);
  }
}

buildEmbeddings().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
