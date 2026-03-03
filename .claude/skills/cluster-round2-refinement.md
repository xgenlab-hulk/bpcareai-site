# 第二轮TopicCluster提纯技能

## 目的
将第一轮产出的中间clusters进一步提纯，合并重复和相似的类别，优化命名，产出最终的核心clusters。

## 与第一轮的区别

### 第一轮：粗聚类
- 输入：1731个原始细分clusters
- 目标：快速归类，减少数量
- 结果：188个中间clusters（存在重复和命名不一致）

### 第二轮：精提纯
- 输入：188个中间clusters（已经过一次聚类）
- 目标：合并重复、统一命名、形成最终核心类别
- 结果：35-45个核心clusters

## 第二轮特殊任务

### 1. 识别并合并完全重复的clusters

**常见重复情况**：
- `cardiovascular-health` 可能在多个batch中出现
- `hypertension-management` 可能出现2-3次
- `medication-safety-interactions` 可能多次出现

**处理方式**：
```
如果看到：
- cardiovascular-health (110篇，来自batch 1)
- cardiovascular-health (26篇，来自batch 7)

合并为：
- cardiovascular-health (136篇)
```

### 2. 合并语义高度相似的clusters

**相似度判断标准**：

**应该合并的情况**：
- `nutrition-diet-optimization` + `nutrition-diet-interventions` + `nutrition-dietary-management` → `nutrition-diet-management`
- `hypertension-management` + `hypertension-comprehensive-management` → `hypertension-management`
- `cardiovascular-health` + `cardiovascular-monitoring-health` → `cardiovascular-health` (监测是健康的一部分)
- `diabetes-comprehensive` + `metabolic-diabetes-management` → `diabetes-metabolic-management`

**不应合并的情况**：
- `cardiovascular-health` ≠ `cardiac-complications-conditions` (一个是整体健康，一个是特定疾病)
- `nutrition-diet-management` ≠ `medication-safety` (不同领域)
- `monitoring-technology` ≠ `treatment-interventions` (不同功能)

### 3. 命名规范化

**命名长度控制**：
- ✅ 2-3个词：`cardiovascular-health`, `diabetes-management`
- ⚠️ 4个词：仅在必要时使用，如 `sleep-circadian-metabolism`
- ❌ 5个词+：过长，需简化

**命名简化规则**：
- `cardiovascular-monitoring-health` → `cardiovascular-health` (监测是健康管理的一部分)
- `hypertension-comprehensive-management` → `hypertension-management` (comprehensive是冗余词)
- `specialized-physiology-mechanisms` → `physiology-mechanisms` (specialized太宽泛)
- `gut-microbiome-metabolic-axis` → `gut-microbiome-health` (axis过于学术)

**避免冗余词**：
- comprehensive, complete, full, total, overall, general
- management (除非是疾病管理，如diabetes-management)
- health (除非是器官系统健康，如cardiovascular-health)

### 4. 语义去重策略

检查这些高频关键词，合并相关clusters：

**nutrition相关**（第一轮有18个）：
- 合并成2-3个核心类别：
  - `nutrition-diet-management`（通用饮食营养）
  - `therapeutic-nutrition`（疾病特异性营养干预，如肾脏、心脏、糖尿病饮食）

**metabolic相关**（第一轮有16个）：
- 合并成1-2个：
  - `metabolic-health`（代谢综合征、血脂、能量代谢）
  - `circadian-metabolism`（昼夜节律相关，如果文章数足够可独立）

**cardiovascular相关**（第一轮有12个）：
- 合并成2-3个：
  - `cardiovascular-health`（心血管整体健康）
  - `cardiac-disease-management`（特定心脏疾病）
  - `vascular-health`（血管健康，如果文章数足够可独立）

**diabetes相关**（第一轮有8个）：
- 合并成1个：
  - `diabetes-management`（包含血糖控制、并发症、饮食、药物等所有方面）

**medication相关**（第一轮有9个）：
- 合并成1个：
  - `medication-safety`（包含相互作用、多药、安全性等）

**monitoring相关**（第一轮有10个）：
- 合并成1个：
  - `monitoring-technology`（包含各种监测设备和技术）

**lifestyle相关**（第一轮有9个）：
- 合并成1-2个：
  - `lifestyle-interventions`（运动、体力活动）
  - `behavioral-health`（压力、心理、行为改变）

### 5. 最终核心clusters建议结构

**目标35-45个核心clusters的合理分布**：

**疾病管理（10-12个）**：
- cardiovascular-health
- hypertension-management
- diabetes-management
- cardiac-disease-management
- vascular-health
- metabolic-health
- renal-health
- complications-management
- 等

**干预措施（8-10个）**：
- nutrition-diet-management
- therapeutic-nutrition
- lifestyle-interventions
- exercise-fitness
- medication-safety
- behavioral-health
- natural-remedies
- 等

**诊断监测（5-7个）**：
- monitoring-technology
- symptoms-diagnosis
- screening-detection
- lab-interpretation
- 等

**影响因素（5-8个）**：
- sleep-circadian-health
- stress-mental-health
- environmental-factors
- gut-microbiome-health
- hormonal-health
- 等

**特殊主题（5-8个）**：
- special-populations
- medication-interactions
- emergency-care
- preventive-care
- patient-education
- 等

## 第二轮聚类流程

### Step 1: 识别重复
遍历47个clusters，找出：
- 完全同名的clusters → 直接合并
- 高度相似的命名 → 标记为待合并

### Step 2: 语义聚类
将剩余的clusters按照上述5大领域分组：
- 疾病管理类
- 干预措施类
- 诊断监测类
- 影响因素类
- 特殊主题类

### Step 3: 合并同类
在每个领域内，合并语义高度相似的clusters

### Step 4: 命名优化
为每个最终cluster选择最清晰、最简洁的名称

### Step 5: 质量检查
- 每个核心cluster包含≥30篇文章（理想）
- 核心cluster总数：10-12个（4批合计40-48个）
- 命名规范、无重叠、语义清晰

## 输出格式

```json
{
  "round": 2,
  "batch_id": 1,
  "input_clusters": 47,
  "output_clusters": 11,
  "total_articles": 592,
  "clustered_results": [
    {
      "core_cluster_name": "cardiovascular-health",
      "description": "心血管系统整体健康,包括心脏功能、血管健康、内皮功能和心血管疾病预防",
      "rationale": "合并了cardiovascular-health(110篇)、cardiovascular-monitoring-health(17篇)、cardiovascular-physiology-mechanisms(15篇)等高度相关的中间clusters,避免过度细分",
      "merged_from": [
        "cardiovascular-health (110篇)",
        "cardiovascular-monitoring-health (17篇)",
        "cardiovascular-physiology-mechanisms (15篇)"
      ],
      "total_articles": 142
    }
  ],
  "clustering_summary": {
    "core_clusters_count": 11,
    "avg_articles_per_cluster": 53.8,
    "largest_cluster": "cardiovascular-health (142篇)",
    "merging_approach": "基于语义去重和命名规范化的深度聚类"
  }
}
```

## 关键原则

1. **宁宽勿窄**：第二轮要大胆合并，避免过度细分
2. **语义清晰**：每个核心cluster要有明确的主题定义
3. **命名简洁**：2-3个词为主，最多4个词
4. **内容深度**：每个核心cluster理想≥30篇文章
5. **GEO优先**：LLM要能轻松理解和索引这些类别
