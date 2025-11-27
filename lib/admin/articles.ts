/**
 * Admin - Articles Management Utilities
 * Functions to read and process published articles data
 */
import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '../articles/types';

/**
 * Get all published articles from articles-index.json
 */
export async function getAllArticles(): Promise<ArticleMeta[]> {
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');

  if (!fs.existsSync(indexPath)) {
    return [];
  }

  const data = fs.readFileSync(indexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(data);

  return articles;
}

/**
 * Get articles statistics
 */
export async function getArticlesStats() {
  const articles = await getAllArticles();

  // Calculate this week's articles
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeekArticles = articles.filter(a => {
    const publishDate = new Date(a.date);
    return publishDate >= oneWeekAgo;
  }).length;

  // Calculate average word count (estimated from description length * 10)
  const avgWords = articles.length > 0
    ? Math.round(
        articles.reduce((sum, a) => sum + (a.description?.length || 0) * 10, 0) / articles.length
      )
    : 0;

  // Count by topic cluster
  const byTopic: Record<string, number> = {};
  articles.forEach(a => {
    const topic = a.topicCluster || 'uncategorized';
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  });

  return {
    total: articles.length,
    thisWeek: thisWeekArticles,
    avgWords,
    byTopic,
  };
}

/**
 * Search articles by query (title or keywords)
 */
export async function searchArticles(query: string): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();

  if (!query) {
    return articles;
  }

  const lowerQuery = query.toLowerCase();

  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description?.toLowerCase().includes(lowerQuery) ||
    article.primaryKeyword?.toLowerCase().includes(lowerQuery) ||
    article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filter articles by topic cluster
 */
export async function filterArticlesByTopic(topic: string): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();

  if (!topic || topic === 'all') {
    return articles;
  }

  return articles.filter(article => article.topicCluster === topic);
}

/**
 * Get unique topic clusters
 */
export async function getTopicClusters(): Promise<string[]> {
  const articles = await getAllArticles();
  const clusters = new Set<string>();

  articles.forEach(article => {
    if (article.topicCluster) {
      clusters.add(article.topicCluster);
    }
  });

  return Array.from(clusters).sort();
}
