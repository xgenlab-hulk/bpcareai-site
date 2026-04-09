import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { generateEmbeddingsBatch } from '../lib/embeddings/qwen';

interface ContentEmbedding {
  slug: string;
  embedding: number[];
}

const BATCH_SIZE = 10; // Qwen 批量 API 最多 10 条
const SAVE_EVERY = 50; // 每 50 篇保存一次进度

async function main() {
  const dir = path.join(process.cwd(), 'content/articles');
  const outputPath = path.join(process.cwd(), 'data/seo/content-embeddings-full.json');
  const samplePath = path.join(process.cwd(), 'data/seo/content-embeddings-sample.json');

  const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  // 加载已有结果
  let results: ContentEmbedding[] = [];
  if (fs.existsSync(outputPath)) {
    results = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } else if (fs.existsSync(samplePath)) {
    results = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
  }

  const doneSlugs = new Set(results.map(r => r.slug));
  const remaining = allFiles.filter(f => !doneSlugs.has(f.replace('.md', '')));

  console.log(`全量正文 embedding 生成（批量模式, batch=${BATCH_SIZE}）`);
  console.log(`总文章: ${allFiles.length} | 已完成: ${doneSlugs.size} | 待处理: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('全部已完成！');
    return;
  }

  const startTime = Date.now();
  let errors = 0;
  let processed = 0;
  let sinceLastSave = 0;

  // 分批处理
  for (let batchStart = 0; batchStart < remaining.length; batchStart += BATCH_SIZE) {
    const batchFiles = remaining.slice(batchStart, batchStart + BATCH_SIZE);
    const batchSlugs: string[] = [];
    const batchTexts: string[] = [];

    // 准备批次数据
    for (const file of batchFiles) {
      const slug = file.replace('.md', '');
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const { content: body } = matter(content);
        const words = body.split(/\s+/).slice(0, 500).join(' ');
        if (words.trim().length > 0) {
          batchSlugs.push(slug);
          batchTexts.push(words);
        }
      } catch {
        errors++;
      }
    }

    if (batchTexts.length === 0) continue;

    // 批量调用 API
    try {
      const embeddings = await generateEmbeddingsBatch(batchTexts);

      for (let i = 0; i < batchSlugs.length; i++) {
        results.push({ slug: batchSlugs[i], embedding: embeddings[i] });
        processed++;
        sinceLastSave++;
      }
    } catch (err: any) {
      errors += batchTexts.length;
      if (errors <= 10) {
        console.warn(`  ❌ batch error: ${err.message.substring(0, 80)}`);
      }
      if (errors > 50) {
        console.error('太多错误，保存进度并中止');
        fs.writeFileSync(outputPath, JSON.stringify(results));
        break;
      }
      // 批量失败时等久一点再重试
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }

    // 定期保存 + 日志
    if (sinceLastSave >= SAVE_EVERY) {
      fs.writeFileSync(outputPath, JSON.stringify(results));
      sinceLastSave = 0;

      const elapsed = (Date.now() - startTime) / 1000;
      const rate = processed / elapsed;
      const eta = (remaining.length - processed) / rate;
      console.log(`  ${processed}/${remaining.length} (${(elapsed / 60).toFixed(1)}min, ${rate.toFixed(1)}/s, ETA ${(eta / 60).toFixed(1)}min)`);
    }

    // API 间隔
    await new Promise(r => setTimeout(r, 300));
  }

  // 最终保存
  fs.writeFileSync(outputPath, JSON.stringify(results));

  const totalTime = (Date.now() - startTime) / 1000;
  console.log(`\n完成! 总: ${results.length} | 新增: ${processed} | 失败: ${errors} | 耗时: ${(totalTime / 60).toFixed(1)}min`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
