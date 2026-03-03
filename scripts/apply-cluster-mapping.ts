/**
 * 应用TopicCluster映射，更新所有文章的frontmatter
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = path.join(process.cwd(), 'content/articles');
const mappingFile = path.join(process.cwd(), 'data/FINAL-MAPPING.json');

interface MappingData {
  total_articles: number;
  total_core_clusters: number;
  mappings: Record<string, string>;
  statistics: Record<string, number>;
}

async function applyMapping() {
  console.log('🔄 开始应用TopicCluster映射...\n');

  // 1. 读取映射表
  const mappingData: MappingData = JSON.parse(
    fs.readFileSync(mappingFile, 'utf-8')
  );
  console.log(`✅ 已加载映射表: ${mappingData.total_articles}篇文章 → ${mappingData.total_core_clusters}个核心clusters\n`);

  // 2. 获取所有文章文件
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  console.log(`📁 找到 ${files.length} 个文章文件\n`);

  let updated = 0;
  let notFound = 0;
  let unchanged = 0;

  // 3. 更新每篇文章
  for (const file of files) {
    const slug = file.replace('.md', '');
    const filePath = path.join(articlesDir, file);

    // 读取文章
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    // 获取新的cluster
    const newCluster = mappingData.mappings[slug];

    if (!newCluster) {
      notFound++;
      console.log(`⚠️  未找到映射: ${slug}`);
      continue;
    }

    const oldCluster = parsed.data.topicCluster;

    if (oldCluster === newCluster) {
      unchanged++;
      continue;
    }

    // 更新topicCluster
    parsed.data.topicCluster = newCluster;

    // 写回文件
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent, 'utf-8');

    updated++;

    if (updated % 100 === 0) {
      console.log(`   已更新 ${updated} 篇...`);
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('✅ 映射应用完成！');
  console.log('='.repeat(100));
  console.log(`✓ 已更新: ${updated}篇`);
  console.log(`✓ 未改变: ${unchanged}篇`);
  console.log(`⚠ 未找到: ${notFound}篇`);
  console.log(`总计: ${files.length}篇`);
  console.log('='.repeat(100));
}

applyMapping().catch(console.error);
