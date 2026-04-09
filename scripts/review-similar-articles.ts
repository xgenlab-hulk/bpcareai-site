/**
 * 用 LLM 精细判断相似文章对
 * 输入: data/seo/pairs-for-llm-review.json
 * 输出: data/seo/similarity-review-results.json
 *
 * 对每对文章，读取正文摘要，调用 Qwen 判断：
 * - DUPLICATE: 真正重复，建议删除其中一篇
 * - CANNIBALIZE: 内容蚕食，建议合并
 * - KEEP: 虽然相似但角度不同，保留
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { openai } from '../lib/llm/client';
import { withRetry } from '../lib/utils/retry';

interface ReviewPair {
  similarity: number;
  slug1: string;
  slug2: string;
  title1: string;
  title2: string;
  pk1: string;
  pk2: string;
  cluster1: string;
  cluster2: string;
}

interface ReviewResult extends ReviewPair {
  verdict: 'DUPLICATE' | 'CANNIBALIZE' | 'KEEP' | 'ERROR';
  reason: string;
  action: string; // 具体建议
}

const BATCH_SIZE = 5;
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

function getArticleSummary(slug: string): string {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return '[FILE NOT FOUND]';

  const content = fs.readFileSync(filePath, 'utf8');
  const { content: body } = matter(content);

  // 取前300字作为摘要
  return body.split(/\s+/).slice(0, 300).join(' ');
}

async function reviewBatch(pairs: ReviewPair[]): Promise<ReviewResult[]> {
  const pairDescriptions = pairs.map((p, i) => {
    const sum1 = getArticleSummary(p.slug1);
    const sum2 = getArticleSummary(p.slug2);

    return `--- Pair ${i + 1} (similarity: ${p.similarity}) ---
Article A: "${p.title1}"
PK: ${p.pk1}
Cluster: ${p.cluster1}
Content preview: ${sum1.substring(0, 400)}

Article B: "${p.title2}"
PK: ${p.pk2}
Cluster: ${p.cluster2}
Content preview: ${sum2.substring(0, 400)}`;
  }).join('\n\n');

  const completion = await withRetry(
    () => openai.chat.completions.create({
      model: 'qwen-plus-latest',
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert reviewing pairs of similar articles for content cannibalization.

For each pair, determine:
- DUPLICATE: Articles cover the same topic with the same angle. One should be deleted.
- CANNIBALIZE: Articles cover similar topics but could compete for the same keywords. Should be merged into one comprehensive article.
- KEEP: Articles are similar but have genuinely different angles, audiences, or depth levels. Both should be kept.

Output valid JSON array only.`,
        },
        {
          role: 'user',
          content: `Review these ${pairs.length} article pairs and determine if they are duplicates, cannibalizing each other, or legitimately different.

${pairDescriptions}

Output a JSON array with ${pairs.length} items:
[
  {
    "pair": 1,
    "verdict": "DUPLICATE|CANNIBALIZE|KEEP",
    "reason": "Brief explanation",
    "action": "Specific recommendation (e.g., 'Delete B, keep A' or 'Merge into A' or 'Keep both')"
  }
]`,
        },
      ],
      temperature: 0.2,
    }),
    { maxRetries: 2 }
  );

  const content = completion.choices[0]?.message?.content || '';

  try {
    const match = content.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : content);

    return pairs.map((p, i) => {
      const review = parsed[i] || {};
      return {
        ...p,
        verdict: review.verdict || 'ERROR',
        reason: review.reason || 'Parse error',
        action: review.action || '',
      };
    });
  } catch {
    return pairs.map(p => ({
      ...p,
      verdict: 'ERROR' as const,
      reason: 'Failed to parse LLM response',
      action: '',
    }));
  }
}

async function main() {
  const pairsPath = path.join(process.cwd(), 'data/seo/pairs-for-llm-review.json');
  const outputPath = path.join(process.cwd(), 'data/seo/similarity-review-results.json');

  const pairs: ReviewPair[] = JSON.parse(fs.readFileSync(pairsPath, 'utf8'));
  console.log(`开始 LLM 审查 ${pairs.length} 对相似文章 (每批 ${BATCH_SIZE} 对)\n`);

  const results: ReviewResult[] = [];
  let batchNum = 0;

  for (let i = 0; i < pairs.length; i += BATCH_SIZE) {
    batchNum++;
    const batch = pairs.slice(i, i + BATCH_SIZE);

    try {
      const batchResults = await reviewBatch(batch);
      results.push(...batchResults);

      const verdicts = batchResults.map(r => r.verdict);
      console.log(`  Batch ${batchNum}: ${verdicts.join(', ')}`);
    } catch (err: any) {
      console.warn(`  Batch ${batchNum} failed: ${err.message.substring(0, 60)}`);
      // 标记为 ERROR
      results.push(...batch.map(p => ({
        ...p,
        verdict: 'ERROR' as const,
        reason: err.message.substring(0, 100),
        action: '',
      })));
    }

    // 每 10 批保存一次进度
    if (batchNum % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      const dup = results.filter(r => r.verdict === 'DUPLICATE').length;
      const can = results.filter(r => r.verdict === 'CANNIBALIZE').length;
      const keep = results.filter(r => r.verdict === 'KEEP').length;
      console.log(`  --- Progress: ${results.length}/${pairs.length} | DUP=${dup} CAN=${can} KEEP=${keep} ---`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  // 最终保存
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // 统计
  const dup = results.filter(r => r.verdict === 'DUPLICATE').length;
  const can = results.filter(r => r.verdict === 'CANNIBALIZE').length;
  const keep = results.filter(r => r.verdict === 'KEEP').length;
  const err = results.filter(r => r.verdict === 'ERROR').length;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`LLM 审查完成`);
  console.log(`${'='.repeat(50)}`);
  console.log(`DUPLICATE (删除):    ${dup} 对`);
  console.log(`CANNIBALIZE (合并):  ${can} 对`);
  console.log(`KEEP (保留):         ${keep} 对`);
  console.log(`ERROR:               ${err} 对`);
  console.log(`\n涉及需处理的文章:`);

  // 统计需要处理的文章
  const toDelete = new Set<string>();
  const toMerge = new Set<string>();
  results.forEach(r => {
    if (r.verdict === 'DUPLICATE') {
      toDelete.add(r.slug1);
      toDelete.add(r.slug2);
    }
    if (r.verdict === 'CANNIBALIZE') {
      toMerge.add(r.slug1);
      toMerge.add(r.slug2);
    }
  });

  console.log(`  需删除相关: ${toDelete.size} 篇`);
  console.log(`  需合并相关: ${toMerge.size} 篇`);
  console.log(`\n结果保存到: ${outputPath}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
