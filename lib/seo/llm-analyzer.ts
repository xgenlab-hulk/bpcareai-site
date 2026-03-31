/**
 * LLM驱动的GSC数据深度分析器
 *
 * 负责3个LLM节点：
 * 1. 每周深度分析（搜索意图、CTR归因、机会识别、选题建议、已有文章优化建议）
 * 2. 紧急选题转化（搜索词 → 完整选题）
 * 3. 已有文章优化建议执行
 *
 * Perplexity接口在此预留，用于深挖内容缺口
 */

import { openai } from '../llm/client';

// ============================================================
// 类型定义
// ============================================================

export interface WeeklyAnalysisInput {
  queries: { query: string; impressions: number; clicks: number; avgPosition: number; ctr: number }[];
  topPages: { slug: string; impressions: number; clicks: number; ctr: number; position: number }[];
  monthlyTrend: any;
  currentTopicLibrary: string;
  siteInfo: string;
}

export interface WeeklyAnalysisResult {
  searchIntentAnalysis: string;
  ctrAnomalies: string;
  hiddenOpportunities: string;
  topicPriorities: string;
  articleOptimizations: ArticleOptimization[];
  rawAnalysis: string;
}

export interface ArticleOptimization {
  slug: string;
  currentTitle: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedPK: string;
  reason: string;
}

export interface UrgentTopicInput {
  query: string;
  impressions: number;
  position: number;
  alertType: string;
  alertReason: string;
}

export interface UrgentTopicOutput {
  title: string;
  primaryKeyword: string;
  description: string;
  topicCluster: string;
  reasoning: string;
}

// ============================================================
// 节点1: 每周深度分析
// ============================================================

export async function runWeeklyDeepAnalysis(input: WeeklyAnalysisInput): Promise<WeeklyAnalysisResult> {
  const dataStr = JSON.stringify({
    site: input.siteInfo,
    queries: input.queries,
    topPages: input.topPages,
    monthlyTrend: input.monthlyTrend,
    topicLibrary: input.currentTopicLibrary,
  }, null, 2);

  const completion = await openai.chat.completions.create({
    model: 'qwen-plus-latest',
    messages: [
      {
        role: 'system',
        content: `You are a senior SEO/GEO strategist analyzing Google Search Console data for BPCareAI, a health website for adults 50+.

Your analysis must be:
- Data-driven: cite specific search terms, numbers, and percentages
- Actionable: every insight must lead to a concrete next step
- Prioritized: rank recommendations by ROI (impact vs effort)

You output in Chinese. You always provide specific title/description suggestions when recommending article optimizations.`,
      },
      {
        role: 'user',
        content: `分析以下GSC数据并输出JSON格式的分析结果：

${dataStr}

请输出以下JSON结构（确保是有效JSON）：
{
  "searchIntentAnalysis": "搜索意图分析（信息查询/比较决策/紧急问题分类，引用具体搜索词和数据）",
  "ctrAnomalies": "CTR异常分析（高展示低点击的原因诊断，引用具体页面数据）",
  "hiddenOpportunities": "被忽视的机会（长尾词、新兴方向、未覆盖需求）",
  "topicPriorities": "未来一周选题优先级TOP 5（每个说明数据依据和为什么优先）",
  "articleOptimizations": [
    {
      "slug": "文章slug",
      "currentTitle": "当前标题",
      "suggestedTitle": "建议新标题（40-70字符，匹配用户搜索词）",
      "suggestedDescription": "建议新描述（120-160字符，含数据点）",
      "suggestedPK": "建议新PK（用户搜索语言）",
      "reason": "为什么要改（引用GSC数据）"
    }
  ]
}`,
      },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content || '';

  // 尝试解析JSON
  let parsed: any;
  try {
    // 尝试直接解析
    parsed = JSON.parse(content);
  } catch {
    // 提取JSON块
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        // JSON解析失败，返回原始文本
        return {
          searchIntentAnalysis: '',
          ctrAnomalies: '',
          hiddenOpportunities: '',
          topicPriorities: '',
          articleOptimizations: [],
          rawAnalysis: content,
        };
      }
    } else {
      return {
        searchIntentAnalysis: '',
        ctrAnomalies: '',
        hiddenOpportunities: '',
        topicPriorities: '',
        articleOptimizations: [],
        rawAnalysis: content,
      };
    }
  }

  return {
    searchIntentAnalysis: parsed.searchIntentAnalysis || '',
    ctrAnomalies: parsed.ctrAnomalies || '',
    hiddenOpportunities: parsed.hiddenOpportunities || '',
    topicPriorities: parsed.topicPriorities || '',
    articleOptimizations: parsed.articleOptimizations || [],
    rawAnalysis: content,
  };
}

// ============================================================
// 节点2: 紧急选题转化（搜索词 → 完整选题）
// ============================================================

export async function convertUrgentQueryToTopic(input: UrgentTopicInput): Promise<UrgentTopicOutput> {
  const completion = await openai.chat.completions.create({
    model: 'qwen-plus-latest',
    messages: [
      {
        role: 'system',
        content: `You are a health content planner for BPCareAI (adults 50+ cardiovascular health).
A trending search query has been detected in Google Search Console. Your job is to convert this search query into a complete article topic that matches what the user actually wants.

Rules:
- Title: 40-70 characters, written for humans not doctors
- PrimaryKeyword: what a 65-year-old would type into Google, no medical jargon
- Description: 120-160 characters, includes a data point, action-oriented ending
- Think about WHY this query is trending — what's happening that makes people search this?`,
      },
      {
        role: 'user',
        content: `Trending GSC query detected:
- Query: "${input.query}"
- Impressions: ${input.impressions}
- Current position: ${input.position}
- Alert type: ${input.alertType}
- Alert reason: ${input.alertReason}

Convert this into a complete article topic. Output JSON only:
{
  "title": "Article title (40-70 chars)",
  "primaryKeyword": "Natural search query (20-60 chars)",
  "description": "Meta description (120-160 chars with data point)",
  "topicCluster": "kebab-case cluster name",
  "reasoning": "Why this topic matters now and what the user really wants"
}`,
      },
    ],
    temperature: 0.4,
  });

  const content = completion.choices[0]?.message?.content || '';

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : content);
    return {
      title: parsed.title || `Article about: ${input.query}`,
      primaryKeyword: parsed.primaryKeyword || input.query,
      description: parsed.description || '',
      topicCluster: parsed.topicCluster || 'trending',
      reasoning: parsed.reasoning || input.alertReason,
    };
  } catch {
    // 降级：直接用搜索词
    return {
      title: `${input.query.charAt(0).toUpperCase() + input.query.slice(1)}: What Seniors Need to Know`,
      primaryKeyword: input.query,
      description: `Learn about ${input.query} — practical guidance for adults 50 and above.`,
      topicCluster: 'trending',
      reasoning: input.alertReason,
    };
  }
}

// ============================================================
// 节点3: 批量生成已有文章优化建议（基于LLM分析结果）
// ============================================================

export async function generateArticleOptimizations(
  pages: { slug: string; title: string; impressions: number; clicks: number; position: number }[],
  gscQueries: { query: string; impressions: number; clicks: number; position: number }[]
): Promise<ArticleOptimization[]> {
  // 筛选高展示低CTR的文章
  const candidates = pages
    .filter(p => p.impressions >= 30 && (p.clicks / p.impressions) < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);

  if (candidates.length === 0) return [];

  const completion = await openai.chat.completions.create({
    model: 'qwen-plus-latest',
    messages: [
      {
        role: 'system',
        content: `You are an SEO specialist optimizing article metadata for BPCareAI (health website for adults 50+).

These articles have high Google impressions but very low click-through rates. Your job is to rewrite their titles and descriptions to match what users actually search for.

Rules:
- New title: 40-70 characters, contains the search terms users actually type
- New description: 120-160 characters, includes a specific number/data point, ends with action language
- New PK: what a real person types into Google, not academic language
- Always explain WHY the current title isn't working (cite specific search terms from GSC data)`,
      },
      {
        role: 'user',
        content: `High-impression low-CTR articles to optimize:

${JSON.stringify(candidates, null, 2)}

Related GSC search queries (what users are actually searching):
${JSON.stringify(gscQueries.slice(0, 30), null, 2)}

For each article, output a JSON array:
[
  {
    "slug": "article-slug",
    "currentTitle": "current title",
    "suggestedTitle": "new title matching user search terms (40-70 chars)",
    "suggestedDescription": "new description with data point (120-160 chars)",
    "suggestedPK": "natural search query as PK",
    "reason": "why current title doesn't work + which GSC queries it should match"
  }
]`,
      },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content || '';

  try {
    const match = content.match(/\[[\s\S]*\]/);
    return JSON.parse(match ? match[0] : content);
  } catch {
    return [];
  }
}

// ============================================================
// Perplexity接口 — 深挖内容缺口
// ============================================================

/**
 * 调用Perplexity API深挖某个内容方向的真实用户需求
 *
 * 使用场景：
 * 1. 每周分析发现内容缺口后，深挖用户真实搜索问题
 * 2. 选题生成前，获取真实搜索数据作为种子
 * 3. 紧急选题转化时，了解趋势背景
 */
export async function deepDiveWithPerplexity(
  direction: string
): Promise<{ questions: string[]; competitorInsights: string; suggestedTopics: string[] }> {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    console.warn('⚠️  Perplexity API key not set, skipping deep dive');
    return { questions: [], competitorInsights: '', suggestedTopics: [] };
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a health content researcher specializing in cardiovascular health for adults 50+. Search the web for real user questions and competitor content. Output valid JSON only.',
          },
          {
            role: 'user',
            content: `Research this health topic for adults aged 50 and above: "${direction}"

Find:
1. The top 10 questions real people ask about this topic on Google, Reddit, health forums, and Q&A sites
2. What the top-ranking health articles cover about this topic — key points that a new article should also address
3. 5 specific article topic suggestions that would fill gaps in existing online content about this topic for seniors

Output JSON only:
{
  "questions": ["question 1", "question 2", ...],
  "competitorInsights": "Summary of what top articles cover and what's missing",
  "suggestedTopics": ["topic suggestion 1", "topic suggestion 2", ...]
}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️  Perplexity API error: ${response.status} ${errorText.substring(0, 100)}`);
      return { questions: [], competitorInsights: '', suggestedTopics: [] };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      return {
        questions: parsed.questions || [],
        competitorInsights: parsed.competitorInsights || '',
        suggestedTopics: parsed.suggestedTopics || [],
      };
    } catch {
      // JSON解析失败，尝试从文本中提取有用信息
      return {
        questions: [],
        competitorInsights: content.substring(0, 500),
        suggestedTopics: [],
      };
    }
  } catch (err: any) {
    console.warn(`⚠️  Perplexity API call failed: ${err.message}`);
    return { questions: [], competitorInsights: '', suggestedTopics: [] };
  }
}
