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
  const systemMessage = `You are an expert SEO content strategist specializing in health and wellness topics.

Your role is to generate highly diverse, search-optimized article topic ideas that:
- Target middle-aged and elderly readers (50+ years old)
- Use clear, accessible language without complex medical jargon
- Focus on practical, actionable information
- Are optimized for search engines (long-tail keywords, natural language queries)
- Cover the topic comprehensively from MULTIPLE different angles and perspectives

Core principles:
- Prioritize SEO effectiveness - think about what people actually search for
- Maximize diversity - avoid repetitive patterns or similar angles
- Address real user questions, concerns, and scenarios
- Write in natural, conversational English that ranks well in search`;

  // 构造 user 消息
  const existingTitlesSummary = existingTitles.length > 0
    ? `\nExisting article titles on our site (avoid semantic duplication):\n${existingTitles.slice(0, 30).map(t => `- ${t}`).join('\n')}${existingTitles.length > 30 ? `\n... and ${existingTitles.length - 30} more` : ''}`
    : '';

  const plannedTitlesSummary = alreadyPlannedTitles.length > 0
    ? `\nAlready planned titles in this batch (must be different):\n${alreadyPlannedTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const userMessage = `Generate ${batchSize} highly diverse article topic ideas for: "${coreKeyword}"
${existingTitlesSummary}
${plannedTitlesSummary}

🎯 DIVERSITY REQUIREMENTS (Critical for SEO success):

You MUST ensure the ${batchSize} titles cover MAXIMUM variety across these dimensions:

1️⃣ TITLE FORMATS - Use diverse high-performing formats (aim for 10+ different formats):

📊 List/Number Formats:
   - "X Ways/Tips/Foods/Signs/Reasons..." (e.g., "10 Foods That Lower Blood Pressure")
   - "X Things You Should Know About..." (e.g., "5 Things Everyone Over 60 Should Know About Cholesterol")
   - "X Mistakes/Habits That..." (e.g., "7 Common Mistakes That Worsen Diabetes")

❓ Question Formats:
   - How/How to (e.g., "How to Lower Blood Sugar Naturally")
   - Why/What causes (e.g., "Why Does Heart Disease Risk Increase with Age")
   - What/What are (e.g., "What Are the Silent Signs of High Blood Pressure")
   - When/Should/Can (e.g., "When Should You Check Your Blood Pressure")

⚡ High-Impact Formats:
   - "A vs B" comparisons (e.g., "Type 1 vs Type 2 Diabetes: Key Differences for Seniors")
   - "Best/Top X for..." (e.g., "Best Exercises for Heart Health After 60")
   - "Complete/Ultimate Guide to..." (e.g., "The Complete Guide to Managing Cholesterol")
   - "X in Y days/weeks" (e.g., "Lower Your Blood Pressure in 30 Days")

⚠️ Warning/Alert Formats:
   - "Warning Signs/Silent Signs/Red Flags of..." (e.g., "Silent Signs of Heart Attack in Women")
   - "When to Worry About..." (e.g., "When to Worry About Irregular Heartbeat")
   - "Dangers/Risks of..." (e.g., "Hidden Dangers of Untreated High Blood Pressure")

🔍 Truth/Verification Formats:
   - "The Truth About..." (e.g., "The Truth About Salt and Blood Pressure")
   - "Myths vs Facts..." (e.g., "Diabetes Myths That Could Harm Your Health")
   - "Does X Really...?" (e.g., "Does Coffee Really Raise Blood Pressure?")

🔗 Connection/Link Formats:
   - "X and Y: The Connection/Link" (e.g., "Stress and High Blood Pressure: Understanding the Link")
   - "How X Affects Y" (e.g., "How Sleep Affects Heart Health in Seniors")

🌟 Natural/Alternative Formats:
   - "Natural Ways/Remedies for..." (e.g., "Natural Remedies for High Cholesterol")
   - "Without Medication/Drugs" (e.g., "Control Diabetes Without Medication")

🎯 Scenario-Specific Formats:
   - "X for Y" audience/situation (e.g., "Blood Pressure Management for Women Over 70")
   - "X While/During Y" (e.g., "Managing Blood Sugar While Traveling")
   - "X at Night/Morning/Summer/Winter" (e.g., "Why Blood Pressure Rises at Night")

📚 Science/Research Formats:
   - "Science-Backed/Proven Ways..." (e.g., "Science-Backed Methods to Reverse Prediabetes")
   - "What Research Says About..." (e.g., "What New Research Says About Heart Health and Diet")

⚡ Quick/Easy Formats:
   - "Quick/Fast/Easy Ways to..." (e.g., "Quick Ways to Lower Blood Sugar Immediately")
   - "Simple Steps/Changes for..." (e.g., "Simple Diet Changes That Lower Cholesterol")

2️⃣ CONTENT ANGLES - Approach from different aspects:
   - Causes & risk factors
   - Symptoms & warning signs
   - Prevention strategies
   - Treatment options (medical & natural)
   - Diet & nutrition (specific foods, meal timing, restrictions)
   - Exercise & physical activity
   - Medications & supplements
   - Monitoring & testing
   - Complications & related conditions
   - Lifestyle modifications (sleep, stress, habits)
   - Emotional & mental health aspects
   - Family history & genetics
   - Gender-specific concerns
   - Seasonal factors

3️⃣ AUDIENCE SEGMENTS - Target different groups:
   - Different age ranges (50s, 60s, 70s, 80+)
   - Gender-specific (women, men)
   - Severity levels (mild, moderate, severe)
   - Comorbidities (with diabetes, obesity, kidney disease, etc.)
   - Lifestyle types (active, sedentary, working, retired)
   - Experience level (newly diagnosed, long-term patients)

4️⃣ SEARCH INTENT - Cover different user needs:
   - Information seeking (what, why, how)
   - Decision making (should I, is it safe, best options)
   - Problem solving (how to fix, reduce, manage)
   - Comparison (A vs B, differences)
   - Emergency (when to worry, warning signs)
   - Prevention (how to avoid, reduce risk)

📊 DISTRIBUTION TARGET:
- Use at least 10 different title formats across the ${batchSize} titles
- Cover at least 12 different content angles
- Address at least 5 different audience segments
- Vary between question formats (40%) and statement formats (60%)

⚠️ CRITICAL RULES:
1. Every title must be SEMANTICALLY DIFFERENT from existing and already planned titles
2. Avoid repetitive patterns - if you use "10 Ways to X", don't use "10 Tips for X" or "10 Methods to X"
3. Think like a user typing into Google - use natural language queries
4. Primary keywords should be specific long-tail phrases (3-6 words)
5. Each title must target a UNIQUE search intent and angle
6. Mix formats strategically - don't generate 5 list-type titles in a row

🏷️ TOPIC CLUSTER:
- DO NOT use predefined categories
- Create a descriptive cluster name that accurately reflects the specific angle/theme of THAT title
- Use kebab-case format (e.g., "diet-nutrition", "emergency-symptoms", "natural-remedies")
- Be specific - if it's about diet, specify "cardiac-diet" or "diabetic-diet", not just "diet"
- Cluster names should emerge naturally from the content focus

📤 OUTPUT FORMAT (ONLY return valid JSON, no explanation):
[
  {
    "title": "Clear, specific, search-friendly title using one of the high-performing formats above",
    "description": "1-2 sentence summary of what the article will cover",
    "primaryKeyword": "specific long-tail keyword phrase (3-6 words)",
    "topicCluster": "descriptive-specific-cluster-name-in-kebab-case"
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
      temperature: 0.85,        // 提高创造性（0.7 → 0.85）
      top_p: 0.95,              // 增加多样性（0.9 → 0.95）
      frequency_penalty: 0.3,   // 减少重复模式和短语
      presence_penalty: 0.2,    // 鼓励引入新主题和概念
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
