const fs = require('fs');
const path = require('path');

// 将字符串转换为 slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 智能生成新 slug
function generateNewSlug(article, existingSlugs, slugMapping) {
  const primaryKeyword = article.primaryKeyword || '';
  const title = article.title || '';

  // 优先使用 primaryKeyword
  let baseSlug = slugify(primaryKeyword);

  // 如果 primaryKeyword 生成的 slug 还是太长，或者为空，使用 title 的前几个词
  if (!baseSlug || baseSlug.length > 100) {
    const words = title.split(/\s+/).slice(0, 12); // 取前12个词
    baseSlug = slugify(words.join(' '));
  }

  // 确保长度不超过 100
  if (baseSlug.length > 100) {
    baseSlug = baseSlug.substring(0, 100).replace(/-[^-]*$/, ''); // 在单词边界截断
  }

  // 处理重复
  let newSlug = baseSlug;
  let counter = 1;
  while (existingSlugs.has(newSlug) || Object.values(slugMapping).includes(newSlug)) {
    // 添加日期或计数器
    const dateSuffix = article.date ? article.date.replace(/\-/g, '') : counter.toString();
    newSlug = `${baseSlug}-${dateSuffix}`;
    if (newSlug.length > 120) {
      // 如果加了后缀还是太长，缩短 base
      const shortened = baseSlug.substring(0, 100 - dateSuffix.length - 1).replace(/-[^-]*$/, '');
      newSlug = `${shortened}-${dateSuffix}`;
    }
    counter++;
    if (counter > 100) {
      // 防止无限循环
      newSlug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return newSlug;
}

// 主函数
function fixLongSlugs() {
  console.log('开始修复超长 slug...\n');

  // 读取 articles-index.json
  const indexPath = path.join(__dirname, '../data/articles-index.json');
  const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  console.log(`总文章数: ${articles.length}`);

  // 找出需要修复的文章
  const longSlugArticles = articles.filter(a => a.slug.length > 150);
  console.log(`需要修复的文章: ${longSlugArticles.length}\n`);

  // 创建 slug 映射表 (旧 slug -> 新 slug)
  const slugMapping = {};
  const existingSlugs = new Set(articles.filter(a => a.slug.length <= 150).map(a => a.slug));

  // 为每篇需要修复的文章生成新 slug
  console.log('生成新 slug...');
  for (const article of longSlugArticles) {
    const oldSlug = article.slug;
    const newSlug = generateNewSlug(article, existingSlugs, slugMapping);
    slugMapping[oldSlug] = newSlug;
    existingSlugs.add(newSlug);

    console.log(`✓ ${oldSlug.substring(0, 80)}... (${oldSlug.length} 字符)`);
    console.log(`  → ${newSlug} (${newSlug.length} 字符)\n`);
  }

  // 更新文章的 slug 和 relatedSlugs
  console.log('\n更新文章数据...');
  for (const article of articles) {
    // 更新 slug
    if (slugMapping[article.slug]) {
      article.slug = slugMapping[article.slug];
    }

    // 更新 relatedSlugs
    if (article.relatedSlugs && Array.isArray(article.relatedSlugs)) {
      article.relatedSlugs = article.relatedSlugs.map(slug =>
        slugMapping[slug] || slug
      );
    }
  }

  // 保存更新后的 articles-index.json
  fs.writeFileSync(indexPath, JSON.stringify(articles, null, 2), 'utf8');
  console.log(`✓ 已更新 ${indexPath}`);

  // 保存 slug 映射表（用于生成重定向）
  const mappingPath = path.join(__dirname, '../data/slug-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(slugMapping, null, 2), 'utf8');
  console.log(`✓ 已保存 slug 映射表到 ${mappingPath}`);

  console.log(`\n总结:`);
  console.log(`- 修复了 ${Object.keys(slugMapping).length} 个超长 slug`);
  console.log(`- 最长的新 slug: ${Math.max(...Object.values(slugMapping).map(s => s.length))} 字符`);

  return slugMapping;
}

// 运行修复
if (require.main === module) {
  try {
    const mapping = fixLongSlugs();
    console.log('\n✓ 修复完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

module.exports = { fixLongSlugs, generateNewSlug };
