#!/usr/bin/env node
/**
 * Two-Phase Article Optimization - Batch 21-40
 * Uses Node.js subprocess to call Claude Code for each article
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load data
const articlesIndex = JSON.parse(fs.readFileSync('data/articles-index.json', 'utf8'));
const batchArticles = articlesIndex.slice(20, 40); // Articles 21-40

console.log('='.repeat(80));
console.log('TWO-PHASE ARTICLE OPTIMIZATION - Batch 21-40');
console.log('='.repeat(80));
console.log(`\nProcessing ${batchArticles.length} articles...\n`);

const results = {
  batch_info: {
    range: '21-40',
    total_articles: 20,
    processing_date: new Date().toISOString().split('T')[0]
  },
  phase1_metadata: {
    audit_results: [],
    optimization_results: []
  },
  phase1_content_audit: {
    content_audit_results: []
  },
  summary: {
    articles_needing_phase2: []
  }
};

// Process each article
let processed = 0;
for (let i = 0; i < batchArticles.length; i++) {
  const article = batchArticles[i];
  const articleNum = 21 + i;

  console.log(`\n[${ articleNum}/${40}] Processing: ${article.slug.substring(0, 60)}...`);

  try {
    // Phase 1a: Metadata Audit
    console.log('  → Metadata audit...');
    const auditPrompt = `Using the skill file .claude/skills/llm-article-audit-comprehensive.md, audit this article metadata:

${JSON.stringify({
  slug: article.slug,
  title: article.title,
  description: article.description,
  primaryKeyword: article.primaryKeyword,
  topicCluster: article.topicCluster
}, null, 2)}

Return ONLY valid JSON in the exact format specified by the skill.`;

    // Write prompt to temp file
    const auditTempFile = `/tmp/audit-prompt-${articleNum}.txt`;
    fs.writeFileSync(auditTempFile, auditPrompt);

    // Call claude
    const auditResult = execSync(`claude -f ${auditTempFile}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });

    // Parse JSON from response
    const auditJson = JSON.parse(auditResult.match(/\{[\s\S]*\}/)[0]);
    results.phase1_metadata.audit_results.push(auditJson);

    console.log(`  ✓ Score: ${auditJson.overall_score}/100`);

    // Phase 1b: Metadata Optimization (if needed)
    if (auditJson.overall_score < 85) {
      console.log('  → Metadata optimization...');

      const optPrompt = `Using the skill file .claude/skills/llm-article-optimization-comprehensive.md, optimize this article:

Article data:
${JSON.stringify(article, null, 2)}

Audit results:
${JSON.stringify(auditJson, null, 2)}

Return ONLY valid JSON in the exact format specified by the skill.`;

      const optTempFile = `/tmp/opt-prompt-${articleNum}.txt`;
      fs.writeFileSync(optTempFile, optPrompt);

      const optResult = execSync(`claude -f ${optTempFile}`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });

      const optJson = JSON.parse(optResult.match(/\{[\s\S]*\}/)[0]);
      results.phase1_metadata.optimization_results.push(optJson);

      console.log(`  ✓ Optimized score: ${optJson.quality_scores?.overall || 'N/A'}/100`);
    } else {
      console.log('  ✓ No optimization needed');
    }

    // Phase 1c: Content Audit
    console.log('  → Content audit...');
    const contentPath = `content/articles/${article.slug}.md`;

    if (fs.existsSync(contentPath)) {
      const content = fs.readFileSync(contentPath, 'utf8');
      const contentPrompt = `Using the skill file .claude/skills/article-content-quality-audit.md, audit this article content:

Slug: ${article.slug}

Content:
${content.substring(0, 30000)}

Return ONLY valid JSON in the exact format specified by the skill.`;

      const contentTempFile = `/tmp/content-prompt-${articleNum}.txt`;
      fs.writeFileSync(contentTempFile, contentPrompt);

      const contentResult = execSync(`claude -f ${contentTempFile}`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });

      const contentJson = JSON.parse(contentResult.match(/\{[\s\S]*\}/)[0]);
      results.phase1_content_audit.content_audit_results.push(contentJson);

      if (contentJson.content_quality_score < 85) {
        results.summary.articles_needing_phase2.push(article.slug);
        console.log(`  ✓ Content score: ${contentJson.content_quality_score}/100 - Needs Phase 2`);
      } else {
        console.log(`  ✓ Content score: ${contentJson.content_quality_score}/100 - Excellent`);
      }
    } else {
      console.log('  ⚠ Content file not found');
    }

    processed++;

  } catch (error) {
    console.error(`  ✗ ERROR: ${error.message}`);
  }
}

// Calculate statistics
if (results.phase1_metadata.audit_results.length > 0) {
  const avgOriginal = results.phase1_metadata.audit_results.reduce((sum, a) => sum + a.overall_score, 0) / results.phase1_metadata.audit_results.length;
  results.summary.metadata_avg_original_score = Math.round(avgOriginal * 10) / 10;
}

if (results.phase1_metadata.optimization_results.length > 0) {
  const avgOptimized = results.phase1_metadata.optimization_results.reduce((sum, o) => sum + (o.quality_scores?.overall || 0), 0) / results.phase1_metadata.optimization_results.length;
  results.summary.metadata_avg_optimized_score = Math.round(avgOptimized * 10) / 10;
}

if (results.phase1_content_audit.content_audit_results.length > 0) {
  const avgContent = results.phase1_content_audit.content_audit_results.reduce((sum, c) => sum + c.content_quality_score, 0) / results.phase1_content_audit.content_audit_results.length;
  results.summary.content_avg_score = Math.round(avgContent * 10) / 10;
}

// Save results
const outputPath = 'data/llm-two-phase-batch-21-40-processed.json';
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log('\n' + '='.repeat(80));
console.log('PROCESSING COMPLETE');
console.log('='.repeat(80));
console.log(`\nArticles processed: ${processed}/${batchArticles.length}`);
console.log(`Metadata avg original: ${results.summary.metadata_avg_original_score || 'N/A'}`);
console.log(`Metadata avg optimized: ${results.summary.metadata_avg_optimized_score || 'N/A'}`);
console.log(`Content avg: ${results.summary.content_avg_score || 'N/A'}`);
console.log(`Articles needing Phase 2: ${results.summary.articles_needing_phase2.length}`);
console.log(`\nResults saved to: ${outputPath}`);
