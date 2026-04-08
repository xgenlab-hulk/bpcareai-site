# BPCareAI 网站项目 - Claude Code 自动化指令

## 项目概述

BPCareAI 是一个面向老年人的心血管健康文章网站（Next.js），当前有 2,209 篇文章需要进行元数据优化（SEO metadata：primaryKeyword、slug、title、description）。

---

## 自动启动行为

**每次新 session 启动时，必须自动执行以下操作（无需用户指令）：**

### Step 1: 读取最新进度

```
读取文件: data/QUICK-STATUS.txt
```

显示给用户：
- 已优化/总文章数/完成率
- 已完成批次列表
- 待优化范围

### Step 2: 读取批次执行计划

```
读取文件: data/BATCH-EXECUTION-PLAN.json
```

找到 `remaining_batches` 中第一个 `"status": "pending"` 的批次，作为推荐批次。

### Step 3: 向用户报告并询问

向用户输出以下格式的报告：

```
📊 当前优化进度: XXX/2209 (XX.XX%)
✅ 已完成批次: X个
⏳ 下一推荐批次: batch-XXX (文章 XXX-XXX, XX篇)

是否开始优化下一批次？或指定其他批次？
```

**等待用户确认后再执行优化。**

---

## 批次优化执行流程

当用户说 `优化下一批次`、`优化 batch-XXX`、`继续优化` 或确认开始时：

### 1. 读取核心标准文件（按顺序）

1. `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md` — 评分标准
2. `data/BATCH-EXECUTION-PLAN.json` — 批次计划
3. `.claude/skills/BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md` — 工作流程
4. `.claude/skills/AUTO-BATCH-OPTIMIZATION-TRIGGER.md` — 触发器逻辑

### 2. 提取目标批次文章数据

```bash
jq '.[起始索引:结束索引]' data/articles-index.json > /tmp/batchXX-articles.json
```

### 3. 启动并行 Agent Tasks 执行优化

- 每个 Task 处理 5 篇文章
- 严格按照 MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md 评分
- 所有字段必须 ≥85 分

### 4. 合并结果 + 生成重定向配置

- 输出: `data/llm-two-phase-batch-{范围}.json`
- 输出: `data/REDIRECT-CONFIGURATION-BATCH-{编号}.json`

### 5. 反向验证（抽样 5 篇）

### 6. 更新进度文件

**必须同时更新以下 3 个文件，确保数据一致：**

| 文件 | 更新内容 |
|------|---------|
| `data/BATCH-EXECUTION-PLAN.json` | 将完成的批次从 remaining 移到 completed，更新 metadata 计数 |
| `data/QUICK-STATUS.txt` | 更新已优化数、待优化数、完成率、已完成批次列表、待优化范围 |
| `data/OPTIMIZATION-PROGRESS-REPORT.json` | 更新 summary 中的 optimized_count、pending_count、completion_percentage |

**数据一致性校验公式：**
```
已优化 + 待优化 = 2209（总文章数）
已完成批次文章数之和 = 已优化数
```

### 7. 向用户报告结果

---

## 关键文件路径

| 文件 | 用途 |
|------|------|
| `data/QUICK-STATUS.txt` | 快速进度查询（每次启动必读） |
| `data/BATCH-EXECUTION-PLAN.json` | 批次执行计划（每次启动必读） |
| `data/OPTIMIZATION-PROGRESS-REPORT.json` | 详细进度报告 |
| `data/PARALLEL-BATCH-EXECUTION-GUIDE.md` | 并行执行指南 |
| `data/articles-index.json` | 全部文章索引 |
| `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md` | 优化评分标准 |
| `.claude/skills/BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md` | 工作流标准 |
| `.claude/skills/AUTO-BATCH-OPTIMIZATION-TRIGGER.md` | 自动触发器 |

---

## 数据一致性规则

**每次完成批次优化后，必须确保以下 3 个文件中的数据完全一致：**

1. `data/QUICK-STATUS.txt`
2. `data/BATCH-EXECUTION-PLAN.json`
3. `data/OPTIMIZATION-PROGRESS-REPORT.json`

**一致性字段：**
- 已优化文章数
- 待优化文章数
- 完成百分比
- 已完成批次数量和列表
- 待优化范围（不能有重叠、不能有遗漏）

**校验方式：**
```
已优化数 + 待优化数 = 2209
所有已完成批次的文章数之和 = 已优化数
所有待优化批次的文章数之和 = 待优化数
```

---

## 触发关键词

| 用户说 | 行为 |
|--------|------|
| `优化下一批次` / `继续优化` / `下一批次` | 自动检测第一个 pending 批次并执行 |
| `优化 batch-XXX` | 执行指定批次 |
| `优化文章 XXX-XXX` | 匹配对应批次并执行 |
| `统计优化进度` / `查看进度` | 只显示进度，不执行优化 |
| `检查数据一致性` | 验证 3 个进度文件的数据是否一致 |
