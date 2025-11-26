import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArticleMeta, ArticleFull } from './types';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * 获取所有文章的元数据
 * @returns Promise<ArticleMeta[]> 按 date 降序排序的文章列表
 */
export async function getAllArticlesMeta(): Promise<ArticleMeta[]> {
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
        updated: matterResult.data.updated || '',
        primaryKeyword: matterResult.data.primaryKeyword || '',
        topicCluster: matterResult.data.topicCluster || '',
        image: matterResult.data.image || '',
        tags: matterResult.data.tags || [],
        relatedSlugs: matterResult.data.relatedSlugs || [],
      } as ArticleMeta;
    });

  // 按日期倒序排序
  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * 根据 slug 获取单篇文章的完整内容
 * @param slug 文章的 slug
 * @returns Promise<ArticleFull | null> 文章完整数据，失败时返回 null
 */
export async function getArticleBySlug(slug: string): Promise<ArticleFull | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      title: matterResult.data.title || '',
      description: matterResult.data.description || '',
      date: matterResult.data.date || '',
      updated: matterResult.data.updated || '',
      primaryKeyword: matterResult.data.primaryKeyword || '',
      topicCluster: matterResult.data.topicCluster || '',
      image: matterResult.data.image || '',
      tags: matterResult.data.tags || [],
      relatedSlugs: matterResult.data.relatedSlugs || [],
      content: matterResult.content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}
