#!/usr/bin/env node

/**
 * Process articles 81-100 with two-phase audit and optimization
 * Requires: ANTHROPIC_API_KEY environment variable
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const WORKING_DIR = path.join(__dirname, '..');
const ARTICLES_INDEX_FILE = path.join(WORKING_DIR, 'data/articles-index.json');
const CONTENT_DIR = path.join(WORKING_DIR, 'content/articles');
const OUTPUT_FILE = path.join(WORKING_DIR, 'data/llm-two-phase-batch-81-100.json');

const METADATA_AUDIT_SKILL = path.join(WORKING_DIR, '.claude/skills/llm-article-audit-comprehensive.md');
const METADATA_OPTIMIZATION_SKILL = path.join(WORKING_DIR, '.claude/skills/llm-article-optimization-comprehensive.md');
const CONTENT_AUDIT_SKILL = path.join(WORKING_DIR, '.claude/skills/article-content-quality-audit.md');

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
  process.exit(1);
}

// Helper: Call Claude API
function callClaude(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(responseBody);
            resolve(result.content[0].text);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Helper: Parse JSON from Claude response
function parseJsonResponse(responseText) {
  // Try to find JSON block
  let jsonStr = responseText;

  if (responseText.includes('```json')) {
    const start = responseText.indexOf('```json') + 7;
    const end = responseText.indexOf('```', start);
    jsonStr = responseText.substring(start, end).trim();
  } else if (responseText.includes('```')) {
    const start = responseText.indexOf('```') + 3;
    const end = responseText.indexOf('```', start);
    jsonStr = responseText.substring(start, end).trim();
  }

  return JSON.parse(jsonStr);
}

// Phase 1 Metadata: Audit
async function auditMetadata(article, auditSkill) {
  console.log('  - Auditing metadata...');

  const userMessage = `Please audit this article's metadata:

\`\`\`json
${JSON.stringify(article, null, 2)}
\`\`\`

Provide your audit in the specified JSON format.`;

  const response = await callClaude(auditSkill, userMessage);
  return parseJsonResponse(response);
}

// Phase 1 Metadata: Optimize
async function optimizeMetadata(article, auditResults, optimizationSkill) {
  console.log(`  - Optimizing metadata (score was ${auditResults.overall_score})...`);

  const combined = {
    ...article,
    audit_results: auditResults
  };

  const userMessage = `Please optimize this article's metadata:

\`\`\`json
${JSON.stringify(combined, null, 2)}
\`\`\`

Provide your optimization in the specified JSON format.`;

  const response = await callClaude(optimizationSkill, userMessage);
  return parseJsonResponse(response);
}

// Phase 1 Content: Audit
async function auditContent(slug, contentAuditSkill) {
  console.log('  - Auditing content quality...');

  const contentFile = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(contentFile)) {
    return {
      slug,
      content_quality_score: 0,
      needs_content_optimization: true,
      error: 'Content file not found'
    };
  }

  const content = fs.readFileSync(contentFile, 'utf8');

  const userMessage = `Please audit this article's content quality:

Article slug: ${slug}

\`\`\`markdown
${content}
\`\`\`

Provide your audit in the specified JSON format.`;

  const response = await callClaude(contentAuditSkill, userMessage);
  return parseJsonResponse(response);
}

// Process single article
async function processArticle(article, auditSkill, optimizationSkill, contentAuditSkill) {
  const slug = article.slug;
  console.log(`\nProcessing: ${slug}`);

  const result = {
    slug,
    phase1_metadata: {},
    phase1_content_audit: {},
    needs_phase2: false
  };

  try {
    // Phase 1 Metadata: Audit
    const auditResults = await auditMetadata(article, auditSkill);
    result.phase1_metadata.audit_results = auditResults;

    const metadataScore = auditResults.overall_score || 0;

    // Phase 1 Metadata: Optimize if needed
    if (metadataScore < 85) {
      const optimizationResults = await optimizeMetadata(article, auditResults, optimizationSkill);
      result.phase1_metadata.optimization_results = optimizationResults;

      const optimizedScore = optimizationResults.quality_scores?.overall || 0;
      console.log(`  - Metadata optimized: ${metadataScore} -> ${optimizedScore}`);
    } else {
      console.log(`  - Metadata score ${metadataScore} >= 85, no optimization needed`);
      result.phase1_metadata.optimization_results = null;
    }

    // Phase 1 Content: Audit
    const contentAuditResults = await auditContent(slug, contentAuditSkill);
    result.phase1_content_audit = contentAuditResults;

    const contentScore = contentAuditResults.content_quality_score || 0;
    console.log(`  - Content quality score: ${contentScore}`);

    // Determine if Phase 2 needed
    if (contentScore < 85) {
      result.needs_phase2 = true;
      console.log('  ✓ Flagged for Phase 2 content optimization');
    } else {
      console.log('  ✓ Content quality sufficient, no Phase 2 needed');
    }
  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
    result.error = error.message;
  }

  return result;
}

// Main function
async function main() {
  console.log('=== Processing Articles 81-100 (Two-Phase Audit & Optimization) ===\n');

  // Load articles
  console.log('Loading articles index...');
  const articles = JSON.parse(fs.readFileSync(ARTICLES_INDEX_FILE, 'utf8'));

  // Extract batch 81-100 (indices 80-99)
  const batchArticles = articles.slice(80, 100);
  console.log(`Processing ${batchArticles.length} articles (indices 80-99)\n`);

  // Load skill prompts
  console.log('Loading skill prompts...');
  const auditSkill = fs.readFileSync(METADATA_AUDIT_SKILL, 'utf8');
  const optimizationSkill = fs.readFileSync(METADATA_OPTIMIZATION_SKILL, 'utf8');
  const contentAuditSkill = fs.readFileSync(CONTENT_AUDIT_SKILL, 'utf8');

  // Process each article
  const results = [];
  const stats = {
    total_processed: 0,
    metadata_optimized: 0,
    metadata_optimization_failed: 0,
    content_needs_phase2: 0,
    errors: 0
  };

  for (const article of batchArticles) {
    const result = await processArticle(article, auditSkill, optimizationSkill, contentAuditSkill);
    results.push(result);

    // Update stats
    stats.total_processed++;

    if (result.error) {
      stats.errors++;
    } else {
      // Check if metadata was optimized
      if (result.phase1_metadata.optimization_results) {
        const optimizedScore = result.phase1_metadata.optimization_results.quality_scores?.overall || 0;
        if (optimizedScore >= 85) {
          stats.metadata_optimized++;
        } else {
          stats.metadata_optimization_failed++;
        }
      }

      // Check if content needs Phase 2
      if (result.needs_phase2) {
        stats.content_needs_phase2++;
      }
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Compile final output
  const output = {
    batch_info: {
      batch_name: 'batch-81-100',
      article_indices: '80-99',
      article_count: batchArticles.length,
      processed_count: stats.total_processed
    },
    summary: {
      total_processed: stats.total_processed,
      metadata_optimized: stats.metadata_optimized,
      metadata_optimization_failed: stats.metadata_optimization_failed,
      content_needs_phase2: stats.content_needs_phase2,
      errors: stats.errors,
      articles_needing_phase2: results
        .filter(r => r.needs_phase2)
        .map(r => r.slug)
    },
    results
  };

  // Save results
  console.log(`\nSaving results to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total processed: ${stats.total_processed}`);
  console.log(`Metadata optimized: ${stats.metadata_optimized}`);
  console.log(`Metadata optimization failed: ${stats.metadata_optimization_failed}`);
  console.log(`Content needs Phase 2: ${stats.content_needs_phase2}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nArticles needing Phase 2 content optimization: ${stats.content_needs_phase2}`);

  if (stats.content_needs_phase2 > 0) {
    console.log('\nArticles flagged for Phase 2:');
    output.summary.articles_needing_phase2.forEach(slug => {
      console.log(`  - ${slug}`);
    });
  }

  console.log(`\n✓ Results saved to: ${OUTPUT_FILE}`);
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
