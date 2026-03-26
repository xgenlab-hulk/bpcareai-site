# 内容优化软标准（Content Optimization Standard）

**版本**: v1.0
**生效日期**: 2026-03-18
**状态**: 🔓 软标准 - LLM根据上下文定制化判断

---

## ⚠️ 重要说明

这是**内容优化的软标准文档**，与Metadata硬标准不同：

**硬标准 vs 软标准**：
- 📏 **Metadata优化**（硬标准）：可量化、可计算、评分精确
- 🧠 **Content优化**（软标准）：需要LLM判断、上下文理解、定制化评估

**使用原则**：
1. ✅ LLM根据文章主题、受众、语境灵活判断
2. ✅ 标准提供评估框架，而非刚性规则
3. ✅ 重视用户体验和实际价值，而非机械执行
4. ❌ 不能机械套用模板和公式

---

## 📋 优化目标

每篇文章的内容优化包含6个维度：
1. **H1标题优化** - 用户友好度优先
2. **内容结构优化** - 逻辑流程清晰
3. **FAQ优化** - GEO关键维度
4. **技术语言简化** - 50-80岁受众理解度
5. **事实密度** - 可验证的具体信息
6. **用户价值/可操作性** - 今天就能执行的建议

**成功标准**: 每个维度≥85%得分率，总体≥85分

---

# 第一部分：H1标题优化

## 评分目标：≥17分 (满分20分)

### 评估维度

**核心原则**：与Title高度一致，但更自然、用户友好

| 维度 | 评估标准 |
|------|---------|
| **Title一致性** | H1是否保留Title核心意图和关键词？ |
| **用户友好度** | 50岁的人能立即看懂吗？无需思考？ |
| **术语简化** | 是否避免了学术术语和医学缩写？ |
| **自然流畅** | 读起来是自然的人类语言吗？ |

### LLM评分指南

**评估问题（20分制）**：

```
1. 这个H1是否比Title更容易理解？
   - 是：保持分数
   - 否：扣5分

2. 50岁的人能立即明白这篇文章讲什么吗？
   - 能，一眼看懂：20分
   - 需要思考2-3秒：15分
   - 需要思考5秒以上：10分
   - 不理解：5分

3. 是否避免了学术术语？
   - 完全无学术词：+0分
   - 1-2个专业词但解释清楚：-2分
   - 多个专业词未解释：-5分

4. 是否与Title核心关键词一致？
   - 完全一致：+0分
   - 部分偏离：-3分
   - 完全偏离：-8分
```

### 标准案例

```
✅ 20分案例:
Title: "Holiday Food Upsetting Your Stomach? (PPI Users Guide)"
H1: "Why Holiday Meals Upset Your Stomach If You Take Acid Reflux Medicine"

评估：
- Title一致性: 完全一致 (0分扣除)
- 用户友好: 一眼看懂 (20分基础)
- 术语简化: "acid reflux medicine"替代"PPI" (+0分)
- 自然流畅: 完全自然 (+0分)
总分: 20分

✅ 18分案例:
Title: "Keeping Your BP Down While Caring for Spouse with Dementia"
H1: "Managing Blood Pressure When You're a Dementia Caregiver"

评估：
- Title一致性: 高度一致 (0分扣除)
- 用户友好: 清晰明了 (20分基础)
- 术语: "Blood Pressure"略专业 (-2分)
- 自然流畅: 自然 (+0分)
总分: 18分

❌ 12分案例:
Title: "Holiday Food Upsetting Your Stomach? (PPI Users Guide)"
H1: "Understanding Proton Pump Inhibitor-Induced Gastroparesis During Holiday Season"

评估：
- Title一致性: 偏离严重 (-8分)
- 用户友好: 需要思考10秒 (10分基础)
- 术语: 多个医学术语 (-5分)
- 自然流畅: 学术化 (-3分)
总分: 12分 ❌
```

### 优化技巧

**从Title到H1的转化**：

```
Title → H1 转化原则：
1. 问句 → 陈述句或更详细的问句
2. 缩写 → 完整词（但避免学术术语）
3. 简短 → 稍微展开（但保持简洁）

示例1：
Title: "BP Drops After Walking? (Heart Amyloid Guide)"
H1: "Why Your Blood Pressure Drops After Walking: A Guide for Heart Amyloid Patients"
(BP→Blood Pressure, 保持核心主题)

示例2：
Title: "Low Blood Sugar After Meals? (50-59 Essential Guide)"
H1: "Understanding Low Blood Sugar After Eating: Essential Guide for Ages 50-59"
(保持问题意图，稍微展开)

示例3：
Title: "12 Foods to Stop Reflux After Meals (Seniors 60+)"
H1: "12 Foods That Stop Acid Reflux After Meals for Seniors Over 60"
(保持数字和承诺，转为陈述句)
```

---

# 第二部分：内容结构优化

## 评分目标：≥17分 (满分20分)

### 评估维度

**核心原则**：清晰的层级、顺畅的逻辑、适中的段落

| 维度 | 评估标准 |
|------|---------|
| **H2/H3层级** | 标题层级是否清晰？是否超过3级？ |
| **逻辑流程** | 内容是否按合理顺序展开？ |
| **段落长度** | 每段是否控制在50-150词？ |
| **可扫描性** | 快速扫描能否抓住要点？ |

### LLM评分指南

**评估问题（20分制）**：

```
1. H2/H3层级清晰度 (6分)
   - H2主题明确，H3支撑逻辑：6分
   - H2清晰，H3略混乱：4分
   - 层级混乱或过深（>3级）：2分

2. 逻辑流程顺畅度 (8分)
   评估：内容是否按合理顺序展开？

   推荐顺序：
   - 问题识别 → 原因解释 → 解决方案 → 具体建议
   - 或：现状 → 风险 → 预防 → 行动步骤

   评分：
   - 完全顺畅，自然过渡：8分
   - 大部分顺畅，1-2处跳跃：6分
   - 多处逻辑跳跃：4分
   - 混乱无序：2分

3. 段落长度适中 (3分)
   - 90%段落在50-150词：3分
   - 70-89%段落符合：2分
   - <70%段落符合：1分

4. 可扫描性 (3分)
   - 使用列表、加粗、小标题：3分
   - 部分使用：2分
   - 纯文本墙：1分
```

### 标准案例

```
✅ 19分案例:
H1: "Why Holiday Meals Upset Your Stomach If You Take Acid Reflux Medicine"

H2: How Acid Reflux Medicine Works (问题背景)
  H3: What PPIs Do in Your Stomach
  H3: Why This Affects Digestion

H2: 3 Reasons Holiday Food Causes Problems (原因解释)
  - 段落1: 高脂肪食物 (80词)
  - 段落2: 酒精影响 (95词)
  - 段落3: 进餐时间紊乱 (75词)

H2: 3 At-Home Tests You Can Try Today (解决方案)
  H3: Test 1: Food Timing Test
  H3: Test 2: Portion Size Test
  H3: Test 3: Symptom Tracking

H2: Meal Timing Tricks That Prevent Bloating (具体建议)
  - 使用列表和加粗

评估：
- H2/H3层级: 清晰完美 (6分)
- 逻辑流程: 背景→原因→方案→建议，完美 (8分)
- 段落长度: 全部符合50-150词 (3分)
- 可扫描性: 列表+加粗+小标题 (3分)
总分: 20分

✅ 17分案例:
H1: "Managing Blood Pressure When You're a Dementia Caregiver"

H2: The BP-Stress Connection for Caregivers
  - 段落1: 压力机制 (120词)
  - 段落2: 睡眠影响 (180词) ← 略长

H2: 5 Proven Strategies to Keep BP Down
  H3: Strategy 1: Micro-Breaks
  H3: Strategy 2: Sleep Hygiene
  (依次展开)

H2: When to Adjust Your BP Medication
  - 3个警示信号

评估：
- H2/H3层级: 清晰 (6分)
- 逻辑流程: 问题→方案→警示，顺畅 (8分)
- 段落长度: 1个段落超150词 (2分)
- 可扫描性: 有列表和小标题 (2分)
总分: 18分

❌ 12分案例:
H1: "Understanding PPI-Induced Gastroparesis"

H2: Clinical Mechanisms of PPIs
  H3: Pharmacokinetic Profile
    H4: Absorption Pathway ← 层级过深
    H4: Metabolic Processing

H2: Dietary Modifications (逻辑跳跃，缺中间步骤)
  - 200词大段落 × 3

H2: Pathophysiology Discussion (逻辑倒置)

评估：
- H2/H3层级: 过深且混乱 (2分)
- 逻辑流程: 跳跃且倒置 (4分)
- 段落长度: 多数超标 (1分)
- 可扫描性: 纯文本 (1分)
总分: 8分 ❌
```

---

# 第三部分：FAQ优化

## 评分目标：≥21分 (满分25分) - GEO关键！

### 评估维度

**核心原则**：自然问题 + 直接答案 + 具体信息

| 维度 | 评估标准 |
|------|---------|
| **问题数量** | 是否有3-5个问题？ |
| **自然度** | 问题是否像真实用户会问的？ |
| **答案质量** | 是否直接回答且包含具体信息？ |
| **答案长度** | 每个答案是否控制在50-150词？ |
| **数据支持** | 是否包含具体数字/研究引用？ |

### LLM评分指南

**评估问题（25分制）**：

```
1. 问题数量 (5分)
   - 3-5个问题：5分
   - 2个问题：3分
   - 1个或无：0分

2. 问题自然度 (8分)
   评估：这些问题是真实用户会在Google搜索的吗？

   ✅ 自然问题特征：
   - 使用口语化表达
   - 聚焦具体困惑或痛点
   - 包含受众特征（如"我60岁"）

   ❌ 不自然问题特征：
   - 学术化问题（"What is the pathophysiology of..."）
   - 过于宽泛（"What is health?"）
   - 机械套用格式

   评分：
   - 全部问题非常自然：8分
   - 大部分自然（3-4个自然）：6分
   - 部分自然（1-2个自然）：3分
   - 全部不自然：0分

3. 答案质量 (8分)
   评估：答案是否直接回答问题并提供价值？

   ✅ 优质答案特征：
   - 第一句直接回答问题
   - 包含具体信息（数字、步骤、例子）
   - 提供可操作建议
   - 50-150词之间

   评分：
   - 全部答案优质：8分
   - 大部分优质：6分
   - 部分优质：3分
   - 答案泛泛或离题：0分

4. 数据支持 (4分)
   评估：是否包含具体数据或研究引用？

   示例：
   - "研究显示60%的患者..."
   - "Mayo Clinic建议..."
   - "临床数据表明..."

   评分：
   - 每个答案有数据支持：4分
   - 大部分答案有数据：3分
   - 少量答案有数据：2分
   - 无数据支持：0分
```

### 标准案例

```
✅ 25分案例:
FAQ标题: "Common Questions About Holiday Meals and Acid Reflux Medicine"

Q1: "I'm 65 and take omeprazole daily. Why do I feel so bloated after Thanksgiving dinner?"
A1: "Omeprazole (a PPI) reduces stomach acid by up to 90%, which slows down protein digestion—especially from turkey and ham. During large holiday meals, this delayed digestion causes gas buildup and bloating. Try eating smaller portions (about half your usual plate size) and wait 3-4 hours between courses instead of grazing all day. A 2023 Johns Hopkins study found this timing adjustment reduced bloating by 65% in PPI users over 60."
(126词，直接答案+数字+研究)

Q2: "Can I drink wine at Christmas if I take Prilosec?"
A2: "Yes, but limit to 1 glass and drink it with food—not on an empty stomach. PPIs like Prilosec already slow digestion, and alcohol adds to this effect. Together they can cause acid reflux rebound within 2-3 hours. If you notice heartburn after that first glass, stop there and switch to water. The American Gastroenterological Association recommends waiting at least 2 hours after your last PPI dose before drinking any alcohol."
(98词，直接答案+具体建议+权威引用)

Q3: "How long before a holiday party should I take my PPI?"
A3: "Take your PPI 30-60 minutes before the first meal of your party. This gives it time to block acid production before food arrives. Don't take it right before eating or with food—this reduces effectiveness by up to 50% according to Cleveland Clinic research. For evening parties, if you normally take your PPI in the morning, stick to that schedule and avoid late-night snacking after 8 PM."
(89词，具体时间+数字+研究+实用建议)

评估：
- 问题数量: 3个 (5分)
- 自然度: 全部非常自然，包含受众特征 (8分)
- 答案质量: 全部直接回答+具体信息 (8分)
- 数据支持: 每个答案有研究或数字 (4分)
总分: 25分

✅ 22分案例:
FAQ标题: "Your Blood Pressure Questions as a Dementia Caregiver"

Q1: "Why does my BP spike every time my spouse wakes me up at night?"
A1: "Sudden nighttime wake-ups trigger a stress hormone surge that can raise BP by 15-25 points within minutes. This is especially common for dementia caregivers who average 4-6 sleep interruptions per night. The repeated spikes put strain on your heart over time. Keep a small BP monitor by your bed and measure 10 minutes after waking—if it's over 140/90, practice 5 deep breaths before getting up."
(98词，直接答案+数字+建议)

Q2: "Should I adjust my BP meds when caregiving gets stressful?"
A2: "Never adjust on your own, but track your readings for 7 days and share them with your doctor. Stress-induced spikes are different from chronic high BP. Your doctor may suggest a short-term adjustment or timing change—like taking evening BP meds if your spikes happen at night. About 30% of dementia caregivers need medication adjustments according to caregiver health studies."
(85词，直接答案+流程+统计)

Q3: "What's a realistic BP target when I'm this stressed?"
A3: "Aim for under 140/90 for most readings, but don't panic over occasional spikes to 150/95 during acute stress. Focus on your average over a week rather than single readings. If your weekly average stays above 140/90 for two weeks straight, call your doctor. The American Heart Association recognizes that caregiver stress is a valid reason for slightly relaxed short-term targets."
(82词，具体目标+权威引用)

评估：
- 问题数量: 3个 (5分)
- 自然度: 非常自然，真实痛点 (8分)
- 答案质量: 直接+具体，但第3个答案略泛 (7分)
- 数据支持: 2个有明确数据 (2分)
总分: 22分

❌ 15分案例:
FAQ标题: "Proton Pump Inhibitor Information"

Q1: "What are PPIs?"
A1: "PPIs are medications that reduce stomach acid production. They are commonly used to treat acid reflux and related conditions. Many people take them daily for chronic symptoms."
(35词，过短+泛泛+未回答具体价值)

Q2: "How do PPIs work?"
A2: "PPIs work by blocking the proton pumps in the stomach lining that produce acid. This mechanism allows for healing of the esophagus and reduction of symptoms associated with excess acid production."
(40词，学术化+缺具体信息)

Q3: "Are there side effects?"
A3: "Like all medications, PPIs can have side effects. Common ones include headache, nausea, and diarrhea. Long-term use may be associated with other health concerns. Consult your doctor if you experience any unusual symptoms."
(45词，泛泛+无具体数据+无可操作建议)

评估：
- 问题数量: 3个 (5分)
- 自然度: 过于宽泛和学术 (3分)
- 答案质量: 未直接回答痛点，泛泛 (3分)
- 数据支持: 无任何数据或研究 (0分)
总分: 11分 ❌
```

### FAQ优化技巧

**从泛泛问题到自然问题的转化**：

```
❌ 泛泛: "What is blood pressure?"
✅ 自然: "Why does my BP go up when I'm stressed about my spouse's dementia?"

❌ 泛泛: "How do PPIs work?"
✅ 自然: "I'm 65 and take omeprazole. Why do I feel bloated after big meals?"

❌ 泛泛: "What are the side effects?"
✅ 自然: "Can I still drink wine at Christmas if I take Prilosec?"

❌ 泛泛: "How long does treatment take?"
✅ 自然: "How many weeks before my PPI starts working for holiday reflux?"
```

---

# 第四部分：技术语言简化

## 评分目标：≥13分 (满分15分)

### 评估维度

**核心原则**：50-80岁受众能轻松理解

| 维度 | 评估标准 |
|------|---------|
| **术语频率** | 专业术语出现频率是否适中？ |
| **术语解释** | 必要术语是否解释清楚？ |
| **类比使用** | 是否使用类比或例子？ |
| **阅读难度** | 65岁的人能轻松阅读吗？ |

### LLM评分指南

**评估问题（15分制）**：

```
1. 专业术语处理 (6分)
   评估：是否避免或解释专业术语？

   ✅ 优秀示例：
   - "proton pump inhibitors (PPIs)"第一次出现时解释
   - 后续用"acid reflux medicine"或"your medication"
   - 避免"gastroparesis", "subclinical"等学术词

   评分标准：
   - 专业词<3个且都解释：6分
   - 专业词3-5个，大部分解释：4分
   - 专业词>5个或多数未解释：2分
   - 学术化严重：0分

2. 类比和例子 (5分)
   评估：是否使用日常生活类比？

   示例：
   - "PPIs are like turning down a faucet in your stomach"
   - "Think of your blood pressure like water pressure in a hose"
   - "Imagine your digestive system as a conveyor belt..."

   评分标准：
   - 多处使用类比（≥3次）：5分
   - 使用1-2个类比：3分
   - 无类比，纯描述：1分

3. 整体阅读难度 (4分)
   评估测试：
   "假设你是一位65岁的退休教师，能不费力地读完这篇文章吗？"

   考虑因素：
   - 句子长度（建议<25词/句）
   - 段落复杂度
   - 整体语气（对话式 vs 学术式）

   评分标准：
   - 完全轻松阅读：4分
   - 需要集中注意力：3分
   - 需要反复阅读某些段落：2分
   - 难以理解：0分
```

### 标准案例

```
✅ 15分案例:
段落示例：
"Think of PPIs like a dimmer switch for stomach acid. Normally, your stomach produces acid like a faucet running at full blast—strong enough to break down a steak in 3-4 hours. PPIs turn that faucet down to about 10% flow. This is great for stopping heartburn, but it also means your stomach takes much longer to digest protein-heavy holiday foods like turkey or ham. That's why you might feel uncomfortably full 2-3 hours after Thanksgiving dinner, even though you didn't overeat."

评估：
- 专业术语: 只有"PPIs"且开头解释 (6分)
- 类比: "dimmer switch", "faucet"类比 (5分)
- 阅读难度: 对话式，句子简短 (4分)
总分: 15分

✅ 13分案例:
段落示例：
"Proton pump inhibitors (PPIs) work by reducing stomach acid production. When you take these medications, your stomach makes about 90% less acid than usual. This helps with acid reflux, but it also means food digests more slowly. For example, a high-fat meal that normally takes 3 hours to digest might take 5-6 hours when you're on PPIs. This is why many people experience bloating after large meals."

评估：
- 专业术语: "PPIs"解释，"proton pump"略专业 (4分)
- 类比: 用了时间例子但不够形象 (3分)
- 阅读难度: 清晰但稍正式 (3分)
总分: 10分

❌ 8分案例:
段落示例：
"The pharmacodynamic mechanism of proton pump inhibitors involves irreversible binding to H+/K+-ATPase enzymes at the secretory surface of gastric parietal cells. This covalent modification results in profound suppression of basal and stimulated gastric acid secretion, with subsequent implications for gastric proteolytic capacity and small bowel bacterial overgrowth potential, particularly in the context of high-lipid alimentary intake during celebratory occasions."

评估：
- 专业术语: 严重学术化，无解释 (0分)
- 类比: 无任何类比 (1分)
- 阅读难度: 需要医学背景才能理解 (0分)
总分: 1分 ❌
```

---

# 第五部分：事实密度

## 评分目标：≥8.5分 (满分10分)

### 评估维度

**核心原则**：包含可验证的具体信息

| 维度 | 评估标准 |
|------|---------|
| **数字引用** | 是否包含具体百分比、数量、时间？ |
| **研究引用** | 是否引用权威机构或研究？ |
| **可验证性** | 事实声明是否可以验证？ |

### LLM评分指南

**评估问题（10分制）**：

```
1. 具体数字频率 (5分)
   统计整篇文章中的具体数字：
   - 百分比（"60%的患者..."）
   - 数量（"3个测试"，"5个策略"）
   - 时间（"30-60分钟"，"2-3小时"）
   - 剂量/测量值（"140/90", "25 points"）

   评分标准：
   - ≥10个具体数字：5分
   - 6-9个具体数字：4分
   - 3-5个具体数字：3分
   - 1-2个具体数字：2分
   - 无具体数字：0分

2. 权威引用 (3分)
   检查是否引用：
   - 医疗机构（Mayo Clinic, Cleveland Clinic, Johns Hopkins）
   - 专业组织（American Heart Association, AGA）
   - 研究或临床数据

   评分标准：
   - ≥3个权威引用：3分
   - 1-2个权威引用：2分
   - 无权威引用：0分

3. 事实可验证性 (2分)
   评估：声明是否足够具体，可以验证？

   ✅ 可验证：
   - "A 2023 Johns Hopkins study found..."
   - "The American Heart Association recommends..."
   - "Clinical data shows 60% of patients..."

   ❌ 不可验证：
   - "Studies show that..."（哪个研究？）
   - "Experts recommend..."（哪些专家？）
   - "Many people find..."（多少？）

   评分标准：
   - 大部分声明可验证：2分
   - 部分声明可验证：1分
   - 泛泛声明，无法验证：0分
```

### 标准案例

```
✅ 10分案例:
文章摘要：
"Omeprazole reduces stomach acid by up to 90% (Cleveland Clinic, 2024), which extends protein digestion time from 3-4 hours to 5-6 hours. A 2023 Johns Hopkins study of 1,200 PPI users over 60 found that 65% experienced post-meal bloating during holidays. The American Gastroenterological Association recommends waiting 30-60 minutes after taking your PPI before eating, and limiting meal portions to about half your usual plate size. Clinical data shows this timing adjustment reduces bloating by 45% within the first week."

统计：
- 具体数字: 90%, 3-4小时, 5-6小时, 2023, 1,200人, 60岁, 65%, 30-60分钟, 50%, 45%, 1周 = 13个数字 (5分)
- 权威引用: Cleveland Clinic, Johns Hopkins, American Gastroenterological Association = 3个 (3分)
- 可验证性: 所有声明都有具体来源和数字 (2分)
总分: 10分

✅ 8.5分案例:
文章摘要：
"PPIs slow digestion significantly, which is why many people feel bloated after large meals. Research shows that caregivers experience more BP spikes than non-caregivers—averaging 4-6 sleep interruptions per night. The American Heart Association recommends keeping BP under 140/90. About 30% of dementia caregivers need medication adjustments according to recent studies. Simple strategies like taking 5 deep breaths can lower BP by 10-15 points within minutes."

统计：
- 具体数字: 4-6次, 140/90, 30%, 5次, 10-15点 = 8个数字 (4分)
- 权威引用: American Heart Association, "recent studies"（略泛） = 1.5个 (2分)
- 可验证性: 部分声明泛泛（"Research shows"） (1分)
总分: 7分

❌ 3分案例:
文章摘要：
"PPIs are effective medications for acid reflux. Many patients take them daily for symptom management. It's important to follow your doctor's recommendations and maintain a healthy lifestyle. Studies have shown various benefits and some potential side effects with long-term use. Eating smaller meals and avoiding trigger foods can help improve digestive comfort during the holidays."

统计：
- 具体数字: 0个 (0分)
- 权威引用: 0个，泛泛提及"studies" (0分)
- 可验证性: 全部是泛泛声明 (0分)
总分: 0分 ❌
```

---

# 第六部分：用户价值/可操作性

## 评分目标：≥8.5分 (满分10分)

### 评估维度

**核心原则**：今天就能执行的实际建议

| 维度 | 评估标准 |
|------|---------|
| **具体步骤** | 是否提供"如何做"的步骤？ |
| **可执行性** | 读者今天就能执行吗？ |
| **实用性** | 建议是否切实可行？ |

### LLM评分指南

**评估问题（10分制）**：

```
1. 具体步骤 (5分)
   统计文章中的可操作建议数量：
   - 必须是"how to"格式
   - 必须有清晰步骤
   - 必须具体而非泛泛

   示例：
   ✅ "Take your PPI 30 minutes before eating, not with food."
   ✅ "Eat half your usual plate size and wait 3 hours between courses."
   ✅ "Keep a BP monitor by your bed and measure 10 minutes after waking."
   ❌ "Eat healthier." （太泛）
   ❌ "Consult your doctor." （不是self-action）

   评分标准：
   - ≥5个具体可操作建议：5分
   - 3-4个建议：4分
   - 1-2个建议：2分
   - 无具体建议：0分

2. 立即可执行性 (3分)
   评估："今天"就能执行的建议有多少？

   ✅ 今天可执行：
   - "Drink your PPI with water, not coffee"
   - "Try eating dinner 3 hours before bed tonight"
   - "Take 5 deep breaths when you feel stressed"

   ❌ 不能今天执行：
   - "Schedule an appointment with your doctor next month"
   - "Consider long-term lifestyle changes"

   评分标准：
   - ≥3个今天可执行：3分
   - 1-2个今天可执行：2分
   - 需要准备/预约才能执行：1分

3. 实用性/可行性 (2分)
   评估：建议是否现实可行？

   ✅ 可行：
   - "Eat half your usual plate size"
   - "Wait 30 minutes after your PPI to eat"

   ❌ 不可行或过于理想化：
   - "Never eat fatty foods again"
   - "Eliminate all stress from caregiving"
   - "Get 8 hours of uninterrupted sleep every night" (对失眠照护者不现实)

   评分标准：
   - 所有建议都现实可行：2分
   - 部分建议不切实际：1分
   - 建议过于理想化：0分
```

### 标准案例

```
✅ 10分案例:
文章内容：
"5 Things You Can Do Today to Prevent Holiday Bloating:

1. Take Your PPI 30-60 Minutes Before Eating
   - Set a phone alarm for 30 minutes before your holiday meal
   - Take it with water, not coffee or juice
   - Don't take it with food—this reduces effectiveness by up to 50%

2. Try the Half-Plate Strategy
   - Put your usual amount on your plate, then remove half
   - Eat slowly over 20-30 minutes
   - Wait 3 hours before going back for seconds

3. Keep a Symptom Journal Tonight
   - Write down what you ate and when
   - Note any bloating or discomfort timing
   - Track which foods caused problems
   - Share this with your doctor next visit

4. Test Your Meal Timing
   - Tonight, eat dinner at 6 PM (not 8 PM)
   - Notice if earlier eating reduces nighttime reflux
   - Adjust tomorrow based on results

5. Practice the 5-Breath Rule
   - When you feel bloated, stop eating
   - Take 5 slow deep breaths (4 seconds in, 6 seconds out)
   - Wait 10 minutes before deciding if you're still hungry"

评估：
- 具体步骤: 5个明确策略，每个有详细步骤 (5分)
- 立即可执行: 全部今天就能执行 (3分)
- 实用性: 全部现实可行 (2分)
总分: 10分

✅ 8分案例:
文章内容：
"Managing Your BP as a Caregiver:

1. Micro-Break Strategy
   - Set a timer for every 2 hours
   - Step outside for 5 minutes
   - Take 3 deep breaths

2. Sleep Hygiene Tips
   - Keep a white noise machine by the bed
   - Use blackout curtains
   - Try melatonin 1 hour before sleep

3. Medication Timing
   - Talk to your doctor about switching to evening BP meds
   - This can help if your spikes happen at night"

评估：
- 具体步骤: 3个策略，但#3不够具体（需要医生） (4分)
- 立即可执行: #1和#2今天可执行，#3需要预约 (2分)
- 实用性: 全部可行 (2分)
总分: 8分

❌ 4分案例:
文章内容：
"To improve your digestive health during the holidays, consider the following recommendations:

- Maintain a balanced diet
- Exercise regularly
- Avoid trigger foods
- Stay hydrated
- Get adequate sleep
- Manage stress levels
- Consult with your healthcare provider about medication options"

评估：
- 具体步骤: 泛泛建议，无具体步骤 (1分)
- 立即可执行: "stay hydrated"可以今天做 (1分)
- 实用性: 建议过于泛泛 (1分)
总分: 3分 ❌
```

---

# 第七部分：整体一致性检查

## Metadata-Content匹配度

**核心原则**：Metadata承诺的价值，Content必须实际提供

### 一致性检查清单

```
1. Title问题 → Content回答
   Title: "Holiday Food Upsetting Your Stomach? (PPI Users Guide)"
   Content必须：
   - [ ] H1呼应这个问题
   - [ ] 解释为什么PPIs导致胃不适
   - [ ] 提供具体解决方案
   - [ ] FAQ深化相关问题

2. Description承诺 → Content实现
   Description: "Discover why PPIs change digestion, plus 3 tests you can do today..."
   Content必须：
   - [ ] 解释PPIs如何改变消化
   - [ ] 提供恰好3个测试（不能是2个或4个）
   - [ ] 测试必须是"今天就能做"的

3. 目标受众一致
   Metadata: "seniors 60+"
   Content必须：
   - [ ] 语言适合60+岁阅读
   - [ ] 例子和建议符合60+岁情境
   - [ ] 避免"年轻人才会做"的建议

4. 语气和风格一致
   Metadata: 疑问句+情感钩子
   Content应该：
   - [ ] 对话式语气
   - [ ] 避免学术口吻
   - [ ] 呼应读者痛点
```

---

# 第八部分：最终成功标准

## 评分汇总

| 维度 | 满分 | 及格线 (85%) | 权重 |
|------|------|-------------|------|
| H1标题 | 20 | 17 | 20% |
| 内容结构 | 20 | 17 | 20% |
| FAQ优化 | 25 | 21 | 25% |
| 技术语言 | 15 | 13 | 15% |
| 事实密度 | 10 | 8.5 | 10% |
| 可操作性 | 10 | 8.5 | 10% |
| **总计** | **100** | **≥85** | **100%** |

## 成功标准

```
✅ 内容优化成功：
- 每个维度≥85%得分率
- 总体评分≥85分
- Metadata-Content高度一致

❌ 需要重新优化：
- 任何一个维度<85%
- 或总体评分<85分
- 或Metadata-Content不一致
```

---

# 附录：LLM评估提示词模板

使用此模板进行Content优化评估：

```
你是一位内容质量评估专家。请根据《CONTENT-OPTIMIZATION-STANDARD-v1.0》对以下文章进行评估。

文章Metadata：
- Title: [title]
- Description: [description]
- 目标受众: [audience]

文章Content：
[full content]

请逐维度评估（使用软标准判断）：

1. H1标题优化 (20分)
   - Title一致性：
   - 用户友好度：
   - 术语简化：
   评分：___/20

2. 内容结构优化 (20分)
   - H2/H3层级：
   - 逻辑流程：
   - 段落长度：
   评分：___/20

3. FAQ优化 (25分)
   - 问题数量：
   - 自然度：
   - 答案质量：
   - 数据支持：
   评分：___/25

4. 技术语言简化 (15分)
   - 专业术语处理：
   - 类比使用：
   - 阅读难度：
   评分：___/15

5. 事实密度 (10分)
   - 具体数字频率：
   - 权威引用：
   - 可验证性：
   评分：___/10

6. 可操作性 (10分)
   - 具体步骤：
   - 立即可执行：
   - 实用性：
   评分：___/10

总分：___/100

Metadata-Content一致性：
- [ ] Title问题→Content回答
- [ ] Description承诺→Content实现
- [ ] 受众一致
- [ ] 语气一致

最终结论：
[ ] ✅ 通过 (≥85分)
[ ] ❌ 需要优化 (<85分)

具体优化建议：
1. ...
2. ...
3. ...
```

---

# 版本历史

## v1.0 (2026-03-18) - 当前版本

**首次发布**：内容优化软标准

- ✅ 定义6大优化维度
- ✅ 提供LLM评估指南
- ✅ 强调软标准+定制化判断
- ✅ 包含丰富案例和评分示例
- ✅ 整合Metadata-Content一致性检查

---

**🔓 此文档为软标准，需要LLM根据上下文灵活判断**

**📌 文档路径**: `.claude/skills/CONTENT-OPTIMIZATION-STANDARD-v1.0.md`
