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
        content: `You are a senior SEO/GEO strategist analyzing Google Search Console data for BPCareAI, a health website for adults 35+.

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
        content: `You are a health content planner for BPCareAI (adults 35+ cardiovascular health).
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
        content: `You are an SEO specialist optimizing article metadata for BPCareAI (health website for adults 35+).

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
// Perplexity — 发现用户真实搜索问题
// ============================================================

/**
 * Perplexity搜索结果
 */
export interface PerplexityInsight {
  questions: string[];           // 用户真实搜索问题（核心）
  competitorCoverage: string;    // 排名靠前的文章都覆盖了什么（用于确保内容完整性）
  whyItMatters: string;          // 这个方向为什么重要/为什么现在火（用于判断优先级）
}

/**
 * 调用Perplexity获取某个关键词方向的：
 * 1. 用户真实搜索问题（核心，直接变选题）
 * 2. 竞品内容覆盖要点（确保我们的文章不遗漏关键内容）
 * 3. 方向重要性判断（帮助决定投入优先级）
 *
 * 一次调用获取全部信息，成本不增加
 */
export async function discoverUserQuestions(
  keyword: string,
  existingTopics: string[] = []
): Promise<PerplexityInsight> {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    console.warn('⚠️  PERPLEXITY_API_KEY not set');
    return { questions: [], competitorCoverage: '', whyItMatters: '' };
  }

  const existingContext = existingTopics.length > 0
    ? `\n\nWe already have articles about:\n${existingTopics.slice(0, 20).map(t => `- ${t}`).join('\n')}\n\nDo NOT repeat these topics. Focus on questions and angles we haven't covered.`
    : '';

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
            content: 'You are a health content researcher. Search the real web and return structured findings. Output valid JSON only.',
          },
          {
            role: 'user',
            content: `Research what adults (age 35+) are searching about "${keyword}" on the web right now.

Find these 3 things:

1. QUESTIONS (most important): The top 15 specific questions real people ask on Google, Reddit, health forums about "${keyword}". Include questions with specific numbers, ages, scenarios (e.g. "is 140/90 dangerous at 45"). Mix basic questions (newly concerned) and advanced questions (already managing).

2. COMPETITOR COVERAGE: In 2-3 sentences, what do the top-ranking Google articles about "${keyword}" for adults all cover? What key points must a new article include to compete?

3. WHY IT MATTERS: In 1-2 sentences, why is this topic trending or important right now? Any recent studies, guideline changes, or seasonal factors?
${existingContext}

Output JSON only:
{
  "questions": ["question 1", "question 2", ...15 questions],
  "competitorCoverage": "What top articles all cover...",
  "whyItMatters": "Why this matters now..."
}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️  Perplexity API error: ${response.status} ${errorText.substring(0, 100)}`);
      return { questions: [], competitorCoverage: '', whyItMatters: '' };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const empty: PerplexityInsight = { questions: [], competitorCoverage: '', whyItMatters: '' };

    try {
      const objMatch = content.match(/\{[\s\S]*\}/);
      if (objMatch) {
        const parsed = JSON.parse(objMatch[0]);
        return {
          questions: (parsed.questions || []).filter((q: any) => typeof q === 'string' && q.length > 10),
          competitorCoverage: parsed.competitorCoverage || '',
          whyItMatters: parsed.whyItMatters || '',
        };
      }
      // 降级：尝试提取数组
      const arrayMatch = content.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        return {
          questions: JSON.parse(arrayMatch[0]).filter((q: any) => typeof q === 'string' && q.length > 10),
          competitorCoverage: '',
          whyItMatters: '',
        };
      }
      return empty;
    } catch {
      return empty;
    }
  } catch (err: any) {
    console.warn(`⚠️  Perplexity call failed: ${err.message}`);
    return { questions: [], competitorCoverage: '', whyItMatters: '' };
  }
}
