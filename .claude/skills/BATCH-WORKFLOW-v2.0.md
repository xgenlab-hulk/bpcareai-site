# 批次优化工作流 v2.1

**版本**: v2.1
**生效日期**: 2026-03-27
**配套标准**: OPTIMIZATION-STANDARD-v3.0.md
**替代**: v2.0

---

## 执行概览

```
每批200篇文章 → 4组并行Agent（每组50篇）→ 合并写入 → 抽样校验20篇（10%）→ 不达标修复 → commit → 报告
```

---

## ⚠️ 强制校验规则（新增 v2.1）

**每批优化写入完成后，必须执行抽样校验，不可跳过。**

- 抽样数量：本批次文章数的 **10%**（200篇取20篇，100篇取10篇）
- 抽样方式：随机抽取（用 `random.seed(batch_number)` 保证可复现）
- 合格标准：**抽样平均综合分 ≥ 7.5，且每篇综合分 ≥ 7.0**
- 不合格处理：低于7.0的文章单独重优化，直到达标
- 校验通过后才能 git commit，才能向用户报告完成

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

## Step 4: 抽样校验（强制，不可跳过）

### 4.1 抽取样本

```python
import random, glob, os

content_dir = 'content/articles'
# 取本批次已更新的文件列表
batch_files = [f for f in glob.glob(f'{content_dir}/*.md')
               if "updated: '2026-03-" in open(f).read(500)]  # 按实际日期调整

random.seed(batch_number)  # batch_number = 批次编号，保证可复现
sample = random.sample(batch_files, min(20, len(batch_files) // 10))
```

### 4.2 启动独立校验 Agent

向 general-purpose agent 发送如下 prompt：

```
你是严格的GEO/SEO metadata独立验证者。对以下 {N} 篇文章进行质量校验。

**评分标准（v3.0）**：
- PrimaryKeyword: 20-60字符，自然语言，65岁患者测试，读出来自然
- Title: 40-70字符，不以学术词开头，有独特价值，年龄自然融入（不是括号）
- Description: 严格120-160字符，至少1处"通俗 (术语)"桥接，至少1个具体数据点，无营销词，无模板

**对每篇文章**：
1. 读取文件 content/articles/{slug}.md 的frontmatter
2. 执行底线检查（通过/不通过，注明违反原因）
3. 给出独立语义评分 PK/Title/Desc（1-10），综合分=(PK+Title+Desc)/3
4. 标注主要问题

**要校验的文章slug列表**：
{slug列表，每行一个}

**合格标准**：综合分 ≥ 7.5（批次平均），每篇综合分 ≥ 7.0

**输出**：
- 每篇的评分和主要问题
- 批次平均分
- 低于7.0的文章列表（需重优化）
- 最终判定：✅ PASS（平均≥7.5且无文章<7.0）/ ⚠️ PARTIAL（平均≥7.5但有文章<7.0）/ ❌ FAIL（平均<7.5）
```

### 4.3 校验结果处理

**校验完成后，只向用户报告结果，不自动发起重优化。**

报告内容：
- 每篇抽样文章的评分和主要问题
- 批次平均分和最终判定（PASS/PARTIAL/FAIL）
- 低于7.0的文章slug列表

**等待用户指令**：是否需要重优化、重优化哪些文章，由用户决定。

**commit时机**：校验报告发出后，等待用户确认 → 用户说"可以commit"或"继续下一批"后才执行 commit。

---

## Step 5: 向用户报告校验结果，等待确认后 commit

**流程**：校验完成 → 向用户报告 → 等待用户确认 → 用户说"可以"/"继续"后才 commit。

向用户报告：

```markdown
## Batch {ID} 完成报告 (v2.1流程)

### 优化统计
| 指标 | 数值 |
|------|------|
| 本批文章数 | 200篇 |
| 成功写入 | XX篇 |

### 抽样校验结果（20篇）
| 指标 | 数值 |
|------|------|
| 抽样数量 | 20篇 |
| 批次平均分 | X.X/10 |
| PK均分 | X.X |
| Title均分 | X.X |
| Desc均分 | X.X |
| 低于7.0文章数 | X篇（已修复） |
| 校验结论 | ✅ PASS / ⚠️ PARTIAL（已修复）/ ❌ FAIL |

### 总体进度
| 指标 | 数值 |
|------|------|
| 已优化 | XXXX篇 |
| 剩余 | XXXX篇 |
| 完成率 | XX.X% |
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
