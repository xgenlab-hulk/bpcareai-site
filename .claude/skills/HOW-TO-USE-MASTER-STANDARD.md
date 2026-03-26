# 如何使用主标准文档

**文档**: `MASTER-METADATA-OPTIMIZATION-STANDARD.md`
**版本**: v2.0
**用途**: 确保所有Task工具调用时统一使用此标准

---

## 🎯 重要说明

当你启动任何文章优化任务时，**必须**在Task的prompt中包含以下指令：

---

## 📋 Task Prompt 标准模板

```
你的任务是优化文章元数据。

**必读标准文档**:
请严格遵循 `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md` 中的所有规则和评分标准。

**优化要求**:
1. 按照主标准文档中的评分公式为每个字段打分
2. 所有字段必须≥85分
3. 如果任何字段<85分，必须重新优化直到达标
4. 使用文档中的评分计算器模板进行评分

**输出格式**:
{
  "optimized": {
    "primaryKeyword": "...",
    "slug": "...",
    "title": "...",
    "description": "..."
  },
  "scores": {
    "primaryKeyword": 95,
    "primaryKeyword_breakdown": {
      "length": 25,
      "search_intent": 40,
      "conciseness": 20,
      "density": 15
    },
    "slug": 95,
    "slug_breakdown": {
      "length": 30,
      "keyword_integration": 35,
      "readability": 20,
      "seo": 15
    },
    "title": 92,
    "title_breakdown": {
      "length": 15,
      "emotional_appeal": 30,
      "value_clarity": 25,
      "audience_id": 20,
      "keyword": 10
    },
    "description": 94,
    "description_breakdown": {
      "length": 10,
      "strong_opening": 25,
      "specific_value": 30,
      "audience": 20,
      "cta": 15
    },
    "overall": 94
  },
  "meets_standard": true
}

**重要**: 必须使用主标准文档中的评分公式，不得自行判断。
```

---

## ✅ 正确使用示例

### 示例1：批量优化任务

```javascript
// 在调用Task工具时
Task({
  subagent_type: "general-purpose",
  description: "优化文章1-50的元数据",
  prompt: `
你的任务是优化文章1-50的元数据。

**必读标准文档**:
严格遵循 .claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md

**处理流程**:
1. 读取 data/articles-index.json，提取文章1-50
2. 对每篇文章：
   a. 按主标准优化 primaryKeyword
   b. 按主标准优化 slug
   c. 按主标准优化 title
   d. 按主标准优化 description
3. 使用主标准的评分公式为每个字段打分
4. 确保所有字段≥85分
5. 保存结果到 data/optimized-batch-1-50.json

**评分标准严格遵循**:
- PrimaryKeyword: 长度(25)+搜索意图(40)+简洁(20)+密度(15)
- Slug: 长度(30)+关键词(35)+可读性(20)+SEO(15)
- Title: 长度(15)+情感(30)+价值(25)+受众(20)+关键词(10)
- Description: 长度(10)+开场(25)+价值(30)+受众(20)+CTA(15)

不要偏离这些评分标准！
  `
})
```

### 示例2：单篇文章优化

```javascript
Task({
  subagent_type: "general-purpose",
  description: "优化单篇文章元数据",
  prompt: `
优化这篇文章的元数据：

文章数据:
{
  "slug": "blood-pressure-management-dementia-caregivers",
  "title": "Blood Pressure Management for Dementia Caregivers",
  "description": "Learn about blood pressure management...",
  "primaryKeyword": "blood pressure management dementia caregivers"
}

**必读标准**:
严格遵循 .claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md

**优化步骤**:
1. 先优化 primaryKeyword（目标30-40字符，评分≥85）
2. 再优化 slug（目标30-35字符，评分≥85）
3. 然后优化 title（目标50-60字符，必须用疑问句或"Your"，评分≥85）
4. 最后优化 description（目标130-145字符，疑问开场+可数价值，评分≥85）

**评分要求**:
使用主标准文档附录B的评分计算器模板，逐项打分。
所有字段必须≥85分。

返回完整的优化结果和详细评分。
  `
})
```

---

## ❌ 错误使用示例（避免）

### 错误1：没有引用主标准

```javascript
// ❌ 错误：没有明确要求使用主标准
Task({
  prompt: `优化这些文章的slug, title, description...`
})
// 问题：Agent可能会自行判断标准，导致不一致
```

### 错误2：自定义评分标准

```javascript
// ❌ 错误：自己定义评分标准
Task({
  prompt: `
优化文章，评分标准：
- slug长度<40字符得满分
- title要有吸引力
...
  `
})
// 问题：与主标准不一致，无法保证质量
```

### 错误3：没有明确评分公式

```javascript
// ❌ 错误：没有要求使用具体的评分公式
Task({
  prompt: `
优化文章，确保质量良好即可
  `
})
// 问题：无法量化，无法验证
```

---

## 🔍 质量验证流程

每次Task完成后，检查返回结果：

### 检查1：是否包含评分细分

```json
✅ 正确：
{
  "scores": {
    "slug": 95,
    "slug_breakdown": {
      "length": 30,
      "keyword_integration": 35,
      "readability": 20,
      "seo": 15
    }
  }
}

❌ 错误：
{
  "scores": {
    "slug": 95  // 没有细分，无法验证
  }
}
```

### 检查2：评分是否符合公式

```
Slug总分 = length + keyword_integration + readability + seo
95 = 30 + 35 + 20 + 15 ✅ 正确

如果：
95 = 28 + 35 + 20 + 15 = 98 ❌ 错误（总分不对）
```

### 检查3：所有字段是否≥85分

```json
✅ 合格：
{
  "primaryKeyword": 95,
  "slug": 95,
  "title": 92,
  "description": 94,
  "overall": 94
}

❌ 不合格：
{
  "primaryKeyword": 95,
  "slug": 78,  // <85分
  "title": 92,
  "description": 94
}
```

---

## 📊 并行任务的标准一致性

当运行多个并行Task时，每个Task都必须独立引用主标准：

```javascript
// 正确：每个Task都明确引用主标准
Promise.all([
  Task({
    description: "优化文章1-50",
    prompt: "严格遵循 .claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md ..."
  }),
  Task({
    description: "优化文章51-100",
    prompt: "严格遵循 .claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md ..."
  }),
  Task({
    description: "优化文章101-150",
    prompt: "严格遵循 .claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md ..."
  })
])
```

这样确保：
- ✅ 每个并行任务都使用相同标准
- ✅ 评分一致性
- ✅ 可以合并结果而不会有质量差异

---

## 🎯 标准文档的权威性

**主标准文档是唯一权威来源**：

| 优先级 | 文档 | 用途 |
|-------|------|------|
| 🥇 **最高** | `MASTER-METADATA-OPTIMIZATION-STANDARD.md` | 所有优化任务的权威标准 |
| 🥈 次要 | `slug-optimization-standard.md` | 详细说明（参考） |
| 🥈 次要 | `title-optimization-standard.md` | 详细说明（参考） |
| 🥈 次要 | `description-optimization-standard.md` | 详细说明（参考） |

如果主标准和其他文档有冲突，**以主标准为准**。

---

## 🛠️ 调试和问题排查

### 问题1：评分不一致

**症状**: 相似的文章评分差异很大

**原因**: 可能没有严格遵循评分公式

**解决**: 在Task prompt中明确要求使用附录B的评分计算器模板

```javascript
Task({
  prompt: `
...
必须使用主标准文档附录B的评分计算器模板，逐项打分：
1. 先列出每个维度的得分
2. 再计算总分
3. 验证总分 = 各维度之和
  `
})
```

### 问题2：优化质量不达标

**症状**: 优化后评分仍<85

**原因**: 没有迭代优化

**解决**: 在Task prompt中要求迭代

```javascript
Task({
  prompt: `
...
如果优化后任何字段<85分：
1. 分析扣分原因
2. 重新优化该字段
3. 再次评分
4. 重复直到所有字段≥85分

不要返回不达标的结果！
  `
})
```

### 问题3：格式不统一

**症状**: 返回的JSON格式不一致

**解决**: 在Task prompt中提供精确的输出模板

```javascript
Task({
  prompt: `
...
输出格式（严格遵循）：
{
  "optimized": { ... },
  "scores": {
    "primaryKeyword": X,
    "primaryKeyword_breakdown": { ... },
    "slug": X,
    "slug_breakdown": { ... },
    ...
  },
  "meets_standard": true/false
}
  `
})
```

---

## 📝 最佳实践总结

1. **✅ 必做**：
   - 在每个Task prompt中明确引用主标准文档
   - 要求使用评分公式和计算器模板
   - 要求输出评分细分
   - 设置≥85分的硬性要求

2. **❌ 禁止**：
   - 不引用主标准就启动优化任务
   - 自定义评分标准
   - 接受<85分的结果
   - 跳过评分细分

3. **🔍 验证**：
   - 检查每个返回结果的评分细分
   - 验证评分公式计算正确
   - 确认所有字段≥85分
   - 抽查优化质量

---

**🔒 使用此指南确保所有Task调用的标准一致性**

**📌 主标准路径**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD.md`
**📌 使用指南路径**: `.claude/skills/HOW-TO-USE-MASTER-STANDARD.md`
