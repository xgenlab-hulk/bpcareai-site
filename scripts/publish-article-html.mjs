import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

// 使用 Next 自己生成的完整页面，保留元数据、结构化数据和客户端组件。
const destination = 'public/_article-documents';
const articles = (await readdir('content/articles')).filter(file => file.endsWith('.md'));
if (articles.length === 0) throw new Error('缺少文章，取消静态发布');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const article of articles) {
  const html = path.basename(article, '.md') + '.html';
  await copyFile(path.join('.next/server/app/articles', html), path.join(destination, html));
}
console.log('已生成文章静态文件：', articles.length);
