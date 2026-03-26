# 当前有效的优化标准 - 2026年3月16日

## ✅ 官方标准文件（仅使用这3个）

### 1. llm-article-audit-comprehensive.md
**用途**：元数据综合审计

**评估内容**：
- slug（URL路径）
- title（标题）
- description（描述）
- primaryKeyword（主关键词）

**核心原则**：
- 像用户一样思考，不像机器人
- 理解搜索意图和上下文
- 评估用户友好度和可搜索性

**评分标准**：
- 0-100分制
- ≥85分 = 优秀，无需优化
- <85分 = 需要优化

### 2. llm-article-optimization-comprehensive.md
**用途**：元数据综合优化

**优化目标**：
- 将技术术语转化为用户友好的表达
- 确保所有元素（slug、title、description、primaryKeyword）一致性
- 优化后评分必须≥85分

**优化流程**：
1. 深入理解文章内容和目标受众
2. 识别真实的用户搜索查询
3. 整体优化，确保自然流畅
4. 验证所有元素协调一致

### 3. article-content-quality-audit.md
**用途**：文章内容质量审计（Phase 1）

**评估6个维度**（总分100分）：
1. **H1标题质量**（20分）- 是否用户友好、避免学术化
2. **内容结构**（20分）- H2/H3组织、逻辑流程
3. **FAQ部分**（25分）- 最重要！GEO优化关键
4. **技术语言**（15分）- 是否适合50+岁受众
5. **事实密度**（10分）- 具体数据、研究引用
6. **用户价值**（10分）- 可操作性建议

**阈值**：
- ≥85分 = 内容优秀，无需Phase 2
- <85分 = 标记为需要Phase 2内容优化

---

## 🎯 两阶段优化策略

### Phase 1: 元数据优化 + 内容审计
1. 使用 `llm-article-audit-comprehensive.md` 审计元数据
2. 如果<85分，使用 `llm-article-optimization-comprehensive.md` 优化
3. 使用 `article-content-quality-audit.md` 审计内容
4. 记录需要Phase 2的文章

### Phase 2: 内容优化（仅处理被标记的文章）
- 改进H1标题
- 增强FAQ部分（3-5个自然问题）
- 简化技术术语
- 添加实用建议章节
- 优化结构和可读性

---

## 📊 质量标准总结

### 元数据标准
| 元素 | 长度限制 | 质量要求 |
|------|----------|----------|
| slug | <60字符 | 简洁、描述性、用户友好 |
| title | <70字符 | 自然、可搜索、避免技术术语 |
| description | 120-155字符 | 精准、吸引人、包含关键词 |
| primaryKeyword | 30-50字符 | 匹配用户搜索意图 |

### 内容标准
- **FAQ必须**：3-5个自然问题，每个答案50-150词，包含具体数据
- **语言要求**：50-80岁成人能轻松理解
- **技术术语**：必须解释或避免（如"内皮损伤"、"压力感受器敏感性"）
- **实用性**：必须包含"如何做"的实际建议

---

## ❌ 已废弃的标准

所有旧标准已移至 `.claude/skills/DEPRECATED/` 目录：
- article-seo-holistic-optimization-v2.md
- article-seo-holistic-optimization.md
- primary-keyword-audit-v3.md
- primary-keyword-audit-v4-flexible.md
- primary-keyword-optimization-v2.md
- primary-keyword-standards.md

**废弃原因**：
- 过度依赖硬编码规则
- 假阳性率高达98%
- 缺乏上下文理解
- 忽视用户搜索意图

---

## 🔧 其他工具文件（非优化标准）

这些文件用于其他用途，不是文章优化标准：
- `cluster-round2-refinement.md` - 主题聚类精化
- `cluster-semantic-grouping.md` - 语义分组
- `topic-cluster-remapping.md` - 主题重新映射

---

## 📚 参考文档

详细说明请参考：
- `docs/LLM-DRIVEN-OPTIMIZATION-GUIDE.md` - LLM驱动优化完整指南
- 包含旧方法 vs 新方法的对比分析
- 成本估算：$84处理全部2209篇文章
- 时间估算：5-7小时

---

**更新时间**：2026-03-16
**版本**：v1.0 - 最终标准
