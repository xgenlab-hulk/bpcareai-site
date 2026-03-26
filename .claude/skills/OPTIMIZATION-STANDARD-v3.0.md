# 文章优化标准 v3.0 — GEO优先 · 语义驱动

**版本**: v3.0
**生效日期**: 2026-03-25
**状态**: 🔒 官方标准 — 替代所有旧版本（v2.1及以下）
**设计原则**: GEO效果优先 > SEO效果 > 执行效率

---

## 核心理念

### 为什么需要v3.0？

v2.1标准的38篇抽样评估暴露了系统性问题：
- Description 90%模板化 → AI系统无法区分文章
- 医学实体被过度剥离 → AI引用价值下降
- PrimaryKeyword碎片化 → 不匹配自然语言查询
- 硬性评分公式 → 大模型"凑分"而非真正理解

### v3.0的核心转变

| 维度 | v2.1 | v3.0 |
|------|------|------|
| 优先级 | SEO优先 | **GEO优先** |
| 规则类型 | 90%硬规则 | **30%底线 + 70%语义指导** |
| PK风格 | 碎片化词组 | **自然语言查询** |
| Description | 模板+营销词 | **独特答案概述+保留医学实体** |
| Title | 强制疑问句模板 | **多样化，匹配文章本质** |
| Slug | 改slug+301 | **不改slug** |
| 评分方式 | 公式凑分 | **语义质量判断+底线检查** |
| AI引用 | 未考虑 | **核心指标** |

---

## 第一部分：底线约束（硬性规则，不可违反）

这些是唯一的硬性规则。只要不违反底线，大模型可以自由发挥语义理解能力。

### 1.1 字段长度底线

| 字段 | 绝对下限 | 绝对上限 | 最佳区间 |
|------|---------|---------|---------|
| PrimaryKeyword | 20字符 | 60字符 | 30-50字符 |
| Title | 40字符 | 70字符 | 50-65字符 |
| Description | 120字符 | 160字符 | 130-155字符 |
| Slug | — | — | **不改动** |

### 1.2 绝对禁止

- ❌ 修改slug字段或文件名
- ❌ Description使用"Learn how/why X. Includes/Covers A, B, and C."模板
- ❌ Description连续使用"today"、"proven"、"essential"、"must-know"等营销词
- ❌ PrimaryKeyword去掉所有介词变成名词堆砌
- ❌ 剥离所有医学专业术语（应保留+加通俗解释）
- ❌ 相邻5篇文章使用完全相同的Title句式结构
- ❌ 自评分数虚高（独立验证偏差>10分需重做）

### 1.3 绝对要求

- ✅ 每篇Description必须结构独特，不能套模板
- ✅ PrimaryKeyword必须是一个用户可能实际输入的完整短语或问题
- ✅ Description必须保留至少1个具体医学实体（药物名/疾病名/检测指标）
- ✅ Title和Description必须语义一致（Title提的问题，Description要回应）

---

## 第二部分：PrimaryKeyword 优化指导

### 2.1 核心思想

PrimaryKeyword不是给搜索引擎看的关键词列表，而是**用户会实际输入的搜索查询**。

v2.1做法（错误）：去掉所有介词 → 碎片化词组
```
❌ "hearing aids blood pressure morning spikes"
❌ "fluid retention weight gain afib seniors"
❌ "air pollution heart health seniors angina"
```

v3.0做法（正确）：保留自然语法，匹配真实查询
```
✅ "why do hearing aids affect blood pressure in the morning"
✅ "is my holiday weight gain fluid retention or fat"
✅ "how does air pollution trigger angina in seniors"
```

### 2.2 语义指导（非硬规则）

**问自己这3个问题：**

1. **如果你是一个65岁的患者，你会怎么在Google或ChatGPT里问这个问题？**
   - 用那个问法作为PrimaryKeyword的基础

2. **这个关键词放到ChatGPT里，AI能理解你在问什么吗？**
   - 如果AI会回"你是想问XX还是YY？"，说明关键词不够清晰

3. **这个关键词是否保留了文章的独特价值？**
   - "blood pressure seniors"太泛 — 2000篇文章都可以用
   - "blood pressure drops after walking with heart amyloidosis"才是这篇文章的独特价值

### 2.3 允许的格式

以下格式都是合法的，选择最自然的那个：

```
格式1 — 问题式:
"why does blood pressure drop after walking with amyloidosis"

格式2 — 短语式（保留介词）:
"blood pressure drops after walking in heart amyloid patients"

格式3 — 话题式:
"holiday weight gain vs fluid retention in women with afib"

格式4 — 简洁式（适合本身就清晰的话题）:
"low sodium frozen dinner options heart failure"
```

### 2.4 医学术语处理原则

**不是"全部去掉"，而是"保留+翻译"：**

| 场景 | 处理方式 | 示例 |
|------|---------|------|
| 患者会搜索的术语 | 保留 | "afib", "blood pressure", "diabetes", "cholesterol" |
| 患者知道但不常搜的 | 保留在PK中，Description中加通俗解释 | "amyloidosis" → 保留，Description中加"protein buildup in heart" |
| 纯学术术语 | 替换为通俗版本 | "endothelial dysfunction" → "blood vessel damage" |
| 药物通用名 | 保留 | "metformin", "lisinopril", "warfarin" |
| 检测指标 | 保留缩写 | "HbA1c", "eGFR", "BNP" |

### 2.5 "精确的通俗"原则（v3.0.1补充）

**这是v3.0最重要的执行原则。**

通俗化的目标是让患者能理解，但绝不能牺牲精确性。"精确的通俗" > "泛化的通俗"。

**核心方法：通俗表述在前 + 括号保留精确术语**

```
❌ 泛化的通俗（扣分）:
"heart blood flow"           → 太泛，什么都能指
"tiny heart vessels"         → 不精确，患者和AI都不清楚指什么
"dangerous drops"            → 什么程度算dangerous？
"heart problems"             → 2000篇文章都能用

✅ 精确的通俗（高分）:
"blood flow through your heart's small vessels (coronary microvascular)"
"chest pain with clear arteries (INOCA)"
"stiff arteries (arterial stiffness)"
"protein buildup that stiffens your heart (cardiac amyloidosis)"
"a measure of artery flexibility (pulse wave velocity)"
```

**在不同字段中的应用：**

| 字段 | 通俗化策略 |
|------|-----------|
| **PrimaryKeyword** | 用患者的精确场景描述，不是泛化词。"does cold water on hands help blood flow to my heart" 比 "heart blood flow" 好，因为前者描述了具体场景。 |
| **Title** | 通俗词为主 + 可保留1个关键医学实体（不加括号解释，因为字符有限）。选择患者最可能认识的那个术语。 |
| **Description** | 通俗桥接 + 括号保留术语。Description有120-160字符空间，足够放"通俗解释 (精确术语)"的组合。每篇至少1处这种桥接。 |

**判断标准：如果你删掉了一个术语，问自己：**
1. 替代词是否同样精确？（"stiff arteries" ≈ "arterial stiffness" → OK）
2. 替代词是否变泛了？（"heart blood flow" ≠ "coronary flow reserve" → 不OK，加括号保留）
3. AI系统看到替代词，能精确匹配同一个医学概念吗？（"tiny heart vessels" → AI不确定你指的是capillaries还是arterioles → 不OK）

---

## 第三部分：Title 优化指导

### 3.1 核心思想

Title的目标是**在搜索结果中让用户愿意点击，同时让AI系统理解这篇文章回答什么问题**。

不要强制所有文章都用同一种格式。

### 3.2 多样化格式库

根据文章内容本质选择最合适的格式：

**适合"解释原因"类文章：**
```
"Why Blood Pressure Drops After Walking With Heart Amyloidosis"
"How Air Pollution Triggers Angina — Even Indoors (Seniors 65+)"
```

**适合"实用指南"类文章：**
```
"Low-Sodium Frozen Dinners: A Heart Failure Patient's Guide"
"Blood Pressure Monitoring at Home: What Seniors Over 70 Need"
```

**适合"风险警示"类文章：**
```
"7 Holiday Foods That Spike Blood Pressure — Even Low-Sodium Ones"
"Your Hearing Aids May Be Raising Morning Blood Pressure"
```

**适合"对比/选择"类文章：**
```
"Holiday Weight Gain or Fluid Retention? How to Tell (Women 65+ With AFib)"
"Warm Baths and SGLT2 Inhibitors: Safe or Risky for Seniors?"
```

**适合"特定人群"类文章：**
```
"Managing Blood Pressure as a Dementia Caregiver (Ages 65-79)"
"Zinc Supplements and Heart Health: What Men Over 70 Should Know"
```

### 3.3 语义指导

- **Title要传递文章的独特价值**，不是泛泛的"Guide for Seniors"
- **保留关键医学实体**：如果文章讲"amyloidosis"，Title中应该出现
- **受众标识要自然融入**：不是每次都加括号"(Seniors 60+)"，可以是"for Men Over 70"或"as a Caregiver"
- **避免连续5篇使用相同句式**：如果前4篇都用了"Your X?"，第5篇换一种

### 3.4 多样性检查

在批量优化时，每5篇一组检查Title格式分布：
- 至少使用2种不同的句式格式
- 不超过3篇使用疑问句
- 不超过2篇使用相同的模板结构

---

## 第四部分：Description 优化指导

### 4.1 核心思想

Description是**文章的微型摘要**，需要完成两个任务：
1. **SEO任务**：在Google搜索结果中吸引点击
2. **GEO任务**：让AI系统判断"这篇文章能回答用户的问题"

v2.1的问题是只做了(1)还做得不好（模板化），完全忽略了(2)。

### 4.2 禁止的模板

以下模板在v3.0中**严格禁止**：

```
❌ "Learn how/why [X] affects [Y]. Includes [A], [B], and [C]."
❌ "Discover [N] ways to [action]. Get [benefit] today."
❌ "Essential guide for seniors [age]+. Covers [topic] and [topic]."
```

### 4.3 好的Description是什么样的？

**原则：每篇Description都应该像是一位专科医生用一句话概括这篇文章能告诉你什么。**

**案例1 — 解释原因类：**
```
文章：心脏淀粉样变患者步行后血压骤降
Title: "Why Blood Pressure Drops After Walking With Heart Amyloidosis"

❌ v2.1产出:
"Learn how heart amyloid causes dangerous drops. Includes warning signs, monitoring tips, and safe walking strategies for adults 74+."

✅ v3.0产出:
"Heart amyloidosis stiffens your heart so it can't compensate during walks — causing 20-40 mmHg drops vs. the normal 5-10 mmHg. Here's how to measure it at home, the 3 red flags that need urgent care, and why compression stockings help."
```

为什么v3.0更好：
- 包含具体数据（20-40 mmHg vs 5-10 mmHg）— AI可引用
- 解释了机制（stiffens your heart）— 语义完整
- 保留了医学实体（heart amyloidosis, compression stockings）— 知识图谱信号
- 没有营销词 — AI不会降权
- 结构独特 — 不是模板

**案例2 — 对比类：**
```
文章：节日体重增加vs水肿
Title: "Holiday Weight Gain or Fluid Retention? How to Tell (Women 65+ With AFib)"

❌ v2.1产出:
"Learn how to tell if holiday weight gain is fluid retention or fat. Includes warning signs and when to see your doctor."

✅ v3.0产出:
"Gained 3+ pounds overnight during the holidays? With atrial fibrillation, that's likely fluid — not fat. Check ankle pitting, track daily weight before breakfast, and know the 4-pound-in-3-days rule that means call your cardiologist."
```

**案例3 — 实用指南类：**
```
文章：低钠冷冻晚餐选择
Title: "Low-Sodium Frozen Dinners: A Heart Failure Patient's Guide"

❌ v2.1产出:
"Discover the best low-sodium frozen dinner options for heart failure patients. Get proven tips for reading labels and choosing meals today."

✅ v3.0产出:
"Most 'healthy' frozen dinners pack 700-1200mg sodium per serving — half your daily limit with heart failure. We compare 8 brands under 400mg, flag hidden sodium sources like sodium citrate, and show a simple label-reading method that takes 10 seconds."
```

### 4.4 GEO关键要素清单

每篇Description必须包含以下至少3项：

| 要素 | 说明 | 示例 |
|------|------|------|
| **具体数据点** | 可被AI直接引用的数字 | "20-40 mmHg drops", "700-1200mg sodium" |
| **医学实体** | 疾病/药物/检测名 | "amyloidosis", "sodium citrate", "AFib" |
| **因果关系** | 为什么+所以 | "stiffens your heart so it can't compensate" |
| **行动指引** | 具体怎么做 | "check ankle pitting", "track daily weight" |
| **阈值/标准** | 什么时候该担心 | "4-pound-in-3-days rule", "under 400mg" |
| **对比/区分** | A vs B | "fluid — not fat", "normal 5-10 vs amyloid 20-40" |

### 4.5 Title-Description一致性

如果Title是问题，Description的前半句要**直接回应**（不是重复问题，而是给出答案的开头）：

```
Title: "Holiday Weight Gain or Fluid Retention?"
Description: "Gained 3+ pounds overnight? With AFib, that's likely fluid..."
                ↑ 直接回应问题，给出答案方向

Title: "Why Blood Pressure Drops After Walking?"
Description: "Heart amyloidosis stiffens your heart so it can't compensate..."
                ↑ 直接解释原因
```

---

## 第五部分：Slug 策略

### 不优化、不评分、不改动

- Slug字段保持原值
- 文件名保持原值
- 不新增301重定向
- 不评分（v3.0中Slug不参与评分）

**原因：**
1. GEO角度：AI系统不看URL结构
2. SEO角度：改slug的301重定向损失（-10-15%）> slug缩短的收益（+2-3%）
3. 风险角度：已有592条重定向占Vercel上限57.8%，不可持续

---

## 第六部分：评分体系

### 6.1 设计理念

v2.1的问题：公式化评分让大模型"凑分"。
v3.0的方案：**底线检查 + 语义质量评估**。

### 6.2 底线检查（通过/不通过）

每个字段必须通过以下底线检查，任一不通过则该字段不合格：

**PrimaryKeyword底线：**
- [ ] 长度在20-60字符之间
- [ ] 是一个语法完整的短语或问题（不是碎片化词组拼接）
- [ ] 包含文章的核心医学话题
- [ ] 一个65岁患者能理解这个短语在说什么

**Title底线：**
- [ ] 长度在40-70字符之间
- [ ] 不以"Understanding"、"A Comprehensive Guide"等学术词开头
- [ ] 包含文章的独特价值（不是泛泛的"Health Guide for Seniors"）
- [ ] 包含目标受众标识（年龄/疾病/药物/身份，至少一项）

**Description底线：**
- [ ] 长度在120-160字符之间
- [ ] 不使用禁止的模板结构
- [ ] 包含至少1个具体数据点或医学实体
- [ ] 与Title语义一致（Title问的问题，Description有回应）

### 6.3 语义质量评估（1-10分）

通过底线检查后，对每个字段进行语义质量评估。这不是公式计算，而是大模型基于理解力的判断。

**PrimaryKeyword语义评分 (1-10)：**
```
问自己：
- 如果我是患者，我会这样搜索吗？(权重最高)
- AI系统看到这个查询，能准确理解用户意图吗？
- 这个关键词能区分这篇文章和站内其他文章吗？

10分: 完美匹配真实用户查询，AI能精准理解
7-9分: 接近真实查询，AI基本能理解
4-6分: 有偏差，需要改进
1-3分: 碎片化/学术化/太泛，需重做
```

**Title语义评分 (1-10)：**
```
问自己：
- 在搜索结果中看到这个Title，患者会点击吗？(SEO)
- AI系统看到这个Title，能判断文章回答什么问题吗？(GEO)
- 这个Title有独特性还是千篇一律？(多样性)
- 关键医学实体是否保留？(知识图谱)

10分: 高点击率+AI可理解+独特+实体完整
7-9分: 大部分维度优秀
4-6分: 某些维度有明显短板
1-3分: 模板化/泛化/学术化，需重做
```

**Description语义评分 (1-10)：**
```
问自己：
- AI如果要引用一篇关于这个话题的文章，这段Description能让它选中这篇吗？(GEO核心)
- Description是否包含可直接引用的事实/数据？(AI引用价值)
- 是否保留了关键医学实体？(知识图谱信号)
- 是否像一位专科医生在概括文章？还是像营销文案？(权威性)
- 是否与Title语义一致？(连贯性)

10分: AI高概率引用，专业权威，数据丰富，结构独特
7-9分: AI可能引用，质量良好
4-6分: AI可能忽略，某些方面需改进
1-3分: 模板化/营销化/空洞，需重做
```

### 6.4 综合评判

```
综合分 = (PK分 + Title分 + Description分) / 3

合格标准: 综合分 ≥ 7/10 且 任一字段不低于 6/10
优秀标准: 综合分 ≥ 8/10 且 任一字段不低于 7/10
卓越标准: 综合分 ≥ 9/10
```

### 6.5 独立验证机制

**自评偏差控制：**

在批量优化中，每10篇设置1篇作为"校准文章"：
- 优化完成后，由独立的验证Task重新评分
- 如果自评与独立评分偏差 > 2分（10分制），则该批次所有文章需要重新检查
- 这解决v2.1中自评虚高27.5分的问题

---

## 第七部分：工作流程

### 7.1 单篇文章优化流程

```
Step 1: 读取原文章
  → 理解文章在讲什么（核心话题、目标受众、独特价值）
  → 记录原始slug（不改动）

Step 2: 优化PrimaryKeyword
  → 问自己"患者会怎么搜索这个问题？"
  → 写一个自然语言查询
  → 底线检查 → 语义评分

Step 3: 优化Title
  → 选择最匹配文章本质的格式（不强制疑问句）
  → 确保包含核心医学实体和受众标识
  → 底线检查 → 语义评分 → 多样性检查

Step 4: 优化Description
  → 写一段"专科医生的一句话概括"
  → 必须包含具体数据/实体/因果关系
  → 不用任何模板
  → 底线检查 → 语义评分

Step 5: 一致性检查
  → PK、Title、Description是否在说同一件事？
  → Title的问题在Description中有回应吗？
  → 核心医学实体在三个字段中都出现了吗？

Step 6: 输出
  → 优化后的metadata
  → 底线检查结果（全部通过/哪项未通过）
  → 语义评分（3个字段各1-10分 + 综合分）
  → 简要说明关键改进点
```

### 7.2 批量优化流程

```
每批50篇，10个并行Task，每Task处理5篇。

每个Task的输入：
1. 5篇文章的原始数据
2. 本标准文档（OPTIMIZATION-STANDARD-v3.0.md）
3. 不需要读取其他标准文件（v3.0是唯一标准）

每个Task的输出：
{
  "task_id": "batch-X-task-Y",
  "articles": [
    {
      "article_number": N,
      "original_slug": "...(不改动)",
      "optimized": {
        "primaryKeyword": "...",
        "title": "...",
        "description": "..."
      },
      "baseline_check": {
        "pk_pass": true/false,
        "title_pass": true/false,
        "description_pass": true/false,
        "all_pass": true/false
      },
      "semantic_scores": {
        "primaryKeyword": 8,
        "title": 9,
        "description": 8,
        "overall": 8.3
      },
      "key_changes": ["改进1", "改进2"]
    }
  ]
}

批次完成后：
1. 合并10个Task结果
2. 抽取5篇做独立验证（偏差>2分则需检查）
3. 统计综合分分布
4. 向用户报告
```

### 7.3 380篇二次修复流程

已优化的380篇只需修复Description和PrimaryKeyword：

```
每篇文章：
1. 读取当前metadata（已优化过的v2.1版本）
2. 保留Title（基本OK，除非明显模板化）
3. 重写PrimaryKeyword（碎片化 → 自然语言查询）
4. 重写Description（去模板化，加回医学实体和数据）
5. 不动Slug
```

---

## 第八部分：对比案例库

### 案例1：低钠冷冻晚餐与心力衰竭

**原始metadata（未优化）：**
```
PK: low-sodium frozen dinner choices heart failure patients elderly considerations
Title: "12 Low-Sodium Frozen Dinner Choices for Heart Failure Patients — Including Hidden Sodium Traps, Potassium Balance, and Meal-Prep Alternatives for Adults 70+ With Fluid Restrictions"
Description: "Evaluates commercial low-sodium frozen meals (<500mg/serving) through a cardiorenal lens."
```

**v2.1产出（有问题）：**
```
PK: low sodium frozen dinners heart failure seniors
Title: "Best Low-Sodium Frozen Dinners? (Heart Failure Guide 70+)"
Description: "Discover the best low-sodium frozen dinner options for heart failure. Get proven tips for reading labels and safe meal choices for seniors 70+ today."
```

**v3.0产出（改进）：**
```
PK: best low sodium frozen dinners for heart failure patients
Title: "Low-Sodium Frozen Dinners: What Heart Failure Patients Over 70 Need to Know"
Description: "Most 'healthy' frozen dinners pack 700-1200mg sodium — half your daily limit with heart failure. We compare 8 brands under 400mg, flag hidden sources like sodium citrate, and show a 10-second label check."
```

**对比分析：**
| 维度 | v2.1 | v3.0 | 差异 |
|------|------|------|------|
| PK自然度 | 词组拼接 | 完整短语 | v3.0匹配真实搜索 |
| Title独特性 | 模板"Best X? (Y Guide Z+)" | 独特陈述 | v3.0不千篇一律 |
| Description数据 | 无 | "700-1200mg"、"8 brands"、"400mg"、"sodium citrate" | v3.0可被AI引用 |
| 营销词 | "Discover"、"proven"、"today" | 无 | v3.0不会被AI降权 |
| 医学实体 | 无 | "sodium citrate"、"heart failure" | v3.0有知识图谱信号 |

### 案例2：步行后血压骤降与心脏淀粉样变

**v2.1产出：**
```
PK: blood pressure drops walking heart amyloid
Title: "Blood Pressure Dropping After Walks? (Heart Amyloid Guide 74+)"
Description: "Blood pressure crashing after walks? Learn why heart amyloid causes dangerous drops, 3 warning signs, and safe monitoring steps for adults 74+."
```

**v3.0产出：**
```
PK: why does blood pressure drop so much after walking with cardiac amyloidosis
Title: "Why Blood Pressure Drops Dangerously After Walking With Heart Amyloidosis"
Description: "Cardiac amyloidosis stiffens the heart so it can't compensate during walks — causing 20-40 mmHg drops vs. normal 5-10 mmHg. Here's the 3-minute post-walk test, 3 red flags for urgent care, and why compression stockings (20-30 mmHg) help."
```

### 案例3：听力助听器与晨间血压

**v2.1产出：**
```
PK: hearing aids blood pressure morning spikes
Title: "Hearing Aids Raising Your Morning BP? (Guide for Seniors 65+)"
Description: "Learn how hearing aids affect morning blood pressure in seniors. Includes tips for monitoring, adjustment strategies, and when to talk to your doctor."
```

**v3.0产出：**
```
PK: can hearing aids cause morning blood pressure spikes in seniors
Title: "Your Hearing Aids May Be Raising Morning Blood Pressure — Here's Why"
Description: "New hearing aids amplify ambient noise by 15-25 dB, triggering a sympathetic stress response that can add 8-15 mmHg to morning systolic readings. How to test: compare BP with aids in vs. out for 3 mornings. If the gap exceeds 10 mmHg, ask your audiologist about compression settings."
```

---

## 第九部分：常见错误对照表

| # | 错误 | 为什么是错误 | 正确做法 |
|---|------|------------|---------|
| 1 | PK: "hearing aids blood pressure morning spikes" | 名词堆砌，不是自然查询 | "can hearing aids cause morning blood pressure spikes" |
| 2 | Title: "Your X? (Y Guide Z+)" 每篇都用 | AI判断为批量生成内容 | 根据文章本质选择不同格式 |
| 3 | Desc: "Learn how X affects Y. Includes A, B, and C." | 模板化，无数据，AI无法引用 | 写具体数据+因果关系+行动指引 |
| 4 | Desc: "Discover proven tips today" | 营销词，AI降权促销内容 | 删掉营销词，用事实替代 |
| 5 | 把"amyloidosis"替换为"heart problems" | 过度简化，丢失AI引用的精确实体 | 保留"amyloidosis"+加通俗解释 |
| 6 | 改slug + 做301 | 损失10-15%权重，GEO无益 | 不改slug |
| 7 | 自评9.2分，独立评估6.4分 | 公式凑分 | 语义质量判断，独立验证偏差控制 |

---

## 第十部分：版本历史与迁移

### 从v2.1迁移到v3.0

**已优化的380篇（v2.1标准）：**
- Title: 基本保留（除非明显模板化严重的）
- PrimaryKeyword: 需要重写（碎片化 → 自然语言）
- Description: 需要重写（模板化 → 独特+数据+实体）
- Slug: 不动

**未优化的1,829篇：**
- 直接使用v3.0标准
- 不再参考v2.1标准

### 版本历史

| 版本 | 日期 | 核心变化 |
|------|------|---------|
| v1.0 | 2026-03-13 | 初始标准，分散在多个文件 |
| v2.0 | 2026-03-16 | 整合为单一文档，硬性评分公式 |
| v2.1 | 2026-03-18 | 新增Description的语义完整性和问答一致性 |
| **v3.0** | **2026-03-25** | **GEO优先重构：软规则+语义驱动，去模板化，保留医学实体** |

### 旧标准文件处理

以下文件在v3.0生效后归档到`.claude/skills/DEPRECATED/`：
- MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md
- MASTER-METADATA-OPTIMIZATION-STANDARD.md
- slug-optimization-standard.md
- title-optimization-standard.md
- description-optimization-standard.md
- METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md

---

**🔒 此文档为v3.0官方标准，所有优化任务必须遵循**
**📌 文档路径**: `.claude/skills/OPTIMIZATION-STANDARD-v3.0.md`
