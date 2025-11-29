/**
 * 内链健康分析报告脚本
 *
 * 功能：
 * 1. 统计内链数量分布
 * 2. 分析topicCluster内部连通性
 * 3. 识别孤岛文章
 * 4. 计算双向链接覆盖率
 * 5. 生成可视化报告
 *
 * 使用方式：
 *   npm run analyze:links
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import {
  loadArticleEmbeddings,
  calculateInlinkCounts,
  getArticleRelatedSlugs,
} from '../lib/embeddings/internal-linking';

/**
 * 内链健康统计
 */
interface LinkingHealth {
  totalArticles: number;
  linkDistribution: Map<number, number>; // 内链数量 -> 文章数
  compliantArticles: number;              // 符合要求的文章数（3-5个）
  complianceRate: number;                 // 合规率
  averageLinks: number;                   // 平均内链数
  islanded: string[];                     // 孤岛文章（无入链）
  overlinked: string[];                   // 过度链接的文章（入链>10）
  bidirectionalCoverage: number;          // 双向链接覆盖率
  clusterConnectivity: Map<string, number>; // cluster内部连通性
}

/**
 * 计算cluster内部连通性
 * 返回每个cluster内部互相链接的文章比例
 */
function calculateClusterConnectivity(
  allEmbeddings: any[]
): Map<string, number> {
  const connectivity = new Map<string, number>();

  // 按cluster分组
  const clusterGroups = new Map<string, string[]>();
  allEmbeddings.forEach((article) => {
    const cluster = article.topicCluster;
    if (!clusterGroups.has(cluster)) {
      clusterGroups.set(cluster, []);
    }
    clusterGroups.get(cluster)!.push(article.slug);
  });

  // 计算每个cluster的内部连通性
  clusterGroups.forEach((slugs, cluster) => {
    if (slugs.length < 2) {
      connectivity.set(cluster, 1.0); // 单个文章默认100%连通
      return;
    }

    let internalLinks = 0;
    let totalPossibleLinks = 0;

    slugs.forEach((slug) => {
      const relatedSlugs = getArticleRelatedSlugs(slug);

      // 计算有多少链接指向同cluster的文章
      const internalCount = relatedSlugs.filter((related) =>
        slugs.includes(related)
      ).length;

      internalLinks += internalCount;
      totalPossibleLinks += slugs.length - 1; // 不包括自己
    });

    const connectivityRate =
      totalPossibleLinks > 0 ? internalLinks / totalPossibleLinks : 0;
    connectivity.set(cluster, connectivityRate);
  });

  return connectivity;
}

/**
 * 计算双向链接覆盖率
 * 如果 A->B 且 B->A，则这条链接是双向的
 */
function calculateBidirectionalCoverage(allEmbeddings: any[]): number {
  let totalLinks = 0;
  let bidirectionalLinks = 0;

  allEmbeddings.forEach((article) => {
    const relatedSlugs = getArticleRelatedSlugs(article.slug);

    relatedSlugs.forEach((relatedSlug) => {
      totalLinks++;

      // 检查反向链接
      const reverseLinks = getArticleRelatedSlugs(relatedSlug);
      if (reverseLinks.includes(article.slug)) {
        bidirectionalLinks++;
      }
    });
  });

  return totalLinks > 0 ? bidirectionalLinks / totalLinks : 0;
}

/**
 * 分析内链健康状况
 */
function analyzeInternalLinks(allEmbeddings: any[]): LinkingHealth {
  // 1. 统计内链分布
  const linkDistribution = new Map<number, number>();
  let totalLinks = 0;
  let compliantCount = 0;

  allEmbeddings.forEach((article) => {
    const count = getArticleRelatedSlugs(article.slug).length;
    linkDistribution.set(count, (linkDistribution.get(count) || 0) + 1);
    totalLinks += count;

    if (count >= 3 && count <= 5) {
      compliantCount++;
    }
  });

  // 2. 计算入链统计
  const inlinkCounts = calculateInlinkCounts();

  const islanded: string[] = [];
  const overlinked: string[] = [];

  allEmbeddings.forEach((article) => {
    const inlinks = inlinkCounts.get(article.slug) || 0;

    if (inlinks === 0) {
      islanded.push(article.slug);
    } else if (inlinks > 10) {
      overlinked.push(article.slug);
    }
  });

  // 3. 计算cluster连通性
  const clusterConnectivity = calculateClusterConnectivity(allEmbeddings);

  // 4. 计算双向链接覆盖率
  const bidirectionalCoverage = calculateBidirectionalCoverage(allEmbeddings);

  return {
    totalArticles: allEmbeddings.length,
    linkDistribution,
    compliantArticles: compliantCount,
    complianceRate: compliantCount / allEmbeddings.length,
    averageLinks: totalLinks / allEmbeddings.length,
    islanded,
    overlinked,
    bidirectionalCoverage,
    clusterConnectivity,
  };
}

/**
 * 生成Markdown报告
 */
function generateMarkdownReport(health: LinkingHealth): string {
  const lines: string[] = [];

  lines.push('# 内链健康分析报告');
  lines.push(`**生成时间**: ${new Date().toLocaleString('zh-CN')}\n`);

  lines.push('## 一、总体健康度\n');
  lines.push(`- **总文章数**: ${health.totalArticles}`);
  lines.push(`- **符合要求** (3-5个内链): ${health.compliantArticles} 篇 (${(health.complianceRate * 100).toFixed(1)}%)`);
  lines.push(`- **平均内链数**: ${health.averageLinks.toFixed(2)}`);
  lines.push(`- **双向链接覆盖率**: ${(health.bidirectionalCoverage * 100).toFixed(1)}%\n`);

  const healthScore =
    (health.complianceRate * 0.5 + health.bidirectionalCoverage * 0.3) * 100 +
    (health.islanded.length === 0 ? 20 : 0);

  lines.push(`### 健康评分: ${healthScore.toFixed(0)}/100\n`);

  if (healthScore >= 90) {
    lines.push('✅ **优秀** - 内链系统运行良好\n');
  } else if (healthScore >= 70) {
    lines.push('⚠️ **良好** - 建议进一步优化\n');
  } else {
    lines.push('❌ **需改进** - 存在显著问题，建议立即优化\n');
  }

  lines.push('## 二、内链数量分布\n');
  lines.push('| 内链数量 | 文章数 | 占比 | 状态 |');
  lines.push('|---------|--------|------|------|');

  const sortedDistribution = Array.from(health.linkDistribution.entries()).sort(
    (a, b) => a[0] - b[0]
  );

  sortedDistribution.forEach(([count, articles]) => {
    const percentage = ((articles / health.totalArticles) * 100).toFixed(1);
    let status = '';

    if (count === 0) {
      status = '❌ 无内链';
    } else if (count < 3) {
      status = '⚠️ 不足';
    } else if (count >= 3 && count <= 5) {
      status = '✅ 符合要求';
    } else {
      status = '⚠️ 过多';
    }

    lines.push(`| ${count} | ${articles} | ${percentage}% | ${status} |`);
  });

  lines.push('');

  lines.push('## 三、孤岛文章分析\n');

  if (health.islanded.length === 0) {
    lines.push('✅ **无孤岛文章** - 所有文章都有入链\n');
  } else {
    lines.push(`⚠️ 发现 **${health.islanded.length}** 篇孤岛文章（无其他文章链接到它）：\n`);
    health.islanded.slice(0, 10).forEach((slug) => {
      lines.push(`- ${slug}`);
    });

    if (health.islanded.length > 10) {
      lines.push(`- ...及其他 ${health.islanded.length - 10} 篇\n`);
    } else {
      lines.push('');
    }
  }

  lines.push('## 四、TopicCluster 连通性\n');
  lines.push('各主题集群内部文章互相链接的比例：\n');
  lines.push('| Cluster | 连通性 | 评价 |');
  lines.push('|---------|--------|------|');

  const sortedClusters = Array.from(health.clusterConnectivity.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  sortedClusters.forEach(([cluster, connectivity]) => {
    const percentage = (connectivity * 100).toFixed(1);
    let rating = '';

    if (connectivity >= 0.7) {
      rating = '✅ 优秀';
    } else if (connectivity >= 0.5) {
      rating = '⚠️ 良好';
    } else {
      rating = '❌ 需改进';
    }

    lines.push(`| ${cluster} | ${percentage}% | ${rating} |`);
  });

  lines.push('');

  lines.push('## 五、过度链接文章\n');

  if (health.overlinked.length === 0) {
    lines.push('✅ **无过度链接文章** - 入链分布合理\n');
  } else {
    lines.push(
      `⚠️ 发现 **${health.overlinked.length}** 篇文章被链接次数过多（>10次）：\n`
    );
    health.overlinked.forEach((slug) => {
      lines.push(`- ${slug}`);
    });
    lines.push('');
  }

  lines.push('## 六、优化建议\n');

  const suggestions: string[] = [];

  if (health.complianceRate < 1.0) {
    suggestions.push(
      `1. **修复不符合要求的文章**: 运行 \`npm run optimize:links\` 将所有文章调整到3-5个内链`
    );
  }

  if (health.islanded.length > 0) {
    suggestions.push(
      `2. **消除孤岛文章**: ${health.islanded.length} 篇文章没有被其他文章链接，建议通过双向链接优化改善`
    );
  }

  if (health.bidirectionalCoverage < 0.6) {
    suggestions.push(
      `3. **提升双向链接覆盖率**: 当前为 ${(health.bidirectionalCoverage * 100).toFixed(1)}%，建议目标 >60%`
    );
  }

  const lowConnectivityClusters = sortedClusters.filter(
    ([_, connectivity]) => connectivity < 0.5
  );
  if (lowConnectivityClusters.length > 0) {
    suggestions.push(
      `4. **改善Cluster连通性**: ${lowConnectivityClusters.length} 个主题集群内部连通性低于50%`
    );
  }

  if (suggestions.length === 0) {
    lines.push('✅ **无需额外优化** - 内链系统已达到最佳状态！\n');
  } else {
    suggestions.forEach((s) => lines.push(s));
    lines.push('');
  }

  lines.push('---');
  lines.push('*本报告由 BPCare AI 内链分析系统自动生成*');

  return lines.join('\n');
}

/**
 * 主函数
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Internal Linking Health Analysis                   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    // 1. 加载数据
    console.log('📊 Loading article embeddings...\n');
    const allEmbeddings = loadArticleEmbeddings();
    console.log(`✅ Loaded ${allEmbeddings.length} articles\n`);

    // 2. 分析健康度
    console.log('🔍 Analyzing internal linking health...\n');
    const health = analyzeInternalLinks(allEmbeddings);

    // 3. 生成报告
    console.log('📝 Generating health report...\n');
    const report = generateMarkdownReport(health);

    // 4. 保存报告
    const reportPath = path.join(process.cwd(), 'internal-links-health-report.md');
    fs.writeFileSync(reportPath, report, 'utf8');

    console.log(`✅ Report saved: ${reportPath}\n`);

    // 5. 在控制台输出摘要
    console.log('═'.repeat(60));
    console.log('📊 Quick Summary:');
    console.log(`   Total Articles: ${health.totalArticles}`);
    console.log(
      `   Compliant (3-5 links): ${health.compliantArticles} (${(health.complianceRate * 100).toFixed(1)}%)`
    );
    console.log(`   Average Links: ${health.averageLinks.toFixed(2)}`);
    console.log(
      `   Bidirectional Coverage: ${(health.bidirectionalCoverage * 100).toFixed(1)}%`
    );
    console.log(`   Islanded Articles: ${health.islanded.length}`);
    console.log('═'.repeat(60));
    console.log('');

    if (health.complianceRate < 1.0) {
      console.log('💡 Tip: Run "npm run optimize:links" to fix non-compliant articles\n');
    } else {
      console.log('🎉 All articles are compliant! Great job!\n');
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   - Make sure data/articles-embeddings.json exists');
    console.error('   - Run "npm run build:embeddings" if embeddings are missing\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
