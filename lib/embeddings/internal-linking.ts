/**
 * Internal Linking 工具函数
 * 用于生成和管理文章之间的相关链接（relatedSlugs）
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
