# TopicCluster重映射技能

## 目的
将文章从1740个旧topicClusters映射到32个核心clusters，基于语义相似性选择最合适的核心cluster。

## 映射原则

### 1. 语义匹配优先
选择与文章主题**最语义相关**的核心cluster，而非简单的关键词匹配。

**例子**：
- 文章："How Salt Affects Blood Pressure in Seniors"
- 旧cluster：`sodium-hypertension-elderly`
- ✅ 正确映射：`hypertension-management` （高血压管理是主题）
- ❌ 错误映射：`nutrition-diet-management` （虽然提到盐，但核心是高血压）

### 2. 从宽原则
如果文章可以归入多个核心clusters，选择**更宽泛**的那个。

**例子**：
- 文章："Diabetes-Friendly Mediterranean Diet Recipes"
- 可选：`diabetes-management` 或 `nutrition-diet-management`
- ✅ 选择：`nutrition-diet-management` （饮食是主题，糖尿病是限定词）

### 3. 优先级规则

**疾病 > 干预 > 症状**

- 如果文章明确讨论**特定疾病**（高血压、糖尿病、心脏病），优先选疾病cluster
- 如果文章讨论**干预措施**（饮食、运动、药物），选干预cluster
- 如果文章讨论**症状诊断**，选症状cluster

### 4. 32个核心Clusters分类指南

#### **疾病管理类（7个）**
1. `cardiovascular-health` - 心血管整体健康、心脏功能、血管健康
2. `hypertension-management` - 高血压的所有方面（检测、治疗、饮食、生活方式）
3. `diabetes-management` - 糖尿病综合管理（血糖控制、饮食、并发症）
4. `cardiac-disease-management` - 特定心脏疾病（心肌病、心衰、心律失常）
5. `glucose-diabetes-management` - 血糖和糖尿病管理（监测、治疗）
6. `diabetes-glucose-management` - 糖尿病血糖管理（与上一个相似）
7. `metabolic-syndrome-management` - 代谢综合征

**映射提示**：
- 如果文章标题或描述中有"hypertension/blood pressure"→ `hypertension-management`
- 如果有"diabetes/blood sugar/glucose"→ `diabetes-management`
- 如果有"heart disease/cardiac/cardiovascular"→ `cardiovascular-health`

#### **干预措施类（6个）**
8. `nutrition-diet-management` - 所有饮食营养内容（最广泛的饮食cluster）
9. `lifestyle-interventions` - 运动、体力活动、生活方式改变
10. `medication-safety` - 药物安全、相互作用、多药管理
11. `treatment-interventions` - 治疗干预、药物和非药物治疗
12. `behavioral-mental-health` - 压力管理、心理健康、行为改变
13. `natural-remedies` - 天然疗法、补充剂、非药物干预

**映射提示**：
- 如果文章主要讲"diet/food/nutrition/eating"→ `nutrition-diet-management`
- 如果主要讲"exercise/activity/fitness"→ `lifestyle-interventions`
- 如果主要讲"medication/drugs/pills"→ `medication-safety`

#### **诊断监测类（3个）**
14. `symptoms-diagnosis` - 症状识别、早期检测、诊断技术
15. `monitoring-technology` - 监测设备、技术、数字工具
16. `monitoring-diagnosis` - 健康监测和疾病诊断

**映射提示**：
- 如果文章讲"symptoms/warning signs/detection"→ `symptoms-diagnosis`
- 如果讲"monitoring/devices/technology"→ `monitoring-technology`

#### **影响因素类（7个）**
17. `circadian-sleep-health` - 昼夜节律、睡眠质量与代谢
18. `sleep-circadian-health` - 睡眠与昼夜节律（与上一个相似）
19. `circadian-sleep-metabolism` - 昼夜节律睡眠代谢
20. `circadian-metabolic-health` - 昼夜节律与代谢健康
21. `environmental-factors` - 环境和社会因素对健康的影响
22. `environmental-health-factors` - 环境健康因素（与上一个相似）
23. `mental-health-stress` - 心理健康、压力与生理功能

**映射提示**：
- 如果文章讲"sleep/circadian/rhythm"→ circadian-sleep系列（任选一个）
- 如果讲"environment/seasonal/weather"→ `environmental-factors`
- 如果讲"stress/anxiety/mental"→ `mental-health-stress`

#### **特殊主题类（9个）**
24. `special-populations` - 特殊人群（老年人、女性、性别差异）
25. `gastrointestinal-health` - 消化系统健康、肠道微生物
26. `complications-management` - 并发症和合并症管理
27. `cardiovascular-physiology` - 心血管生理机制
28. `metabolic-health` - 代谢健康、代谢综合征
29. `renal-health` - 肾脏健康、慢性肾病
30. `autonomic-nervous-regulation` - 自主神经系统调节
31. `comprehensive-health-topics` - 综合健康主题（其他不适合的归这里）
32. `prevention-risk-assessment` - 疾病预防和风险评估

**映射提示**：
- 如果文章针对"elderly/seniors/women/men"特定人群→ `special-populations`
- 如果讲"gut/digestive/microbiome"→ `gastrointestinal-health`
- 如果讲"complications/comorbidities"→ `complications-management`
- 如果讲"kidney/renal"→ `renal-health`
- **当不确定时**→ `comprehensive-health-topics`

## 映射流程

### Step 1: 分析文章
读取文章的：
- `title`（最重要！）
- `description`
- `primaryKeyword`
- `topicCluster`（当前的旧cluster）

### Step 2: 提取核心主题
从标题和描述中提取：
- 主要疾病（如果有）
- 主要干预措施（如果有）
- 特殊人群（如果有）
- 核心关键词

### Step 3: 匹配核心cluster
根据提取的信息，从32个核心clusters中选择**最合适的1个**。

### Step 4: 验证合理性
检查：
- ✅ 选择的cluster是否准确描述了文章主题？
- ✅ 如果读者搜索这个主题，会期待在这个cluster中找到吗？
- ✅ 这篇文章与该cluster中的其他文章相关吗？

## 输出格式

```json
{
  "batch_id": 1,
  "total_articles": 250,
  "mappings": [
    {
      "slug": "how-salt-affects-blood-pressure-in-seniors",
      "old_cluster": "sodium-hypertension-elderly",
      "new_cluster": "hypertension-management",
      "rationale": "文章主题是高血压管理，盐是其中的一个因素"
    },
    {
      "slug": "mediterranean-diet-for-diabetics",
      "old_cluster": "diabetic-diet-mediterranean",
      "new_cluster": "nutrition-diet-management",
      "rationale": "主题是饮食营养，糖尿病是应用场景"
    }
  ]
}
```

## 常见错误

### ❌ 错误1：过度细分
- 文章："Exercise for People with Diabetes"
- ❌ 错误：`diabetes-management`（因为提到糖尿病）
- ✅ 正确：`lifestyle-interventions`（核心是运动，糖尿病是受众）

### ❌ 错误2：关键词匹配
- 文章："Foods That Help Control Blood Pressure"
- ❌ 错误：`nutrition-diet-management`（因为提到食物）
- ✅ 正确：`hypertension-management`（核心目标是控制血压）

### ❌ 错误3：忽略标题
- 标题："Understanding Your Heart Rate Variability"
- 描述提到："for diabetic patients"
- ❌ 错误：`diabetes-management`（被描述误导）
- ✅ 正确：`cardiovascular-health`（标题明确是心率变异性）

## 质量检查

映射完成后，检查：
1. ✅ 每篇文章都有new_cluster？
2. ✅ new_cluster都在32个核心列表中？
3. ✅ rationale清晰解释了映射逻辑？
4. ✅ 没有明显不合理的映射？
