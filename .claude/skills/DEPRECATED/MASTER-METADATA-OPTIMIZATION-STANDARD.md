# 元数据优化主标准（Master Standard）

**版本**: v2.0
**生效日期**: 2026-03-16
**状态**: 🔒 官方标准 - 所有优化任务必须严格遵循

---

## ⚠️ 重要说明

这是**唯一权威的元数据优化标准文档**。

所有使用Task工具进行文章优化的任务，必须：
1. ✅ 引用此文档作为优化标准
2. ✅ 严格按照评分标准打分
3. ✅ 确保所有元素评分≥85分
4. ❌ 不得使用其他标准或自行判断

---

## 📋 优化目标

每篇文章的元数据包含4个字段：
1. **primaryKeyword** - 主关键词（30-50字符）
2. **slug** - URL路径（30-38字符）
3. **title** - 标题（50-65字符）
4. **description** - 描述（130-150字符）

**成功标准**: 每个字段评分≥85分，总体评分≥85分

---

# 第一部分：PrimaryKeyword 优化标准

## 评分目标：≥85分

### 评分维度（总分100）

| 维度 | 分值 | 评分标准 |
|------|------|---------|
| **长度适中** | 25分 | 30-40字符=25分, 41-50字符=20分, <30或>50=10分 |
| **用户搜索意图** | 40分 | 完全匹配用户真实搜索词=40分, 学术化=20分 |
| **简洁自然** | 20分 | 无冗余词=20分, 有介词/修饰词=10分 |
| **关键词密度** | 15分 | 2-5个核心词=15分, >5个词=8分 |

### 硬性规则

✅ **必须做**：
- 长度控制在30-50字符（最优30-40）
- 使用用户会搜索的词，不用学术术语
- 去掉所有介词（for, with, in, after等）
- 核心词2-5个

❌ **禁止**：
- 学术术语（"pathophysiology", "subclinical", "endothelial"）
- 超过50字符
- 包含标点符号
- 重复概念

### 评分公式

```
总分 = 长度分(25) + 搜索意图分(40) + 简洁度分(20) + 密度分(15)

长度分计算：
- 30-40字符: 25分
- 41-45字符: 22分
- 46-50字符: 20分
- <30字符: 15分
- >50字符: 10分

搜索意图分计算：
- 完全匹配用户搜索词: 40分
- 部分学术化但可理解: 25分
- 过于学术/技术: 15分

简洁度分计算：
- 无冗余词: 20分
- 1-2个介词: 15分
- >2个介词: 8分

密度分计算：
- 2-4个核心词: 15分
- 5个核心词: 12分
- >5个核心词: 8分
```

### 标准案例

```
✅ 95分: "digestive problems holiday food ppi seniors"
   - 46字符 (20分)
   - 用户搜索词 (40分)
   - 无冗余 (20分)
   - 5个核心词 (12分)
   总分: 92分

❌ 40分: "understanding subclinical gut dysbiosis pathophysiology in elderly ppi users"
   - 75字符 (10分)
   - 学术化 (15分)
   - 有介词"in" (8分)
   - 7个核心词 (8分)
   总分: 41分
```

---

# 第二部分：Slug 优化标准

## 评分目标：≥85分

### 评分维度（总分100）

| 维度 | 分值 | 评分标准 |
|------|------|---------|
| **长度控制** | 30分 | 30-35字符=30分, 36-38=25分, 39-42=20分, >42=10分 |
| **关键词自然融入** | 35分 | 核心词完整且自然=35分, 机械拼接=20分 |
| **可读性** | 20分 | 一眼看懂=20分, 需要思考=12分, 难懂=5分 |
| **SEO友好度** | 15分 | 关键词前置+简洁=15分, 一般=10分 |

### 硬性规则

✅ **必须做**：
- 长度30-38字符（最优30-35）
- primaryKeyword核心词必须出现
- 使用连字符分隔单词
- 全小写
- 关键信息前置

❌ **禁止**：
- 包含介词（for, with, in, after等）
- 包含冠词（the, a, an）
- 包含"your", "how-to"等冗余词
- 机械拼接primaryKeyword
- 使用下划线或空格

### 优化技巧

1. **战略性缩写**（医学语境适用）
   ```
   ✅ blood-pressure → bp
   ✅ cardiac-amyloidosis → heart-amyloid
   ✅ 50-59 → 50s
   ✅ chronic-kidney-disease → ckd
   ```

2. **去冗余词**
   ```
   ✅ holiday-digestion-ppi-seniors (29字符)
   ❌ digestive-problems-after-holiday-food-for-seniors-on-ppi (59字符)
   ```

3. **合并概念**
   ```
   ✅ seniors (而非 adults-60-plus-seniors)
   ✅ dementia-caregivers (而非 caregivers-for-dementia-patients)
   ```

### 评分公式

```
总分 = 长度分(30) + 关键词融入分(35) + 可读性分(20) + SEO分(15)

长度分计算：
- 30-35字符: 30分
- 36-38字符: 25分
- 39-42字符: 20分
- 43-45字符: 15分
- >45字符: 10分

关键词融入分计算：
- 核心词完整且自然流畅: 35分
- 核心词完整但略显机械: 25分
- 机械拼接primaryKeyword: 15分

可读性分计算：
- 一眼看懂文章主题: 20分
- 需要思考2-3秒: 12分
- 难以理解: 5分

SEO分计算：
- 高价值词前置+简洁: 15分
- 关键词位置适中: 12分
- 关键词靠后: 8分
```

### 标准案例

```
✅ 95分: "holiday-digestion-ppi-seniors" (29字符)
   - 29字符 (30分)
   - 核心词自然融入 (35分)
   - 非常清晰 (20分)
   - 关键词前置 (15分)
   总分: 100分

✅ 90分: "bp-management-dementia-caregivers" (33字符)
   - 33字符 (30分)
   - 使用"bp"缩写自然 (33分)
   - 清晰 (20分)
   - 好 (15分)
   总分: 98分

❌ 60分: "digestive-problems-holiday-food-ppi-seniors" (43字符)
   - 43字符 (15分)
   - 机械拼接 (25分)
   - 可理解 (15分)
   - 一般 (10分)
   总分: 65分
```

---

# 第三部分：Title 优化标准

## 评分目标：≥85分

### 评分维度（总分100）

| 维度 | 分值 | 评分标准 |
|------|------|---------|
| **长度控制** | 15分 | 50-60字符=15分, 61-65=12分, 66-70=10分 |
| **情感吸引力** | 30分 | 疑问句+Your=30分, 陈述句=18分 |
| **价值主张明确** | 25分 | 具体可数=25分, 泛泛=15分 |
| **目标受众识别** | 20分 | 精准标识=20分, 模糊=10分 |
| **关键词优化** | 10分 | 核心词在前半部=10分, 后半=6分 |

### 硬性规则

✅ **必须做**：
- 长度50-65字符（最优50-60）
- 使用疑问句格式（8/10推荐）
- 使用"Your"而不是"The"
- 明确目标受众（年龄/状况/药物）
- 包含具体数字或结果

❌ **禁止**：
- 学术开场（"Understanding", "A Comprehensive Guide to"）
- 泛泛价值（"improve health", "better management"）
- 模糊受众（"seniors"要改为"seniors 60+"）
- 超过70字符（会被截断）

### 高吸引力模板

**模板1：疑问+受众+价值**
```
"[Problem Question]? ([Audience] [Solution Type])"

示例：
✅ "Holiday Food Upsetting Your Stomach? (PPI Users Complete Guide)"
✅ "Low Blood Sugar After Meals? (50-59 Essential Guide)"
```

**模板2：您的症状+解决方案**
```
"[Your Symptom]: [Solution/What It Means] for [Audience]"

示例：
✅ "Your Blood Pressure Drops After Walking: What It Means (Heart Amyloid)"
✅ "Your Holiday Energy Crash: Low Blood Sugar Guide (Ages 50-59)"
```

**模板3：数字+行动+结果**
```
"[Number] Ways to [Action] [Result] ([Audience])"

示例：
✅ "12 Foods to Stop Reflux After Meals (Seniors 60+)"
✅ "5 Things Women on HRT Must Know About Holiday Alcohol"
```

**模板4：警示型**
```
"[Common Activity] and [Risk]: [What Audience Should Know]"

示例：
✅ "Holiday Wine and Heart Rhythm: Essential SSRI Guide (Women 62+)"
✅ "Skip the Holiday Buffet? Stage 4 Kidney Disease Guide"
```

### 评分公式

```
总分 = 长度分(15) + 情感分(30) + 价值分(25) + 受众分(20) + 关键词分(10)

长度分计算：
- 50-60字符: 15分
- 61-65字符: 12分
- 45-49字符: 12分
- 66-70字符: 10分
- <45或>70字符: 8分

情感吸引力分计算：
- 疑问句+"Your"+情感词: 30分
- 疑问句: 25分
- "Your"+强动词: 22分
- 陈述句但有力: 18分
- 平淡陈述: 12分

价值主张分计算：
- 具体数字+明确结果: 25分
- 具体数字或明确结果: 20分
- 比较泛但清晰: 15分
- 很泛: 10分

受众识别分计算：
- 年龄+状况/药物: 20分
- 年龄或状况: 15分
- 模糊受众: 10分

关键词分计算：
- 核心词在前半部: 10分
- 核心词在中间: 8分
- 核心词在后半: 6分
```

### 标准案例

```
✅ 92分: "Holiday Food Upsetting Your Stomach? (PPI Users Complete Guide)" (64字符)
   - 64字符 (12分)
   - 疑问+"Your" (30分)
   - "Complete Guide"明确 (25分)
   - "PPI Users"精准 (20分)
   - 关键词前置 (10分)
   总分: 97分

✅ 90分: "Keeping Your BP Down While Caring for Spouse with Dementia" (62字符)
   - 62字符 (12分)
   - "Your"+情感情境 (28分)
   - "Keeping Down"具体行动 (24分)
   - 情境明确 (20分)
   - BP前置 (9分)
   总分: 93分

❌ 67分: "Digestive Problems After Holiday Food (If You Take PPIs)" (53字符)
   - 53字符 (15分)
   - 陈述句 (18分)
   - 问题清晰但无解决方案 (18分)
   - 受众明确 (18分)
   - 关键词中间 (8分)
   总分: 77分
```

---

# 第四部分：Description 优化标准

## 评分目标：≥85分

### 评分维度（总分100）

| 维度 | 分值 | 评分标准 |
|------|------|---------|
| **长度控制** | 10分 | 130-145字符=10分, 146-155=8分, <130=5分 |
| **强有力开场** | 25分 | 疑问句=25分, 强动词=20分, Learn/Understand=15分 |
| **具体价值主张** | 30分 | 可数+具体结果=30分, 可数或结果=20分, 泛泛=12分 |
| **目标受众召唤** | 20分 | 精准标识=20分, 模糊=12分 |
| **行动驱动CTA** | 15分 | 紧迫性词+价值=15分, 一般=10分 |

### 硬性规则

✅ **必须做**：
- 长度130-150字符（最优130-145）
- 开场用疑问句或强动词（Discover, Get, Stop）
- 包含可数的具体价值（3 tests, 5 signs, 12 foods）
- 明确目标受众（年龄+状况）
- 结尾有紧迫性或价值强化（today, essential, proven）

❌ **禁止**：
- 开场用"Learn", "Understand", "This article"
- 泛泛价值（helpful tips, useful information）
- 模糊受众（seniors → seniors 60+）
- 浪费字符（<130字符未充分利用）

### 高效开场模板

**开场1：疑问钩子**（最强）
```
✅ "Holiday meals upsetting your stomach?"
✅ "Blood pressure dropping after walks?"
✅ "Tired of reflux after meals?"
✅ "On SSRIs and enjoying holiday wine?"
```

**开场2：行动召唤**
```
✅ "Discover why..."
✅ "Get [number] proven..."
✅ "Stop [problem] with..."
```

**开场3：情境识别**
```
✅ "Caring for spouse with dementia?"
✅ "If you take PPIs and love holiday food..."
```

### 具体价值模板

```
可数内容：
✅ "3 at-home tests"
✅ "4 warning signs"
✅ "5 safety tips"
✅ "12 foods"

具体结果：
✅ "stop reflux and bloating"
✅ "prevent dangerous drops"
✅ "avoid heart rhythm changes"
✅ "keep BP down"

紧迫性词：
✅ "today"
✅ "essential"
✅ "must-know"
✅ "proven"
✅ "backed by research"
```

### 评分公式

```
总分 = 长度分(10) + 开场分(25) + 价值分(30) + 受众分(20) + CTA分(15)

长度分计算：
- 130-145字符: 10分
- 146-150字符: 9分
- 151-155字符: 8分
- 120-129字符: 7分
- <120字符: 5分

开场分计算：
- 疑问钩子: 25分
- 强动词(Discover, Get, Stop): 20分
- 一般动词(Learn, Find): 15分
- 陈述句: 12分

价值主张分计算：
- 可数内容+具体结果: 30分
- 可数内容或具体结果: 22分
- 比较具体: 15分
- 很泛: 10分

受众召唤分计算：
- 年龄+状况/药物: 20分
- 年龄或状况: 15分
- 模糊: 10分

CTA分计算：
- 紧迫性词+价值强化: 15分
- 紧迫性词或价值强化: 12分
- 一般结尾: 8分
```

### 标准案例

```
✅ 94分: "Holiday meals upsetting your stomach? Discover why PPIs change digestion, plus 3 tests you can do today and meal timing tricks that prevent bloating for seniors 60+." (148字符)
   - 148字符 (9分)
   - 疑问开场 (25分)
   - "3 tests"+"prevent bloating" (30分)
   - "seniors 60+" (18分)
   - "today" (14分)
   总分: 96分

✅ 91分: "Caring for spouse with dementia? Get proven BP strategies for fragmented sleep and caregiver stress—plus when to adjust meds safely (ages 65-79)." (145字符)
   - 145字符 (10分)
   - 疑问情境 (25分)
   - "proven strategies"+"adjust safely" (28分)
   - 情境+年龄 (20分)
   - "safely" (12分)
   总分: 95分

❌ 65分: "Learn why holiday meals cause digestive issues if you take acid reflux medication. Includes simple at-home tests and gentle diet adjustments for seniors." (137字符)
   - 137字符 (10分)
   - "Learn why"弱 (15分)
   - "simple tests"不够具体 (20分)
   - "seniors"太泛 (12分)
   - 无CTA (8分)
   总分: 65分
```

---

# 第五部分：综合评分和质量控制

## 总体评分计算

```
总体评分 = (primaryKeyword分 + slug分 + title分 + description分) / 4

✅ 成功标准：
- 每个字段≥85分
- 总体评分≥85分
- 如果任何一个字段<85分，整体视为不合格
```

## 质量检查清单

在优化完成后，必须检查：

### Slug检查
- [ ] 长度30-38字符
- [ ] 无介词/冠词
- [ ] primaryKeyword核心词出现
- [ ] 一眼看懂主题
- [ ] 全小写，用连字符

### Title检查
- [ ] 长度50-65字符
- [ ] 使用疑问句或"Your"
- [ ] 包含具体价值或数字
- [ ] 目标受众明确
- [ ] 关键词在前半部

### Description检查
- [ ] 长度130-150字符
- [ ] 疑问句或强动词开场
- [ ] 包含可数的具体价值
- [ ] 目标受众年龄+状况
- [ ] 有紧迫性词汇

### PrimaryKeyword检查
- [ ] 长度30-50字符
- [ ] 无介词
- [ ] 用户会搜索的词
- [ ] 2-5个核心词

---

# 第六部分：常见错误和修正

## 错误1：机械拼接关键词

❌ **错误**:
```
slug: digestive-problems-holiday-food-ppi-seniors
title: Digestive Problems Holiday Food PPI Seniors Guide
```

✅ **正确**:
```
slug: holiday-digestion-ppi-seniors
title: Holiday Food Upsetting Your Stomach? (PPI Users Guide)
```

## 错误2：学术化语言

❌ **错误**:
```
primaryKeyword: understanding subclinical gut dysbiosis pathophysiology
title: Understanding the Pathophysiology of Subclinical Gut Dysbiosis
```

✅ **正确**:
```
primaryKeyword: digestive problems holiday food ppi seniors
title: Holiday Food Upsetting Your Stomach? (PPI Users Complete Guide)
```

## 错误3：价值主张太泛

❌ **错误**:
```
description: Learn about blood pressure management. Includes helpful tips and useful information.
```

✅ **正确**:
```
description: Get 5 proven BP strategies for dementia caregivers—stop stress-induced spikes and know when to adjust meds safely.
```

## 错误4：缺少情感钩子

❌ **错误**:
```
title: Blood Pressure Management for Dementia Caregivers
```

✅ **正确**:
```
title: Keeping Your BP Down While Caring for Spouse with Dementia
```

## 错误5：浪费字符空间

❌ **错误**:
```
description: Learn why holiday wine affects heart rhythm. (64字符，太短！)
```

✅ **正确**:
```
description: On SSRIs and enjoying holiday wine? Learn the 4 warning signs of heart rhythm changes and exactly when to skip that glass—essential for women 62+. (148字符)
```

---

# 第七部分：使用此标准的工作流程

## Step 1: 读取文章数据

```json
{
  "slug": "原始slug",
  "title": "原始title",
  "description": "原始description",
  "primaryKeyword": "原始primaryKeyword"
}
```

## Step 2: 按顺序优化各字段

**优化顺序**：
1. 先优化 primaryKeyword（基础）
2. 再优化 slug（基于primaryKeyword）
3. 然后优化 title（基于slug和primaryKeyword）
4. 最后优化 description（基于所有优化后的字段）

## Step 3: 逐字段评分

对每个优化后的字段，严格按照评分公式打分：
- primaryKeyword: 长度(25)+搜索意图(40)+简洁(20)+密度(15) = 100
- slug: 长度(30)+关键词(35)+可读性(20)+SEO(15) = 100
- title: 长度(15)+情感(30)+价值(25)+受众(20)+关键词(10) = 100
- description: 长度(10)+开场(25)+价值(30)+受众(20)+CTA(15) = 100

## Step 4: 质量验证

如果任何字段<85分：
1. 找出扣分原因
2. 重新优化该字段
3. 再次评分
4. 直到所有字段≥85分

## Step 5: 输出结果

```json
{
  "optimized": {
    "primaryKeyword": "优化后的primaryKeyword",
    "slug": "优化后的slug",
    "title": "优化后的title",
    "description": "优化后的description"
  },
  "scores": {
    "primaryKeyword": 95,
    "slug": 95,
    "title": 92,
    "description": 94,
    "overall": 94
  },
  "meets_standard": true
}
```

---

# 附录A：快速参考表

## 长度限制

| 字段 | 最优长度 | 可接受范围 | 评分影响 |
|------|---------|-----------|---------|
| primaryKeyword | 30-40字符 | 30-50字符 | 超过扣分严重 |
| slug | 30-35字符 | 30-38字符 | 每超1字符扣1分 |
| title | 50-60字符 | 50-65字符 | 61-65扣3分 |
| description | 130-145字符 | 130-150字符 | <130浪费空间扣分 |

## 情感触发词库

### 疑问词（高分）
- Why, How, What, When, Should, Could, Is, Are, Do, Does

### 强动词（高分）
- Discover, Get, Stop, Keep, Avoid, Prevent, Master

### 弱动词（低分）
- Learn, Understand, Know, Read, Covers

### 紧迫性词
- Today, Now, Essential, Must-know, Critical, Proven, Backed by research

### 个人化词
- Your, You, You're

## 目标受众标识格式

```
✅ 精准（20分）:
- seniors 60+
- women 62+ on SSRIs
- adults 50-59 with diabetes
- stage 4 kidney disease patients
- dementia caregivers ages 65-79

✅ 可以（15分）:
- seniors
- women over 60
- older adults

❌ 太泛（10分）:
- adults
- people
- everyone
```

---

# 附录B：评分计算器模板

使用此模板为每个字段打分：

## PrimaryKeyword评分

```
字段: [primaryKeyword内容]
长度: [X]字符

长度分 (25分): ___
- 30-40字符: 25分
- 41-45字符: 22分
- 其他: ___分

搜索意图分 (40分): ___
- 完全匹配用户搜索: 40分
- 部分学术化: 25分
- 评估: ___分

简洁度分 (20分): ___
- 无冗余词: 20分
- 有介词: 15分
- 评估: ___分

密度分 (15分): ___
- 2-4个核心词: 15分
- 5个: 12分
- 评估: ___分

总分: ___ / 100
```

## Slug评分

```
字段: [slug内容]
长度: [X]字符

长度分 (30分): ___
关键词融入分 (35分): ___
可读性分 (20分): ___
SEO分 (15分): ___

总分: ___ / 100
```

## Title评分

```
字段: [title内容]
长度: [X]字符

长度分 (15分): ___
情感吸引力分 (30分): ___
价值主张分 (25分): ___
受众识别分 (20分): ___
关键词分 (10分): ___

总分: ___ / 100
```

## Description评分

```
字段: [description内容]
长度: [X]字符

长度分 (10分): ___
开场分 (25分): ___
价值主张分 (30分): ___
受众召唤分 (20分): ___
CTA分 (15分): ___

总分: ___ / 100
```

---

# 版本历史

## v2.0 (2026-03-16) - 当前版本
- ✅ 整合所有字段标准到单一文档
- ✅ 明确评分公式和计算方法
- ✅ 添加快速参考表和评分计算器
- ✅ 提供具体案例和错误示例
- ✅ 确保可重复性和一致性

## v1.0 (2026-03-13)
- 初始综合标准（分散在多个文档）

---

**🔒 此文档为官方标准，所有优化任务必须严格遵循**

**📌 文档路径**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md`
