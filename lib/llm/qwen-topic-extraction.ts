/**
 * 基于自然语言提示的 Topic 提取工具
 * 使用 LLM 分析用户输入，自动提取相关健康主题
 */

import { openai } from './client';

/**
 * 单个提取的 Topic
 */
export interface ExtractedTopic {
  keyword: string;           // 提取的关键词/主题（如 "sudden cardiac arrest"）
  reasoning: string;         // 为什么这个 topic 相关且有潜力
  estimatedHeat: number;     // 预估热度（1-10）
  suggestedCount: number;    // 建议生成的标题数量（10-50）
}

/**
 * Topic 提取结果
 */
export interface ExtractedTopicsResult {
  topics: ExtractedTopic[];  // 提取的 topics 列表
  analysis: string;          // 整体分析说明
}

/**
 * 从用户的自然语言输入中提取相关健康 topics
 *
 * @param userPrompt - 用户输入的自然语言描述（如新闻事件、趋势等）
 * @returns 提取的 topics 及分析
 *
 * @example
 * const result = await extractTopicsFromPrompt(
 *   "昨天xx明星因为心脏病突发离世了，请你围绕这个热点新闻输出一些具有高热度潜力的topics"
 * );
 * // result.topics = [
 * //   { keyword: "sudden cardiac arrest", reasoning: "...", estimatedHeat: 9, suggestedCount: 30 },
 * //   { keyword: "heart attack warning signs", reasoning: "...", estimatedHeat: 8, suggestedCount: 25 }
 * // ]
 */
export async function extractTopicsFromPrompt(
  userPrompt: string
): Promise<ExtractedTopicsResult> {
  console.log(`\n🤖 Calling Qwen Plus to extract topics from natural language...`);
  console.log(`   User prompt: "${userPrompt.substring(0, 100)}${userPrompt.length > 100 ? '...' : ''}"`);

  const systemMessage = `You are an expert health content strategist and SEO specialist.

Your task is to analyze user input (which may describe events, news, trends, or general topics) and extract relevant health-related topics that have high SEO potential and reader interest.

Core responsibilities:
1. Identify relevant health topics from the user's input
2. Assess the SEO potential and search volume for each topic
3. Estimate the heat/trend level for each topic (1-10 scale)
4. Recommend how many article titles should be generated for each topic

Target audience: Middle-aged and elderly readers (50+ years old)

Focus areas:
- Blood pressure and hypertension
- Heart health and cardiovascular disease
- Diabetes and blood sugar management
- Cholesterol management
- General cardiovascular wellness
- Related conditions and risk factors

For each extracted topic, provide:
- keyword: The topic in English (clear, searchable phrase)
- reasoning: Why this topic is relevant and has potential (in Chinese)
- estimatedHeat: Heat score 1-10 (10 = extremely hot/trending, 1 = low interest)
- suggestedCount: Recommended number of article titles to generate (10-50 based on topic breadth and heat)`;

  const userMessage = `请分析以下用户输入，提取出相关的健康主题（topics）并评估其SEO潜力：

用户输入：
${userPrompt}

请提取 2-5 个最相关且有高SEO潜力的健康主题。

📊 评估标准：
1. **相关性**：与用户输入的关联程度
2. **搜索需求**：用户可能搜索的关键词
3. **受众匹配**：是否适合50+岁的中老年读者
4. **内容深度**：主题是否有足够的内容可以展开
5. **时效性**：如果涉及热点事件，评估其持续热度

📈 热度评分（estimatedHeat）：
- 9-10: 极高热度（如重大新闻事件、突发健康话题）
- 7-8: 高热度（常见关注话题、季节性热点）
- 5-6: 中等热度（常青内容、稳定搜索量）
- 3-4: 较低热度（细分话题、特定人群）
- 1-2: 低热度（冷门话题）

📝 建议标题数量（suggestedCount）：
- 40-50篇：极高热度且内容范围广的核心主题
- 30-40篇：高热度或中等热度但内容丰富的主题
- 20-30篇：中等热度的主题
- 10-20篇：较窄或细分的主题

🎯 输出格式（必须返回有效的JSON）：
{
  "analysis": "简要分析用户输入的背景和提取思路（2-3句话）",
  "topics": [
    {
      "keyword": "English keyword phrase",
      "reasoning": "为什么这个主题相关且有潜力（中文说明）",
      "estimatedHeat": 8,
      "suggestedCount": 30
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'qwen-plus-latest',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Qwen Plus');
    }

    console.log(`   ✅ Received response from Qwen Plus`);

    // 解析 JSON
    const result: ExtractedTopicsResult = JSON.parse(content);

    // 验证结果
    if (!result.topics || !Array.isArray(result.topics)) {
      throw new Error('Invalid response format: missing topics array');
    }

    // 验证每个 topic
    for (const topic of result.topics) {
      if (!topic.keyword || typeof topic.keyword !== 'string') {
        throw new Error('Invalid topic: missing or invalid keyword');
      }
      if (typeof topic.estimatedHeat !== 'number' || topic.estimatedHeat < 1 || topic.estimatedHeat > 10) {
        throw new Error(`Invalid estimatedHeat for topic "${topic.keyword}": must be 1-10`);
      }
      if (typeof topic.suggestedCount !== 'number' || topic.suggestedCount < 10 || topic.suggestedCount > 50) {
        throw new Error(`Invalid suggestedCount for topic "${topic.keyword}": must be 10-50`);
      }
    }

    console.log(`   📋 Extracted ${result.topics.length} topics\n`);

    return result;
  } catch (error) {
    console.error('   ❌ Error extracting topics:', error);
    throw error;
  }
}
