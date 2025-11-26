/**
 * 基于 Qwen Plus 的文章自动生成工具
 */

import fs from 'fs';
import path from 'path';
import { openai } from './client';
import { slugify } from '../utils/slugify';

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
  tags: string[];
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
 * 生成唯一的 slug，避免与已有文件冲突
 */
function generateUniqueSlug(title: string): string {
  const baseSlug = slugify(title);
  const articlesDir = path.join(process.cwd(), 'content', 'articles');

  // 确保目录存在
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  let slug = baseSlug;
  let counter = 2;

  // 检查文件是否已存在，如果存在则追加数字
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
 * 从 topic 生成 tags 数组
 */
function generateTags(topic: PlannedTopic): string[] {
  const tags = new Set<string>();

  if (topic.primaryKeyword && topic.primaryKeyword.trim()) {
    tags.add(topic.primaryKeyword.trim());
  }

  if (topic.coreKeyword && topic.coreKeyword.trim()) {
    tags.add(topic.coreKeyword.trim());
  }

  if (topic.topicCluster && topic.topicCluster.trim()) {
    tags.add(topic.topicCluster.trim());
  }

  return Array.from(tags);
}

/**
 * 随机选择文章长度和语气
 */
function selectRandomStyle(): { wordCount: string; tone: string } {
  // 50% 短文，50% 长文
  const wordCount = Math.random() < 0.5 ? '700-900' : '1200-1500';

  // 随机选择语气
  const tones = ['more educational', 'more conversational', 'more reassuring'];
  const tone = tones[Math.floor(Math.random() * tones.length)];

  return { wordCount, tone };
}

/**
 * 为选题生成完整的 Markdown 文章
 */
export async function generateArticleMarkdown(
  topic: PlannedTopic
): Promise<GeneratedArticle> {
  console.log(`\n📝 Generating article for: "${topic.title}"`);

  // 1. 生成唯一 slug
  const slug = generateUniqueSlug(topic.title);
  console.log(`   Slug: ${slug}`);

  // 2. 随机选择风格
  const { wordCount, tone } = selectRandomStyle();
  console.log(`   Style: ${wordCount} words, ${tone}`);

  // 3. 构造 frontmatter
  const currentDate = getCurrentDate();
  const frontmatter: ArticleFrontmatter = {
    title: topic.title,
    slug,
    description: topic.description || '',
    date: currentDate,
    updated: currentDate,
    tags: generateTags(topic),
    primaryKeyword: topic.primaryKeyword,
    topicCluster: topic.topicCluster,
    image: '',
    relatedSlugs: [],
  };

  // 4. 调用 LLM 生成正文
  const body = await generateArticleBody(topic, wordCount, tone);

  // 5. 验证正文长度
  const wordCountActual = body.split(/\s+/).length;
  if (wordCountActual < 300) {
    throw new Error(
      `Generated article too short: ${wordCountActual} words (minimum 300)`
    );
  }

  console.log(`   ✅ Generated ${wordCountActual} words\n`);

  return {
    slug,
    frontmatter,
    body,
  };
}

/**
 * 调用 Qwen Plus 生成文章正文
 */
async function generateArticleBody(
  topic: PlannedTopic,
  wordCount: string,
  tone: string
): Promise<string> {
  const systemMessage = `You are a medical content editor writing cardiovascular health articles for people aged 50 and above.

Your writing style should be:
- Friendly, gentle, and easy to understand in English
- Avoid fear-mongering or exaggeration
- Focus on "what you can do" rather than "what might happen to you"
- Provide reassurance and companionship
- Use simple language, avoid medical jargon unless commonly searched

Your goal is to:
- Help users understand specific scenarios or questions related to blood pressure and heart health
- Provide practical lifestyle and monitoring advice
- Create content suitable for SEO publication on a health website`;

  const userMessage = `Write a comprehensive article about the following topic:

Title: ${topic.title}
Description: ${topic.description}
Primary Keyword: ${topic.primaryKeyword}
Topic Cluster: ${topic.topicCluster}
Core Keyword: ${topic.coreKeyword}

Requirements:
1. Length: Write approximately ${wordCount} words
2. Tone: Make it ${tone}
3. Output ONLY Markdown body text (NO YAML frontmatter, NO --- delimiters)

Structure:
- # Main heading (H1): Similar meaning to the title but slightly varied phrasing, should include the Primary Keyword or a close variant
- Opening 1-2 paragraphs:
  * Use the Primary Keyword naturally in the first paragraph
  * Explain why this topic matters for 50+ adults
  * Mention 1-2 common misconceptions
- 2-3 main sections (##):
  * At least ONE H2 heading should incorporate the Primary Keyword or topic-relevant keywords naturally
  * Example: Instead of "Why This Happens", use "Why ${topic.primaryKeyword.split(' ').slice(0, 4).join(' ')} Matters"
  * Causes or reasons for this phenomenon/issue
  * How to properly measure/assess
  * Who should pay special attention
- 1 practical advice section (##):
  * Lifestyle recommendations
  * Self-monitoring tips
  * At the end of this section, add: "Tracking your blood pressure trends can help you and your doctor make better decisions. Consider keeping a daily log or using a monitoring tool to stay informed."
  * Signs when to see a doctor
- Brief conclusion with reassuring message
  * Include the Primary Keyword once naturally
  * Example: "If you're unsure, talking to your doctor is always a good idea."

FAQ Section:
- Add a "### FAQ" section at the end
- Include 3-5 questions that users might search on Google
- At least 2-3 FAQ questions should include variations of the Primary Keyword naturally
- Format: #### Question, followed by Answer
- Questions should be natural, specific, and match real search queries

SEO Optimization Requirements:
1. **Keyword Usage**:
   - Use the Primary Keyword "${topic.primaryKeyword}" naturally 3-5 times throughout the article
   - Use related terms and synonyms contextually (e.g., "BP", "arterial pressure" if discussing blood pressure)
   - Ensure keyword placement feels natural, not forced

2. **Heading Optimization**:
   - H1: Must contain Primary Keyword or close variant
   - At least one H2: Should incorporate topic-relevant keywords
   - Keep headings reader-friendly while SEO-optimized

3. **Content Depth**:
   - Include specific numbers, statistics, or ranges where appropriate (e.g., "140/90 mm Hg", "20% increase")
   - Mention related medical terms that users might search for

4. **Semantic Richness**:
   - Use natural variations and related concepts
   - Answer the search intent comprehensively

Important:
- Output MUST be valid Markdown
- Do NOT include any YAML frontmatter (no --- sections)
- Do NOT insert promotional content about specific apps or products
- Maintain neutral, objective scientific writing
- Focus on education and practical advice
- SEO optimization should enhance, not compromise, readability`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'qwen-plus-latest',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      top_p: 0.9,
    });

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
