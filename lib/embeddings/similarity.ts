/**
 * 文章相似度计算和查重工具
 */

import fs from 'fs';
import path from 'path';
import type { ArticleEmbedding } from './types';
import { generateEmbeddingForText } from './qwen';

/**
 * 计算两个向量的余弦相似度
 * @returns 相似度值 [0, 1]，值越大越相似
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // 处理边界情况
  if (!a || !b || a.length === 0 || b.length === 0) {
    return 0;
  }

  if (a.length !== b.length) {
    console.warn(`Vector length mismatch: ${a.length} vs ${b.length}`);
    return 0;
  }

  // 计算点积
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  // 处理零向量
  if (normA === 0 || normB === 0) {
    return 0;
  }

  // 余弦相似度 = dot(a, b) / (|a| * |b|)
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 从本地文件加载所有文章的 embedding
 */
async function loadArticleEmbeddings(): Promise<ArticleEmbedding[]> {
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  if (!fs.existsSync(embeddingsPath)) {
    throw new Error(
      `Embeddings file not found: ${embeddingsPath}\n` +
      'Please run "npm run build:embeddings" first to generate article embeddings.'
    );
  }

  try {
    const data = fs.readFileSync(embeddingsPath, 'utf8');
    const embeddings: ArticleEmbedding[] = JSON.parse(data);

    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      throw new Error('Invalid embeddings file: expected non-empty array');
    }

    return embeddings;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse embeddings JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 构造主题输入文本（与 build-embeddings.ts 中的逻辑保持一致）
 */
function buildTopicInputText(params: {
  title: string;
  description?: string;
  primaryKeyword?: string;
}): string {
  let text = params.title;

  if (params.description && params.description.trim().length > 0) {
    text += `\n${params.description}`;
  }

  if (params.primaryKeyword && params.primaryKeyword.trim().length > 0) {
    text += `\nPrimary keyword: ${params.primaryKeyword}`;
  }

  return text;
}

/**
 * 相似文章结果
 */
export interface SimilarArticle {
  slug: string;
  title: string;
  primaryKeyword: string;
  topicCluster: string;
  similarity: number;
}

/**
 * 查找相似文章的参数
 */
export interface FindSimilarArticlesParams {
  title: string;
  description?: string;
  primaryKeyword?: string;
  topK?: number;           // 返回前 K 篇，默认 5
  minSimilarity?: number;  // 最小相似度阈值，默认 0.6
}

/**
 * 为新主题查找相似的已有文章
 */
export async function findSimilarArticlesForTopic(
  params: FindSimilarArticlesParams
): Promise<SimilarArticle[]> {
  const { title, description, primaryKeyword, topK = 5, minSimilarity = 0.6 } = params;

  // 1. 构造输入文本
  const inputText = buildTopicInputText({ title, description, primaryKeyword });

  // 2. 生成新主题的 embedding
  const newTopicEmbedding = await generateEmbeddingForText(inputText);

  // 3. 加载所有已有文章的 embedding
  const allEmbeddings = await loadArticleEmbeddings();

  // 4. 计算每篇文章与新主题的相似度
  const similarities: SimilarArticle[] = allEmbeddings.map((article) => ({
    slug: article.slug,
    title: article.title,
    primaryKeyword: article.primaryKeyword,
    topicCluster: article.topicCluster,
    similarity: cosineSimilarity(newTopicEmbedding, article.embedding),
  }));

  // 5. 过滤 + 排序 + 取前 K 个
  return similarities
    .filter((item) => item.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * 选题查重结果
 */
export interface TopicDuplicateCheckResult {
  isDuplicate: boolean;        // 是否可能重复
  maxSimilarity: number;        // 最高相似度
  mostSimilar?: SimilarArticle; // 最相似的文章
  allSimilar: SimilarArticle[]; // 所有相似文章列表
}

/**
 * 检查选题是否与现有文章重复
 */
export async function checkTopicDuplicate(
  params: FindSimilarArticlesParams & { duplicateThreshold?: number }
): Promise<TopicDuplicateCheckResult> {
  const { duplicateThreshold = 0.85, ...findParams } = params;

  // 查找相似文章，topK 设大一点以便充分检查
  const similarArticles = await findSimilarArticlesForTopic({
    ...findParams,
    topK: 10,
    minSimilarity: 0.5, // 降低阈值以获取更多候选
  });

  const mostSimilar = similarArticles[0];
  const maxSimilarity = mostSimilar?.similarity ?? 0;

  return {
    isDuplicate: maxSimilarity >= duplicateThreshold,
    maxSimilarity,
    mostSimilar,
    allSimilar: similarArticles,
  };
}
