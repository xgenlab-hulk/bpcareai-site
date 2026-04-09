/**
 * 正文内容级别查重
 * 基于文章正文前500字的embedding进行语义相似度检测
 *
 * 三层判定:
 * - sim >= 0.90: 高度重复，直接丢弃
 * - sim 0.82-0.89: 灰色区间，调LLM精细判断
 * - sim < 0.82: 通过
 */

import fs from 'fs';
import path from 'path';
import { generateEmbeddingForText } from './qwen';
import { cosineSimilarity } from './similarity';
import { openai } from '../llm/client';
import { withRetry } from '../utils/retry';

export interface ContentEmbedding {
  slug: string;
  embedding: number[];
}

export interface ContentDedupResult {
  passed: boolean;
  maxSimilarity: number;
  mostSimilarSlug: string;
  verdict: 'PASS' | 'HIGH_DUPLICATE' | 'LLM_DUPLICATE' | 'LLM_KEEP';
  reason: string;
  embedding: number[];  // 返回生成的embedding供后续保存
}

const CONTENT_EMBEDDINGS_PATH = path.join(process.cwd(), 'data', 'seo', 'content-embeddings-full.json');

// 阈值
const HIGH_DUPLICATE_THRESHOLD = 0.90;  // >= 0.90 直接丢弃
const GRAY_ZONE_THRESHOLD = 0.82;       // 0.82-0.89 需要LLM判断

/**
 * 加载正文embedding向量表
 */
export function loadContentEmbeddings(): ContentEmbedding[] {
  if (!fs.existsSync(CONTENT_EMBEDDINGS_PATH)) return [];

  try {
    return JSON.parse(fs.readFileSync(CONTENT_EMBEDDINGS_PATH, 'utf8'));
  } catch {
    return [];
  }
}

/**
 * 保存正文embedding向量表
 */
export function saveContentEmbeddings(embeddings: ContentEmbedding[]): void {
  fs.writeFileSync(CONTENT_EMBEDDINGS_PATH, JSON.stringify(embeddings));
}

/**
 * 追加一篇文章的正文embedding到向量表
 */
export function appendContentEmbedding(slug: string, embedding: number[]): void {
  const embeddings = loadContentEmbeddings();
  // 避免重复
  const exists = embeddings.some(e => e.slug === slug);
  if (!exists) {
    embeddings.push({ slug, embedding });
    saveContentEmbeddings(embeddings);
  }
}

/**
 * 对文章正文进行内容级查重
 *
 * @param bodyText 文章正文（完整markdown正文）
 * @param slug 文章slug（用于排除自身）
 * @param existingEmbeddings 已有的正文embedding列表（传入避免重复加载）
 */
export async function checkContentDuplicate(
  bodyText: string,
  slug: string,
  existingEmbeddings: ContentEmbedding[],
): Promise<ContentDedupResult> {
  // 取正文前500字生成embedding
  const words = bodyText.split(/\s+/).slice(0, 500).join(' ');
  const embedding = await generateEmbeddingForText(words);

  // 计算与所有已有文章的相似度
  let maxSimilarity = 0;
  let mostSimilarSlug = '';

  for (const article of existingEmbeddings) {
    if (article.slug === slug) continue; // 排除自身
    const sim = cosineSimilarity(embedding, article.embedding);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      mostSimilarSlug = article.slug;
    }
  }

  // Layer 1: 高度重复，直接丢弃
  if (maxSimilarity >= HIGH_DUPLICATE_THRESHOLD) {
    return {
      passed: false,
      maxSimilarity,
      mostSimilarSlug,
      verdict: 'HIGH_DUPLICATE',
      reason: `Content similarity ${maxSimilarity.toFixed(3)} >= ${HIGH_DUPLICATE_THRESHOLD} (auto-reject)`,
      embedding,
    };
  }

  // Layer 2: 灰色区间，调LLM判断
  if (maxSimilarity >= GRAY_ZONE_THRESHOLD) {
    const llmVerdict = await llmJudgeSimilarity(bodyText, mostSimilarSlug, maxSimilarity);

    if (llmVerdict === 'KEEP') {
      return {
        passed: true,
        maxSimilarity,
        mostSimilarSlug,
        verdict: 'LLM_KEEP',
        reason: `Content similarity ${maxSimilarity.toFixed(3)} in gray zone, LLM judged KEEP`,
        embedding,
      };
    } else {
      return {
        passed: false,
        maxSimilarity,
        mostSimilarSlug,
        verdict: 'LLM_DUPLICATE',
        reason: `Content similarity ${maxSimilarity.toFixed(3)} in gray zone, LLM judged ${llmVerdict}`,
        embedding,
      };
    }
  }

  // Layer 3: 通过
  return {
    passed: true,
    maxSimilarity,
    mostSimilarSlug,
    verdict: 'PASS',
    reason: `Content similarity ${maxSimilarity.toFixed(3)} < ${GRAY_ZONE_THRESHOLD}`,
    embedding,
  };
}

/**
 * 调用LLM判断灰色区间的两篇文章是否真正重复
 */
async function llmJudgeSimilarity(
  newBodyText: string,
  existingSlug: string,
  similarity: number,
): Promise<'KEEP' | 'DUPLICATE' | 'CANNIBALIZE'> {
  // 读取已有文章的正文摘要
  const existingPath = path.join(process.cwd(), 'content', 'articles', `${existingSlug}.md`);
  let existingPreview = '';
  if (fs.existsSync(existingPath)) {
    const content = fs.readFileSync(existingPath, 'utf8');
    // 跳过frontmatter
    const fmEnd = content.indexOf('---', 4);
    const body = fmEnd > 0 ? content.substring(fmEnd + 3) : content;
    existingPreview = body.split(/\s+/).slice(0, 300).join(' ');
  }

  const newPreview = newBodyText.split(/\s+/).slice(0, 300).join(' ');

  try {
    const completion = await withRetry(
      () => openai.chat.completions.create({
        model: 'qwen-plus-latest',
        messages: [
          {
            role: 'system',
            content: `You are an SEO expert. Two articles have ${(similarity * 100).toFixed(0)}% content similarity. Determine if they are genuinely different or redundant. Output one word only: KEEP, DUPLICATE, or CANNIBALIZE.

KEEP = Different angles, audiences, or depth levels. Both valuable.
DUPLICATE = Same topic, same angle. One is redundant.
CANNIBALIZE = Same topic, competing for same keywords. Harmful to SEO.`,
          },
          {
            role: 'user',
            content: `Article A (NEW):
${newPreview}

Article B (EXISTING - ${existingSlug}):
${existingPreview}

Verdict (one word):`,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      }),
      { maxRetries: 1 }
    );

    const response = (completion.choices[0]?.message?.content || '').trim().toUpperCase();

    if (response.includes('KEEP')) return 'KEEP';
    if (response.includes('DUPLICATE')) return 'DUPLICATE';
    if (response.includes('CANNIBALIZE')) return 'CANNIBALIZE';

    // 默认保守处理：判为蚕食
    return 'CANNIBALIZE';
  } catch {
    // LLM调用失败时，保守处理：判为蚕食
    return 'CANNIBALIZE';
  }
}
