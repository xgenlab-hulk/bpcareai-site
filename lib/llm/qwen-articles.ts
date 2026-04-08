/**
 * 基于 Qwen Plus 的文章自动生成工具
 * v2.0 — GEO优先 + SEO优化 + E-E-A-T信号
 */

import fs from 'fs';
import path from 'path';
import { openai } from './client';
import { slugify } from '../utils/slugify';
import { withRetry } from '../utils/retry';

/**
 * 计划中的选题（来自 planned-topics JSON）
 */
export interface PlannedTopic {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  coreKeyword: string;
  createdAt: string;
  perplexityQuestions?: string[];
  competitorCoverage?: string;
}

/**
 * 文章 Frontmatter
 */
export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated: string;
  primaryKeyword: string;
  topicCluster: string;
  image: string;
  relatedSlugs: string[];
}

/**
 * 文章生成结果
 */
export interface GeneratedArticle {
  slug: string;
  frontmatter: ArticleFrontmatter;
  body: string;
}

/**
 * 优化后的 Metadata
 */
interface OptimizedMetadata {
  title: string;
  slug: string;
  description: string;
  primaryKeyword: string;
}

/**
 * 生成唯一的 slug，避免与已有文件冲突
 */
function generateUniqueSlug(baseSlug: string): string {
  const articlesDir = path.join(process.cwd(), 'content', 'articles');

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  let slug = baseSlug;
  let counter = 2;

  while (fs.existsSync(path.join(articlesDir, `${slug}.md`))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * 生成当前日期（YYYY-MM-DD 格式）
 */
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 随机选择语气（词数固定为1200-1800）
 */
function selectRandomStyle(): { wordCount: string; tone: string } {
  const tones = ['educational and authoritative', 'conversational and warm', 'reassuring and practical'];
  const tone = tones[Math.floor(Math.random() * tones.length)];

  return { wordCount: '1200-1800', tone };
}

/**
 * 格式验证结果
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 严格验证所有 metadata 字段格式
 * 任何不合格都会被修正或报错，确保不会因格式问题导致部署中断
 */
function validateAndFixMetadata(metadata: OptimizedMetadata): { fixed: OptimizedMetadata; validation: ValidationResult } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fixed = { ...metadata };

  // === PrimaryKeyword 验证 ===
  if (!fixed.primaryKeyword || fixed.primaryKeyword.trim().length === 0) {
    errors.push('PK is empty');
  } else {
    fixed.primaryKeyword = fixed.primaryKeyword.trim();
    if (fixed.primaryKeyword.length < 15) {
      warnings.push(`PK too short (${fixed.primaryKeyword.length} chars, min 15)`);
    }
    if (fixed.primaryKeyword.length > 60) {
      // 在词边界截断
      const words = fixed.primaryKeyword.split(' ');
      let result = '';
      for (const word of words) {
        if ((result + ' ' + word).trim().length > 60) break;
        result = (result + ' ' + word).trim();
      }
      fixed.primaryKeyword = result;
      warnings.push(`PK truncated to ${fixed.primaryKeyword.length} chars`);
    }
  }

  // === Title 验证 ===
  if (!fixed.title || fixed.title.trim().length === 0) {
    errors.push('Title is empty');
  } else {
    fixed.title = fixed.title.trim();
    // 移除 YAML 危险字符
    fixed.title = fixed.title.replace(/[\t\r]/g, ' ');
    if (fixed.title.length > 70) {
      const truncated = fixed.title.substring(0, 70);
      const lastSpace = truncated.lastIndexOf(' ');
      fixed.title = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated;
      warnings.push(`Title truncated to ${fixed.title.length} chars`);
    }
    if (fixed.title.length < 30) {
      warnings.push(`Title short (${fixed.title.length} chars, recommend 40-70)`);
    }
  }

  // === Description 验证 ===
  if (!fixed.description || fixed.description.trim().length === 0) {
    errors.push('Description is empty');
  } else {
    fixed.description = fixed.description.trim();
    // 移除 YAML 危险字符
    fixed.description = fixed.description.replace(/[\t\r]/g, ' ');
    // 确保不含换行符（YAML >- 格式中也要避免）
    fixed.description = fixed.description.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    if (fixed.description.length > 160) {
      // 优先在句号处截断，确保描述以完整句子结尾
      const truncated = fixed.description.substring(0, 160);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastQuestion = truncated.lastIndexOf('?');
      const lastExclaim = truncated.lastIndexOf('!');
      const lastSentEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);
      if (lastSentEnd > 80) {
        fixed.description = truncated.substring(0, lastSentEnd + 1);
      } else {
        const lastSpace = truncated.lastIndexOf(' ');
        fixed.description = (lastSpace > 100 ? truncated.substring(0, lastSpace) : truncated) + '.';
      }
      warnings.push(`Description truncated to ${fixed.description.length} chars`);
    }
    if (fixed.description.length < 80) {
      warnings.push(`Description short (${fixed.description.length} chars, recommend 120-160)`);
    }
  }

  // === Slug 验证 ===
  if (!fixed.slug || fixed.slug.trim().length === 0) {
    errors.push('Slug is empty');
  } else {
    // 强制 slug 格式：只允许小写字母、数字、连字符
    fixed.slug = fixed.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (fixed.slug.length > 80) {
      // 在连字符处截断
      const truncated = fixed.slug.substring(0, 80);
      const lastHyphen = truncated.lastIndexOf('-');
      fixed.slug = lastHyphen > 20 ? truncated.substring(0, lastHyphen) : truncated;
      warnings.push(`Slug truncated to ${fixed.slug.length} chars`);
    }
    if (fixed.slug.length < 10) {
      warnings.push(`Slug very short (${fixed.slug.length} chars)`);
    }
  }

  // === YAML 安全性验证（所有文本字段）===
  for (const field of ['title', 'description', 'primaryKeyword'] as const) {
    const value = fixed[field];
    if (value) {
      // 检查是否包含可能破坏 YAML 的字符序列
      if (value.includes('---')) {
        fixed[field] = value.replace(/---/g, '—') as any;
        warnings.push(`${field}: replaced '---' with '—' for YAML safety`);
      }
    }
  }

  const valid = errors.length === 0;
  return { fixed, validation: { valid, errors, warnings } };
}

/**
 * 验证文章正文的结构完整性
 */
function validateArticleBody(body: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const wordCount = body.split(/\s+/).length;

  // 最低词数
  if (wordCount < 500) {
    errors.push(`Word count too low: ${wordCount} (minimum 500)`);
  } else if (wordCount < 1000) {
    warnings.push(`Word count below target: ${wordCount} (target 1200+)`);
  }

  // 检查必要结构
  const h1Count = (body.match(/^# /gm) || []).length;
  const h2Count = (body.match(/^## /gm) || []).length;

  if (h1Count === 0) warnings.push('Missing H1 heading');
  if (h2Count < 3) warnings.push(`Only ${h2Count} H2 sections (recommend 4+)`);

  // 检查 FAQ
  const hasFAQ = /FAQ|Frequently Asked/i.test(body);
  if (!hasFAQ) warnings.push('Missing FAQ section');

  // 检查 YAML frontmatter 泄露（LLM 不遵守指令时可能发生）
  if (body.trimStart().startsWith('---')) {
    warnings.push('Body starts with --- (possible frontmatter leak, will be cleaned)');
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * 已有的 Topic Cluster 列表（从articles-index统计）
 * 新文章优先匹配这些已有cluster，避免碎片化
 */
const EXISTING_CLUSTERS = [
  'hypertension-management',
  'diabetes-management',
  'nutrition-diet-management',
  'cardiovascular-health',
  'cardiac-disease-management',
  'renal-health',
  'special-populations',
  'circadian-sleep-health',
  'glucose-diabetes-management',
  'symptoms-diagnosis',
  'medication-safety',
  'comprehensive-health-topics',
  'gastrointestinal-health',
  'lifestyle-interventions',
  'environmental-factors',
  'monitoring-technology',
  'mental-health-stress',
  'natural-remedies',
  'prevention-risk-assessment',
  'autonomic-nervous-regulation',
];

/**
 * 关键词到cluster的映射规则
 */
const CLUSTER_KEYWORD_MAP: Record<string, string[]> = {
  'hypertension-management': ['blood pressure', 'hypertension', 'bp', 'systolic', 'diastolic', 'mmhg'],
  'diabetes-management': ['diabetes', 'blood sugar', 'glucose', 'insulin', 'hba1c', 'a1c', 'diabetic'],
  'nutrition-diet-management': ['food', 'diet', 'eating', 'nutrition', 'meal', 'salt', 'sodium', 'potassium', 'recipe', 'cranberry', 'berry'],
  'cardiovascular-health': ['heart', 'cardiac', 'cardiovascular', 'artery', 'vein', 'blood vessel', 'cholesterol'],
  'medication-safety': ['medication', 'medicine', 'drug', 'pill', 'prescription', 'side effect', 'dosage'],
  'lifestyle-interventions': ['exercise', 'walking', 'yoga', 'tai chi', 'physical activity', 'fitness', 'weight'],
  'monitoring-technology': ['monitor', 'cuff', 'device', 'tracking', 'wearable', 'measurement', 'home monitoring'],
  'circadian-sleep-health': ['sleep', 'night', 'morning', 'circadian', 'insomnia', 'rest'],
  'mental-health-stress': ['stress', 'anxiety', 'depression', 'mental', 'emotional', 'mindfulness', 'breathing'],
  'natural-remedies': ['natural', 'herbal', 'supplement', 'alternative', 'without medication', 'home remedy'],
  'symptoms-diagnosis': ['symptom', 'sign', 'warning', 'diagnos', 'test', 'check'],
  'special-populations': ['women', 'men', 'elderly', 'senior', 'age 70', 'age 80', 'pregnancy'],
  'environmental-factors': ['weather', 'winter', 'summer', 'cold', 'heat', 'altitude', 'travel'],
  'renal-health': ['kidney', 'renal', 'dehydration', 'fluid', 'water intake'],
  'prevention-risk-assessment': ['prevent', 'risk', 'reduce risk', 'avoid', 'protect'],
};

/**
 * 将选题的 topicCluster 匹配到已有的cluster
 * 如果能匹配就用已有的，否则保留原始值
 */
function matchTopicCluster(rawCluster: string): string {
  const normalized = rawCluster.toLowerCase().trim();

  // 1. 完全匹配
  if (EXISTING_CLUSTERS.includes(normalized)) {
    return normalized;
  }

  // 2. 关键词匹配
  for (const [cluster, keywords] of Object.entries(CLUSTER_KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword.replace(/\s+/g, '-'))) {
        return cluster;
      }
    }
  }

  // 3. 模糊匹配 — 检查原始cluster的词是否出现在已有cluster中
  const rawWords = normalized.split('-');
  let bestMatch = '';
  let bestScore = 0;

  for (const cluster of EXISTING_CLUSTERS) {
    const clusterWords = cluster.split('-');
    let score = 0;
    for (const word of rawWords) {
      if (clusterWords.some(cw => cw.includes(word) || word.includes(cw))) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cluster;
    }
  }

  // 至少2个词匹配才认为有效
  if (bestScore >= 2) {
    return bestMatch;
  }

  // 4. 无法匹配 — 保留原始值（会形成新cluster）
  return normalized;
}

/**
 * 为选题生成完整的 Markdown 文章
 * v2.1: 先生成正文 → 再基于正文优化metadata → 严格格式验证 → cluster匹配 → 写入
 */
export async function generateArticleMarkdown(
  topic: PlannedTopic
): Promise<GeneratedArticle> {
  console.log(`\n📝 Generating article for: "${topic.title}"`);

  // 1. 随机选择风格
  const { wordCount, tone } = selectRandomStyle();
  console.log(`   Style: ${wordCount} words, ${tone}`);

  // 2. 调用 LLM 生成正文
  const body = await generateArticleBody(topic, wordCount, tone);

  // 3. 验证正文
  const bodyValidation = validateArticleBody(body);
  if (!bodyValidation.valid) {
    throw new Error(`Article body validation failed: ${bodyValidation.errors.join('; ')}`);
  }
  if (bodyValidation.warnings.length > 0) {
    bodyValidation.warnings.forEach(w => console.warn(`   ⚠️  Body: ${w}`));
  }

  const wordCountActual = body.split(/\s+/).length;
  console.log(`   ✅ Generated ${wordCountActual} words`);

  // 4. 基于正文内容优化 metadata（最多重试2次）
  console.log(`   🔄 Optimizing metadata...`);
  let optimized: OptimizedMetadata | null = null;
  let metadataValid = false;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const raw = await optimizeMetadata(topic, body);
    const { fixed, validation } = validateAndFixMetadata(raw);

    if (validation.errors.length > 0) {
      console.warn(`   ⚠️  Attempt ${attempt} metadata errors: ${validation.errors.join('; ')}`);
      if (attempt === 2) {
        throw new Error(`Metadata validation failed after 2 attempts: ${validation.errors.join('; ')}`);
      }
      continue;
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(w => console.warn(`   ⚠️  ${w}`));
    }

    optimized = fixed;
    metadataValid = true;
    break;
  }

  if (!metadataValid || !optimized) {
    throw new Error('Failed to generate valid metadata');
  }

  console.log(`   ✅ Metadata validated`);
  console.log(`      PK: "${optimized.primaryKeyword}" (${optimized.primaryKeyword.length} chars)`);
  console.log(`      Title: "${optimized.title}" (${optimized.title.length} chars)`);
  console.log(`      Desc: "${optimized.description.substring(0, 60)}..." (${optimized.description.length} chars)`);
  console.log(`      Slug: ${optimized.slug}`);

  // 5. 生成唯一 slug
  const slug = generateUniqueSlug(optimized.slug);

  // 6. Topic Cluster 匹配 — 优先使用已有cluster
  const resolvedCluster = matchTopicCluster(topic.topicCluster);
  if (resolvedCluster !== topic.topicCluster) {
    console.log(`      Cluster: ${topic.topicCluster} → ${resolvedCluster} (matched existing)`);
  }

  // 7. 构造 frontmatter
  const currentDate = getCurrentDate();
  const frontmatter: ArticleFrontmatter = {
    title: optimized.title,
    slug,
    description: optimized.description,
    date: currentDate,
    updated: currentDate,
    primaryKeyword: optimized.primaryKeyword,
    topicCluster: resolvedCluster,
    image: '',
    relatedSlugs: [],
  };

  // 8. 最终 YAML 安全检查 — 确保所有文本字段不含破坏 YAML 的字符
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string' && value.includes('\n')) {
      (frontmatter as any)[key] = value.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      console.warn(`   ⚠️  Fixed newline in frontmatter.${key}`);
    }
  }

  // 9. 同步 H1 与 YAML title — 确保搜索引擎和 AI 看到一致的标题
  let finalBody = body;
  const h1Match = finalBody.match(/^# .+$/m);
  if (h1Match) {
    finalBody = finalBody.replace(h1Match[0], `# ${optimized.title}`);
    console.log(`   🔄 H1 synced with metadata title`);
  }

  console.log(`   ✅ Article ready: ${slug}\n`);

  return {
    slug,
    frontmatter,
    body: finalBody,
  };
}

/**
 * 调用 Qwen Plus 生成文章正文
 * v2.0: GEO结构 + E-E-A-T信号 + 深度内容
 */
async function generateArticleBody(
  topic: PlannedTopic,
  wordCount: string,
  tone: string
): Promise<string> {
  const systemMessage = `You are a board-certified cardiologist writing patient education articles for adults aged 35 and above on a health website called BPCareAI.

Your expertise allows you to:
- Explain complex cardiovascular concepts in plain language that patients actually understand
- Bridge medical terminology with everyday words (e.g., "blood vessel stiffness (arterial stiffness)")
- Cite specific guidelines and research (AHA, ACC, ESC) with concrete numbers
- Provide actionable, evidence-based advice with clear thresholds

Your writing principles:
- "Precise simplicity": every medical term gets a plain-language bridge on first use
- Data over vagueness: use specific numbers (percentages, ranges, mmHg values) instead of "some" or "many"
- Empowerment over fear: focus on "here's what you can do" not "here's what might kill you"
- AI-quotable: write key statements as self-contained, fact-rich sentences that AI systems can directly cite
- Authority with warmth: sound like a doctor who actually listens, not a textbook`;

  // Build optional Perplexity context block
  let perplexityContext = '';
  if (topic.perplexityQuestions?.length || topic.competitorCoverage) {
    const parts: string[] = [];
    if (topic.competitorCoverage) {
      parts.push(`COMPETITOR COVERAGE (what top-ranking articles already cover — differentiate from this):\n${topic.competitorCoverage}`);
    }
    if (topic.perplexityQuestions?.length) {
      parts.push(`REAL USER QUESTIONS (address at least 3 of these in your article):\n${topic.perplexityQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`);
    }
    perplexityContext = `\n═══════════════════════════════════════\nSEARCH INTELLIGENCE (from real web data)\n═══════════════════════════════════════\n\n${parts.join('\n\n')}\n`;
  }

  const userMessage = `Write a comprehensive, SEO-optimized health article about:

Topic: ${topic.title}
Primary Keyword: ${topic.primaryKeyword}
Core Area: ${topic.coreKeyword}
${perplexityContext}
Requirements:
- Length: ${wordCount} words (MINIMUM 1200 words, do not write less)
- Tone: ${tone}
- Output ONLY Markdown body text (NO YAML frontmatter, NO --- delimiters)

═══════════════════════════════════════
ARTICLE STRUCTURE (follow this exactly)
═══════════════════════════════════════

# [H1 Main Heading]
- Must contain the Primary Keyword or a close natural variant
- Slightly different phrasing from the topic title (complementary, not duplicate)
- Written to hook the reader emotionally

## Quick Answer (CRITICAL for AI/GEO)
- 2-3 sentences that DIRECTLY answer the question implied by the title
- Must be self-contained — an AI reading ONLY this paragraph should get the core answer
- Include 1 specific number or data point
- Include the Primary Keyword naturally

## Key Facts (CRITICAL for Featured Snippets)
Use a bullet list with checkmark format:
✅ [Fact 1 with specific number]
✅ [Fact 2 with specific number]
✅ [Fact 3 with specific number]
✅ [Fact 4 with specific number]
✅ [Fact 5 with specific number]
- Each fact must be a complete, quotable statement with a concrete data point
- These should cover the article's most important takeaways

## ⚠️ When to See Your Doctor
- List 4-5 specific warning signs with EXACT thresholds (e.g., "systolic BP consistently ≥140 mmHg")
- This section builds E-E-A-T trust signals
- Place it early — shows you prioritize patient safety over engagement

## [H2 Section 1: Understanding the Topic]
- Explain the "why" behind this health topic for adults 35 and above
- Use at least ONE "plain language (medical term)" bridge, e.g., "blood vessel stiffness (arterial stiffness)"
- Include at least 1 specific statistic or research finding with source
- Address 1-2 common misconceptions
- Primary Keyword used naturally 1-2 times

## [H2 Section 2: What You Can Do — Evidence-Based Actions]
- Concrete, actionable recommendations (diet, exercise, monitoring, lifestyle)
- Each recommendation backed by a number or guideline (e.g., "AHA recommends 150 minutes/week of moderate exercise")
- Use at least ONE "plain language (medical term)" bridge
- Include specific measurements, dosages, or timeframes where relevant
- Primary Keyword used naturally 1-2 times

## [H2 Section 3: Monitoring and Tracking Your Progress]
- How to measure improvement at home (blood pressure, symptoms, energy)
- Specific targets and timelines (e.g., "expect to see 5-7 mmHg reduction in 4-6 weeks")
- When numbers indicate you need to adjust your approach

## Conclusion
- Reassuring closing message
- Reinforce the main actionable takeaway
- Include Primary Keyword once naturally
- End with: "Tracking your blood pressure trends can help you and your doctor make better decisions together."

### Frequently Asked Questions

- Include 5 FAQ items
- Format each as: #### [Question]\\n[Answer]
- Questions should match real Google search queries (natural language, specific)
- At least 3 questions should contain the Primary Keyword or a close variant
- CRITICAL: The first sentence of each answer must DIRECTLY answer the question — suitable for AI to quote as a standalone answer
- Then expand with supporting detail

═══════════════════════════════════════
SEO + GEO OPTIMIZATION RULES
═══════════════════════════════════════

1. **Primary Keyword Usage**: Use "${topic.primaryKeyword}" naturally 4-6 times total across the article. Also use 3-5 related terms/synonyms.

2. **Heading Optimization**: H1 must contain PK. At least 2 H2s should contain topic-relevant keywords naturally.

3. **AI-Quotable Paragraphs**: In each major section, write at least ONE paragraph that:
   - Starts with a clear claim or fact
   - Contains a specific data point
   - Is self-contained (makes sense without surrounding context)
   - An AI system could quote this paragraph as a complete answer

4. **Medical Term Bridging**: On EVERY first use of a medical term, follow it with the plain-language equivalent in parentheses, or vice versa. E.g., "arterial stiffness (when blood vessels lose flexibility)"

5. **E-E-A-T Signals**:
   - Reference at least 2 specific medical guidelines or organizations (AHA, ACC, WHO, ESC, JNC)
   - Include "according to [source]" attributions for key claims
   - Use specific study references where possible (e.g., "a 2023 study in The Lancet found...")

6. **Content Depth**:
   - Each H2 section: minimum 200 words
   - Include specific numbers: percentages, mmHg values, timeframes, dosages
   - No filler sentences — every sentence should inform or advise

═══════════════════════════════════════
STRICT RULES
═══════════════════════════════════════
- Output MUST be valid Markdown
- Do NOT include YAML frontmatter (no --- sections)
- Do NOT promote specific apps, products, or brands
- Do NOT use fear-mongering language
- Do NOT make diagnostic claims — always recommend consulting a doctor for diagnosis
- Keep paragraphs short (3-5 sentences max) for mobile readability`;

  try {
    const completion = await withRetry(
      () => openai.chat.completions.create({
        model: 'qwen-plus-latest',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        top_p: 0.9,
      }),
      { maxRetries: 2 }
    );

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Qwen Plus');
    }

    // 移除可能的 frontmatter（以防 LLM 不遵守指令）
    let cleanedContent = content;
    if (cleanedContent.startsWith('---')) {
      const secondDelimiter = cleanedContent.indexOf('---', 3);
      if (secondDelimiter !== -1) {
        cleanedContent = cleanedContent.substring(secondDelimiter + 3).trim();
      }
    }

    return cleanedContent;
  } catch (error) {
    console.error('   ❌ Error generating article body:', error);
    throw error;
  }
}

/**
 * 基于已生成的正文内容，调用 LLM 优化 metadata
 * 确保 title/description/primaryKeyword/slug 都基于实际内容优化
 */
async function optimizeMetadata(
  topic: PlannedTopic,
  articleBody: string
): Promise<OptimizedMetadata> {
  const bodyPreview = articleBody.substring(0, 2000);

  const systemMessage = `You are an SEO and GEO (Generative Engine Optimization) specialist. Your job is to optimize article metadata for maximum search engine visibility and AI citability.

You optimize for a health website targeting adults aged 35+ about cardiovascular health, blood pressure, diabetes, and heart disease.`;

  const userMessage = `Based on the following article content, generate optimized metadata.

Original Topic Title: ${topic.title}
Original Primary Keyword: ${topic.primaryKeyword}
Topic Area: ${topic.coreKeyword}

Article Content Preview:
${bodyPreview}

═══════════════════════════════════════
OPTIMIZATION STANDARDS
═══════════════════════════════════════

**Primary Keyword** (MOST IMPORTANT):
- Must be a phrase a real person would type into Google
- 20-60 characters, 3-8 words
- Natural language query format
- Pass the "would my 65-year-old parent search this?" test
- Include age/audience context naturally if relevant
- NO medical jargon unless it's a commonly searched term (e.g., "blood pressure" is OK, "endothelial dysfunction" is NOT)
- Examples of GOOD PKs: "foods that lower blood pressure naturally after 60", "is 150/90 blood pressure dangerous for seniors"
- Examples of BAD PKs: "nrf2 pathway activation for coronary endothelium", "arterial stiffness pathophysiology"

**Title**:
- 40-70 characters (STRICT — will be truncated in search results if longer)
- Must contain the Primary Keyword or its core 2-3 word variant
- Engaging but not clickbait
- Varied formats: questions, how-to, lists, statements (pick what fits best)
- Age/audience can be included naturally but not forced

**Description**:
- 120-160 characters (STRICT)
- Must contain the Primary Keyword or core variant
- Include at least 1 specific data point from the article (percentage, number, measurement)
- Include at least 1 "plain language (medical term)" bridge if relevant
- End with action-oriented language
- Should make a searcher want to click

**Slug**:
- 3-6 words, hyphen-separated
- Contains core keyword words
- Short, readable, memorable
- Example: "lower-blood-pressure-naturally-seniors"

═══════════════════════════════════════
OUTPUT FORMAT (JSON only, no explanation)
═══════════════════════════════════════
{
  "primaryKeyword": "optimized primary keyword",
  "title": "Optimized Title Here",
  "description": "Optimized description with data point and bridge.",
  "slug": "short-readable-slug"
}`;

  try {
    const completion = await withRetry(
      () => openai.chat.completions.create({
        model: 'qwen-plus-latest',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        top_p: 0.9,
      }),
      { maxRetries: 2 }
    );

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from metadata optimization');
    }

    let parsed: OptimizedMetadata;

    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error(`Failed to parse metadata JSON. Content: ${content.substring(0, 200)}`);
      }
      parsed = JSON.parse(match[0]);
    }

    // 基础字段存在性检查（详细验证由 validateAndFixMetadata 处理）
    if (!parsed.primaryKeyword || !parsed.title || !parsed.description || !parsed.slug) {
      throw new Error('Incomplete metadata response');
    }

    // slug 标准化
    parsed.slug = slugify(parsed.slug);

    return parsed;
  } catch (error) {
    console.warn(`   ⚠️  Metadata optimization failed, using fallback:`, error);

    // 降级方案：基于原始数据生成
    return {
      primaryKeyword: topic.primaryKeyword,
      title: topic.title.length > 70 ? topic.title.substring(0, 67) + '...' : topic.title,
      description: topic.description || `Learn about ${topic.primaryKeyword} — practical, evidence-based guidance for adults 35 and above.`,
      slug: slugify(topic.title).substring(0, 60),
    };
  }
}
