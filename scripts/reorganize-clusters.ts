/**
 * Cluster Reorganization Script
 * Consolidates 155 clusters into 20 core clusters for better SEO and content organization
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Load mapping
const mappingFile = path.join(process.cwd(), 'scripts', 'cluster-mapping.json');
const { mapping } = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

// Build reverse mapping (old cluster -> new cluster)
const reverseMapping: Record<string, string> = {};
for (const [newCluster, oldClusters] of Object.entries(mapping)) {
  for (const oldCluster of oldClusters as string[]) {
    reverseMapping[oldCluster] = newCluster;
  }
}

interface Stats {
  totalArticles: number;
  updated: number;
  notMapped: string[];
  clusterDistribution: Record<string, number>;
}

const stats: Stats = {
  totalArticles: 0,
  updated: 0,
  notMapped: [],
  clusterDistribution: {},
};

function updateArticleCluster(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    stats.totalArticles++;

    // Get current cluster (handle both quoted and unquoted)
    const currentCluster = String(data.topicCluster || '').replace(/"/g, '');

    if (!currentCluster) {
      console.log(`⚠️  No cluster found in: ${path.basename(filePath)}`);
      return;
    }

    // Find new cluster
    const newCluster = reverseMapping[currentCluster];

    if (!newCluster) {
      if (!stats.notMapped.includes(currentCluster)) {
        stats.notMapped.push(currentCluster);
      }
      console.log(`❌ No mapping found for cluster: "${currentCluster}" in ${path.basename(filePath)}`);
      return;
    }

    // Update cluster in frontmatter
    data.topicCluster = newCluster;

    // Track distribution
    stats.clusterDistribution[newCluster] = (stats.clusterDistribution[newCluster] || 0) + 1;

    // Write back to file
    const newContent = matter.stringify(markdownContent, data);
    fs.writeFileSync(filePath, newContent, 'utf8');

    stats.updated++;
    console.log(`✅ Updated: ${path.basename(filePath)} | ${currentCluster} → ${newCluster}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function main() {
  console.log('🚀 Starting cluster reorganization...\n');
  console.log(`📊 Consolidating 155 clusters into ${Object.keys(mapping).length} core clusters\n`);

  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} articles to process\n`);

  // Process each article
  files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    updateArticleCluster(filePath);
  });

  // Print statistics
  console.log('\n' + '='.repeat(80));
  console.log('📊 REORGANIZATION COMPLETE');
  console.log('='.repeat(80));
  console.log(`\nTotal articles processed: ${stats.totalArticles}`);
  console.log(`Successfully updated: ${stats.updated}`);
  console.log(`Not mapped: ${stats.notMapped.length}`);

  if (stats.notMapped.length > 0) {
    console.log('\n⚠️  Clusters without mapping:');
    stats.notMapped.forEach(cluster => console.log(`   - ${cluster}`));
  }

  console.log('\n📈 New Cluster Distribution:');
  const sorted = Object.entries(stats.clusterDistribution).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([cluster, count]) => {
    console.log(`   ${cluster}: ${count} articles`);
  });

  console.log('\n✨ Done! All articles have been reorganized.');
  console.log('📝 Next steps:');
  console.log('   1. Review the changes: git diff');
  console.log('   2. Commit: git add . && git commit -m "refactor: consolidate 155 clusters into 20 core clusters for better SEO"');
  console.log('   3. Push: git push\n');
}

main();
