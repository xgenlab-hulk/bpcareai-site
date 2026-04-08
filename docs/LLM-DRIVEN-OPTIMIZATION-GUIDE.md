# LLM驱动的文章优化系统

## 🎯 核心理念

### 从"规则驱动"到"理解驱动"

**旧方法**（硬编码规则）❌:
```python
# 机械评分
if "seniors" in keyword:
    score += 20
if 30 <= len(keyword) <= 50:
    score += 15
# ...结果：98%文章"优秀"，但实际质量参差不齐
```

**新方法**（LLM理解）✅:
```python
# LLM综合理解
审计结果 = LLM.分析({
    文章完整metadata,
    用户搜索行为理解,
    SEO最佳实践,
    目标受众特点
})
# 结果：真实反映文章质量，准确识别需要优化的文章
```

---

## 📐 系统架构

### 1. 两个核心Skill

#### A. 审计Skill (`llm-article-audit-comprehensive.md`)

**功能**：
- 理解文章主题、受众、搜索意图
- 评估每个SEO元素（slug, title, description, primaryKeyword）
- 检查整体一致性
- 给出0-100分的综合评分

**关键特点**：
- ✅ 无硬编码规则
- ✅ 基于真实用户搜索行为
- ✅ 考虑上下文和受众
- ✅ 诚实评分（不虚高）

#### B. 优化Skill (`llm-article-optimization-comprehensive.md`)

**功能**：
- 深度理解文章内容
- 识别真实用户搜索查询
- 优化所有SEO元素
- 确保一致性和质量

**关键特点**：
- ✅ 整体优化（不是单独优化每个元素）
- ✅ 保持准确性（不改变核心主题）
- ✅ 用户友好语言
- ✅ 自我验证（确保优化后≥85分）

### 2. 执行脚本

**文件**：`scripts/llm-audit-and-optimize.py`

**功能**：
- 批量加载文章
- Phase 1: 审计所有文章
- Phase 2: 优化需要改进的文章
- 保存结果为JSON

---

## 🚀 使用指南

### 准备工作

1. **设置API Key**：
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

2. **安装依赖**：
```bash
pip install anthropic
```

3. **检查文件结构**：
```
bpcareai-site/
├── .claude/
│   └── skills/
│       ├── llm-article-audit-comprehensive.md
│       └── llm-article-optimization-comprehensive.md
├── scripts/
│   └── llm-audit-and-optimize.py
└── data/
    └── articles-index.json
```

### 运行审计和优化

#### 测试运行（推荐先测试）

**测试50篇文章**：
```bash
cd /Users/hulksi/Desktop/IOS_APPS/bpcareai-site

python3 scripts/llm-audit-and-optimize.py 0 50
```

**参数说明**：
- `0` = 起始索引（从第1篇开始）
- `50` = 数量（处理50篇）

**输出**：
```
data/llm-audit-batch-0-50.json         # 审计结果
data/llm-optimization-batch-0-50.json  # 优化结果
```

#### 批量处理全部文章

**分批处理**（推荐，避免API限流）：

```bash
# Batch 1: 0-200
python3 scripts/llm-audit-and-optimize.py 0 200

# Batch 2: 200-400
python3 scripts/llm-audit-and-optimize.py 200 200

# Batch 3: 400-600
python3 scripts/llm-audit-and-optimize.py 400 200

# ... 继续直到处理完所有2209篇
```

**全部处理完需要**：
- 约11个批次（每批200篇）
- 预计时间：每批15-30分钟
- 总时间：约3-6小时

---

## 📊 输出格式

### 审计结果示例

**文件**：`data/llm-audit-batch-0-50.json`

```json
{
  "batch_range": "0-49",
  "total_audited": 50,
  "audit_results": [
    {
      "slug": "article-slug",
      "overall_score": 65,
      "overall_assessment": "Fair - significant issues",
      "needs_optimization": true,

      "analysis": {
        "core_topic": "Blood pressure management",
        "target_audience": "Seniors 65+",
        "user_search_intent": "Learn home management",
        "likely_search_queries": [
          "blood pressure management seniors",
          "how to lower blood pressure over 65"
        ]
      },

      "element_scores": {
        "slug": {
          "score": 60,
          "issues": ["Too long (127 chars)", "Technical jargon"],
          "strengths": ["Contains core topic"]
        },
        "title": {
          "score": 65,
          "issues": ["Too long", "Too academic"],
          "strengths": ["Clear topic"]
        },
        "description": {
          "score": 75,
          "issues": ["Could be more actionable"],
          "strengths": ["Good length", "Natural keyword"]
        },
        "primaryKeyword": {
          "score": 70,
          "issues": ["Slightly too long"],
          "strengths": ["Specific", "Searchable"]
        }
      },

      "consistency_check": {
        "score": 80,
        "assessment": "Good thematic consistency",
        "issues": []
      },

      "key_problems": [
        "Slug excessively long (127 chars)",
        "Title too academic",
        "PrimaryKeyword could be more natural"
      ],

      "optimization_priority": "high"
    }
  ]
}
```

### 优化结果示例

**文件**：`data/llm-optimization-batch-0-50.json`

```json
{
  "batch_range": "0-49",
  "total_optimized": 30,
  "optimization_results": [
    {
      "slug": "original-slug",
      "optimization_successful": true,

      "analysis": {
        "core_topic": "Blood pressure management",
        "target_audience": "Seniors 65+",
        "user_search_intent": "Learn home monitoring",
        "primary_search_queries": [
          "blood pressure monitoring seniors",
          "how to check blood pressure at home"
        ]
      },

      "optimizations": {
        "primaryKeyword": {
          "original": "baroreceptor sensitivity blood pressure variability",
          "optimized": "blood pressure monitoring seniors over 65",
          "changed": true,
          "rationale": "Replaced technical 'baroreceptor' with natural 'monitoring'. More searchable.",
          "character_count": 45
        },

        "slug": {
          "original": "understanding-baroreceptor-sensitivity-blood-pressure-variability-adults-65-80",
          "optimized": "blood-pressure-monitoring-guide-seniors",
          "changed": true,
          "rationale": "Reduced from 80 to 39 chars. Removed jargon. Natural phrasing.",
          "character_count": 39
        },

        "title": {
          "original": "Understanding Baroreceptor Sensitivity and Blood Pressure Variability in Adults 65-80",
          "optimized": "Blood Pressure Monitoring Guide for Seniors Over 65",
          "changed": true,
          "rationale": "Reduced from 86 to 53 chars. Removed academic tone. Used 'guide' format.",
          "character_count": 53
        },

        "description": {
          "original": "Explores autonomic regulation and blood pressure variability.",
          "optimized": "Learn how to monitor blood pressure at home if you're over 65. Includes device recommendations and when to see your doctor.",
          "changed": true,
          "rationale": "Expanded to 130 chars. User-focused. Actionable. Natural keyword.",
          "character_count": 130
        }
      },

      "quality_scores": {
        "primaryKeyword": { "score": 92, "assessment": "Excellent" },
        "slug": { "score": 95, "assessment": "Excellent" },
        "title": { "score": 93, "assessment": "Excellent" },
        "description": { "score": 90, "assessment": "Excellent" },
        "consistency": { "score": 95, "assessment": "Perfect alignment" },
        "overall": 93
      },

      "validation": {
        "all_elements_meet_standards": true,
        "all_scores_above_85": true,
        "consistency_maintained": true,
        "ready_to_publish": true
      },

      "optimization_summary": "Successfully transformed technical metadata into user-friendly content. All elements aligned. Expect better search visibility."
    }
  ]
}
```

---

## 📈 预期结果

### 审计阶段

**与旧方法对比**：

| 指标 | 旧方法（硬规则） | 新方法（LLM理解） |
|------|----------------|-----------------|
| 优秀率 | 84.4% | 预计30-40% |
| 需优化率 | 2% | 预计40-50% |
| 平均分 | 虚高 | 真实反映质量 |
| 识别准确性 | 低（机械评分） | 高（理解驱动） |

**为什么差异大？**
- 旧方法：机械加分，容易达到高分
- 新方法：真实评估用户发现性

### 优化阶段

**优化效果**：
- ✅ 所有优化后文章评分≥85分
- ✅ Slug平均从120+ chars → 40-50 chars
- ✅ Title平均从150+ chars → 55-65 chars
- ✅ 去除技术术语，使用用户友好语言
- ✅ 所有元素一致性提升

**SEO/GEO影响**（预计3-6个月）：
- 📈 搜索可见性提升：50-100%
- 📈 点击率（CTR）提升：30-50%
- 📈 AI引用率提升：40-60%

---

## 🔍 质量验证

### 手动抽查

**建议每批完成后抽查10-20篇**：

1. **打开审计结果**：
```bash
open data/llm-audit-batch-0-50.json
```

2. **检查评分是否合理**：
   - 看低分文章（<60分）是否真的有问题
   - 看高分文章（>85分）是否确实优秀

3. **打开优化结果**：
```bash
open data/llm-optimization-batch-0-50.json
```

4. **检查优化是否有效**：
   - 优化后的元素是否更好？
   - 是否保持了文章原意？
   - 是否真的更容易被搜索到？

### 质量标准

**审计质量**：
- ✅ 评分分布合理（不是所有都>85分）
- ✅ 问题识别准确（真实反映SEO问题）
- ✅ 搜索查询建议合理

**优化质量**：
- ✅ 所有元素评分≥85分
- ✅ 保持文章核心主题
- ✅ 语言自然、用户友好
- ✅ 所有元素一致性高

---

## 🛠 应用优化结果

### 自动应用脚本

创建应用脚本（待实现）：

```python
# scripts/apply-llm-optimizations.py

"""
读取所有 llm-optimization-batch-*.json 文件
应用优化到：
1. articles-index.json
2. articles-embeddings.json
3. markdown 文件的 frontmatter
4. 生成 301 重定向（如果slug改变）
"""
```

### 手动验证流程

**推荐流程**（首次使用）：

1. **测试50篇** → 验证质量
2. **如果满意** → 扩展到200篇
3. **再次验证** → 抽查质量
4. **逐步扩展** → 直到全部2209篇
5. **应用优化** → 更新所有文件
6. **创建备份** → Git commit before applying
7. **应用变更** → 运行应用脚本
8. **验证结果** → 检查网站正常

---

## 💡 最佳实践

### DO（应该做）

1. ✅ **先测试小批量**（50篇）验证质量
2. ✅ **Git commit** 在应用优化前
3. ✅ **抽查结果** 每批处理后检查
4. ✅ **分批处理** 避免API限流
5. ✅ **记录发现** 特殊问题记录下来

### DON'T（不应该做）

1. ❌ **盲目处理全部** 不验证质量
2. ❌ **忽略错误** API错误要处理
3. ❌ **不备份** 直接应用可能有风险
4. ❌ **期望完美** LLM可能偶尔出错
5. ❌ **一次性应用** 分阶段更安全

---

## 🐛 问题排查

### 常见问题

**1. API Key错误**
```bash
Error: ANTHROPIC_API_KEY environment variable not set
```
**解决**：
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

**2. JSON解析错误**
```
Error auditing article: JSON decode error
```
**原因**：LLM输出格式不标准
**解决**：脚本已包含容错处理，会跳过并继续

**3. Rate limit**
```
Error: Rate limit exceeded
```
**解决**：等待1分钟后继续，或减小批次大小

---

## 📚 附录

### A. 方案对比总结

| 维度 | 旧方案（硬规则） | 新方案（LLM驱动） |
|------|----------------|-----------------|
| **评估方式** | 机械计分 | 综合理解 |
| **准确性** | 低（虚高） | 高（真实） |
| **灵活性** | 无（死板） | 高（上下文） |
| **可扩展性** | 差（改规则难） | 好（改prompt易） |
| **成本** | 低（本地运行） | 中（API调用） |
| **质量** | 不可靠 | 可靠 |

### B. 预计成本

**Claude Sonnet 4 API定价**：
- Input: ~$3/million tokens
- Output: ~$15/million tokens

**单篇文章成本**：
- 审计：~2000 tokens input + 1000 output ≈ $0.02
- 优化：~3000 tokens input + 2000 output ≈ $0.04
- 合计：~$0.06/article

**全部2209篇文章**：
- 审计全部：2209 × $0.02 ≈ $44
- 优化~1000篇（假设45%需要）：1000 × $0.04 ≈ $40
- **总成本：约$84**

### C. 时间估算

**单篇文章处理时间**：
- 审计：5-10秒
- 优化：10-15秒

**批量处理时间**：
- 50篇：约10-15分钟
- 200篇：约30-45分钟
- 2209篇（全部）：约4-6小时

---

## ✅ 下一步行动

### 立即开始

1. **设置API Key**
2. **测试50篇文章**：
   ```bash
   python3 scripts/llm-audit-and-optimize.py 0 50
   ```
3. **验证结果质量**
4. **如果满意** → 扩展到200篇
5. **逐步处理全部2209篇**

### 后续优化

1. 创建应用脚本（apply-llm-optimizations.py）
2. 集成到CI/CD流程
3. 定期重新审计（每季度）
4. 持续改进Skills（基于反馈）

---

**文档版本**：1.0
**创建日期**：2026-03-13
**维护者**：Claude (Anthropic)
