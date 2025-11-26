import fs from 'fs';
import path from 'path';
import { slugify } from '../utils/slugify';

/**
 * Embedding 缓存条目
 */
interface EmbeddingCacheEntry {
  embedding: number[];
  createdAt: string;
}

/**
 * Embedding 缓存结构
 */
interface EmbeddingCache {
  [topicKey: string]: EmbeddingCacheEntry;
}

/**
 * 获取缓存文件路径
 */
function getCacheFilePath(): string {
  return path.join(process.cwd(), 'data', 'topic-embeddings-cache.json');
}

/**
 * 生成 topic 的缓存 key
 * 使用 title + primaryKeyword 的组合来唯一标识一个 topic
 */
export function getTopicCacheKey(title: string, primaryKeyword: string): string {
  const titleSlug = slugify(title);
  const keywordSlug = slugify(primaryKeyword);
  return `${titleSlug}_${keywordSlug}`;
}

/**
 * 加载缓存（如果存在）
 */
function loadCache(): EmbeddingCache {
  const cacheFilePath = getCacheFilePath();

  if (!fs.existsSync(cacheFilePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(cacheFilePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Failed to load embedding cache: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}

/**
 * 保存缓存到文件
 */
function saveCache(cache: EmbeddingCache): void {
  const cacheFilePath = getCacheFilePath();
  const dataDir = path.dirname(cacheFilePath);

  // 确保 data 目录存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error(`❌ Failed to save embedding cache: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 保存 topic embedding 到缓存
 */
export function cacheTopicEmbedding(
  title: string,
  primaryKeyword: string,
  embedding: number[]
): void {
  const cache = loadCache();
  const key = getTopicCacheKey(title, primaryKeyword);

  cache[key] = {
    embedding,
    createdAt: new Date().toISOString(),
  };

  saveCache(cache);
}

/**
 * 从缓存读取 topic embedding
 * @returns embedding 数组，如果不存在则返回 null
 */
export function getCachedTopicEmbedding(
  title: string,
  primaryKeyword: string
): number[] | null {
  const cache = loadCache();
  const key = getTopicCacheKey(title, primaryKeyword);

  const entry = cache[key];
  return entry ? entry.embedding : null;
}

/**
 * 检查缓存中是否存在指定 topic 的 embedding
 */
export function hasCachedEmbedding(title: string, primaryKeyword: string): boolean {
  const cache = loadCache();
  const key = getTopicCacheKey(title, primaryKeyword);
  return key in cache;
}

/**
 * 批量保存 embeddings 到缓存
 */
export function batchCacheTopicEmbeddings(
  topics: Array<{
    title: string;
    primaryKeyword: string;
    embedding: number[];
  }>
): void {
  const cache = loadCache();
  const now = new Date().toISOString();

  for (const topic of topics) {
    const key = getTopicCacheKey(topic.title, topic.primaryKeyword);
    cache[key] = {
      embedding: topic.embedding,
      createdAt: now,
    };
  }

  saveCache(cache);
}

/**
 * 清理缓存中的旧条目
 * @param daysOld 删除超过指定天数的条目
 */
export function cleanOldCacheEntries(daysOld: number = 90): number {
  const cache = loadCache();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  let removedCount = 0;
  const keys = Object.keys(cache);

  for (const key of keys) {
    const entry = cache[key];
    const entryDate = new Date(entry.createdAt);

    if (entryDate < cutoffDate) {
      delete cache[key];
      removedCount++;
    }
  }

  if (removedCount > 0) {
    saveCache(cache);
    console.log(`🧹 Cleaned ${removedCount} old cache entries (older than ${daysOld} days)`);
  }

  return removedCount;
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  totalEntries: number;
  cacheFileSizeMB: number;
  oldestEntry: string | null;
  newestEntry: string | null;
} {
  const cache = loadCache();
  const keys = Object.keys(cache);

  let oldest: string | null = null;
  let newest: string | null = null;

  for (const key of keys) {
    const entry = cache[key];
    if (!oldest || entry.createdAt < oldest) {
      oldest = entry.createdAt;
    }
    if (!newest || entry.createdAt > newest) {
      newest = entry.createdAt;
    }
  }

  // 计算文件大小
  let cacheFileSizeMB = 0;
  const cacheFilePath = getCacheFilePath();
  if (fs.existsSync(cacheFilePath)) {
    const stats = fs.statSync(cacheFilePath);
    cacheFileSizeMB = stats.size / (1024 * 1024);
  }

  return {
    totalEntries: keys.length,
    cacheFileSizeMB: parseFloat(cacheFileSizeMB.toFixed(2)),
    oldestEntry: oldest,
    newestEntry: newest,
  };
}
