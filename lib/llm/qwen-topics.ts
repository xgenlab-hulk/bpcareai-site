/**
 * 基于 Qwen Plus 的文章选题生成工具
 * v2.1: 用户友好的选题 + 严格格式验证
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
  existingPKs?: string[];        // 站内已有所有文章的PrimaryKeyword（用于更精准去重）
  alreadyPlannedTitles: string[];// 本次脚本中已入选的标题
  angles?: string[];             // 需要覆盖的子方向（从config读取）
  batchSize?: number;            // 每次期望生成的候选数量，默认 30
}

/**
 * 验证单个选题候选是否符合格式标准
 * 不合格的直接丢弃，不修复
 */
function validateTopicCandidate(candidate: GeneratedTopicCandidate): { valid: boolean; reason?: string } {
  // Title 检查
  if (!candidate.title || candidate.title.trim().length === 0) {
    return { valid: false, reason: 'empty title' };
  }
  if (candidate.title.length > 80) {
    return { valid: false, reason: `title too long: ${candidate.title.length} chars (max 80)` };
  }
  if (candidate.title.length < 20) {
    return { valid: false, reason: `title too short: ${candidate.title.length} chars (min 20)` };
  }

  // PrimaryKeyword 检查
  if (!candidate.primaryKeyword || candidate.primaryKeyword.trim().length === 0) {
    return { valid: false, reason: 'empty primaryKeyword' };
  }
  if (candidate.primaryKeyword.length > 65) {
    return { valid: false, reason: `PK too long: ${candidate.primaryKeyword.length} chars (max 65)` };
  }
  if (candidate.primaryKeyword.length < 12) {
    return { valid: false, reason: `PK too short: ${candidate.primaryKeyword.length} chars (min 12)` };
  }

  // PK 术语黑名单检查 — 普通用户不会搜这些
  const jargonBlacklist = [
    'endothelial', 'pathophysiology', 'nrf2', 'aquaporin', 'cotransporter',
    'brachial', 'aortic', 'tonometry', 'baroreflex', 'eNOS', 'RAAS',
    'aldosterone', 'angiotensin', 'sympathetic', 'parasympathetic',
    'catecholamine', 'mycobiome', 'postprandial', 'pseudonormalization',
    'euvolemic', 'tubular', 'natriuresis', 'coupling', 'redox',
  ];
  const pkLower = candidate.primaryKeyword.toLowerCase();
  for (const term of jargonBlacklist) {
    if (pkLower.includes(term.toLowerCase())) {
      return { valid: false, reason: `PK contains medical jargon: "${term}"` };
    }
  }

  // Description 检查
  if (!candidate.description || candidate.description.trim().length === 0) {
    return { valid: false, reason: 'empty description' };
  }
  if (candidate.description.length > 170) {
    return { valid: false, reason: `description too long: ${candidate.description.length} chars (max 170)` };
  }

  // TopicCluster 检查
  if (!candidate.topicCluster || candidate.topicCluster.trim().length === 0) {
    return { valid: false, reason: 'empty topicCluster' };
  }

  return { valid: true };
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
    existingPKs = [],
    alreadyPlannedTitles,
    angles = [],
    batchSize = 30,
  } = params;

  console.log(`\n🤖 Calling Qwen Plus to generate topics...`);
  console.log(`   Core keyword: "${coreKeyword}"`);
  console.log(`   Batch size: ${batchSize}`);
  console.log(`   Existing articles: ${existingTitles.length}`);
  console.log(`   Existing PKs: ${existingPKs.length}`);
  console.log(`   Already planned: ${alreadyPlannedTitles.length}`);
  if (angles.length > 0) {
    console.log(`   Required angles: ${angles.join(', ')}`);
  }

  const systemMessage = `You are a health content planner for BPCareAI, a website helping adults aged 50+ manage blood pressure, heart health, and diabetes.

Your job: generate article topic ideas that REAL PEOPLE would actually search for on Google.

Golden rule: Before writing any title or keyword, ask yourself — "Would my 65-year-old mother type this into Google?" If no, rewrite it simpler.

Your output must be:
- Written in plain, everyday English — NO medical jargon in titles or keywords
- Focused on practical questions real patients have
- Optimized for Google search (long-tail, natural language queries)
- Diverse in format, angle, and audience segment
- DIFFERENT from the existing keywords and titles we already have`;

  // 传PK列表（比title短，能传更多）用于更精准避重
  const existingPKsSummary = existingPKs.length > 0
    ? `\nExisting primary keywords on our site (DO NOT duplicate these search queries):\n${existingPKs.slice(0, 200).map(pk => `- ${pk}`).join('\n')}${existingPKs.length > 200 ? `\n... and ${existingPKs.length - 200} more keywords` : ''}`
    : '';

  const existingTitlesSummary = existingTitles.length > 0
    ? `\nSample existing titles (avoid similar topics):\n${existingTitles.slice(0, 50).map(t => `- ${t}`).join('\n')}${existingTitles.length > 50 ? `\n... and ${existingTitles.length - 50} more articles` : ''}`
    : '';

  const plannedTitlesSummary = alreadyPlannedTitles.length > 0
    ? `\nAlready planned titles (must be different):\n${alreadyPlannedTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const anglesSection = angles.length > 0
    ? `\n\n🎯 REQUIRED CONTENT ANGLES — you MUST cover at least ${Math.min(angles.length, Math.ceil(batchSize / 3))} of these:\n${angles.map(a => `- ${a}`).join('\n')}\nDistribute topics evenly across these angles. Do NOT generate all topics from the same angle.`
    : '';

  const userMessage = `Generate ${batchSize} article topic ideas for: "${coreKeyword}"
${existingPKsSummary}
${existingTitlesSummary}
${plannedTitlesSummary}
${anglesSection}

══════════════════════════════════════════
STRICT FORMAT REQUIREMENTS (will be auto-validated — non-compliant items get discarded)
══════════════════════════════════════════

**primaryKeyword** — THE MOST IMPORTANT FIELD:
- 12-60 characters, 3-8 words
- Must sound like what a real person types into Google
- NO medical jargon: no "endothelial", "pathophysiology", "baroreflex", "postprandial", etc.
- GOOD: "foods that lower blood pressure naturally", "is 150 90 blood pressure dangerous", "best exercises for heart health after 60"
- BAD: "endothelial dysfunction management", "RAAS system modulation", "nrf2 pathway activation"

**title**:
- 20-80 characters (STRICT — longer will be discarded)
- Must contain the primaryKeyword or its core 2-3 word variant
- Written for humans, not doctors

**description**:
- 100-170 characters
- Contains 1 specific number/data point
- Ends with action-oriented language ("learn how", "find out", "discover")

**topicCluster**:
- Descriptive kebab-case, e.g. "diet-blood-pressure", "exercise-heart-health"

══════════════════════════════════════════
DIVERSITY — vary across these dimensions
══════════════════════════════════════════

TITLE FORMATS (use at least 8 different ones):
- "X Foods/Ways/Tips That..." (list format)
- "How to [action] [condition]" (how-to)
- "Does [X] Really [Y]?" (question)
- "Why [X] Happens After [age]" (explanation)
- "[X] vs [Y]: Which Is Better for..." (comparison)
- "Warning Signs of [X] You Shouldn't Ignore" (alert)
- "The Truth About [X] and [Y]" (myth-busting)
- "Best [X] for [audience]" (recommendation)
- "What to Do When [situation]" (problem-solving)
- "Can [X] Help With [Y]?" (exploratory)
- "[X] at Night/Morning/Winter" (time/season specific)

CONTENT ANGLES (cover at least 8):
- Diet & specific foods
- Exercise & activity
- Symptoms & warning signs
- Medication questions
- Home monitoring tips
- Sleep & stress
- Seasonal/weather factors
- Age-specific concerns
- Gender-specific topics
- Newly diagnosed vs long-term
- Travel/lifestyle situations
- Family history concerns

AUDIENCE (mix these):
- Age 50s, 60s, 70s, 80+
- Men vs women
- Newly diagnosed vs experienced
- Active vs sedentary

══════════════════════════════════════════
OUTPUT (JSON only, no explanation)
══════════════════════════════════════════
[
  {
    "title": "Short, clear title (20-80 chars)",
    "description": "100-170 char description with a data point. Action ending.",
    "primaryKeyword": "natural search query 3-8 words no jargon",
    "topicCluster": "specific-kebab-case-cluster"
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'qwen-plus-latest',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.85,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Qwen Plus');
    }

    console.log(`   ✅ Received response from Qwen Plus`);

    // 解析 JSON
    let candidates: GeneratedTopicCandidate[];

    try {
      candidates = JSON.parse(content);
    } catch {
      console.warn('   ⚠️  Direct JSON parse failed, attempting to extract array...');
      const match = content.match(/\[[\s\S]*\]/);
      if (!match) {
        throw new Error(`Failed to parse JSON response. Content preview:\n${content.substring(0, 200)}...`);
      }
      candidates = JSON.parse(match[0]);
    }

    // 严格格式验证 — 不合格直接丢弃
    const validCandidates: GeneratedTopicCandidate[] = [];
    let rejectedCount = 0;

    for (const candidate of candidates) {
      const check = validateTopicCandidate(candidate);
      if (check.valid) {
        validCandidates.push(candidate);
      } else {
        rejectedCount++;
        console.log(`   🚫 Rejected: "${(candidate.title || '').substring(0, 50)}..." — ${check.reason}`);
      }
    }

    console.log(`   📋 Raw: ${candidates.length} | Validated: ${validCandidates.length} | Rejected: ${rejectedCount}\n`);

    return validCandidates;
  } catch (error) {
    console.error('   ❌ Error generating topics:', error);
    throw error;
  }
}
