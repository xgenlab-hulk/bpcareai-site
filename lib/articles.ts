import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  primaryKeyword?: string;
  topicCluster?: string;
  image?: string;
  relatedSlugs?: string[];
}

export interface Article extends ArticleMeta {
  content: string;
}

// 构建期间源文件固定，每个构建进程只需扫描一次文章目录。
let buildIndex: ArticleMeta[] | undefined;

/**
 * 获取所有文章的元数据，按日期倒序排列
 */
export function getAllArticlesMeta(): ArticleMeta[] {
  if (buildIndex) return buildIndex.slice();
  // 确保目录存在
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || '',
        description: matterResult.data.description || '',
        date: matterResult.data.date || '',
        updated: matterResult.data.updated,
        primaryKeyword: matterResult.data.primaryKeyword,
        topicCluster: matterResult.data.topicCluster,
        image: matterResult.data.image,
        relatedSlugs: matterResult.data.relatedSlugs || [],
      } as ArticleMeta;
    });

  // 按日期倒序排序
  allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  if (process.env.BPC_BUILD_ARTICLES === '1') buildIndex = allArticlesData;
  return allArticlesData.slice();
}

/**
 * 根据 slug 获取单篇文章的完整内容
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // 使用 remark 将 Markdown 转换为 HTML
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: matterResult.data.title || '',
      description: matterResult.data.description || '',
      date: matterResult.data.date || '',
      updated: matterResult.data.updated,
      primaryKeyword: matterResult.data.primaryKeyword,
      topicCluster: matterResult.data.topicCluster,
      image: matterResult.data.image,
      relatedSlugs: matterResult.data.relatedSlugs || [],
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有文章的 slug（用于生成静态路径）
 */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
