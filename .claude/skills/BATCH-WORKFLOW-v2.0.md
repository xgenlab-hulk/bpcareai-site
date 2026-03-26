# 批次优化工作流 v2.0

**版本**: v2.0
**生效日期**: 2026-03-25
**配套标准**: OPTIMIZATION-STANDARD-v3.0.md
**替代**: BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md (v1.0)

---

## 执行概览

```
每批50篇文章 → 10个并行Task（每Task 5篇）→ 合并 → 抽样验证 → 报告
```

---

## Step 0: 准备

1. 执行 `/compact` 释放上下文空间
2. 读取 `data/BATCH-EXECUTION-PLAN.json` 确定本批次范围
3. 读取 `data/QUICK-STATUS.txt` 确认进度

---

## Step 1: 提取文章数据

```bash
jq '.[起始索引:结束索引]' data/articles-index.json > /tmp/batch-{ID}-articles.json
```

验证:
```bash
jq 'length' /tmp/batch-{ID}-articles.json  # 应为50
```

---

## Step 2: 启动10个并行Task

**Task Prompt模板（v3.0专用）：**

```
你是一个GEO/SEO优化专家。请优化以下5篇文章的metadata。

## 必读标准
读取: `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/OPTIMIZATION-STANDARD-v3.0.md`

## 你的文章数据
读取: `/tmp/batch-{ID}-articles.json`，取索引 {起始}-{结束} 的5篇文章

## 对每篇文章执行

### 1. 理解文章
- 这篇文章在讲什么？（核心话题）
- 谁需要这个信息？（目标受众）
- 患者会怎么搜索这个问题？（自然语言查询）
- 这篇文章的独特价值是什么？

### 2. 优化3个字段（不动slug）
- **PrimaryKeyword**: 写一个自然语言查询（不是碎片化词组）
- **Title**: 选择最匹配文章本质的格式（不强制用同一模板）
- **Description**: 像专科医生一句话概括（必须含具体数据/实体）

### 3. 底线检查 + 语义评分
按v3.0标准执行底线检查和1-10分语义评分。

### 4. 多样性检查
5篇文章的Title至少使用2种不同句式格式。

## 关键规则
- ❌ 不改slug
- ❌ Description不用"Learn how/why X. Includes A, B, C."模板
- ❌ PrimaryKeyword不能是去掉介词的名词堆砌
- ❌ 不塞营销词（today/proven/essential/must-know）
- ✅ 保留关键医学实体（药物名/疾病名/检测指标）
- ✅ Description必须含至少1个具体数据点
- ✅ 每篇Description结构必须独特

## 输出格式

保存到 `/tmp/batch-{ID}-task-{N}-results.json`

{
  "task_id": "batch-{ID}-task-{N}",
  "articles": [
    {
      "article_number": N,
      "original_slug": "...(不改动)",
      "optimized": {
        "primaryKeyword": "...",
        "title": "...",
        "description": "..."
      },
      "original": {
        "primaryKeyword": "...",
        "title": "...",
        "description": "..."
      },
      "baseline_check": {
        "pk_pass": true,
        "title_pass": true,
        "description_pass": true,
        "all_pass": true
      },
      "semantic_scores": {
        "primaryKeyword": 8,
        "title": 9,
        "description": 8,
        "overall": 8.3
      },
      "key_changes": ["具体改进1", "具体改进2"],
      "medical_entities_preserved": ["entity1", "entity2"],
      "needs_redirect": false
    }
  ]
}

开始优化。
```

**Task索引分配：**

| Task | 索引范围 |
|------|---------|
| 1 | 0-4 |
| 2 | 5-9 |
| 3 | 10-14 |
| 4 | 15-19 |
| 5 | 20-24 |
| 6 | 25-29 |
| 7 | 30-34 |
| 8 | 35-39 |
| 9 | 40-44 |
| 10 | 45-49 |

---

## Step 3: 合并结果

```bash
jq -s '{
  batch_info: {
    batch_id: "batch-{ID}",
    articles_range: "{起始}-{结束}",
    total_articles: 50,
    optimization_date: "YYYY-MM-DD",
    standard_version: "v3.0",
    method: "GEO-first semantic optimization via 10 parallel Tasks"
  },
  summary: {
    total_articles: ([.[].articles | length] | add),
    all_baseline_passed: (all(.[].articles[]; .baseline_check.all_pass)),
    average_pk_score: (([.[].articles[].semantic_scores.primaryKeyword] | add) / ([.[].articles | length] | add)),
    average_title_score: (([.[].articles[].semantic_scores.title] | add) / ([.[].articles | length] | add)),
    average_desc_score: (([.[].articles[].semantic_scores.description] | add) / ([.[].articles | length] | add)),
    average_overall: (([.[].articles[].semantic_scores.overall] | add) / ([.[].articles | length] | add))
  },
  phase1_metadata: {
    optimization_results: ([.[].articles] | add)
  }
}' /tmp/batch-{ID}-task-{1,2,3,4,5,6,7,8,9,10}-results.json > data/llm-two-phase-batch-{起始}-{结束}.json
```

---

## Step 4: 独立抽样验证

从50篇中抽取5篇（索引0, 12, 24, 36, 48），启动1个独立验证Task：

```
你是独立验证者。请对以下5篇已优化文章重新评估。

读取标准: OPTIMIZATION-STANDARD-v3.0.md
读取数据: data/llm-two-phase-batch-{起始}-{结束}.json 中索引 0, 12, 24, 36, 48

对每篇文章：
1. 重新执行底线检查
2. 独立给出语义评分（1-10）
3. 与自评分数对比

输出偏差分析：
- 如果平均偏差 ≤ 1分: 批次质量合格 ✅
- 如果平均偏差 1-2分: 批次质量可接受 ⚠️
- 如果平均偏差 > 2分: 批次需检查 ❌

保存到 /tmp/batch-{ID}-validation.json
```

---

## Step 5: 向用户报告

```markdown
## Batch {ID} 完成报告 (v3.0标准)

### 统计
| 指标 | 数值 |
|------|------|
| 文章范围 | {起始}-{结束} |
| 总篇数 | 50 |
| 底线全通过 | XX/50 |
| PK平均分 | X.X/10 |
| Title平均分 | X.X/10 |
| Description平均分 | X.X/10 |
| 综合平均分 | X.X/10 |
| 验证偏差 | X.X分 |

### 质量评级
- ✅ / ⚠️ / ❌

### 生成文件
1. data/llm-two-phase-batch-{起始}-{结束}.json
2. /tmp/batch-{ID}-validation.json
```

---

## Step 6: 更新进度

更新以下文件：
1. `data/BATCH-EXECUTION-PLAN.json` — 标记批次为completed
2. `data/QUICK-STATUS.txt` — 更新已优化数量
3. `data/OPTIMIZATION-PROGRESS-REPORT.json` — 添加批次记录

---

## 380篇二次修复专用流程

与新文章优化的区别：

| 步骤 | 新文章 | 380篇修复 |
|------|--------|----------|
| 读取 | 原始未优化metadata | 已优化的v2.1 metadata |
| PK | 从零优化 | 重写（碎片化→自然语言） |
| Title | 从零优化 | **保留**（除非明显模板化） |
| Description | 从零优化 | 重写（模板化→独特+数据） |
| Slug | 不动 | 不动 |
| 输出 | 完整3字段 | PK + Description（Title标注是否保留/修改） |

---

**📌 文档路径**: `.claude/skills/BATCH-WORKFLOW-v2.0.md`
