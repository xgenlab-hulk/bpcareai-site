/**
 * 已有文章metadata自动优化（线B）
 *
 * 读取 data/seo/analysis/article-optimizations-pending.json
 * 对每篇建议优化的文章：
 * 1. 读取当前文件
 * 2. 验证建议的metadata格式
 * 3. 修改 title / description / primaryKeyword
 * 4. 使用 >- 安全YAML格式写回
 * 5. 标记为已执行
 *
 * 使用方式：npm run seo:optimize-articles
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadAnalysis, saveAnalysis } from '../lib/seo/data-store';

interface PendingOptimization {
  slug: string;
  currentTitle: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedPK: string;
  reason: string;
}

/**
 * 清理文本：去掉换行、制表、多空格
 */
function sanitize(text: string): string {
  return text.replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * 验证metadata长度
 */
function validateMetadata(opt: PendingOptimization): { valid: boolean; reason?: string } {
  const title = sanitize(opt.suggestedTitle);
  const desc = sanitize(opt.suggestedDescription);
  const pk = sanitize(opt.suggestedPK);

  if (title.length < 20 || title.length > 75) return { valid: false, reason: `title ${title.length} chars (need 20-75)` };
  if (desc.length < 80 || desc.length > 165) return { valid: false, reason: `desc ${desc.length} chars (need 80-165)` };
  if (pk.length < 10 || pk.length > 65) return { valid: false, reason: `pk ${pk.length} chars (need 10-65)` };

  return { valid: true };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Apply Article Metadata Optimizations (Line B)           ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // 1. 读取待执行的优化建议
  const pending = loadAnalysis('article-optimizations-pending.json');
  if (!pending || !pending.optimizations || pending.optimizations.length === 0) {
    console.log('No pending optimizations found.\n');
    return;
  }

  console.log(`📋 ${pending.optimizations.length} pending optimizations (generated ${pending.generatedAt})\n`);

  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  let applied = 0;
  let skipped = 0;
  const results: any[] = [];

  for (const opt of pending.optimizations as PendingOptimization[]) {
    console.log(`─── ${opt.slug} ───`);

    // 2. 找到文章文件
    const filePath = path.join(articlesDir, `${opt.slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  File not found, skipping`);
      skipped++;
      results.push({ slug: opt.slug, status: 'file_not_found' });
      continue;
    }

    // 3. 验证建议的metadata格式
    const validation = validateMetadata(opt);
    if (!validation.valid) {
      console.log(`   ⚠️  Invalid metadata: ${validation.reason}, skipping`);
      skipped++;
      results.push({ slug: opt.slug, status: 'invalid_metadata', reason: validation.reason });
      continue;
    }

    // 4. 读取当前文件
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(fileContent);

    const oldTitle = parsed.data.title || '';
    const oldDesc = parsed.data.description || '';
    const oldPK = parsed.data.primaryKeyword || '';

    // 5. 更新metadata
    parsed.data.title = sanitize(opt.suggestedTitle);
    parsed.data.description = sanitize(opt.suggestedDescription);
    parsed.data.primaryKeyword = sanitize(opt.suggestedPK);
    parsed.data.updated = new Date().toISOString().split('T')[0];

    // 6. 使用 >- 安全格式写回
    const lines = [
      `title: >-`,
      `  ${parsed.data.title}`,
      `slug: ${parsed.data.slug}`,
      `description: >-`,
      `  ${parsed.data.description}`,
      `date: '${parsed.data.date}'`,
      `updated: '${parsed.data.updated}'`,
      `primaryKeyword: >-`,
      `  ${parsed.data.primaryKeyword}`,
      `topicCluster: ${parsed.data.topicCluster}`,
      `image: '${parsed.data.image || ''}'`,
    ];

    // relatedSlugs
    const relatedSlugs = parsed.data.relatedSlugs || [];
    if (Array.isArray(relatedSlugs) && relatedSlugs.length > 0) {
      lines.push(`relatedSlugs:`);
      for (const s of relatedSlugs) {
        lines.push(`  - >-`);
        lines.push(`    ${s}`);
      }
    } else {
      lines.push(`relatedSlugs: []`);
    }

    const yaml = `---\n${lines.join('\n')}\n---`;
    const newContent = `${yaml}\n\n${parsed.content.trim()}\n`;

    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`   Old title: "${oldTitle.substring(0, 50)}..."`);
    console.log(`   New title: "${parsed.data.title.substring(0, 50)}..."`);
    console.log(`   Reason: ${opt.reason.substring(0, 80)}`);
    console.log(`   ✅ Applied\n`);

    applied++;
    results.push({
      slug: opt.slug,
      status: 'applied',
      oldTitle, newTitle: parsed.data.title,
      oldPK, newPK: parsed.data.primaryKeyword,
    });
  }

  // 7. 保存执行结果 + 清空pending
  console.log(`\n═══ Summary ═══`);
  console.log(`Applied: ${applied}`);
  console.log(`Skipped: ${skipped}\n`);

  // 保存执行历史
  saveAnalysis(`article-optimizations-applied-${new Date().toISOString().split('T')[0]}.json`, {
    executedAt: new Date().toISOString(),
    results,
  });

  // 清空pending（已执行完毕）
  saveAnalysis('article-optimizations-pending.json', {
    generatedAt: pending.generatedAt,
    executedAt: new Date().toISOString(),
    optimizations: [], // 清空
  });

  console.log('Pending list cleared. History saved.\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
