# Article Reverse Evaluation Skill

**版本**: v2.1
**用途**: 对优化后的文章进行反向评估，验证是否符合标准
**使用者**: 质量检查、自动验证、人工抽查

---

## 🎯 核心职责

验证优化后的文章是否真正达到v2.1 + v1.0标准。

**关键原则**:
- 不信任优化者的自我评分
- 独立重新评分
- 使用相同的评分公式
- 发现任何不符合标准的问题

---

## 📋 评估标准来源

**唯一权威标准**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md` (v2.1)

---

## 🔍 完整评估流程

### 第1步: 读取优化结果

**必须获取**:

```json
{
  "optimized_metadata": {
    "primaryKeyword": "...",
    "slug": "...",
    "title": "...",
    "description": "..."
  },
  "metadata_scores": {
    "primaryKeyword": X,
    "primaryKeyword_breakdown": {...},
    ...
  },
  "optimized_content": {...},
  "content_scores": {...}
}
```

### 第2步: 独立评分 - Metadata

#### 2.1 PrimaryKeyword评分

**评分公式** (100分满分):
```
总分 = 长度分 + 搜索意图分 + 简洁性分 + 密度分
```

**详细评分**:

```javascript
// 1. 长度分 (25分满分)
function scorePKLength(pk) {
  const len = pk.length;
  if (len >= 30 && len <= 40) return 25;
  if (len >= 41 && len <= 45) return 22;
  if (len >= 25 && len <= 29) return 20;
  return 15;
}

// 2. 搜索意图分 (40分满分)
function scorePKSearchIntent(pk) {
  // 检查是否使用用户语言
  const medicalTerms = ['hypotension', 'myocardial', 'autonomic', 'transthyretin', 'amyloidosis'];
  const hasMedicalTerms = medicalTerms.some(term => pk.toLowerCase().includes(term));

  const userLanguage = ['blood pressure', 'heart', 'bp', 'drops', 'walking', 'after eating'];
  const hasUserLanguage = userLanguage.some(term => pk.toLowerCase().includes(term));

  if (hasUserLanguage && !hasMedicalTerms) return 40;
  if (hasUserLanguage && hasMedicalTerms) return 35;
  if (hasMedicalTerms) return 25;
  return 20;
}

// 3. 简洁性分 (20分满分)
function scorePKConciseness(pk) {
  const words = pk.split(' ').length;
  const unnecessaryWords = ['in', 'of', 'for', 'with', 'and', 'the', 'a'];
  const hasUnnecessary = unnecessaryWords.some(word => pk.toLowerCase().includes(` ${word} `));

  if (words <= 6 && !hasUnnecessary) return 20;
  if (words <= 7 && !hasUnnecessary) return 18;
  if (hasUnnecessary) return 15;
  return 10;
}

// 4. 密度分 (15分满分)
function scorePKDensity(pk) {
  const words = pk.split(' ');
  const totalWords = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;

  // 每个词都独特且必要
  if (uniqueWords === totalWords && totalWords <= 6) return 15;
  if (uniqueWords === totalWords) return 12;
  if (uniqueWords / totalWords > 0.8) return 10;
  return 8;
}

// 总分
const pkScore = scorePKLength(pk) + scorePKSearchIntent(pk) + scorePKConciseness(pk) + scorePKDensity(pk);
```

**验证优化者的评分**:

```javascript
// 检查优化者提供的评分是否正确
function verifyPKScore(providedScore, providedBreakdown, actualPK) {
  const myScore = {
    length: scorePKLength(actualPK),
    search_intent: scorePKSearchIntent(actualPK),
    conciseness: scorePKConciseness(actualPK),
    density: scorePKDensity(actualPK)
  };

  const myTotal = myScore.length + myScore.search_intent + myScore.conciseness + myScore.density;

  const issues = [];

  // 检查breakdown是否正确
  if (providedBreakdown.length !== myScore.length) {
    issues.push(`长度分不正确: 声称${providedBreakdown.length}, 实际应为${myScore.length}`);
  }
  if (providedBreakdown.search_intent !== myScore.search_intent) {
    issues.push(`搜索意图分不正确: 声称${providedBreakdown.search_intent}, 实际应为${myScore.search_intent}`);
  }
  // ... 其他维度

  // 检查总分
  const providedSum = Object.values(providedBreakdown).reduce((a, b) => a + b, 0);
  if (providedScore !== providedSum) {
    issues.push(`总分计算错误: breakdown总和${providedSum}, 但声称总分${providedScore}`);
  }
  if (providedScore !== myTotal) {
    issues.push(`总分不正确: 声称${providedScore}, 实际应为${myTotal}`);
  }

  return {
    pass: issues.length === 0,
    myScore: myTotal,
    myBreakdown: myScore,
    providedScore,
    providedBreakdown,
    issues
  };
}
```

#### 2.2 Slug评分

**评分公式** (100分满分):
```
总分 = 长度分 + 关键词整合分 + 可读性分 + SEO分
```

**详细评分**:

```javascript
// 1. 长度分 (30分满分)
function scoreSlugLength(slug) {
  const len = slug.length;
  if (len >= 30 && len <= 35) return 30;
  if (len >= 36 && len <= 40) return 28;
  if (len >= 25 && len <= 29) return 25;
  if (len > 40) return Math.max(0, 28 - (len - 40) * 2); // 每超1字符扣2分
  return 20;
}

// 2. 关键词整合分 (35分满分)
function scoreSlugKeyword(slug, primaryKeyword) {
  // 检查主关键词是否完整出现
  const pkWords = primaryKeyword.toLowerCase().split(' ');
  const slugWords = slug.toLowerCase().split('-');

  const allPKWordsInSlug = pkWords.every(pkWord =>
    slugWords.some(slugWord => slugWord.includes(pkWord) || pkWord.includes(slugWord))
  );

  // 检查关键词是否前置
  const firstThreeSlugWords = slugWords.slice(0, 3).join(' ');
  const firstPKWord = pkWords[0];
  const isKeywordFront = firstThreeSlugWords.includes(firstPKWord);

  if (allPKWordsInSlug && isKeywordFront) return 35;
  if (allPKWordsInSlug) return 30;
  return 25;
}

// 3. 可读性分 (20分满分)
function scoreSlugReadability(slug) {
  // 检查是否使用连字符
  const hasHyphens = slug.includes('-');
  if (!hasHyphens) return 5;

  // 检查是否全小写
  const isLowerCase = slug === slug.toLowerCase();
  if (!isLowerCase) return 10;

  // 检查单词数和可理解性
  const words = slug.split('-');
  const wordCount = words.length;

  // 理想4-6个单词
  if (wordCount >= 4 && wordCount <= 6) return 20;
  if (wordCount >= 3 && wordCount <= 7) return 18;
  return 15;
}

// 4. SEO分 (15分满分)
function scoreSlugSEO(slug) {
  let score = 15;

  // 检查是否有冠词和不必要的词
  const unnecessary = ['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at'];
  const words = slug.split('-');
  const hasUnnecessary = words.some(word => unnecessary.includes(word));

  if (hasUnnecessary) score -= 3;

  // 检查是否有数字、特殊字符
  if (/[^a-z0-9-]/.test(slug)) score -= 2;

  // 检查是否有连续连字符
  if (/--/.test(slug)) score -= 2;

  return Math.max(0, score);
}
```

#### 2.3 Title评分

**评分公式** (100分满分):
```
总分 = 长度分 + 情感吸引力分 + 价值清晰度分 + 受众识别分 + 关键词分
```

**详细评分**:

```javascript
// 1. 长度分 (15分满分)
function scoreTitleLength(title) {
  const len = title.length;
  if (len >= 50 && len <= 60) return 15;
  if (len >= 61 && len <= 65) return 12;
  if (len >= 45 && len <= 49) return 10;
  return 5;
}

// 2. 情感吸引力分 (30分满分)
function scoreTitleEmotional(title) {
  // 检查是否是疑问句
  const isQuestion = title.includes('?');

  // 检查是否有强动词
  const strongVerbs = ['crashing', 'dropping', 'skyrocketing', 'plummeting', 'soaring'];
  const hasStrongVerb = strongVerbs.some(verb => title.toLowerCase().includes(verb));

  // 检查是否有情感词
  const emotionalWords = ['dangerous', 'critical', 'urgent', 'alarming', 'warning'];
  const hasEmotional = emotionalWords.some(word => title.toLowerCase().includes(word));

  if (isQuestion && (hasStrongVerb || hasEmotional)) return 30;
  if (isQuestion || hasStrongVerb) return 25;
  if (hasEmotional) return 20;
  return 15;
}

// 3. 价值清晰度分 (25分满分)
function scoreTitleValue(title) {
  // 检查是否有可数价值
  const countableValueRegex = /\d+\s+(tips|steps|signs|ways|methods|strategies|warnings|foods|exercises)/i;
  const hasCountableValue = countableValueRegex.test(title);

  // 检查是否有价值词
  const valueWords = ['guide', 'how to', 'complete', 'ultimate', 'essential', 'proven'];
  const hasValueWord = valueWords.some(word => title.toLowerCase().includes(word));

  if (hasCountableValue) return 25;
  if (hasValueWord) return 20;
  return 15;
}

// 4. 受众识别分 (20分满分)
function scoreTitleAudience(title) {
  // 检查是否有精确年龄
  const ageRegex = /\b\d{2}\+|\bages?\s+\d{2}(-\d{2})?/i;
  const hasAge = ageRegex.test(title);

  // 检查是否有人群标识
  const audienceWords = ['women', 'men', 'adults', 'seniors', 'patients', 'caregivers'];
  const hasAudience = audienceWords.some(word => title.toLowerCase().includes(word));

  if (hasAge && hasAudience) return 20;
  if (hasAge || hasAudience) return 15;
  return 5;
}

// 5. 关键词分 (10分满分)
function scoreTitleKeyword(title, primaryKeyword) {
  const pkWords = primaryKeyword.toLowerCase().split(' ');
  const titleLower = title.toLowerCase();

  const matchCount = pkWords.filter(word => titleLower.includes(word)).length;
  const matchRate = matchCount / pkWords.length;

  if (matchRate >= 0.8) return 10;
  if (matchRate >= 0.6) return 8;
  if (matchRate >= 0.4) return 6;
  return 3;
}
```

#### 2.4 Description评分 (v2.1 包含GEO)

**评分公式** (115分满分，归一化到100):
```
总分 = 长度分 + 开场分 + 价值分 + 受众分 + CTA分 + 语义完整性分 + 问答一致性分
归一化 = (总分 / 115) × 100
```

**详细评分**:

```javascript
// 1. 长度分 (10分满分)
function scoreDescLength(desc) {
  const len = desc.length;
  if (len >= 130 && len <= 145) return 10;
  if (len >= 146 && len <= 150) return 9;
  if (len >= 120 && len <= 129) return 7;
  return 5;
}

// 2. 强有力开场分 (25分满分)
function scoreDescOpening(desc) {
  // 检查是否以疑问句开场
  const firstSentence = desc.split(/[.!?]/)[0];
  const isQuestion = firstSentence.includes('?');

  // 检查是否有强动词
  const strongVerbs = ['discover', 'learn', 'get', 'stop', 'prevent', 'avoid'];
  const hasStrongVerb = strongVerbs.some(verb => desc.toLowerCase().startsWith(verb));

  if (isQuestion) return 25;
  if (hasStrongVerb) return 20;
  return 15;
}

// 3. 具体价值分 (30分满分)
function scoreDescValue(desc) {
  // 计算可数价值数量
  const countableValueRegex = /\d+\s+(tips|steps|signs|ways|methods|strategies|warnings|foods)/gi;
  const matches = desc.match(countableValueRegex) || [];

  if (matches.length >= 2) return 30;
  if (matches.length === 1) return 25;

  // 检查是否有暗示价值
  const valueWords = ['guide', 'how', 'ways', 'methods'];
  const hasValue = valueWords.some(word => desc.toLowerCase().includes(word));

  if (hasValue) return 20;
  return 10;
}

// 4. 受众分 (15分满分)
function scoreDescAudience(desc) {
  const ageRegex = /\b\d{2}\+|\bages?\s+\d{2}(-\d{2})?/i;
  const hasAge = ageRegex.test(desc);

  const audienceWords = ['women', 'men', 'adults', 'seniors', 'patients'];
  const hasAudience = audienceWords.some(word => desc.toLowerCase().includes(word));

  if (hasAge) return 15;
  if (hasAudience) return 10;
  return 3;
}

// 5. CTA分 (15分满分)
function scoreDescCTA(desc) {
  const strongCTA = ['discover', 'learn', 'get', 'find out'];
  const weakCTA = ['see', 'read', 'check', 'explore'];

  const hasStrongCTA = strongCTA.some(cta => desc.toLowerCase().includes(cta));
  const hasWeakCTA = weakCTA.some(cta => desc.toLowerCase().includes(cta));

  if (hasStrongCTA) return 15;
  if (hasWeakCTA) return 10;
  return 3;
}

// 6. 语义完整性分 (8分满分) - v2.1新增
function scoreDescSemantic(desc, title) {
  const titleWords = title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const descLower = desc.toLowerCase();

  // 核心词必须出现
  const coreWords = titleWords.filter(word => word.length > 4); // 忽略短词
  const coreMatches = coreWords.filter(word => descLower.includes(word)).length;

  // 相关词 (LSI keywords, synonyms)
  const relatedWords = ['dangerous', 'risky', 'warning', 'monitor', 'track', 'measure', 'check'];
  const relatedMatches = relatedWords.filter(word => descLower.includes(word)).length;

  // 实体 (疾病、年龄、症状等)
  const entities = /\b(amyloid|diabetes|hypertension|\d{2}\+|adults|seniors)\b/gi;
  const entityMatches = (desc.match(entities) || []).length;

  if (coreMatches >= 2 && relatedMatches >= 2 && entityMatches >= 2) return 8;
  if (coreMatches >= 2 && (relatedMatches >= 1 || entityMatches >= 1)) return 6;
  if (coreMatches >= 1) return 4;
  return 2;
}

// 7. 问答一致性分 (7分满分) - v2.1新增
function scoreDescQA(desc, title) {
  const titleIsQuestion = title.includes('?');
  if (!titleIsQuestion) return 2; // Title不是疑问句，无法一致

  // Description是否echo了问题
  const questionWords = ['how', 'why', 'what', 'when', 'where', 'who', 'can', 'should', 'do', 'does', 'is', 'are'];
  const titleQuestionWord = questionWords.find(qw => title.toLowerCase().includes(qw));
  const descEchoes = desc.toLowerCase().includes(titleQuestionWord || '');

  if (!descEchoes) return 3; // Description没有echo问题

  // Description是否直接回答
  const answerPatterns = [
    /yes|no/i,
    /because|due to|caused by/i,
    /learn|discover|find out/i,
    /\d+\s+(signs|steps|tips|ways)/i
  ];

  const hasAnswer = answerPatterns.some(pattern => pattern.test(desc));

  if (hasAnswer) return 7;
  return 5;
}

// 总分 (归一化)
function scoreDescription(desc, title) {
  const rawScore =
    scoreDescLength(desc) +
    scoreDescOpening(desc) +
    scoreDescValue(desc) +
    scoreDescAudience(desc) +
    scoreDescCTA(desc) +
    scoreDescSemantic(desc, title) +
    scoreDescQA(desc, title);

  // 归一化到100
  return Math.round((rawScore / 115) * 100);
}
```

### 第3步: 独立评分 - Content

Content评分更加主观，但仍有明确标准：

#### 3.1 H1优化 (20分满分)

```javascript
function scoreH1(h1, primaryKeyword) {
  let score = 0;

  // 长度 (5分)
  const len = h1.length;
  if (len >= 80 && len <= 100) score += 5;
  else if (len >= 70 && len <= 110) score += 3;
  else score += 1;

  // 格式 (5分)
  if (h1.includes('?')) score += 5; // 疑问句
  else if (/how|why|what|when/i.test(h1)) score += 3;
  else score += 1;

  // 关键词 (5分)
  const pkWords = primaryKeyword.toLowerCase().split(' ');
  const h1Lower = h1.toLowerCase();
  const matchRate = pkWords.filter(w => h1Lower.includes(w)).length / pkWords.length;
  if (matchRate >= 0.8) score += 5;
  else if (matchRate >= 0.6) score += 3;
  else score += 1;

  // 移动端友好 (5分)
  if (len <= 100) score += 5;
  else if (len <= 120) score += 3;
  else score += 1;

  return Math.min(20, score);
}
```

#### 3.2 内容结构 (20分满分)

```javascript
function scoreContentStructure(content) {
  let score = 0;

  // 是否有"本文将学到"导航 (5分)
  if (/本文将学到|you will learn|in this article/i.test(content)) score += 5;

  // 危险信号是否前置 (5分)
  const firstSection = content.substring(0, 1000); // 前1000字符
  if (/⚠️|warning|危险|when to (call|contact|see)/i.test(firstSection)) score += 5;

  // 是否有编号步骤 (5分)
  if (/[1-7]️⃣|step \d|^\d+\./gm.test(content)) score += 5;

  // 是否有emoji导航 (5分)
  if (/[🎯⚠️✅❓📊]/u.test(content)) score += 5;

  return Math.min(20, score);
}
```

#### 3.3 FAQ优化 (25分满分)

```javascript
function scoreFAQ(content) {
  // 提取FAQ部分
  const faqSection = content.match(/###?\s*FAQ([\s\S]*?)(?=###|$)/i);
  if (!faqSection) return 5; // 没有FAQ

  const faqContent = faqSection[1];

  let score = 5; // 有FAQ基础分

  // FAQ数量 (5分)
  const faqCount = (faqContent.match(/####/g) || []).length;
  if (faqCount >= 5) score += 5;
  else if (faqCount >= 3) score += 3;
  else score += 1;

  // 真实用户声音 (10分)
  const hasUserVoice = /I'm \d{2}|I am \d{2}|my (bp|blood pressure|heart)/i.test(faqContent);
  if (hasUserVoice) score += 10;
  else if (/can I|should I|how do I/i.test(faqContent)) score += 6;
  else score += 2;

  // 具体数字 (5分)
  const numberCount = (faqContent.match(/\d+\s+(mm Hg|mg\/dL|%|minutes|hours|days)/gi) || []).length;
  if (numberCount >= 5) score += 5;
  else if (numberCount >= 2) score += 3;
  else score += 1;

  return Math.min(25, score);
}
```

#### 3.4 语言简化 (15分满分)

```javascript
function scoreLanguageSimplification(content) {
  let score = 0;

  // 医学术语密度 (5分)
  const medicalTerms = [
    'hypotension', 'hypertension', 'myocardial', 'autonomic',
    'transthyretin', 'amyloidosis', 'neuropathy', 'compliance'
  ];

  const totalWords = content.split(/\s+/).length;
  const medicalTermCount = medicalTerms.reduce((count, term) => {
    return count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
  }, 0);

  const density = medicalTermCount / totalWords;

  if (density < 0.01) score += 5; // <1%
  else if (density < 0.02) score += 3; // 1-2%
  else score += 1;

  // 是否有类比 (5分)
  const hasAnalogy = /like (a|an)|similar to|imagine|think of .* as/i.test(content);
  if (hasAnalogy) score += 5;
  else score += 1;

  // 平均句子长度 (5分)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;

  if (avgSentenceLength < 20) score += 5;
  else if (avgSentenceLength < 25) score += 3;
  else score += 1;

  return Math.min(15, score);
}
```

#### 3.5 事实密度 (10分满分)

```javascript
function scoreFactDensity(content) {
  // 具体数字数量
  const numberCount = (content.match(/\d+(\.\d+)?\s*(mm Hg|mg\/dL|%|minutes|hours|days|years|months|weeks)/gi) || []).length;

  if (numberCount >= 10) return 10;
  if (numberCount >= 7) return 9;
  if (numberCount >= 5) return 8;
  if (numberCount >= 3) return 6;
  return 4;
}
```

#### 3.6 可操作性 (10分满分)

```javascript
function scoreActionability(content) {
  let score = 0;

  // 是否有"今日可执行"清单 (4分)
  if (/今日可执行|today|start today/i.test(content)) score += 4;

  // 是否有编号步骤 (3分)
  if (/[1-7]️⃣.*\n.*[1-7]️⃣/s.test(content)) score += 3;

  // 是否有"今日第一步" (3分)
  if (/今日第一步|first step|start with/i.test(content)) score += 3;

  return Math.min(10, score);
}
```

### 第4步: 对比验证

```javascript
function verifyOptimization(optimizationResult) {
  const {
    optimized_metadata,
    metadata_scores: providedScores,
    optimized_content,
    content_scores: providedContentScores
  } = optimizationResult;

  const issues = [];
  const warnings = [];

  // Metadata验证
  const myMetadataScores = {
    primaryKeyword: scorePrimaryKeyword(optimized_metadata.primaryKeyword),
    slug: scoreSlug(optimized_metadata.slug, optimized_metadata.primaryKeyword),
    title: scoreTitle(optimized_metadata.title, optimized_metadata.primaryKeyword),
    description: scoreDescription(optimized_metadata.description, optimized_metadata.title)
  };

  // 检查每个字段
  for (const field of ['primaryKeyword', 'slug', 'title', 'description']) {
    const myScore = myMetadataScores[field];
    const providedScore = providedScores[field];
    const diff = Math.abs(myScore - providedScore);

    if (diff > 5) {
      issues.push({
        field,
        type: 'score_mismatch',
        myScore,
        providedScore,
        diff,
        severity: diff > 10 ? 'high' : 'medium'
      });
    }

    if (myScore < 85) {
      issues.push({
        field,
        type: 'below_threshold',
        score: myScore,
        threshold: 85,
        severity: 'high'
      });
    } else if (myScore < 90) {
      warnings.push({
        field,
        type: 'low_score',
        score: myScore,
        message: '分数偏低，建议进一步优化'
      });
    }
  }

  // Content验证
  const myContentScores = {
    h1_optimization: scoreH1(optimized_content.h1, optimized_metadata.primaryKeyword),
    content_structure: scoreContentStructure(optimized_content.body),
    faq_optimization: scoreFAQ(optimized_content.body),
    language_simplification: scoreLanguageSimplification(optimized_content.body),
    fact_density: scoreFactDensity(optimized_content.body),
    user_value: scoreActionability(optimized_content.body)
  };

  const myContentTotal = Object.values(myContentScores).reduce((a, b) => a + b, 0);
  const providedContentTotal = providedContentScores.overall_content;

  if (Math.abs(myContentTotal - providedContentTotal) > 5) {
    issues.push({
      field: 'content_overall',
      type: 'score_mismatch',
      myScore: myContentTotal,
      providedScore: providedContentTotal,
      diff: Math.abs(myContentTotal - providedContentTotal),
      severity: 'medium'
    });
  }

  // 生成评估报告
  return {
    pass: issues.filter(i => i.severity === 'high').length === 0,
    score: issues.length === 0 ? 'A+' : issues.filter(i => i.severity === 'high').length > 0 ? 'C' : 'B',
    myScores: {
      metadata: myMetadataScores,
      content: myContentScores
    },
    providedScores: {
      metadata: providedScores,
      content: providedContentScores
    },
    issues,
    warnings,
    recommendation: issues.length === 0
      ? '优化质量优秀，符合所有标准'
      : '发现问题，需要重新优化'
  };
}
```

### 第5步: 生成评估报告

```json
{
  "evaluation_date": "2026-03-18",
  "article_slug": "bp-drops-walking-heart-amyloid-74",
  "pass": true,
  "overall_score": "A+",

  "metadata_evaluation": {
    "primaryKeyword": {
      "provided_score": 94,
      "my_score": 94,
      "difference": 0,
      "pass": true,
      "breakdown_correct": true
    },
    "slug": {
      "provided_score": 100,
      "my_score": 100,
      "difference": 0,
      "pass": true,
      "breakdown_correct": true
    },
    "title": {
      "provided_score": 94,
      "my_score": 92,
      "difference": 2,
      "pass": true,
      "note": "轻微差异，可接受"
    },
    "description": {
      "provided_score": 100,
      "my_score": 100,
      "difference": 0,
      "pass": true,
      "breakdown_correct": true
    }
  },

  "content_evaluation": {
    "h1_optimization": {
      "provided_score": 20,
      "my_score": 20,
      "pass": true
    },
    "content_structure": {
      "provided_score": 19,
      "my_score": 19,
      "pass": true
    },
    "faq_optimization": {
      "provided_score": 23,
      "my_score": 23,
      "pass": true
    },
    "language_simplification": {
      "provided_score": 14,
      "my_score": 14,
      "pass": true
    },
    "fact_density": {
      "provided_score": 9.5,
      "my_score": 9,
      "difference": 0.5,
      "pass": true
    },
    "user_value": {
      "provided_score": 10,
      "my_score": 10,
      "pass": true
    }
  },

  "issues": [],
  "warnings": [],

  "recommendation": "✅ 优化质量优秀，符合v2.1 + v1.0标准，建议发布",

  "quality_grade": {
    "metadata": "A+ (97/100)",
    "content": "A+ (95.5/100)",
    "overall": "A+ (96.25/100)"
  }
}
```

---

## 🚨 常见问题识别

### 问题1: 评分计算错误

```javascript
// 检测: breakdown总和 ≠ 总分
if (providedScore !== Object.values(providedBreakdown).reduce((a, b) => a + b, 0)) {
  return {
    issue: 'calculation_error',
    message: 'Breakdown总和与总分不一致',
    severity: 'high'
  };
}
```

### 问题2: 字段低于阈值

```javascript
// 检测: 任何字段 < 85分
if (score < 85) {
  return {
    issue: 'below_threshold',
    field,
    score,
    threshold: 85,
    severity: 'high',
    action: '必须重新优化'
  };
}
```

### 问题3: GEO元素缺失

```javascript
// 检测: v2.1新增元素未评分
if (!providedBreakdown.semantic_completeness || !providedBreakdown.question_answer_consistency) {
  return {
    issue: 'missing_geo_elements',
    message: 'Description缺少v2.1 GEO元素评分',
    severity: 'high'
  };
}
```

### 问题4: 评分过于宽松

```javascript
// 检测: 我的评分远低于声称的评分
if (myScore < providedScore - 10) {
  return {
    issue: 'score_inflation',
    message: '评分可能过于宽松',
    myScore,
    providedScore,
    diff: providedScore - myScore,
    severity: 'medium',
    action: '需要重新审查'
  };
}
```

---

## 📊 批量评估

当评估多篇文章时:

```javascript
async function batchEvaluate(optimizationResults) {
  const evaluations = [];

  for (const result of optimizationResults) {
    const evaluation = await verifyOptimization(result);
    evaluations.push({
      slug: result.optimized_slug,
      ...evaluation
    });
  }

  // 生成批量报告
  const summary = {
    total: evaluations.length,
    passed: evaluations.filter(e => e.pass).length,
    failed: evaluations.filter(e => !e.pass).length,
    pass_rate: evaluations.filter(e => e.pass).length / evaluations.length,
    average_metadata_score: evaluations.reduce((sum, e) =>
      sum + Object.values(e.myScores.metadata).reduce((a, b) => a + b, 0) / 4, 0
    ) / evaluations.length,
    average_content_score: evaluations.reduce((sum, e) =>
      sum + Object.values(e.myScores.content).reduce((a, b) => a + b, 0), 0
    ) / evaluations.length,
    high_severity_issues: evaluations.reduce((sum, e) =>
      sum + e.issues.filter(i => i.severity === 'high').length, 0
    ),
    articles_needing_rework: evaluations.filter(e =>
      e.issues.some(i => i.severity === 'high')
    ).map(e => e.slug)
  };

  return {
    summary,
    evaluations
  };
}
```

---

## ✅ 质量保证流程

### 自动化验证

```
每篇优化文章都必须通过:
1. 评分计算正确性验证
2. 所有字段≥85分验证
3. GEO元素完整性验证
4. 评分公式使用正确性验证
```

### 抽查验证

```
每批次随机抽查10%:
1. 深度阅读内容
2. 人工判断质量
3. 对比自动评分
4. 识别系统性问题
```

### 问题处理

```
如果发现问题:
1. 记录问题类型和频率
2. 调整优化流程
3. 重新优化问题文章
4. 验证修复效果
```

---

## 📚 使用场景

### 场景1: 单篇文章质量检查

```javascript
// 读取优化结果
const result = require('./data/optimized-article-123.json');

// 执行评估
const evaluation = verifyOptimization(result);

// 查看报告
console.log(evaluation);

if (!evaluation.pass) {
  console.error('❌ 文章未通过质量检查');
  console.error('问题:', evaluation.issues);
}
```

### 场景2: 批量优化验证

```javascript
// 读取批次结果
const batchResults = require('./data/batch-optimization-1-10.json');

// 批量评估
const batchEval = await batchEvaluate(batchResults.optimized_articles);

// 生成报告
console.log(`通过率: ${batchEval.summary.pass_rate * 100}%`);
console.log(`需要返工: ${batchEval.summary.articles_needing_rework.length}篇`);

// 保存报告
fs.writeFileSync(
  './data/batch-evaluation-report-1-10.json',
  JSON.stringify(batchEval, null, 2)
);
```

### 场景3: 持续质量监控

```javascript
// 每次优化完成后自动验证
function optimizeWithValidation(article) {
  // 1. 优化
  const optimized = optimize(article);

  // 2. 验证
  const evaluation = verifyOptimization(optimized);

  // 3. 如果不通过，重新优化
  if (!evaluation.pass) {
    console.warn(`⚠️ ${article.slug} 未通过验证，重新优化...`);
    const issues = evaluation.issues.filter(i => i.severity === 'high');
    const reoptimized = optimize(article, { focusOn: issues.map(i => i.field) });
    return optimizeWithValidation(reoptimized); // 递归直到通过
  }

  return optimized;
}
```

---

**版本历史**:
- v2.1 (2026-03-18): 添加GEO元素验证 (语义完整性+问答一致性)
- v2.0 (2026-03-10): Content v1.0验证
- v1.0 (2026-03-01): 初始版本
