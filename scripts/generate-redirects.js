const fs = require('fs');
const path = require('path');

function generateRedirects() {
  console.log('生成重定向配置...\n');

  // 读取 slug 映射表
  const mappingPath = path.join(__dirname, '../data/slug-mapping.json');
  const slugMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

  // 生成重定向数组
  const redirects = Object.entries(slugMapping).map(([oldSlug, newSlug]) => ({
    source: `/articles/${oldSlug}`,
    destination: `/articles/${newSlug}`,
    permanent: true, // 301 永久重定向
  }));

  console.log(`生成了 ${redirects.length} 条重定向规则\n`);

  // 读取现有的 next.config.js
  const configPath = path.join(__dirname, '../next.config.js');
  let configContent = fs.readFileSync(configPath, 'utf8');

  // 创建重定向函数
  const redirectsFunction = `  async redirects() {
    const slugRedirects = ${JSON.stringify(redirects, null, 4).replace(/^/gm, '    ').trim()};
    return slugRedirects;
  },`;

  // 检查是否已经有 redirects 配置
  if (configContent.includes('redirects()')) {
    console.log('⚠️  next.config.js 中已有 redirects 配置');
    console.log('请手动合并重定向规则，或删除现有配置后重新运行');
  } else {
    // 在 images 配置后添加 redirects
    configContent = configContent.replace(
      /images:\s*{[^}]*},/s,
      (match) => `${match}\n${redirectsFunction}`
    );

    // 写回文件
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✓ 已更新 next.config.js，添加了重定向配置');
  }

  // 同时保存重定向列表到单独的文件，以便查看
  const redirectsListPath = path.join(__dirname, '../data/redirects-list.json');
  fs.writeFileSync(redirectsListPath, JSON.stringify(redirects, null, 2), 'utf8');
  console.log(`✓ 重定向列表已保存到 ${redirectsListPath}`);
}

// 运行生成
if (require.main === module) {
  try {
    generateRedirects();
    console.log('\n✓ 重定向配置生成完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

module.exports = { generateRedirects };
