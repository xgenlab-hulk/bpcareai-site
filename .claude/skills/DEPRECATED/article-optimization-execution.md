# Article Optimization Execution Skill

**版本**: v2.1
**用途**: 执行单篇或批量文章优化的标准流程
**使用者**: Task工具调用此skill进行文章优化

---

## 🎯 核心职责

当你被要求优化文章时，必须严格按照本文档执行优化流程。

---

## 📋 优化标准来源

**唯一权威标准**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md` (v2.1)

你必须：
1. 首先读取主标准文档
2. 严格遵循所有评分公式
3. 确保所有字段≥85分
4. 使用标准中的评分计算器模板

**禁止**：
- ❌ 自行定义评分标准
- ❌ "差不多就行"的模糊标准
- ❌ 跳过任何评分维度
- ❌ 接受<85分的结果

---

## 🔄 完整优化流程

### 第1步: 读取原文章

```
必须获取的信息:
1. 原始metadata:
   - primaryKeyword
   - slug
   - title
   - description
   - date
   - topicCluster

2. 原始content:
   - H1标题
   - 正文内容
   - FAQ部分
   - 文章结构

工具: Read tool
```

### 第2步: Phase 1 - Metadata优化

按照严格顺序优化4个字段:

#### 2.1 PrimaryKeyword优化

**评分标准** (100分满分):
```
- 长度 (25分):
  * 30-40字符: 25分
  * 41-45字符: 22分
  * 25-29字符: 20分
  * <25或>45字符: 15分

- 搜索意图 (40分):
  * 完全匹配用户真实搜索语言: 40分
  * 使用医学术语而非日常用语: 25分
  * 过于学术或技术性: 20分

- 简洁性 (20分):
  * 无冗余词: 20分
  * 有少量冗余: 15分
  * 过多冗余: 10分

- 关键词密度 (15分):
  * 每个词都必要: 15分
  * 有1-2个可选词: 12分
  * 有3+个可选词: 8分
```

**优化原则**:
1. 使用用户日常语言 (而非医学术语)
2. 3-6个单词最佳
3. 每个词都必要且有搜索量
4. 前置最重要关键词

**示例**:
```
❌ "post-walk hypotension in cardiac amyloidosis" (医学术语)
✅ "blood pressure drops walking heart amyloid" (用户语言)

为什么好:
- 搜索量: "blood pressure drops" 1,800/月 vs "hypotension" 20/月
- 理解度: 74岁用户认知度 95% vs 15%
- 长度: 44字符 (22/25分)
- 搜索意图: 40/40分
```

#### 2.2 Slug优化

**评分标准** (100分满分):
```
- 长度 (30分):
  * 30-35字符: 30分
  * 36-40字符: 28分
  * 25-29字符: 25分
  * >40字符: 按超出字符扣分

- 关键词整合 (35分):
  * 主关键词完整出现且前置: 35分
  * 主关键词出现但未前置: 30分
  * 主关键词部分出现: 25分

- 可读性 (20分):
  * 清晰易懂，一眼看懂: 20分
  * 需要理解2秒: 15分
  * 需要理解>5秒: 10分

- SEO (15分):
  * 连字符分隔，全小写，无冗词: 15分
  * 有1-2个问题: 12分
  * 有3+个问题: 8分
```

**优化原则**:
1. 30-35字符最佳
2. 主关键词前置
3. 使用连字符 (-)
4. 全小写
5. 移除冠词 (a, the, and, of, in等)
6. 可以适当缩写 (bp = blood pressure)

**示例**:
```
❌ "why-your-blood-pressure-dips-too-much-after-walking-not-just-normal-recovery-in-adults-74-with-early-cardiac-amyloidosis"
   (121字符，太长)

✅ "bp-drops-walking-heart-amyloid-74"
   (33字符，完美)

为什么好:
- 长度: 33字符 (30/30分)
- 关键词前置: "bp-drops-walking" (35/35分)
- 可读性: 1秒理解 (20/20分)
- 移动端100%显示
```

#### 2.3 Title优化

**评分标准** (100分满分):
```
- 长度 (15分):
  * 50-60字符: 15分
  * 61-65字符: 12分
  * 45-49字符: 10分
  * <45或>65字符: 5分

- 情感吸引力 (30分):
  * 疑问句 + 强动词: 30分
  * 疑问句或强动词: 25分
  * 一般陈述句: 15分
  * 学术句式: 8分

- 价值清晰度 (25分):
  * 明确可数价值 ("3 tips", "5 steps"): 25分
  * 暗示价值 ("guide", "how to"): 20分
  * 模糊价值: 15分
  * 无价值承诺: 5分

- 受众识别 (20分):
  * 精确年龄/人群 ("adults 74+", "women 64+"): 20分
  * 模糊人群 ("seniors", "elderly"): 15分
  * 无受众识别: 5分

- 关键词 (10分):
  * 主关键词完整出现: 10分
  * 部分出现: 7分
  * 未出现: 3分
```

**优化原则**:
1. 50-60字符最佳
2. 优先使用疑问句 ("...?")
3. 包含可数价值 ("3 warning signs")
4. 明确受众 ("74+")
5. 强动词 ("Crashing", "Dropping")

**示例**:
```
❌ "Why Your Blood Pressure Dips *Too Much* After Walking — Not Just 'Normal Recovery' — In Adults 74+ With Early Cardiac Amyloidosis"
   (131字符，太长，过于学术)

✅ "Blood Pressure Dropping After Walks? (Heart Amyloid Guide 74+)"
   (63字符，疑问句，明确受众)

为什么好:
- 长度: 63字符 (12/15分)
- 情感: 疑问句 + "Dropping"强动词 (28/30分)
- 价值: "Guide"承诺 (24/25分)
- 受众: "74+"精确 (20/20分)
- 关键词: "Blood Pressure...Walks"出现 (10/10分)
- 总分: 94/100 ✅
```

#### 2.4 Description优化 (v2.1 包含GEO元素)

**评分标准** (115分满分，归一化到100):
```
- 长度 (10分):
  * 130-145字符: 10分
  * 146-150字符: 9分
  * 120-129字符: 7分
  * <120或>150字符: 5分

- 强有力开场 (25分):
  * 疑问句echo title: 25分
  * 强动词开场: 20分
  * 一般动词: 15分
  * 学术动词: 8分

- 具体价值 (30分):
  * 可数价值≥2个 ("3 signs", "5 steps"): 30分
  * 可数价值1个: 25分
  * 暗示价值: 20分
  * 模糊价值: 10分

- 受众 (15分):
  * 精确受众出现: 15分
  * 模糊受众: 10分
  * 无受众: 3分

- CTA (15分):
  * 强CTA ("Discover", "Learn"): 15分
  * 弱CTA ("Find out"): 10分
  * 无CTA: 3分

- 语义完整性 (8分) - v2.1新增:
  * Title核心词 + 2-3相关词 + 实体: 8分
  * Title核心词 + 1-2相关词: 6分
  * 仅Title核心词: 4分

- 问答一致性 (7分) - v2.1新增:
  * Title疑问句 + Description echo问题 + 直接回答: 7分
  * Title疑问句 + Description回答但未echo: 5分
  * 不一致: 2分
```

**优化原则**:
1. 130-145字符最佳
2. 疑问句开场 (echo Title)
3. 包含至少2个可数价值
4. 包含精确受众
5. 强CTA动词
6. GEO: 语义丰富 (相关词+实体)
7. GEO: 问答一致 (问题→回答)

**示例**:
```
❌ "Distinguishes pathological post-exercise hypotension due to impaired myocardial compliance and autonomic neuropathy from benign vasodilation in aging hearts."
   (158字符，太学术，无价值，无GEO)

✅ "Blood pressure crashing after walks? Learn why heart amyloid causes dangerous drops, 3 warning signs, and safe monitoring steps for adults 74+."
   (143字符，疑问句，可数价值，GEO优化)

为什么好:
- 长度: 143字符 (10/10分)
- 开场: 疑问句echo title (25/25分)
- 价值: "3 warning signs" + "safe monitoring steps" (30/30分)
- 受众: "adults 74+" (15/15分)
- CTA: "Learn" (15/15分)
- 语义: "crashing"+"dangerous drops"+"heart amyloid"+"monitoring" (8/8分)
- 问答: 完美一致 (7/7分)
- 总分: 110/115 → 归一化100/100 ✅
```

### 第3步: 自我评分

**必须**为每个字段提供详细评分breakdown:

```json
{
  "optimized_metadata": {
    "primaryKeyword": "blood pressure drops walking heart amyloid",
    "slug": "bp-drops-walking-heart-amyloid-74",
    "title": "Blood Pressure Dropping After Walks? (Heart Amyloid Guide 74+)",
    "description": "Blood pressure crashing after walks? Learn why heart amyloid causes dangerous drops, 3 warning signs, and safe monitoring steps for adults 74+."
  },
  "scores": {
    "primaryKeyword": 94,
    "primaryKeyword_breakdown": {
      "length": 22,
      "search_intent": 40,
      "conciseness": 20,
      "density": 12
    },
    "slug": 100,
    "slug_breakdown": {
      "length": 30,
      "keyword_integration": 35,
      "readability": 20,
      "seo": 15
    },
    "title": 94,
    "title_breakdown": {
      "length": 12,
      "emotional_appeal": 28,
      "value_clarity": 24,
      "audience_id": 20,
      "keyword": 10
    },
    "description": 100,
    "description_breakdown": {
      "length": 10,
      "strong_opening": 25,
      "specific_value": 30,
      "audience": 15,
      "cta": 15,
      "semantic_completeness": 8,
      "question_answer_consistency": 7
    },
    "overall_metadata": 97
  },
  "meets_standard": true
}
```

### 第4步: 验证

**自我验证清单**:

```
[ ] PrimaryKeyword ≥85分?
[ ] Slug ≥85分?
[ ] Title ≥85分?
[ ] Description ≥85分?
[ ] 评分breakdown总和 = 总分?
[ ] 所有评分公式正确使用?
```

**如果任何字段<85分**:
1. 分析扣分原因
2. 重新优化该字段
3. 再次评分
4. 重复直到≥85分

**绝对不要**返回不达标的结果！

### 第5步: Phase 2 - Content优化 (v1.0 Soft Standard)

Content优化基于6个维度:

#### 5.1 H1优化 (20分满分)

**要求**:
- 长度: 80-100字符
- 格式: 疑问句优先
- 包含主关键词
- 移动端完整显示

**示例**:
```
❌ "Understanding Post-Walk Hypotension in Cardiac Amyloidosis: When Blood Pressure Drops Too Far After Gentle Exercise in Adults 74+"
   (146字符)

✅ "Blood Pressure Crashing After Walks? What Heart Amyloid Patients 74+ Need to Know"
   (91字符)
```

#### 5.2 内容结构 (20分满分)

**要求**:
- 添加"本文将学到"导航 (6点列表)
- 危险信号前置 (前200词内)
- 所有步骤编号化 (1️⃣ 2️⃣ 3️⃣)
- 段落分块 (每段<200词)
- 使用emoji视觉导航 (🎯 ⚠️ ✅ ❓)

**模板**:
```markdown
## 📋 本文将学到:

✅ 为什么心脏淀粉样变会导致危险性血压下降
✅ 如何在家中正确测量步行后血压(7步详细指南)
✅ 3个警告信号(需要立即联系医生)
✅ 7个今日可执行的安全策略
✅ 压缩袜、饮水、餐后时机等具体建议
✅ 5个真实用户问题的医学准确回答

## ⚠️ 何时立即联系医生:

- 收缩压降至<90 mm Hg
- 昏厥或接近昏厥
- 新的呼吸困难
- 脚踝肿胀或3天内体重增加>4磅
```

#### 5.3 FAQ优化 (25分满分) - GEO关键维度

**要求**:
- 5个FAQ
- 真实用户声音 ("I'm 76. My BP dropped to 95...")
- 先结论后解释
- 包含具体数字
- Featured Snippet格式 (40-60词主回答)

**模板**:
```markdown
#### I'm 76. How much should my blood pressure drop after a short walk?

**Safe range:** 5-10 mm Hg drop within 1-2 minutes, then returns to baseline.

**Warning zone:** 20+ mm Hg drop at 3 minutes post-walk, especially if:
- Systolic falls below 105 mm Hg
- You feel dizzy or lightheaded
- It takes >10 minutes to recover

**Why this matters in heart amyloid:** Your stiff heart can't pump extra blood during activity, and your nervous system can't quickly tighten blood vessels afterward. This "double problem" causes bigger, longer drops than normal aging.

**What to do:** Measure your BP at 1, 3, and 10 minutes after walking. If you consistently see 20+ mm Hg drops, bring this data to your cardiologist.
```

#### 5.4 语言简化 (15分满分)

**要求**:
- 所有医学术语都有类比
- 平均句子长度<20词
- 阅读水平: 8年级
- 74岁用户理解度>85%

**术语简化映射**:
```
myocardial compliance → heart stiffness (水气球类比)
autonomic neuropathy → nerve signaling problems
transthyretin → protein buildup
stroke volume → blood pumped per beat
cardiac output → total blood flow from heart
```

#### 5.5 事实密度 (10分满分)

**要求**:
- 包含10+具体数字
- 提供对比数据 (正常 vs 心脏淀粉样变)
- 时间线明确
- 可执行阈值

**示例**:
```
✅ 好的具体数字:
- "20+ mm Hg drop" (诊断阈值)
- "3 minutes post-walk" (测量时点)
- "74岁用户认知度95%" (数据)
- "压缩袜20-30 mm Hg" (产品规格)

✅ 好的对比:
| 指标 | 正常老化 | 心脏淀粉样变 |
|------|---------|-------------|
| 降幅 | 5-10 mm Hg | 25-40 mm Hg |
| 恢复 | 1-2分钟 | 5-15分钟 |
```

#### 5.6 可操作性 (10分满分)

**要求**:
- "今日可执行7步"清单
- "读完本文的今日第一步"
- 30天进度跟踪
- 真实情境应对 (3个情境)

**模板**:
```markdown
## ✅ 今日可执行的7个安全步骤

**立即开始** (读完本文后30分钟内):

1️⃣ **测量你的步行后血压** (今天就试)
   - 静坐5分钟，测基线血压
   - 步行3-4分钟
   - 在1、3、10分钟时测量
   - 记录数字和任何症状

2️⃣ **准备血压日志**
   - 下载: BPCare AI App或用纸笔
   - 列出栏目: 日期/时间/步行前BP/1分钟后/3分钟后/症状
   - 目标: 连续7天记录

[继续3-7步...]

## 🎯 读完本文，你的今日第一步

**选择以下之一** (根据你的当前情况):

### 如果你已经有血压计:
👉 **今天就测量一次步行后血压**
   - 时间: 今天下午或明天早上
   - 只需: 6分钟步行 + 3次测量
   - 记录在纸上或手机备忘录

[其他选项...]
```

### 第6步: Content自我评分

```json
{
  "content_scores": {
    "h1_optimization": 20,
    "content_structure": 19,
    "faq_optimization": 23,
    "language_simplification": 14,
    "fact_density": 9.5,
    "user_value": 10,
    "overall_content": 95.5
  }
}
```

### 第7步: 最终输出

**必须返回的JSON格式**:

```json
{
  "article_number": 8,
  "original_slug": "why-your-blood-pressure-dips-too-much-after-walking...",
  "optimized_metadata": {
    "primaryKeyword": "...",
    "slug": "...",
    "title": "...",
    "description": "..."
  },
  "metadata_scores": {
    "primaryKeyword": 94,
    "primaryKeyword_breakdown": {...},
    "slug": 100,
    "slug_breakdown": {...},
    "title": 94,
    "title_breakdown": {...},
    "description": 100,
    "description_breakdown": {...},
    "overall_metadata": 97
  },
  "optimized_content": {
    "h1": "...",
    "body": "... (完整markdown内容) ...",
    "faq": [...]
  },
  "content_scores": {
    "h1_optimization": 20,
    "content_structure": 19,
    "faq_optimization": 23,
    "language_simplification": 14,
    "fact_density": 9.5,
    "user_value": 10,
    "overall_content": 95.5
  },
  "key_improvements": [
    "具体改进点1",
    "具体改进点2",
    ...
  ],
  "meets_v2.1_standard": true
}
```

---

## 🚫 常见错误和避免方法

### 错误1: 评分不一致

```
❌ 错误:
"slug_breakdown": {
  "length": 28,
  "keyword_integration": 35,
  "readability": 20,
  "seo": 15
}
"slug": 95  // 但 28+35+20+15 = 98

✅ 正确:
"slug": 98  // 必须等于breakdown总和
```

### 错误2: 接受<85分的结果

```
❌ 错误:
返回 "title": 78分的结果

✅ 正确:
识别到78分 → 分析扣分原因 → 重新优化 → 再次评分 → 直到≥85分
```

### 错误3: 使用模糊描述

```
❌ 错误:
"key_improvements": ["提升了SEO", "改善了用户体验"]

✅ 正确:
"key_improvements": [
  "Slug从121字符缩短到33字符 (-73%)",
  "Title改用疑问句格式，情感吸引力+6分",
  "Description添加2个可数价值 ('3 warning signs', 'safe steps')"
]
```

### 错误4: 忘记GEO元素

```
❌ 错误:
Description只优化传统SEO维度，忘记v2.1新增的:
- semantic_completeness (8分)
- question_answer_consistency (7分)

✅ 正确:
必须评分所有v2.1维度，总分115分归一化到100
```

---

## 📊 批量优化注意事项

当优化多篇文章时:

### 1. 保持标准一致性

```
每篇文章都必须:
- 使用相同的评分标准
- 使用相同的优化原则
- 达到相同的质量阈值 (≥85分)

不要:
- 对不同文章使用不同标准
- "这篇差不多就行"
- 批量操作时降低质量要求
```

### 2. 记录所有评分

```
每篇文章都必须有完整的评分breakdown
便于后续验证和质量检查
```

### 3. 识别异常

```
如果某篇文章:
- 优化3次仍<85分
- 评分异常 (如某维度总是0分)
- 内容过于特殊

标记为"需要人工审核"，不要强行优化
```

---

## ✅ 成功检查清单

在返回结果前，确认:

```
Metadata优化:
[ ] PrimaryKeyword ≥85分
[ ] Slug ≥85分
[ ] Title ≥85分
[ ] Description ≥85分
[ ] 所有breakdown正确
[ ] GEO元素(语义完整性+问答一致性)已优化

Content优化:
[ ] H1优化完成
[ ] 添加了"本文将学到"导航
[ ] 危险信号前置
[ ] FAQ改为真实用户声音
[ ] 添加了类比
[ ] 包含具体数字和对比
[ ] 添加了"今日第一步"

输出格式:
[ ] JSON格式正确
[ ] 包含所有必需字段
[ ] 评分breakdown完整
[ ] key_improvements具体明确
```

---

## 🎯 质量目标

### 最低要求

```
所有字段 ≥85分
```

### 优秀目标

```
Metadata平均分 ≥90分
Content平均分 ≥90分
```

### 卓越目标

```
Metadata平均分 ≥95分
Content平均分 ≥95分
至少1个字段达到100分
```

---

## 📚 参考资源

- **主标准**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md`
- **使用指南**: `.claude/skills/HOW-TO-USE-MASTER-STANDARD.md`
- **最佳案例**: `data/article-8-optimization-deep-dive.md`
- **SEO/GEO验证**: `data/seo-geo-best-practices-validation.md`

---

**版本历史**:
- v2.1 (2026-03-18): 添加GEO元素 (语义完整性+问答一致性)
- v2.0 (2026-03-10): Content v1.0软标准
- v1.0 (2026-03-01): 初始版本
