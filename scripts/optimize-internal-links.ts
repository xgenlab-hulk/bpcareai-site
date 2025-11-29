/**
 * 智能全局内链优化脚本
 *
 * 功能：
 * 1. 确保所有文章有3-5个内链
 * 2. 优先同topicCluster链接
 * 3. 平衡全局内链分布，避免孤岛
 * 4. 智能双向链接优化
 *
 * 使用方式：
 *   npm run optimize:links           # 全量优化模式
 *   npm run optimize:links -- --fix-missing  # 只修复缺失/不足的文章
 *   npm run optimize:links -- --dry-run      # 预览模式，不实际修改
 */

import 'dotenv/config';
import {
  loadArticleEmbeddings,
  calculateSimilarArticlesSmart,
  updateArticleFrontmatterSmart,
  calculateInlinkCounts,
  getArticleRelatedSlugs,
  type SmartLinkingOptions,
} from '../lib/embeddings/internal-linking';

/**
 * 优化结果统计
 */
interface OptimizationResult {
  totalArticles: number;
  compliantBefore: number;    // 优化前符合要求的文章数（3-5个）
  compliantAfter: number;     // 优化后符合要求的文章数
  fixed: number;              // 修复的文章数
  noLinks: number;            // 原本无链接的文章数
  insufficient: number;       // 原本不足3个的文章数
  excessive: number;          // 原本超过5个的文章数
  skipped: number;            // 跳过的文章数（已符合要求）
}

/**
 * 命令行参数
 */
interface CommandLineOptions {
  fixMissing?: boolean;  // 只修复缺失/不足的文章
  dryRun?: boolean;      // 预览模式
}

/**
 * 解析命令行参数
 */
function parseCommandLineArgs(): CommandLineOptions {
  const args = process.argv.slice(2);
  return {
    fixMissing: args.includes('--fix-missing'),
    dryRun: args.includes('--dry-run'),
  };
}

/**
 * 分析所有文章的内链状态
 */
function analyzeCurrentState(allEmbeddings: any[]): {
  noLinks: string[];
  insufficient: string[];
  compliant: string[];
  excessive: string[];
} {
  const noLinks: string[] = [];
  const insufficient: string[] = [];
  const compliant: string[] = [];
  const excessive: string[] = [];

  allEmbeddings.forEach((article) => {
    const slugs = getArticleRelatedSlugs(article.slug);
    const count = slugs.length;

    if (count === 0) {
      noLinks.push(article.slug);
    } else if (count < 3) {
      insufficient.push(article.slug);
    } else if (count >= 3 && count <= 5) {
      compliant.push(article.slug);
    } else {
      excessive.push(article.slug);
    }
  });

  return { noLinks, insufficient, compliant, excessive };
}

/**
 * 主函数
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Intelligent Internal Linking Optimization          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const cmdOptions = parseCommandLineArgs();

  if (cmdOptions.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  if (cmdOptions.fixMissing) {
    console.log('🎯 FIX MISSING MODE - Only fixing articles with <3 links\n');
  }

  console.log('📊 Loading article embeddings...\n');

  try {
    // 1. 加载所有embeddings
    const allEmbeddings = loadArticleEmbeddings();
    console.log(`✅ Loaded ${allEmbeddings.length} article embeddings\n`);

    // 2. 分析当前状态
    console.log('🔍 Analyzing current internal linking state...\n');
    const currentState = analyzeCurrentState(allEmbeddings);

    console.log('📈 Current State:');
    console.log(`   - No links (0):       ${currentState.noLinks.length} articles`);
    console.log(`   - Insufficient (1-2): ${currentState.insufficient.length} articles`);
    console.log(`   - Compliant (3-5):    ${currentState.compliant.length} articles ✅`);
    console.log(`   - Excessive (>5):     ${currentState.excessive.length} articles`);
    console.log(`   ${'─'.repeat(50)}`);
    console.log(
      `   Total: ${allEmbeddings.length} | Compliance: ${((currentState.compliant.length / allEmbeddings.length) * 100).toFixed(1)}%\n`
    );

    // 3. 确定需要优化的文章列表
    let targetArticles: string[];

    if (cmdOptions.fixMissing) {
      // 只修复无链接和不足3个的
      targetArticles = [...currentState.noLinks, ...currentState.insufficient];
      console.log(`🎯 Target: ${targetArticles.length} articles (missing/insufficient only)\n`);
    } else {
      // 全量优化：修复所有不符合要求的
      targetArticles = [
        ...currentState.noLinks,
        ...currentState.insufficient,
        ...currentState.excessive,
      ];
      console.log(
        `🎯 Target: ${targetArticles.length} articles (all non-compliant)\n`
      );
    }

    if (targetArticles.length === 0) {
      console.log('✅ All articles are compliant! No optimization needed.\n');
      return;
    }

    // 4. 配置智能内链参数
    const linkingOptions: SmartLinkingOptions = {
      minLinks: 3,
      maxLinks: 5,
      clusterBoost: 1.15,       // 同cluster加成15%
      avoidOverlinked: true,     // 避免链接到过度链接的文章
      balanceFactor: 0.2,        // 平衡因子权重
      minSimilarityTiers: [0.6, 0.5, 0.4], // 分层阈值
    };

    console.log('⚙️  Optimization Configuration:');
    console.log(`   - Min Links: ${linkingOptions.minLinks}`);
    console.log(`   - Max Links: ${linkingOptions.maxLinks}`);
    console.log(`   - Cluster Boost: ${linkingOptions.clusterBoost}x`);
    console.log(`   - Balance Factor: ${linkingOptions.balanceFactor}`);
    console.log(`   - Similarity Tiers: ${linkingOptions.minSimilarityTiers?.join(' → ')}\n`);

    // 5. 执行优化
    console.log('🔄 Starting optimization...\n');
    console.log('─'.repeat(60));

    let fixedCount = 0;
    let skippedCount = 0;
    const results: { slug: string; before: number; after: number }[] = [];

    targetArticles.forEach((slug, index) => {
      const progress = `[${index + 1}/${targetArticles.length}]`;
      console.log(`${progress} Processing: ${slug}`);

      if (cmdOptions.dryRun) {
        // 预览模式：只计算推荐，不实际修改
        const beforeCount = getArticleRelatedSlugs(slug).length;
        const recommended = calculateSimilarArticlesSmart(
          slug,
          allEmbeddings,
          linkingOptions
        );

        console.log(`   Before: ${beforeCount} links | Recommended: ${recommended.length} links`);
        console.log(`   Suggestions: ${recommended.slice(0, 5).map((r) => r.slug).join(', ')}`);
        results.push({ slug, before: beforeCount, after: recommended.length });
      } else {
        // 实际修改
        const result = updateArticleFrontmatterSmart(slug, allEmbeddings, linkingOptions);

        if (result.updated) {
          fixedCount++;
          console.log(
            `   ✅ Updated: ${result.before} → ${result.after} links`
          );
        } else {
          skippedCount++;
          console.log(
            `   ⏭️  Skipped: Already compliant (${result.before} links)`
          );
        }

        results.push({ slug, before: result.before, after: result.after });
      }

      console.log('');
    });

    console.log('═'.repeat(60));

    // 6. 重新分析优化后的状态
    if (!cmdOptions.dryRun) {
      console.log('\n📊 Re-analyzing state after optimization...\n');
      const afterState = analyzeCurrentState(allEmbeddings);

      console.log('📈 After Optimization:');
      console.log(`   - No links (0):       ${afterState.noLinks.length} articles`);
      console.log(`   - Insufficient (1-2): ${afterState.insufficient.length} articles`);
      console.log(`   - Compliant (3-5):    ${afterState.compliant.length} articles ✅`);
      console.log(`   - Excessive (>5):     ${afterState.excessive.length} articles`);
      console.log(`   ${'─'.repeat(50)}`);
      console.log(
        `   Total: ${allEmbeddings.length} | Compliance: ${((afterState.compliant.length / allEmbeddings.length) * 100).toFixed(1)}%\n`
      );

      console.log('📝 Summary:');
      console.log(`   - Articles Fixed: ${fixedCount}`);
      console.log(`   - Articles Skipped: ${skippedCount}`);
      console.log(
        `   - Compliance Improvement: ${currentState.compliant.length} → ${afterState.compliant.length} (+${afterState.compliant.length - currentState.compliant.length})\n`
      );
    } else {
      console.log('\n🔍 DRY RUN Summary:');
      console.log(`   - Articles Analyzed: ${targetArticles.length}`);
      console.log(`   - Would Fix: ${results.filter((r) => r.before !== r.after).length}`);
      console.log(`   - Would Skip: ${results.filter((r) => r.before === r.after).length}\n`);
      console.log('💡 Run without --dry-run to apply changes\n');
    }

    // 7. 下一步提示
    if (!cmdOptions.dryRun && fixedCount > 0) {
      console.log('📝 Next steps:');
      console.log('   1. Review changes in content/articles/*.md');
      console.log('   2. Run "npm run build:articles-index" to rebuild index');
      console.log('   3. Run "npm run analyze:links" to generate health report');
      console.log('   4. Commit and deploy changes\n');
    }

    console.log('═'.repeat(60));
    console.log('✨ Internal linking optimization completed!');
    console.log('═'.repeat(60));
    console.log('');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   - Make sure data/articles-embeddings.json exists');
    console.error('   - Run "npm run build:embeddings" if embeddings are missing');
    console.error('   - Check that content/articles/*.md files are accessible\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
