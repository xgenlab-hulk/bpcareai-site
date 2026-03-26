# Slug 优化标准

## 评分目标：≥85分

## 当前问题分析

从验证报告看，所有slug评分只有60分，存在以下问题：
- 长度可以更短（当前39-45字符，应该30-38字符）
- 关键词可以更自然地融入
- 可读性还有提升空间

---

## 优化标准

### 1. 长度控制（30分）

**目标长度**：30-38字符（非硬性限制，但这是最优范围）

**评分规则**：
- 30-35字符 = 30分（最优）
- 36-38字符 = 25分（良好）
- 39-42字符 = 20分（尚可）
- 43-50字符 = 15分（过长）
- >50字符 = 10分（太长）

**为什么这个长度**：
- Google在搜索结果中显示50-60字符的URL
- 30-38字符给domain和路径留足空间
- 更短的URL更容易分享和记忆

**案例**：
```
❌ 60分: "blood-pressure-management-dementia-caregivers" (45字符)
✅ 85分: "bp-management-dementia-caregivers" (35字符)

❌ 60分: "foods-blood-vessel-health-aging-60-plus" (39字符)
✅ 85分: "foods-blood-vessel-health-seniors" (33字符)

❌ 60分: "skip-holiday-buffet-stage-4-ckd-seniors" (39字符)
✅ 85分: "holiday-buffet-stage-4-kidney" (29字符)
```

---

### 2. 关键词自然融入（35分）

**核心原则**：关键词要完美融入slug，像自然语言一样流畅

**评分规则**：
- primaryKeyword核心词完整出现 = 20分
- 关键词顺序自然 = 10分
- 没有冗余词汇 = 5分

**优化技巧**：
1. **去掉冗余介词/连接词**
   - ❌ "after-meals-for-seniors"
   - ✅ "after-meals-seniors"

2. **使用简洁同义词**
   - ❌ "blood-pressure" → ✅ "bp"（适用于医疗语境）
   - ❌ "cardiovascular" → ✅ "heart"
   - ❌ "pharmaceutical" → ✅ "medication" or "meds"

3. **合并相似概念**
   - ❌ "adults-60-plus-seniors"
   - ✅ "seniors-60-plus" 或 "seniors"

**案例**：
```
primaryKeyword: "digestive problems holiday food ppi seniors"

❌ 60分: "digestive-problems-holiday-food-ppi-seniors" (43字符，机械翻译)
✅ 85分: "holiday-food-digestion-ppi-seniors" (34字符，自然流畅)

primaryKeyword: "hrt alcohol interactions women over 64"

❌ 60分: "hrt-holiday-alcohol-interactions-women-over-64" (45字符)
✅ 85分: "hrt-alcohol-interactions-women-64" (33字符)
```

---

### 3. 可读性和语义清晰（20分）

**评分规则**：
- 一眼看懂文章主题 = 10分
- 单词分隔清晰（用连字符） = 5分
- 避免缩写歧义 = 5分

**可读性检查清单**：
- [ ] 不需要猜测就能理解内容
- [ ] 关键信息在前3-4个词中出现
- [ ] 没有让人困惑的缩写（除了常见的如"bp"、"ckd"）
- [ ] 目标受众明确（seniors、women、adults-60等）

**案例**：
```
✅ 清晰: "holiday-wine-heart-rhythm-ssri-women"
   → 立即明白：假日酒精 + 心律 + SSRI药物 + 女性

❌ 不清晰: "postprandial-cholinergic-stabilization-seniors"
   → 需要医学背景才能理解

✅ 改进: "digestion-after-meals-seniors"
```

---

### 4. SEO友好度（15分）

**评分规则**：
- 包含高价值关键词 = 8分
- URL结构符合Google最佳实践 = 7分

**SEO最佳实践**：
1. **关键词前置**：最重要的词放在前面
   - ✅ "blood-pressure-drops-walking-seniors"
   - ❌ "seniors-blood-pressure-drops-walking"

2. **避免停用词**（除非必要）
   - ❌ "how-to-manage-your-blood-pressure"
   - ✅ "manage-blood-pressure-seniors"

3. **使用用户搜索词**
   - ✅ "holiday-palpitations" (用户会搜索)
   - ❌ "festive-cardiac-arrhythmia" (过于学术)

**案例**：
```
primaryKeyword: "holiday energy crash low blood sugar adults"

❌ 60分 SEO: "holiday-energy-crash-low-blood-sugar-50-59"
   → 年龄段放最后，关键词顺序机械

✅ 85分 SEO: "low-blood-sugar-holiday-crash-adults"
   → 高价值词"low-blood-sugar"前置
```

---

## 优化流程

### Step 1: 分析primaryKeyword
识别核心概念：
- 主要健康问题
- 情境/触发因素
- 目标人群

### Step 2: 精简关键词
- 去掉冗余词
- 使用简洁同义词
- 合并相似概念

### Step 3: 构建slug
- 长度控制在30-38字符
- 关键信息前置
- 保持自然流畅

### Step 4: 验证评分
- 长度评分（30分）
- 关键词融入（35分）
- 可读性（20分）
- SEO友好度（15分）
- **总分必须≥85分**

---

## 实战案例：从60分到85分

### 案例1：消化问题

**primaryKeyword**: "digestive problems holiday food ppi seniors"

**60分 slug**:
```
digestive-problems-holiday-food-ppi-seniors
- 长度：43字符（20分）
- 关键词：机械拼接（25分）
- 可读性：可以理解（15分）
- SEO：关键词都在但不够优化（10分）
总分：70分 ❌
```

**85分 slug**:
```
holiday-digestion-ppi-seniors
- 长度：29字符（30分）✅
- 关键词："digestive→digestion"简化，"holiday food→holiday"合并（35分）✅
- 可读性：非常清晰（20分）✅
- SEO："digestion"是高价值词，目标人群明确（15分）✅
总分：100分 ✅
```

### 案例2：血压管理

**primaryKeyword**: "blood pressure management dementia caregivers"

**60分 slug**:
```
blood-pressure-management-dementia-caregivers
- 长度：45字符（15分）
- 关键词：完整但冗长（30分）
- 可读性：清晰（18分）
- SEO：较好（12分）
总分：75分 ❌
```

**85分 slug**:
```
bp-management-dementia-caregivers
- 长度：33字符（28分）✅
- 关键词："blood pressure→bp"（35分）✅
- 可读性：BP在医疗语境中常见（20分）✅
- SEO：简洁且关键词集中（15分）✅
总分：98分 ✅
```

### 案例3：假日能量下降

**primaryKeyword**: "holiday energy crash low blood sugar adults"

**60分 slug**:
```
holiday-energy-crash-low-blood-sugar-50-59
- 长度：42字符（20分）
- 关键词：全部包含但顺序机械（28分）
- 可读性：可理解（17分）
- SEO：年龄段放后面不利SEO（10分）
总分：75分 ❌
```

**85分 slug**:
```
low-blood-sugar-holiday-crash-adults
- 长度：36字符（25分）✅
- 关键词：重新排序，"energy→crash"简化（35分）✅
- 可读性：非常清晰（20分）✅
- SEO：高价值词"low-blood-sugar"前置（15分）✅
总分：95分 ✅
```

---

## 常见错误和修正

### 错误1：机械拼接关键词
```
❌ "blood-pressure-drops-after-walking-cardiac-amyloidosis"
✅ "bp-drops-after-walking-heart-amyloid"
   或 "post-walk-bp-drops-amyloidosis"
```

### 错误2：保留所有修饰词
```
❌ "12-foods-that-improve-digestion-after-meals-seniors"
✅ "12-foods-better-digestion-seniors"
   或 "foods-improve-digestion-seniors"
```

### 错误3：年龄段过于具体
```
❌ "holiday-wine-heart-rhythm-women-over-64"
✅ "holiday-wine-heart-rhythm-older-women"
   或 "holiday-wine-heart-ssri-women"
```

### 错误4：重复概念
```
❌ "skip-holiday-buffet-stage-4-ckd-seniors"
   (seniors和年龄段是stage 4 CKD隐含的)
✅ "skip-holiday-buffet-stage-4-kidney"
   或 "holiday-buffet-advanced-kidney-disease"
```

---

## 质量检查清单

在确认slug之前，检查以下项目：

- [ ] **长度30-38字符**（优先30-35）
- [ ] **primaryKeyword核心词都出现**
- [ ] **没有冗余词汇**（the、a、your、for等）
- [ ] **关键信息前置**（最重要的健康问题在前3个词）
- [ ] **目标受众明确**（seniors、women、adults等）
- [ ] **用连字符分隔单词**
- [ ] **全小写**
- [ ] **没有数字（除非必要如"stage-4"）**
- [ ] **一眼就能理解文章主题**
- [ ] **总评分≥85分**

---

## 评分计算器（自检）

| 维度 | 满分 | 我的评分 |
|------|------|----------|
| 长度控制（30-38字符） | 30 | ___ |
| 关键词自然融入 | 35 | ___ |
| 可读性和语义清晰 | 20 | ___ |
| SEO友好度 | 15 | ___ |
| **总分** | **100** | **___** |

**要求：总分≥85分**

---

## 最后提醒

1. **优先简洁**：宁可少一个词，不要多一个词
2. **优先清晰**：如果缩写会造成歧义，保留完整词
3. **优先用户**：用用户会搜索的词，不用学术术语
4. **测试可读性**：给非专业人士看，他们能立即理解吗？

**目标：每个slug都必须≥85分**
