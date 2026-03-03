# TopicCluster语义聚类技能

## 目的
将大量细分的topicClusters基于语义相似性聚类成更大的核心类别，优化GEO和SEO效果。

## 核心原则

### 1. 语义相似性判断
**应该合并的情况**：
- 同一疾病的不同方面（如：diabetes-diet, diabetes-medication, diabetes-monitoring → diabetes-management）
- 同一主题的不同表达（如：heart-health, cardiovascular-wellness, cardiac-care → cardiovascular-health）
- 上下位关系（如：hypertension-diet, low-sodium-diet, dash-diet → hypertension-nutrition）
- 因果关联（如：stress-hypertension, anxiety-blood-pressure → stress-cardiovascular-link）

**不应该合并的情况**：
- 不同疾病领域（如：diabetes vs heart-disease）
- 不同治疗方式（如：medication vs lifestyle-changes）
- 矛盾的概念（如：prevention vs complications）

### 2. GEO优化考虑
- **LLM易理解性**：类别名称要清晰，避免过度专业术语
- **语义完整性**：每个核心类别应该是一个完整的话题领域
- **适度宽泛**：宁可稍宽，不要过窄（宽类别更容易被AI推荐）
- **避免噪音**：不要创建混杂不相关内容的"杂项"类别

### 3. SEO优化考虑
- **内容深度**：每个核心类别应包含足够多文章（理想10+篇）
- **主题权威性**：类别内文章越多，显示该主题越权威
- **内链结构**：同类别文章容易互相链接

## 聚类策略

### 医学主题分类框架
参考以下主要领域进行聚类：

**心血管系统**：
- 高血压（hypertension-*）
- 心脏病（heart-*, cardiac-*, cardiovascular-*）
- 血管疾病（vascular-*, circulation-*）
- 中风（stroke-*）

**代谢疾病**：
- 糖尿病（diabetes-*, diabetic-*, blood-sugar-*, glucose-*）
- 血脂（cholesterol-*, lipid-*）
- 代谢综合征（metabolic-*）

**生活方式**：
- 饮食营养（diet-*, nutrition-*, meal-*, food-*）
- 运动（exercise-*, physical-activity-*, fitness-*）
- 体重管理（weight-*, obesity-*）
- 睡眠（sleep-*）
- 压力（stress-*, mental-*）

**治疗和干预**：
- 药物（medication-*, drug-*, pharmacology-*）
- 手术（surgical-*, intervention-*）
- 监测（monitoring-*, testing-*）

**症状和诊断**：
- 症状识别（symptoms-*, warning-signs-*）
- 诊断检查（diagnosis-*, diagnostic-*, screening-*）
- 急症（emergency-*, acute-*）

**并发症**：
- 器官损伤（nephropathy, retinopathy, neuropathy）
- 并发疾病（complications-*, comorbidities-*）

**特殊人群**：
- 年龄相关（elderly-*, seniors-*, aging-*）
- 性别相关（womens-*, mens-*, gender-*）
- 生命阶段（pregnancy-*, menopause-*）

**环境和社会因素**：
- 季节因素（seasonal-*）
- 环境因素（environmental-*）
- 社会因素（social-*）

## 输出格式

每个聚类任务必须输出JSON格式：

```json
{
  "batch_id": 1,
  "total_original_clusters": 200,
  "total_articles": 668,
  "clustered_results": [
    {
      "new_cluster_name": "hypertension-management",
      "description": "高血压的预防、诊断、治疗和管理的所有方面",
      "rationale": "合并了高血压相关的饮食、药物、监测、生活方式等子主题，形成完整的高血压管理体系",
      "original_clusters": [
        "hypertension-management",
        "hypertension-diet",
        "hypertension-medication",
        "hypertension-monitoring",
        "hypertension-lifestyle"
      ],
      "total_articles": 156
    },
    {
      "new_cluster_name": "diabetes-comprehensive",
      "description": "糖尿病的全面管理，包括血糖控制、饮食、用药和监测",
      "rationale": "整合了1型、2型糖尿病及血糖管理的各个方面，避免过度细分",
      "original_clusters": [
        "diabetes-care",
        "type-1-diabetes",
        "type-2-diabetes",
        "blood-sugar-monitoring",
        "diabetes-medication",
        "insulin-therapy"
      ],
      "total_articles": 142
    }
  ],
  "clustering_summary": {
    "new_clusters_count": 12,
    "avg_articles_per_cluster": 55.6,
    "largest_cluster": "cardiovascular-health (84篇)",
    "approach": "基于医学领域和治疗方式的双维度聚类"
  }
}
```

## 命名规范

核心类别命名要求：
- 使用英文kebab-case格式
- 清晰明确，避免歧义
- 优先使用医学标准术语
- 2-3个词为佳，最多4个词

**好的命名**：
- `hypertension-management`
- `diabetes-nutrition`
- `cardiovascular-health`
- `heart-failure-care`

**不好的命名**：
- `hypertension` (太宽泛)
- `hypertension-diet-low-sodium-dash` (太长)
- `misc-heart-stuff` (不专业)
- `血压管理` (应该用英文)

## 质量检查

聚类后检查：
1. ✅ 每个新类别包含≥5个原始clusters或≥20篇文章
2. ✅ 新类别之间没有语义重叠
3. ✅ 新类别名称清晰易懂
4. ✅ 所有原始clusters都被分配
5. ✅ 类别数量适中（每批200个→10-15个新类别）

## 使用此技能

在处理聚类任务时：
1. 读取分配的cluster批次文件
2. 应用上述语义框架分析
3. 识别明显的语义群组
4. 合并相似clusters
5. 为每个新类别起一个好名字
6. 写清楚rationale（方便后续审查）
7. 输出标准JSON格式
8. 保存结果文件
