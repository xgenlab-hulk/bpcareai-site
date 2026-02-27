const fs = require('fs');
const path = require('path');

function renameArticleFiles() {
  console.log('开始重命名文章文件...\n');

  // 读取 slug 映射表
  const mappingPath = path.join(__dirname, '../data/slug-mapping.json');
  const slugMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

  console.log(`读取 slug 映射表: ${Object.keys(slugMapping).length} 个映射\n`);

  const articlesDir = path.join(__dirname, '../content/articles');
  let renamedCount = 0;
  let notFoundCount = 0;
  const errors = [];

  // 遍历映射表，重命名文件
  for (const [oldSlug, newSlug] of Object.entries(slugMapping)) {
    const oldFileMd = path.join(articlesDir, `${oldSlug}.md`);
    const oldFileMdx = path.join(articlesDir, `${oldSlug}.mdx`);

    let oldFile = null;
    let ext = '';

    // 检查 .md 或 .mdx
    if (fs.existsSync(oldFileMd)) {
      oldFile = oldFileMd;
      ext = '.md';
    } else if (fs.existsSync(oldFileMdx)) {
      oldFile = oldFileMdx;
      ext = '.mdx';
    }

    if (oldFile) {
      const newFile = path.join(articlesDir, `${newSlug}${ext}`);

      try {
        // 检查新文件名是否已存在
        if (fs.existsSync(newFile)) {
          errors.push(`新文件已存在: ${newSlug}${ext}`);
          continue;
        }

        // 重命名文件
        fs.renameSync(oldFile, newFile);
        renamedCount++;

        if (renamedCount <= 5) {
          console.log(`✓ ${oldSlug.substring(0, 60)}...${ext}`);
          console.log(`  → ${newSlug}${ext}\n`);
        }
      } catch (error) {
        errors.push(`重命名失败 ${oldSlug}: ${error.message}`);
      }
    } else {
      notFoundCount++;
      if (notFoundCount <= 5) {
        console.log(`⚠ 文件不存在: ${oldSlug}.md/mdx`);
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('重命名结果:');
  console.log(`${'='.repeat(80)}`);
  console.log(`✓ 成功重命名: ${renamedCount} 个文件`);
  console.log(`⚠ 文件不存在: ${notFoundCount} 个`);
  console.log(`❌ 错误: ${errors.length} 个`);

  if (errors.length > 0) {
    console.log('\n错误详情:');
    errors.forEach(err => console.log(`  - ${err}`));
  }

  console.log(`${'='.repeat(80)}\n`);
}

// 运行重命名
if (require.main === module) {
  try {
    renameArticleFiles();
    console.log('✓ 文件重命名完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

module.exports = { renameArticleFiles };
