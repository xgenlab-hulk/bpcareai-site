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

/**
 * Internal Linking 任务历史记录
 */
interface InternalLinkingHistoryRecord {
  id: string;
  taskType: 'internal-linking';
  timestamp: string;
  durationMinutes: number;
  articlesProcessed: number;
  linksUpdated: number;
  success: boolean;
}

/**
 * 保存任务执行历史记录
 */
function saveTaskHistory(
  articlesProcessed: number,
  linksUpdated: number,
  durationMinutes: number,
  success: boolean
): void {
  const dataDir = path.join(process.cwd(), 'data');
  const historyPath = path.join(dataDir, 'task-history.json');

  // 创建历史记录对象
  const record: InternalLinkingHistoryRecord = {
    id: Date.now().toString(),
    taskType: 'internal-linking',
    timestamp: new Date().toISOString(),
    durationMinutes,
    articlesProcessed,
    linksUpdated,
    success,
  };

  // 读取现有历史记录
  let history: any[] = [];
  if (fs.existsSync(historyPath)) {
    try {
      const content = fs.readFileSync(historyPath, 'utf8');
      history = JSON.parse(content);
    } catch (error) {
      console.warn('⚠️  Failed to read task history, starting fresh:', error);
      history = [];
    }
  }

  // 添加新记录（插入到开头）
  history.unshift(record);

  // 保留最近 100 条记录
  if (history.length > 100) {
    history = history.slice(0, 100);
  }

  // 写入文件
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
    console.log(`📝 Task history saved (${history.length} records total)\n`);
  } catch (error) {
    console.error('❌ Failed to save task history:', error);
  }
}

/**
 * 加载任务配置
 */
function loadTaskConfig() {
  const configPath = path.join(process.cwd(), 'data', 'task-config.json');

  if (!fs.existsSync(configPath)) {
    console.warn('⚠️  task-config.json not found, using default values');
    return {
      minSimilarity: 0.6,
      topK: 3,
      preserveExisting: false,
    };
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);
    return config.internalLinking.config;
  } catch (error) {
    console.warn('⚠️  Failed to load task-config.json, using default values');
    return {
      minSimilarity: 0.6,
      topK: 3,
      preserveExisting: false,
    };
  }
}

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
  let success = false;

  try {
    // 从配置文件加载参数
    const { minSimilarity, topK, preserveExisting } = loadTaskConfig();

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
    const result = batchUpdateRelatedLinks(null, minSimilarity, topK, preserveExisting);

    console.log('🎉 Weekly internal linking update completed!\n');

    // 计算执行时长
    const endTime = Date.now();
    const durationMinutes = (endTime - startTime) / 1000 / 60;

    // 保存任务历史
    saveTaskHistory(
      result.articlesProcessed,
      result.linksUpdated,
      durationMinutes,
      true
    );

    success = true;

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

    // 保存失败记录
    const endTime = Date.now();
    const durationMinutes = (endTime - startTime) / 1000 / 60;
    saveTaskHistory(0, 0, durationMinutes, false);

    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
