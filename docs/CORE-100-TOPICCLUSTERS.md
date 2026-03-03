# 100个核心TopicClusters定义

**目的**：将现有1731个topicCluster精简到100个，避免随意生成

**原则**：
1. 覆盖所有主要医疗健康主题
2. 每个cluster足够broad，可容纳多篇文章
3. 每个cluster足够specific，有明确的语义边界
4. 支持GEO（LLM容易理解）

---

## 🏗️ **结构：5大支柱 × 20个子类 = 100个Clusters**

### **支柱1：心血管健康 (Cardiovascular Health) - 30个**

#### **1.1 高血压相关 (10个)**
1. `hypertension-basics` - 高血压基础知识
2. `hypertension-monitoring` - 血压监测和设备
3. `hypertension-medication` - 降压药物
4. `hypertension-lifestyle` - 高血压生活方式
5. `hypertension-diet` - 高血压饮食
6. `hypertension-complications` - 高血压并发症
7. `hypertension-secondary` - 继发性高血压
8. `hypertension-resistant` - 难治性高血压
9. `hypertension-elderly` - 老年人高血压
10. `hypertension-seasonal` - 季节性血压变化

#### **1.2 心脏疾病 (10个)**
11. `heart-disease-prevention` - 心脏病预防
12. `heart-disease-symptoms` - 心脏病症状
13. `heart-disease-diagnosis` - 心脏病诊断
14. `heart-disease-treatment` - 心脏病治疗
15. `heart-failure` - 心力衰竭
16. `atrial-fibrillation` - 房颤
17. `coronary-artery-disease` - 冠心病
18. `heart-valve-disease` - 心脏瓣膜病
19. `cardiomyopathy` - 心肌病
20. `arrhythmia` - 心律失常

#### **1.3 血管和循环 (10个)**
21. `vascular-health` - 血管健康
22. `atherosclerosis` - 动脉粥样硬化
23. `peripheral-artery-disease` - 外周动脉疾病
24. `venous-insufficiency` - 静脉功能不全
25. `blood-clots` - 血栓
26. `aneurysm` - 动脉瘤
27. `stroke-prevention` - 中风预防
28. `circulation-improvement` - 循环改善
29. `endothelial-health` - 内皮健康
30. `microvascular-disease` - 微血管疾病

---

### **支柱2：糖尿病管理 (Diabetes Management) - 25个**

#### **2.1 血糖控制 (8个)**
31. `diabetes-basics` - 糖尿病基础
32. `blood-sugar-monitoring` - 血糖监测
33. `blood-sugar-levels` - 血糖水平和目标
34. `a1c-management` - A1C管理
35. `hypoglycemia` - 低血糖
36. `hyperglycemia` - 高血糖
37. `dawn-phenomenon` - 黎明现象
38. `reactive-hypoglycemia` - 反应性低血糖

#### **2.2 糖尿病类型和治疗 (7个)**
39. `type-1-diabetes` - 1型糖尿病
40. `type-2-diabetes` - 2型糖尿病
41. `prediabetes` - 糖尿病前期
42. `gestational-diabetes` - 妊娠糖尿病
43. `diabetes-medication` - 糖尿病药物
44. `insulin-therapy` - 胰岛素治疗
45. `diabetes-technology` - 糖尿病科技（CGM等）

#### **2.3 糖尿病并发症 (10个)**
46. `diabetic-neuropathy` - 糖尿病神经病变
47. `diabetic-retinopathy` - 糖尿病视网膜病变
48. `diabetic-nephropathy` - 糖尿病肾病
49. `diabetic-foot-care` - 糖尿病足护理
50. `diabetes-heart-disease` - 糖尿病心脏病
51. `diabetes-skin-conditions` - 糖尿病皮肤问题
52. `diabetes-dental-health` - 糖尿病口腔健康
53. `diabetes-cognitive-decline` - 糖尿病认知衰退
54. `diabetes-depression` - 糖尿病抑郁
55. `diabetes-sexual-health` - 糖尿病性健康

---

### **支柱3：营养和生活方式 (Nutrition & Lifestyle) - 20个**

#### **3.1 饮食和营养 (10个)**
56. `healthy-diet-basics` - 健康饮食基础
57. `heart-healthy-diet` - 护心饮食
58. `diabetes-diet` - 糖尿病饮食
59. `low-sodium-diet` - 低钠饮食
60. `mediterranean-diet` - 地中海饮食
61. `dash-diet` - DASH饮食
62. `meal-planning` - 餐食规划
63. `portion-control` - 份量控制
64. `food-label-reading` - 食品标签阅读
65. `healthy-recipes` - 健康食谱

#### **3.2 运动和活动 (5个)**
66. `exercise-basics` - 运动基础
67. `aerobic-exercise` - 有氧运动
68. `strength-training` - 力量训练
69. `flexibility-balance` - 灵活性和平衡
70. `exercise-safety` - 运动安全

#### **3.3 生活方式因素 (5个)**
71. `weight-management` - 体重管理
72. `stress-management` - 压力管理
73. `sleep-health` - 睡眠健康
74. `smoking-cessation` - 戒烟
75. `alcohol-moderation` - 适度饮酒

---

### **支柱4：症状和监测 (Symptoms & Monitoring) - 15个**

#### **4.1 症状识别 (8个)**
76. `warning-signs-heart` - 心脏警告信号
77. `warning-signs-stroke` - 中风警告信号
78. `warning-signs-diabetes` - 糖尿病警告信号
79. `chest-pain-symptoms` - 胸痛症状
80. `breathing-difficulty` - 呼吸困难
81. `dizziness-fainting` - 头晕和昏厥
82. `fatigue-weakness` - 疲劳和虚弱
83. `edema-swelling` - 水肿

#### **4.2 监测和检查 (7个)**
84. `blood-pressure-monitoring` - 血压监测
85. `blood-sugar-monitoring` - 血糖监测
86. `cholesterol-testing` - 胆固醇检测
87. `cardiac-testing` - 心脏检查
88. `vital-signs-monitoring` - 生命体征监测
89. `home-monitoring-devices` - 家用监测设备
90. `lab-test-interpretation` - 实验室检查解读

---

### **支柱5：特殊人群和情况 (Special Populations & Situations) - 10个**

#### **5.1 年龄和性别 (5个)**
91. `seniors-health` - 老年人健康
92. `womens-heart-health` - 女性心脏健康
93. `mens-health` - 男性健康
94. `menopause-health` - 更年期健康
95. `aging-well` - 健康老龄化

#### **5.2 特殊情况 (5个)**
96. `holiday-health` - 节日健康
97. `seasonal-health` - 季节性健康
98. `travel-health` - 旅行健康
99. `medication-management` - 药物管理
100. `emergency-situations` - 紧急情况

---

## 🤖 **新TopicCluster评判机制**

当OpenClaw或生成系统需要创建新topicCluster时，必须通过以下评判：

### **评判标准**：

```javascript
function shouldCreateNewTopicCluster(proposedCluster, existingClusters) {
  // 1. 检查是否已存在于100个核心cluster中
  if (CORE_100_CLUSTERS.includes(proposedCluster)) {
    return { approved: true, reason: "核心cluster" };
  }

  // 2. 检查是否可以合并到现有cluster
  const similarCluster = findMostSimilar(proposedCluster, CORE_100_CLUSTERS);
  if (similarCluster.similarity > 0.75) {
    return {
      approved: false,
      reason: `应合并到: ${similarCluster.name}`,
      suggestion: similarCluster.name
    };
  }

  // 3. 如果真的是全新类别，需要人工审批
  if (proposedCluster.articleCount < 10) {
    return {
      approved: false,
      reason: "新类别需要至少10篇文章才能创建",
      suggestion: findBestFitCluster(proposedCluster)
    };
  }

  // 4. 检查是否超过100个限制
  if (existingClusters.length >= 100) {
    return {
      approved: false,
      reason: "已达到100个cluster上限",
      suggestion: findBestFitCluster(proposedCluster)
    };
  }

  // 5. 人工审批流程
  return {
    approved: "pending",
    reason: "需要人工审批",
    reviewUrl: `/admin/review-cluster?name=${proposedCluster}`
  };
}
```

### **LLM辅助映射**：

```javascript
async function mapArticleToCluster(article, clusters) {
  const prompt = `
  Given this article:
  - Title: ${article.title}
  - Description: ${article.description}
  - Primary Keyword: ${article.primaryKeyword}
  - Current Cluster: ${article.topicCluster}

  Map it to ONE of these 100 core clusters:
  ${clusters.map(c => `- ${c.id}: ${c.description}`).join('\n')}

  Return ONLY the cluster ID.
  If uncertain, choose the MOST GENERAL applicable cluster.
  `;

  return await callLLM(prompt);
}
```

---

## 📋 **重新映射执行计划**

### **Step 1: 保留高频clusters（前50个）**
- 这50个已经有一定文章量
- 直接保留，作为核心的一部分

### **Step 2: 将1634篇单文章映射到100个核心clusters**
- 使用LLM批量映射
- Sub-agent: `cluster-remapper`
- 每批处理200篇

### **Step 3: 更新所有数据文件**
- `data/articles-index.json`
- `data/articles-embeddings.json`
- markdown文件的frontmatter

### **Step 4: 代码修改**
- `lib/llm/qwen-topics.ts` - 添加cluster评判逻辑
- `lib/topics/manager.ts` - 限制只能使用100个核心clusters

---

## 🎯 **预期效果**

**Before**:
```
1731个topicClusters
  ├─ 1628个只有1篇（94%）
  ├─ 83个有2-5篇
  └─ 20个有6篇以上
```

**After**:
```
100个核心topicClusters
  ├─ 每个平均22篇文章
  ├─ 清晰的语义边界
  ├─ 更好的GEO效果（LLM容易理解）
  └─ 更好的内部链接结构
```

**GEO好处**:
- ✅ 100个cluster更容易被LLM理解和索引
- ✅ 每个cluster有足够多的文章，显示主题权威性
- ✅ 避免"噪音cluster"稀释语义信号

**SEO好处**:
- ✅ 更强的topic clusters结构
- ✅ 更好的内部链接机会
- ✅ 更清晰的网站架构（如果未来添加分类页）
