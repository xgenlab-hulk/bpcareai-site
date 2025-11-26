/**
 * 增量 Embedding 工具函数
 * 用于避免重复计算 embedding，节省 Qwen API token
 */

import fs from 'fs';
import path from 'path';
import type { ArticleEmbedding } from './types';
import { generateEmbeddingForText } from './qwen';
import { getCachedTopicEmbedding } from '../topics/embedding-cache';

/**
 * 为新文章立即生成并保存 embedding
 *
 * 使用场景：
 * - 在 generate-articles.ts 中生成新文章后立即调用
 * - 避免后续运行 build:embeddings 时重复计算
 *
 * 特点：
 * - ✅ 检查 slug 是否已存在，防止重复
 * - ✅ 增量追加到 articles-embeddings.json
 * - ✅ 仅消耗 1 篇文章的 token
 *
 * @param params 文章元信息
 */
export async function addEmbeddingForNewArticle(params: {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
}): Promise<void> {
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  // 1. 读取现有 embeddings
  let existingEmbeddings: ArticleEmbedding[] = [];

  if (fs.existsSync(embeddingsPath)) {
    try {
      const data = fs.readFileSync(embeddingsPath, 'utf8');
      existingEmbeddings = JSON.parse(data);
    } catch (error) {
      console.error(`   ⚠️  Failed to read embeddings file: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`   Creating new embeddings file...`);
      existingEmbeddings = [];
    }
  }

  // 2. 检查是否已存在（防重复）
  const exists = existingEmbeddings.some(e => e.slug === params.slug);
  if (exists) {
    console.log(`   ℹ️  Embedding already exists for: ${params.slug}`);
    return;
  }

  // 3. 尝试从缓存读取 embedding（复用之前补充 topics 时生成的）
  let embedding: number[] | null = getCachedTopicEmbedding(params.title, params.primaryKeyword);

  if (embedding) {
    console.log(`   🔄 Using cached embedding for: ${params.slug}`);
  } else {
    // 缓存未命中，生成新的 embedding
    const inputText = buildEmbeddingInput(params);
    console.log(`   🔢 Generating new embedding for: ${params.slug}...`);

    try {
      embedding = await generateEmbeddingForText(inputText);
    } catch (error) {
      console.error(`   ❌ Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
      throw error; // 向上传播错误
    }
  }

  try {
    // 4. 构造新的 embedding 对象
    const newEmbedding: ArticleEmbedding = {
      slug: params.slug,
      title: params.title,
      primaryKeyword: params.primaryKeyword,
      topicCluster: params.topicCluster,
      embedding,
    };

    // 5. 追加到数组
    existingEmbeddings.push(newEmbedding);

    // 6. 确保 data 目录存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 7. 写入文件
    fs.writeFileSync(embeddingsPath, JSON.stringify(existingEmbeddings, null, 2), 'utf8');

    console.log(`   ✅ Embedding saved (dimension: ${embedding.length})`);
  } catch (error) {
    console.error(`   ❌ Failed to save embedding: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 构造用于生成 embedding 的输入文本
 * 与 build-embeddings.ts 保持一致
 */
function buildEmbeddingInput(params: {
  title: string;
  description: string;
  primaryKeyword: string;
}): string {
  let text = `${params.title}\n${params.description}`;

  if (params.primaryKeyword && params.primaryKeyword.trim().length > 0) {
    text += `\nPrimary keyword: ${params.primaryKeyword}`;
  }

  return text;
}

/**
 * 检查某个 slug 的 embedding 是否已存在
 *
 * @param slug 文章 slug
 * @returns 是否已存在
 */
export function hasEmbedding(slug: string): boolean {
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  if (!fs.existsSync(embeddingsPath)) {
    return false;
  }

  try {
    const data = fs.readFileSync(embeddingsPath, 'utf8');
    const embeddings: ArticleEmbedding[] = JSON.parse(data);
    return embeddings.some(e => e.slug === slug);
  } catch (error) {
    console.error(`Failed to check embedding: ${error}`);
    return false;
  }
}

/**
 * 获取已存在 embeddings 的 slug 集合
 * 用于批量过滤
 *
 * @returns slug 集合
 */
export function getExistingEmbeddingSlugs(): Set<string> {
  const embeddingsPath = path.join(process.cwd(), 'data', 'articles-embeddings.json');

  if (!fs.existsSync(embeddingsPath)) {
    return new Set();
  }

  try {
    const data = fs.readFileSync(embeddingsPath, 'utf8');
    const embeddings: ArticleEmbedding[] = JSON.parse(data);
    return new Set(embeddings.map(e => e.slug));
  } catch (error) {
    console.error(`Failed to load existing embeddings: ${error}`);
    return new Set();
  }
}
