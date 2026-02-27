const fs = require('fs');
const path = require('path');

function updateOtherDataFiles() {
  console.log('开始更新其他数据文件...\n');

  // 读取 slug 映射表
  const mappingPath = path.join(__dirname, '../data/slug-mapping.json');
  const slugMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  console.log(`读取 slug 映射表: ${Object.keys(slugMapping).length} 个映射\n`);

  // 更新 articles-embeddings.json
  console.log('更新 articles-embeddings.json...');
  const embeddingsPath = path.join(__dirname, '../data/articles-embeddings.json');
  const embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));

  let embeddingsUpdated = 0;
  for (const item of embeddings) {
    if (slugMapping[item.slug]) {
      item.slug = slugMapping[item.slug];
      embeddingsUpdated++;
    }
  }

  fs.writeFileSync(embeddingsPath, JSON.stringify(embeddings, null, 2), 'utf8');
  console.log(`✓ 已更新 ${embeddingsUpdated} 条记录\n`);

  // 更新 articles-seo.json
  console.log('更新 articles-seo.json...');
  const seoPath = path.join(__dirname, '../data/articles-seo.json');
  const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));

  let seoUpdated = 0;
  if (seoData.articles && Array.isArray(seoData.articles)) {
    for (const item of seoData.articles) {
      if (slugMapping[item.slug]) {
        item.slug = slugMapping[item.slug];
        seoUpdated++;
      }
    }
  }

  fs.writeFileSync(seoPath, JSON.stringify(seoData, null, 2), 'utf8');
  console.log(`✓ 已更新 ${seoUpdated} 条记录 (articles 数组${seoData.articles ? '有' : '无'}数据)\n`);

  console.log('✓ 所有数据文件更新完成！');
}

// 运行更新
if (require.main === module) {
  try {
    updateOtherDataFiles();
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

module.exports = { updateOtherDataFiles };
