# PrimaryKeyword标准与优化指南

## 目的
定义PrimaryKeyword的最佳实践标准，确保每篇文章的关键词符合GEO/SEO最优规范。

---

## 一、PrimaryKeyword的作用

### 1. SEO优化
- 指导文章H1标题优化
- 控制关键词密度（3-5次自然出现）
- 优化FAQ问题设计
- 提升搜索引擎相关性

### 2. GEO优化
- 帮助AI理解文章核心主题
- 提升AI引用时的语义匹配度
- 增强topical authority信号

---

## 二、标准规范

### ✅ 合格的PrimaryKeyword特征

#### 1. 长度要求
- **理想长度**: 30-50字符
- **可接受**: 25-60字符
- **不合格**: <25字符或>60字符

#### 2. 结构要求
**标准格式**: `[核心主题] + [特定场景/限定词] + [目标受众]`

**优秀示例**:
```
✅ "blood pressure monitoring seniors over 70" (45 chars)
✅ "diabetes diet management holiday meals" (39 chars)
✅ "post-meal glucose spikes adults 60" (35 chars)
✅ "heart rate variability sleep quality" (38 chars)
```

#### 3. 内容要求
**必须包含**:
- 1-2个核心医疗关键词（blood pressure, diabetes, glucose, heart rate, cholesterol等）
- 受众标识（seniors, adults 60+, elderly, women over 65等）或场景标识（holiday, winter, morning, post-meal等）

**可选包含**:
- 行为词（monitoring, management, control, prevention）
- 时间词（morning, winter, holiday）
- 限定词（mild, severe, early）

#### 4. 语言要求
- ✅ 使用自然英语短语，符合用户搜索习惯
- ✅ 使用常见搜索词（不用过度医学化术语）
- ✅ 多个词之间用空格分隔
- ❌ 避免关键词堆砌
- ❌ 避免品牌名称

---

## 三、质量评分标准

### 评分维度（总分100分）

| 维度 | 权重 | 评分标准 |
|------|------|----------|
| **长度合规** | 20分 | 30-50=20分, 25-29或51-60=15分, <25或>60=0分 |
| **结构完整** | 30分 | 主题+受众/场景=30分, 只有主题=15分, 结构混乱=0分 |
| **关键词质量** | 25分 | 1-2个核心医疗词=25分, 太多或无=10分 |
| **搜索意图** | 15分 | 明确搜索意图=15分, 模糊=7分 |
| **自然度** | 10分 | 自然短语=10分, 堆砌=0分 |

### 等级划分
- **优秀**: 80-100分 → 无需优化
- **良好**: 60-79分 → 可选优化
- **需改进**: 40-59分 → 建议优化
- **不合格**: <40分 → 必须优化

---

## 四、常见问题及优化

### ❌ 问题1: 过长（>60字符）
```
❌ "sirt1 activating foods endothelial dysfunction flow-mediated dilation aging" (76 chars)
✅ "sirt1 foods endothelial health aging adults" (45 chars)
```

### ❌ 问题2: 过短（<25字符）
```
❌ "heart health tips" (17 chars)
✅ "heart health tips seniors over 65" (34 chars)
```

### ❌ 问题3: 缺少核心主题
```
❌ "holiday meals seniors safety" (缺少医疗主题)
✅ "holiday meals blood sugar seniors" (明确血糖主题)
```

### ❌ 问题4: 医学术语过度
```
❌ "postprandial hyperglycemic excursion" (用户不会这样搜索)
✅ "after-meal blood sugar spikes" (常见搜索词)
```

### ❌ 问题5: 关键词堆砌
```
❌ "blood pressure hypertension high bp management" (重复同义词)
✅ "blood pressure management seniors" (精简)
```

---

## 五、批量检查任务指南

### 检查流程

**对于每篇文章**:

1. **读取数据**
   - title
   - description
   - topicCluster
   - primaryKeyword

2. **评分（总分100）**
   - 长度评分（20分）
   - 结构评分（30分）
   - 关键词质量评分（25分）
   - 搜索意图评分（15分）
   - 自然度评分（10分）

3. **识别问题**
   - 如果分数<60，列出具体问题

4. **生成优化建议**（仅对分数<60的文章）
   - 基于title和topicCluster，提取核心主题
   - 识别目标受众或场景
   - 生成30-50字符的优化版本

### 输出格式

```json
{
  "batch_id": 1,
  "total_articles": 245,
  "quality_distribution": {
    "excellent": 180,
    "good": 40,
    "needs_improvement": 20,
    "poor": 5
  },
  "needs_optimization": [
    {
      "slug": "article-slug",
      "title": "Article Title",
      "current_keyword": "current primaryKeyword",
      "score": 45,
      "issues": ["too_long", "lacks_audience"],
      "suggested_keyword": "optimized version",
      "rationale": "Shortened from 69 to 42 chars, added audience"
    }
  ]
}
```

### 质量标准检查清单

对每个primaryKeyword检查：
- ✅ 长度25-60字符？
- ✅ 包含1-2个核心医疗关键词？
- ✅ 包含受众或场景标识？
- ✅ 是自然的英语短语？
- ✅ 没有关键词堆砌？
- ✅ 反映明确的搜索意图？

---

## 六、优化原则

1. **保留核心意图**: 不改变文章主题
2. **提升搜索匹配**: 使用更常见的搜索词
3. **增加特异性**: 添加受众或场景标识
4. **保持自然**: 确保是可读的短语
5. **控制长度**: 目标30-50字符
