import fs from 'fs';
import path from 'path';
import { getAllArticlesMeta } from '../lib/articles';

async function buildArticlesIndex() {
  console.log('🔍 Reading articles from /content/articles...');

  // 获取所有文章元数据
  const articles = await getAllArticlesMeta();

  console.log(`✅ Found ${articles.length} articles`);

  // 确保 /data 目录存在
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created /data directory');
  }

  // 写入索引文件
  const outputPath = path.join(dataDir, 'articles-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf8');

  console.log(`📝 Articles index written to ${outputPath}`);
  console.log('✨ Done!');
}

buildArticlesIndex().catch((error) => {
  console.error('❌ Error building articles index:', error);
  process.exit(1);
});
