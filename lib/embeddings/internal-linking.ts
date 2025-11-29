/**
 * Internal Linking 工具函数（智能版本）
 * 用于生成和管理文章之间的相关链接（relatedSlugs）
 *
 * 特性：
 * - 强制保证每篇文章3-5个内链
 * - TopicCluster优先级
 * - 双向链接平衡
 * - 避免孤岛文章
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ArticleEmbedding } from './types';
import { cosineSimilarity } from './similarity';

/**
 * 相似文章结果（简化版，仅用于内部链接）
 */
export interface RelatedArticle {
  slug: string;
  similarity: number;
}

/**
 * 扩展的相似文章结果（包含更多元数据）
 */
export interface RelatedArticleExtended extends RelatedArticle {
  title: string;
  topicCluster: string;
  primaryKeyword: string;
  sameCluster: boolean;  // 是否同一个topicCluster
  inlinkCount?: number;  // 该文章被链接的次数（用于平衡）
}

/**
 * 智能内链计算选项
 */
export interface SmartLinkingOptions {
  minLinks?: number;           // 最少链接数（默认3）
  maxLinks?: number;           // 最多链接数（默认5）
  clusterBoost?: number;       // 同cluster相似度加成（默认1.15）
  avoidOverlinked?: boolean;   // 避免链接到过度链接的文章（默认true）
  balanceFactor?: number;      // 平衡因子权重（默认0.2）
  minSimilarityTiers?: number[];  // 分层相似度阈值（默认[0.6, 0.5, 0.4]）
}

/**
 * 从本地加载所有文章的 embedding
 */
export function loadArticleEmbeddings(): ArticleEmbedding[] {
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
 * 为指定文章计算最相似的其他文章
 *
 * @param targetSlug 目标文章的 slug
 * @param allEmbeddings 所有文章的 embeddings（从 articles-embeddings.json 加载）
 * @param minSimilarity 最低相似度阈值，默认 0.6
 * @param topK 返回前 K 个最相似文章，默认 3
 * @returns 相似文章列表（按相似度降序）
 */
export function calculateSimilarArticles(
  targetSlug: string,
  allEmbeddings: ArticleEmbedding[],
  minSimilarity: number = 0.6,
  topK: number = 3
): RelatedArticle[] {
  // 1. 找到目标文章的 embedding
  const targetArticle = allEmbeddings.find((a) => a.slug === targetSlug);

  if (!targetArticle) {
    console.warn(`⚠️  Target article not found in embeddings: ${targetSlug}`);
    return [];
  }

  // 2. 计算与其他所有文章的相似度
  const similarities: RelatedArticle[] = allEmbeddings
    .filter((article) => article.slug !== targetSlug) // 排除自己
    .map((article) => ({
      slug: article.slug,
      similarity: cosineSimilarity(targetArticle.embedding, article.embedding),
    }));

  // 3. 过滤、排序、取前 K 个
  return similarities
    .filter((item) => item.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * 更新文章 Markdown 文件的 frontmatter 中的 relatedSlugs
 *
 * @param slug 文章 slug
 * @param relatedSlugs 新的 relatedSlugs 数组
 * @param preserveExisting 是否保留现有的 relatedSlugs（合并去重），默认 true
 */
export function updateArticleFrontmatter(
  slug: string,
  relatedSlugs: string[],
  preserveExisting: boolean = true
): void {
  const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);

  if (!fs.existsSync(articlePath)) {
    console.warn(`⚠️  Article file not found: ${articlePath}`);
    return;
  }

  try {
    // 1. 读取文件
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // 2. 合并 relatedSlugs（如果需要保留现有的）
    let finalRelatedSlugs = relatedSlugs;

    if (preserveExisting && Array.isArray(frontmatter.relatedSlugs)) {
      // 合并并去重：现有的在前，新的在后
      const existingSlugs = frontmatter.relatedSlugs as string[];
      finalRelatedSlugs = [
        ...existingSlugs,
        ...relatedSlugs.filter((slug) => !existingSlugs.includes(slug)),
      ];
    }

    // 3. 更新 frontmatter
    frontmatter.relatedSlugs = finalRelatedSlugs;

    // 4. 写回文件
    const updatedContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(articlePath, updatedContent, 'utf8');

    console.log(`✅ Updated relatedSlugs for: ${slug}`);
  } catch (error) {
    console.error(`❌ Failed to update frontmatter for ${slug}:`, error);
  }
}

/**
 * 批量更新结果统计
 */
export interface BatchUpdateResult {
  articlesProcessed: number;
  linksUpdated: number;
  skipped: number;
}

/**
 * 批量为多个文章计算并更新 relatedSlugs
 *
 * @param slugs 要更新的文章 slug 列表（如果为空，则更新所有文章）
 * @param minSimilarity 最低相似度阈值
 * @param topK 每篇文章最多推荐几篇相关文章
 * @param preserveExisting 是否保留现有的 relatedSlugs
 * @returns 更新统计结果
 */
export function batchUpdateRelatedLinks(
  slugs: string[] | null = null,
  minSimilarity: number = 0.6,
  topK: number = 3,
  preserveExisting: boolean = true
): BatchUpdateResult {
  console.log('\n🔗 Starting batch update of related links...\n');

  // 1. 加载所有 embeddings
  const allEmbeddings = loadArticleEmbeddings();
  console.log(`📊 Loaded ${allEmbeddings.length} article embeddings\n`);

  // 2. 确定要更新的文章列表
  const targetSlugs = slugs || allEmbeddings.map((e) => e.slug);
  console.log(`🎯 Updating ${targetSlugs.length} articles\n`);

  // 3. 逐一计算并更新
  let successCount = 0;
  let skippedCount = 0;

  targetSlugs.forEach((slug, index) => {
    console.log(`[${index + 1}/${targetSlugs.length}] Processing: ${slug}`);

    // 计算相似文章
    const relatedArticles = calculateSimilarArticles(
      slug,
      allEmbeddings,
      minSimilarity,
      topK
    );

    if (relatedArticles.length === 0) {
      console.log(`  ⚠️  No similar articles found (threshold: ${minSimilarity})`);
      skippedCount++;
      return;
    }

    // 打印找到的相关文章
    console.log(`  Found ${relatedArticles.length} related articles:`);
    relatedArticles.forEach((r) => {
      console.log(`    - ${r.slug} (similarity: ${r.similarity.toFixed(3)})`);
    });

    // 更新文件
    const relatedSlugs = relatedArticles.map((r) => r.slug);
    updateArticleFrontmatter(slug, relatedSlugs, preserveExisting);

    successCount++;
    console.log('');
  });

  // 4. 输出总结
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Successfully updated: ${successCount} articles`);
  console.log(`⚠️  Skipped (no matches): ${skippedCount} articles`);
  console.log(`📝 Total processed: ${targetSlugs.length} articles`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return {
    articlesProcessed: targetSlugs.length,
    linksUpdated: successCount * topK,
    skipped: skippedCount,
  };
}

// ============================================================================
// 智能内链算法（新增）
// ============================================================================

/**
 * 统计所有文章的入链数量
 * 通过扫描所有文章的 relatedSlugs 字段
 */
export function calculateInlinkCounts(): Map<string, number> {
  const inlinkCounts = new Map<string, number>();
  const articlesDir = path.join(process.cwd(), 'content', 'articles');

  if (!fs.existsSync(articlesDir)) {
    return inlinkCounts;
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const { data } = matter(content);

      if (Array.isArray(data.relatedSlugs)) {
        data.relatedSlugs.forEach((targetSlug: string) => {
          inlinkCounts.set(targetSlug, (inlinkCounts.get(targetSlug) || 0) + 1);
        });
      }
    } catch (error) {
      // 忽略解析错误
    }
  });

  return inlinkCounts;
}

/**
 * 智能计算相似文章（保证3-5个内链）
 *
 * 特性：
 * 1. 同topicCluster优先（相似度加成）
 * 2. 分层降级策略（0.6 -> 0.5 -> 0.4）
 * 3. 避免链接到过度链接的文章
 * 4. 强制保证3-5个内链
 */
export function calculateSimilarArticlesSmart(
  targetSlug: string,
  allEmbeddings: ArticleEmbedding[],
  options: SmartLinkingOptions = {}
): RelatedArticleExtended[] {
  // 默认配置
  const {
    minLinks = 3,
    maxLinks = 5,
    clusterBoost = 1.15,
    avoidOverlinked = true,
    balanceFactor = 0.2,
    minSimilarityTiers = [0.6, 0.5, 0.4],
  } = options;

  // 1. 找到目标文章
  const targetArticle = allEmbeddings.find((a) => a.slug === targetSlug);
  if (!targetArticle) {
    console.warn(`⚠️  Target article not found: ${targetSlug}`);
    return [];
  }

  // 2. 统计入链数量（用于平衡）
  const inlinkCounts = avoidOverlinked ? calculateInlinkCounts() : new Map();

  // 3. 计算所有文章的相似度（带cluster加成）
  const candidates: RelatedArticleExtended[] = allEmbeddings
    .filter((article) => article.slug !== targetSlug)
    .map((article) => {
      const baseSimilarity = cosineSimilarity(
        targetArticle.embedding,
        article.embedding
      );

      // 同cluster加成
      const sameCluster = article.topicCluster === targetArticle.topicCluster;
      const boostedSimilarity = sameCluster
        ? baseSimilarity * clusterBoost
        : baseSimilarity;

      return {
        slug: article.slug,
        title: article.title,
        topicCluster: article.topicCluster,
        primaryKeyword: article.primaryKeyword,
        similarity: boostedSimilarity,
        sameCluster,
        inlinkCount: inlinkCounts.get(article.slug) || 0,
      };
    });

  // 4. 应用平衡因子（降低过度链接文章的权重）
  if (avoidOverlinked) {
    const maxInlinks = Math.max(...candidates.map((c) => c.inlinkCount || 0), 1);

    candidates.forEach((candidate) => {
      const inlinkRatio = (candidate.inlinkCount || 0) / maxInlinks;
      const penalty = 1 - balanceFactor * inlinkRatio;
      candidate.similarity *= penalty;
    });
  }

  // 5. 按相似度排序
  candidates.sort((a, b) => b.similarity - a.similarity);

  // 6. 分层选择：先尝试高阈值，如果不够则降级
  let selected: RelatedArticleExtended[] = [];

  for (const threshold of minSimilarityTiers) {
    selected = candidates.filter((c) => c.similarity >= threshold);

    if (selected.length >= minLinks) {
      break; // 找到足够的文章
    }
  }

  // 7. 如果还是不够，直接取前N个（保底策略）
  if (selected.length < minLinks) {
    console.warn(
      `⚠️  ${targetSlug}: Only found ${selected.length} similar articles, using top ${minLinks} as fallback`
    );
    selected = candidates.slice(0, minLinks);
  }

  // 8. 限制最多maxLinks个
  selected = selected.slice(0, maxLinks);

  return selected;
}

/**
 * 读取文章的当前 relatedSlugs
 */
export function getArticleRelatedSlugs(slug: string): string[] {
  const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);

  if (!fs.existsSync(articlePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(articlePath, 'utf8');
    const { data } = matter(content);
    return Array.isArray(data.relatedSlugs) ? data.relatedSlugs : [];
  } catch (error) {
    return [];
  }
}

/**
 * 智能更新单篇文章的 frontmatter（保证3-5个内链）
 *
 * 策略：
 * - 如果现有内链数量在3-5之间，保留
 * - 如果<3，补充到3个
 * - 如果>5，裁剪到5个（保留最相关的）
 * - 使用智能算法确保质量
 */
export function updateArticleFrontmatterSmart(
  slug: string,
  allEmbeddings: ArticleEmbedding[],
  options: SmartLinkingOptions = {}
): { updated: boolean; before: number; after: number } {
  const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);

  if (!fs.existsSync(articlePath)) {
    console.warn(`⚠️  Article file not found: ${articlePath}`);
    return { updated: false, before: 0, after: 0 };
  }

  try {
    // 1. 读取当前内容
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    const existingSlugs = Array.isArray(frontmatter.relatedSlugs)
      ? frontmatter.relatedSlugs
      : [];
    const beforeCount = existingSlugs.length;

    // 2. 计算推荐的链接
    const recommended = calculateSimilarArticlesSmart(slug, allEmbeddings, options);

    // 3. 决定最终的 relatedSlugs
    let finalSlugs: string[];

    if (beforeCount >= 3 && beforeCount <= 5) {
      // 已经符合要求，不做修改
      return { updated: false, before: beforeCount, after: beforeCount };
    } else if (beforeCount < 3) {
      // 不足3个：合并推荐的，去重
      const combined = [...existingSlugs, ...recommended.map((r) => r.slug)];
      const unique = Array.from(new Set(combined));
      finalSlugs = unique.slice(0, options.maxLinks || 5);
    } else {
      // 超过5个：按相似度重新排序，取前5个
      const targetArticle = allEmbeddings.find((a) => a.slug === slug);
      if (!targetArticle) {
        return { updated: false, before: beforeCount, after: beforeCount };
      }

      const scored = existingSlugs
        .map((relatedSlug) => {
          const relatedArticle = allEmbeddings.find((a) => a.slug === relatedSlug);
          if (!relatedArticle) return null;

          const similarity = cosineSimilarity(
            targetArticle.embedding,
            relatedArticle.embedding
          );
          return { slug: relatedSlug, similarity };
        })
        .filter((item): item is { slug: string; similarity: number } => item !== null)
        .sort((a, b) => b.similarity - a.similarity);

      finalSlugs = scored.slice(0, options.maxLinks || 5).map((s) => s.slug);
    }

    // 4. 更新 frontmatter
    frontmatter.relatedSlugs = finalSlugs;

    // 5. 写回文件
    const updatedContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(articlePath, updatedContent, 'utf8');

    return { updated: true, before: beforeCount, after: finalSlugs.length };
  } catch (error) {
    console.error(`❌ Failed to update ${slug}:`, error);
    return { updated: false, before: 0, after: 0 };
  }
}

/**
 * 智能双向链接：为老文章添加新文章的链接，但保证不超过5个
 *
 * @param oldSlug 老文章的slug
 * @param newSlug 新文章的slug
 * @param allEmbeddings 所有embeddings（用于计算相似度）
 * @param maxLinks 最大链接数（默认5）
 */
export function addBidirectionalLinkSmart(
  oldSlug: string,
  newSlug: string,
  allEmbeddings: ArticleEmbedding[],
  maxLinks: number = 5
): boolean {
  const articlePath = path.join(process.cwd(), 'content', 'articles', `${oldSlug}.md`);

  if (!fs.existsSync(articlePath)) {
    return false;
  }

  try {
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    let relatedSlugs = Array.isArray(frontmatter.relatedSlugs)
      ? [...frontmatter.relatedSlugs]
      : [];

    // 如果新文章已经在列表中，不重复添加
    if (relatedSlugs.includes(newSlug)) {
      return false;
    }

    // 如果未满5个，直接添加
    if (relatedSlugs.length < maxLinks) {
      relatedSlugs.push(newSlug);
    } else {
      // 已满5个：替换最低相似度的链接
      const oldArticle = allEmbeddings.find((a) => a.slug === oldSlug);
      const newArticle = allEmbeddings.find((a) => a.slug === newSlug);

      if (!oldArticle || !newArticle) {
        return false;
      }

      const newSimilarity = cosineSimilarity(
        oldArticle.embedding,
        newArticle.embedding
      );

      // 计算现有链接的相似度
      const scored = relatedSlugs
        .map((relatedSlug) => {
          const related = allEmbeddings.find((a) => a.slug === relatedSlug);
          if (!related) return { slug: relatedSlug, similarity: 0 };

          return {
            slug: relatedSlug,
            similarity: cosineSimilarity(oldArticle.embedding, related.embedding),
          };
        })
        .sort((a, b) => a.similarity - b.similarity); // 升序，最低的在前

      const lowestSimilarity = scored[0]?.similarity || 0;

      // 如果新文章的相似度更高，替换最低的
      if (newSimilarity > lowestSimilarity) {
        scored[0].slug = newSlug;
        relatedSlugs = scored.map((s) => s.slug);
      } else {
        // 新文章相似度不够高，不替换
        return false;
      }
    }

    // 更新frontmatter
    frontmatter.relatedSlugs = relatedSlugs;

    // 写回文件
    const updatedContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(articlePath, updatedContent, 'utf8');

    return true;
  } catch (error) {
    console.error(`❌ Failed to add bidirectional link for ${oldSlug}:`, error);
    return false;
  }
}
