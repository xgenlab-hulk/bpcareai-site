/**
 * Backfill Related Links Script
 *
 * 为所有现有文章批量填充 relatedSlugs 字段
 * 基于 embeddings 计算相似度，自动推荐最相关的 3 篇文章
 *
 * Usage:
 *   npm run backfill:links
 *
 * Options (edit script to customize):
 *   - minSimilarity: 最低相似度阈值（默认 0.6）
 *   - topK: 每篇文章推荐几篇相关文章（默认 3）
 *   - preserveExisting: 是否保留现有的 relatedSlugs（默认 true）
 */

import 'dotenv/config';
import { batchUpdateRelatedLinks } from '../lib/embeddings/internal-linking';

async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   Backfill Related Links for Existing Articles    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    // 配置参数
    const minSimilarity = 0.6;  // 最低相似度阈值
    const topK = 3;              // 每篇文章推荐 3 篇相关文章
    const preserveExisting = true; // 保留现有的 relatedSlugs

    console.log('⚙️  Configuration:');
    console.log(`   Min Similarity: ${minSimilarity}`);
    console.log(`   Top K: ${topK}`);
    console.log(`   Preserve Existing: ${preserveExisting}\n`);

    // 执行批量更新
    batchUpdateRelatedLinks(null, minSimilarity, topK, preserveExisting);

    console.log('🎉 Backfill completed successfully!\n');
    console.log('💡 Next steps:');
    console.log('   1. Review the updated markdown files in content/articles/');
    console.log('   2. Run "npm run build:articles-index" to rebuild the index');
    console.log('   3. Run "npm run build" to verify Next.js build\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    console.error('\nTroubleshooting:');
    console.error('   - Make sure you\'ve run "npm run build:embeddings" first');
    console.error('   - Check that data/articles-embeddings.json exists');
    console.error('   - Verify that content/articles/*.md files exist\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
