// 加载 .env 文件中的环境变量
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '../lib/articles/types';
import type { ArticleEmbedding } from '../lib/embeddings/types';
import { generateEmbeddingForText } from '../lib/embeddings/qwen';
import { getExistingEmbeddingSlugs } from '../lib/embeddings/incremental';

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

  // 1. 检查命令行参数
  const args = process.argv.slice(2);
  const forceRebuild = args.includes('--force');

  if (forceRebuild) {
    console.log('⚠️  Force rebuild mode - regenerating all embeddings\n');
  }

  // 2. 检查 QWEN_API_KEY 是否设置
  if (!process.env.QWEN_API_KEY) {
    console.error('❌ Error: QWEN_API_KEY is not set in environment variables');
    console.error('Please set it in your .env file or environment');
    process.exit(1);
  }

  // 3. 读取文章索引
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: ${indexPath} not found`);
    console.error('Please run "npm run build:articles-index" first');
    process.exit(1);
  }

  const articlesData = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);

  console.log(`📚 Total articles in index: ${articles.length}`);

  // 4. 读取现有 embeddings（增量更新逻辑）
  const outputPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');
  let existingEmbeddings: ArticleEmbedding[] = [];
  let existingSlugs = new Set<string>();

  if (!forceRebuild && fs.existsSync(outputPath)) {
    try {
      const existingData = fs.readFileSync(outputPath, 'utf8');
      existingEmbeddings = JSON.parse(existingData);
      existingSlugs = new Set(existingEmbeddings.map(e => e.slug));
      console.log(`✅ Existing embeddings loaded: ${existingEmbeddings.length}`);
    } catch (error) {
      console.error(`⚠️  Failed to load existing embeddings: ${error}`);
      console.error(`   Starting fresh...`);
      existingEmbeddings = [];
      existingSlugs = new Set();
    }
  }

  // 5. 过滤出需要计算的文章
  const articlesNeedingEmbedding = forceRebuild
    ? articles
    : articles.filter(a => !existingSlugs.has(a.slug));

  console.log(`🆕 New articles needing embedding: ${articlesNeedingEmbedding.length}`);

  if (articlesNeedingEmbedding.length === 0) {
    console.log('\n✨ All articles already have embeddings - nothing to do!');
    console.log(`📝 Output: ${outputPath}`);
    console.log('═'.repeat(50));
    return;
  }

  console.log('');

  // 6. 为新文章生成 embedding
  const newEmbeddings: ArticleEmbedding[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < articlesNeedingEmbedding.length; i++) {
    const article = articlesNeedingEmbedding[i];
    const progress = `[${i + 1}/${articlesNeedingEmbedding.length}]`;

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

      newEmbeddings.push(articleEmbedding);
      successCount++;

      console.log(`    ✅ Success (embedding dimension: ${embedding.length})\n`);

      // 简单的速率限制：每次请求后延迟 500ms
      if (i < articlesNeedingEmbedding.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      failureCount++;
      console.error(`    ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
      // 继续处理下一篇文章，不中断整个流程
    }
  }

  // 7. 合并现有和新的 embeddings
  const allEmbeddings = forceRebuild
    ? newEmbeddings  // 强制重建模式：只使用新生成的
    : [...existingEmbeddings, ...newEmbeddings];  // 增量模式：合并

  // 8. 确保 /data 目录存在
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 9. 写入结果
  fs.writeFileSync(outputPath, JSON.stringify(allEmbeddings, null, 2), 'utf8');

  // 10. 输出总结
  console.log('═'.repeat(50));
  console.log('✨ Embeddings generation completed!\n');
  console.log(`📊 Summary:`);
  console.log(`   Total articles in index: ${articles.length}`);
  console.log(`   Existing embeddings: ${existingEmbeddings.length}`);
  console.log(`   New embeddings generated: ${successCount}`);
  console.log(`   Failed: ${failureCount}`);
  console.log(`   Final total: ${allEmbeddings.length}`);
  console.log(`\n📝 Output: ${outputPath}`);
  console.log('═'.repeat(50));

  // Token 节省提示
  if (!forceRebuild && existingEmbeddings.length > 0) {
    const tokenSaved = (existingEmbeddings.length / articles.length * 100).toFixed(1);
    console.log(`\n💰 Token saved: ~${tokenSaved}% (skipped ${existingEmbeddings.length} existing embeddings)`);
  }

  // 如果有失败，以非零状态码退出
  if (failureCount > 0) {
    process.exit(1);
  }
}

buildEmbeddings().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
