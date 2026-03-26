# DEPRECATED SKILLS - 已废弃的标准

⚠️ **这些文件已被废弃，请勿使用！**

## 废弃时间
2026-03-16

## 废弃原因
这些是旧的优化标准和审计方法，已被新的LLM驱动的综合优化方法取代。

旧方法存在的问题：
1. **过度依赖硬编码规则**：机械地计算字符长度、关键词位置等
2. **假阳性率高**：98%的文章被评为"优秀"，但实际质量参差不齐
3. **缺乏上下文理解**：无法判断技术术语是否适合目标受众
4. **忽视用户搜索意图**：只关注SEO指标，不考虑用户实际需求

## 新的标准（请使用这些）

### ✅ 当前有效的标准文件：

1. **llm-article-audit-comprehensive.md**
   - 元数据综合审计标准
   - 使用LLM理解上下文和用户意图
   - 评分范围：0-100分

2. **llm-article-optimization-comprehensive.md**
   - 元数据综合优化标准
   - 将技术术语转化为用户友好的表达
   - 确保所有元素一致性

3. **article-content-quality-audit.md**
   - 文章内容质量审计标准
   - 评估H1、结构、FAQ、技术语言、事实密度、用户价值
   - 重点关注GEO（生成式引擎优化）

## 废弃文件列表

- `article-seo-holistic-optimization-v2.md` - 旧的整体优化方法v2
- `article-seo-holistic-optimization.md` - 旧的整体优化方法v1
- `primary-keyword-audit-v3.md` - 主关键词审计v3（硬编码规则）
- `primary-keyword-audit-v4-flexible.md` - 主关键词审计v4（仍然过于机械）
- `primary-keyword-optimization-v2.md` - 主关键词优化v2（缺乏上下文）
- `primary-keyword-standards.md` - 主关键词标准（过时）

---

**如果你不确定应该使用哪个标准，请参考：**
- 文档：`docs/LLM-DRIVEN-OPTIMIZATION-GUIDE.md`
- 对比分析：旧方法 vs 新方法的详细说明
