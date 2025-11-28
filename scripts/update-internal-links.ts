/**
 * 定期更新 Internal Linking 脚本
 *
 * 用途：
 * - 每周/每月执行一次，重新计算所有文章的相似度并更新 relatedSlugs
 * - 基于现有 embeddings 数据，不重新调用 Qwen API
 * - 0 token 消耗
 *
 * 使用场景：
 * - 新增大量文章后，为旧文章补充新的关联链接
 * - 定期维护内部链接网络，提升 SEO 效果
 * - 通过 cron 或 GitHub Actions 自动化执行
 *
 * 使用方式：
 *   npm run update:links
 *
 * GitHub Actions 自动化：
 *   每周一自动执行，自动提交更新的 markdown 文件
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { batchUpdateRelatedLinks } from '../lib/embeddings/internal-linking';

async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Weekly Internal Linking Update (Zero Token Cost)   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📌 This script will:');
  console.log('   1. Read existing embeddings from articles-embeddings.json');
  console.log('   2. Recalculate article similarities using cosine distance');
  console.log('   3. Update relatedSlugs in all markdown files');
  console.log('   4. ✅ No API calls - No token consumption\n');

  const startTime = Date.now();

  try {
    // 使用默认配置参数
    const minSimilarity = 0.6;
    const topK = 3;
    const preserveExisting = false;

    console.log('⚙️  Configuration:');
    console.log(`   Min Similarity Threshold: ${minSimilarity}`);
    console.log(`   Top K Recommendations: ${topK}`);
    console.log(`   Preserve Manual Links: ${preserveExisting}`);
    console.log('');

    // 提示：preserveExisting 的作用
    if (preserveExisting) {
      console.log('💡 Mode: Incremental update');
      console.log('   - Existing relatedSlugs will be preserved');
      console.log('   - New recommendations will be appended');
      console.log('   - Manual edits are safe\n');
    } else {
      console.log('💡 Mode: Complete refresh');
      console.log('   - All relatedSlugs will be recalculated');
      console.log('   - Previous links will be replaced');
      console.log('   - Ensures consistency across all articles\n');
    }

    // 执行批量更新（复用现有函数）
    batchUpdateRelatedLinks(null, minSimilarity, topK, preserveExisting);

    console.log('🎉 Weekly internal linking update completed!\n');

    // 下一步提示
    console.log('📝 Next steps:');
    console.log('   1. Review updated markdown files in content/articles/');
    console.log('   2. Run "npm run build:articles-index" to rebuild index');
    console.log('   3. Run "npm run build" to verify Next.js build');
    console.log('   4. Commit and deploy changes\n');

    // 自动化提示
    console.log('🤖 Automation tip:');
    console.log('   Set up GitHub Actions to run this script weekly:');
    console.log('   - See .github/workflows/weekly-internal-linking.yml');
    console.log('   - Auto-commit updated files');
    console.log('   - Zero maintenance required\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   - Make sure data/articles-embeddings.json exists');
    console.error('   - Run "npm run build:embeddings" if embeddings are missing');
    console.error('   - Check that content/articles/*.md files are accessible');
    console.error('   - Verify file permissions\n');

    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
