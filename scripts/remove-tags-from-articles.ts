/**
 * 批量删除所有文章markdown文件中的tags字段
 */

import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'content/articles');

async function removeTags() {
  console.log('🔄 开始删除所有文章中的tags字段...\n');

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  console.log(`📁 找到 ${files.length} 个文章文件\n`);

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 检查是否包含tags字段
    if (!content.includes('tags:')) {
      skipped++;
      continue;
    }

    // 使用正则表达式删除tags字段
    // 匹配 tags: 开始，直到下一个顶级字段或 --- 结束
    const newContent = content.replace(
      /^tags:\s*\n(?:  - .+\n)*/m,
      ''
    );

    // 写回文件
    fs.writeFileSync(filePath, newContent, 'utf-8');
    updated++;

    if (updated % 100 === 0) {
      console.log(`   已处理 ${updated} 篇...`);
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('✅ Tags字段删除完成！');
  console.log('='.repeat(100));
  console.log(`✓ 已更新: ${updated}篇`);
  console.log(`✓ 已跳过: ${skipped}篇（无tags字段）`);
  console.log(`总计: ${files.length}篇`);
  console.log('='.repeat(100));
}

removeTags().catch(console.error);
