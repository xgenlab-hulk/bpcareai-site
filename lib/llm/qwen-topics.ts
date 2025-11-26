/**
 * 基于 Qwen Plus 的文章选题生成工具
 */

import { openai } from './client';

/**
 * 生成的选题候选
 */
export interface GeneratedTopicCandidate {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
}

/**
 * 生成选题的参数
 */
export interface GenerateTopicCandidatesParams {
  coreKeyword: string;           // 核心关键词
  existingTitles: string[];      // 站内已有所有文章标题
  alreadyPlannedTitles: string[];// 本次脚本中已入选的标题
  batchSize?: number;            // 每次期望生成的候选数量，默认 30
}

/**
 * 根据核心关键词生成候选文章标题列表
 */
export async function generateTopicCandidatesForKeyword(
  params: GenerateTopicCandidatesParams
): Promise<GeneratedTopicCandidate[]> {
  const {
    coreKeyword,
    existingTitles,
    alreadyPlannedTitles,
    batchSize = 30,
  } = params;

  console.log(`\n🤖 Calling Qwen Plus to generate topics...`);
  console.log(`   Core keyword: "${coreKeyword}"`);
  console.log(`   Batch size: ${batchSize}`);
  console.log(`   Existing articles: ${existingTitles.length}`);
  console.log(`   Already planned: ${alreadyPlannedTitles.length}`);

  // 构造 system 消息
  const systemMessage = `You are a content strategist for a health website focused on blood pressure and cardiovascular health for people aged 50+.

Your role is to generate article topic ideas that are:
- Friendly, easy-to-understand, and accessible for middle-aged and elderly readers
- Focused on blood pressure, heart health, cardiovascular risk, and related lifestyle topics
- Practical and actionable
- Written in English
- Search-friendly and optimized for SEO

Guidelines:
- Use clear, simple language
- Focus on common questions and concerns
- Address specific scenarios, symptoms, age groups, or situations
- Avoid medical jargon unless it's commonly searched`;

  // 构造 user 消息
  const existingTitlesSummary = existingTitles.length > 0
    ? `\nExisting article titles on our site (avoid semantic duplication):\n${existingTitles.slice(0, 10).map(t => `- ${t}`).join('\n')}${existingTitles.length > 10 ? `\n... and ${existingTitles.length - 10} more` : ''}`
    : '';

  const plannedTitlesSummary = alreadyPlannedTitles.length > 0
    ? `\nAlready planned titles in this batch (must be different):\n${alreadyPlannedTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const userMessage = `Generate ${batchSize} new article topic ideas related to the core keyword: "${coreKeyword}".
${existingTitlesSummary}
${plannedTitlesSummary}

Requirements for each topic:
1. The title should be engaging, specific, and related to "${coreKeyword}"
2. Approach from different angles: scenarios, questions, age groups, symptoms, lifestyle factors, etc.
3. Must NOT semantically duplicate existing or already planned titles
4. Suitable for middle-aged and elderly users
5. Written in English

For each topic, provide:
- title: The article title (clear and search-friendly)
- description: A brief 1-2 sentence summary
- primaryKeyword: The main long-tail keyword for SEO
- topicCluster: Category like "blood-pressure-basics", "heart-health", "hypertension-lifestyle", "cardiovascular-risk", etc.

Output format: Return ONLY a valid JSON array with no explanation, like this:
[
  {
    "title": "...",
    "description": "...",
    "primaryKeyword": "...",
    "topicCluster": "..."
  }
]`;

  try {
    // 调用 Qwen Plus
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

    console.log(`   ✅ Received response from Qwen Plus`);

    // 尝试解析 JSON
    let candidates: GeneratedTopicCandidate[];

    try {
      // 直接解析
      candidates = JSON.parse(content);
    } catch (error) {
      // 尝试修复：提取 [...] 之间的内容
      console.warn('   ⚠️  Direct JSON parse failed, attempting to extract array...');

      const match = content.match(/\[[\s\S]*\]/);
      if (!match) {
        throw new Error(
          `Failed to parse JSON response. Content preview:\n${content.substring(0, 200)}...`
        );
      }

      candidates = JSON.parse(match[0]);
    }

    // 过滤无效条目
    const validCandidates = candidates.filter(
      (c) => c.title && c.title.trim().length > 0
    );

    console.log(`   📋 Raw candidates: ${candidates.length}, Valid: ${validCandidates.length}\n`);

    return validCandidates;
  } catch (error) {
    console.error('   ❌ Error generating topics:', error);
    throw error;
  }
}
