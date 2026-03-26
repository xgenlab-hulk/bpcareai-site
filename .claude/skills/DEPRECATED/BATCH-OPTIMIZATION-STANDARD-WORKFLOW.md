# 📋 批次优化标准化工作流程

**版本**: v1.0
**创建时间**: 2026-03-21
**适用场景**: 所有50篇文章的批次优化任务
**目标**: 确保每个批次优化质量一致、流程标准化

---

## 🎯 标准执行流程

### Step 0: 对话压缩 (每个批次开始前)

**⚠️ 重要**: 在开始新批次前，**必须先压缩对话**以释放上下文空间。

```bash
# 用户执行命令
/compact
```

**目的**:
- 释放token空间
- 保持Claude Code响应速度
- 确保有足够上下文处理50篇文章

---

### Step 1: 确定批次范围

**当前进度查询**:
```bash
# 检查已优化数量
ls -1 /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-*.json | wc -l

# 查看最后优化的文章范围
ls -1 /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-*.json | tail -1
```

**批次命名规则**:
- 格式: `llm-two-phase-batch-{起始文章编号}-{结束文章编号}.json`
- 示例: `llm-two-phase-batch-196-245.json` (Batch 8)

**下一批次计算**:
```
上一批次结束编号 + 1 = 新批次起始编号
新批次起始编号 + 49 = 新批次结束编号
```

---

### Step 2: 创建待办清单

使用TodoWrite工具创建标准化待办事项：

```markdown
1. [ ] 提取文章 {起始}-{结束} 到临时文件
2. [ ] 创建10个并行Tasks (每个优化5篇文章)
3. [ ] 合并所有Task结果到统一批次文件
4. [ ] 生成301重定向配置
5. [ ] 抽样反向验证5篇文章
6. [ ] 向用户报告结果
```

---

### Step 3: 提取文章数据

```bash
# 计算索引位置
起始索引 = 文章编号
结束索引 = 文章编号 + 50

# 提取文章
jq '.[起始索引:结束索引]' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/articles-index.json > /tmp/batch{批次号}-articles-{起始}-{结束}.json
```

**示例 (Batch 8)**:
```bash
jq '.[195:245]' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/articles-index.json > /tmp/batch8-articles-196-245.json
```

---

### Step 4: 创建10个并行Tasks

**重要参数**:
- **subagent_type**: `general-purpose`
- **文章分配**: 每个Task处理5篇文章
- **输出文件**: `/tmp/batch{批次号}-task{1-10}-results.json`

**Task提示词模板**:
```
You are optimizing **5 articles (Articles {起始}-{结束})** from Batch {批次号} using LLM-driven semantic optimization.

## Your Task

Read the following files:
1. `/tmp/batch{批次号}-articles-{起始}-{结束}.json` - Extract articles at indices {索引范围}
2. `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md` - Strict scoring formulas
3. `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/llm-article-audit-comprehensive.md` - Audit methodology
4. `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/llm-article-optimization-comprehensive.md` - Optimization methodology

## Workflow for Each Article

### Step 1: Audit Current Metadata
Using the MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md formulas, score each field:
- primaryKeyword (100 points)
- slug (100 points)
- title (100 points)
- description (100 points)

**Threshold**: If any field < 85, optimization is required.

### Step 2: Optimize Using LLM Semantic Understanding
Apply the llm-article-optimization-comprehensive.md approach:
- Think like a user, not a robot
- Transform technical jargon to user-friendly language
- Ensure all fields score ≥85

### Step 3: Verify Optimized Scores
Re-score the optimized metadata to confirm all fields ≥85.

## Output Format

Save your results to `/tmp/batch{批次号}-task{任务号}-results.json`

## Critical Requirements

1. **Apply STRICT scoring** - Do not inflate scores
2. **All fields must score ≥85** after optimization
3. **Mark needs_redirect: true** if slug changes
4. **Use semantic understanding** - Not hard rules

Begin optimization now.
```

**Task索引分配表**:
| Task | 文章编号 | 索引范围 |
|------|---------|---------|
| 1 | 起始+0 到 起始+4 | 0-4 |
| 2 | 起始+5 到 起始+9 | 5-9 |
| 3 | 起始+10 到 起始+14 | 10-14 |
| 4 | 起始+15 到 起始+19 | 15-19 |
| 5 | 起始+20 到 起始+24 | 20-24 |
| 6 | 起始+25 到 起始+29 | 25-29 |
| 7 | 起始+30 到 起始+34 | 30-34 |
| 8 | 起始+35 到 起始+39 | 35-39 |
| 9 | 起始+40 到 起始+44 | 40-44 |
| 10 | 起始+45 到 起始+49 | 45-49 |

---

### Step 5: 合并Task结果

```bash
jq -s '{
  batch_info: {
    batch_id: "batch-{批次编号}",
    batch_name: "Batch {批次号}",
    articles_range: "{起始}-{结束}",
    total_articles: 50,
    optimization_date: "{日期}",
    optimization_method: "LLM-driven semantic optimization via 10 parallel Tasks"
  },
  summary: {
    total_articles: ([.[].results | length] | add),
    all_successful: (all(.[].results[]; .optimization_successful)),
    average_original_score: (([.[].results[].original_scores.overall] | add) / ([.[].results | length] | add)),
    average_optimized_score: (([.[].results[].optimized_scores.overall] | add) / ([.[].results | length] | add)),
    average_improvement: ((([.[].results[].optimized_scores.overall] | add) - ([.[].results[].original_scores.overall] | add)) / ([.[].results | length] | add)),
    redirects_needed: ([.[].results[] | select(.needs_redirect == true)] | length)
  },
  phase1_metadata: {
    optimization_results: ([.[].results] | add)
  }
}' /tmp/batch{批次号}-task{1,2,3,4,5,6,7,8,9,10}-results.json > /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-{起始}-{结束}.json
```

**验证合并结果**:
```bash
jq '.summary' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-{起始}-{结束}.json
```

**预期输出**:
```json
{
  "total_articles": 50,
  "all_successful": true,
  "average_original_score": 65-75,
  "average_optimized_score": 88-92,
  "average_improvement": 20-30,
  "redirects_needed": 35-48
}
```

---

### Step 6: 生成301重定向配置

```bash
jq '{
  metadata: {
    created_date: "{日期}",
    total_redirects: (.phase1_metadata.optimization_results | map(select(.needs_redirect == true)) | length),
    batches_covered: ["batch-{批次编号}"],
    purpose: "为Batch {批次号}优化的50篇文章提供301永久重定向配置",
    usage: "将redirects数组内容添加到next.config.js的redirects()函数中"
  },
  redirects: [
    .phase1_metadata.optimization_results[] |
    select(.needs_redirect == true) |
    {
      source: ("/articles/" + .original_metadata.slug),
      destination: ("/articles/" + .optimized_metadata.slug),
      permanent: true
    }
  ],
  instructions: {
    step_1: "打开 next.config.js 文件",
    step_2: "找到 async redirects() 函数",
    step_3: "将上述redirects数组内容添加到slugRedirects数组中",
    step_4: "保存并重新部署网站",
    step_5: "验证重定向是否生效: curl -I https://yourdomain.com/articles/[旧slug]"
  }
}' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-{起始}-{结束}.json > /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/REDIRECT-CONFIGURATION-BATCH-{批次号}.json
```

**验证重定向配置**:
```bash
jq '.metadata' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/REDIRECT-CONFIGURATION-BATCH-{批次号}.json
```

---

### Step 7: 抽样反向验证

**抽样策略**: 均匀分布抽取5篇文章
- 索引: 0, 12, 24, 36, 48
- 对应文章编号: 起始+0, 起始+12, 起始+24, 起始+36, 起始+48

**验证Task提示词**:
```
You are performing **independent reverse validation** on 5 randomly selected articles from Batch {批次号}.

## Your Task

Read the following files:
1. `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-{起始}-{结束}.json` - Extract articles at indices 0, 12, 24, 36, 48
2. `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md` - Official scoring formulas

## Workflow

For each of the 5 selected articles:

### Step 1: Extract Optimized Metadata
Get the optimized metadata that was claimed to score ≥85.

### Step 2: Independent Re-Scoring
Using MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md formulas, **independently re-score** each field.

**IMPORTANT**:
- Apply STRICT scoring formulas
- Do NOT trust the claimed scores
- Be conservative, not lenient

### Step 3: Compare Scores
Compare your verified scores with the claimed scores:
- If verified score ≥85: **PASS** ✅
- If verified score <85: **FAIL** ❌

### Step 4: Identify Issues
For failing articles, identify specific problems.

## Output Format

Save your results to `/tmp/batch{批次号}-reverse-validation-report.json`

## Critical Requirements

1. **Be STRICT** - Apply formulas exactly as written
2. **Be INDEPENDENT** - Don't trust claimed scores
3. **Be CONSERVATIVE** - When in doubt, score lower
4. **Document everything** - Explain why each score was given

Begin validation now.
```

**质量阈值**:
- **通过率 ≥80% (4/5篇)**: 批次质量合格 ✅
- **通过率 60-79% (3/5篇)**: 批次质量可接受 ⚠️
- **通过率 <60% (<3/5篇)**: 批次需要返工 ❌

---

### Step 8: 向用户报告结果

**报告模板**:

```markdown
## ✅ Batch {批次号} 优化完成报告

### 📊 总体统计

| 指标 | 数值 |
|------|------|
| **批次编号** | Batch {批次号} |
| **文章范围** | Articles {起始}-{结束} |
| **总文章数** | 50篇 |
| **优化成功率** | {成功率}% |
| **原始平均分** | {原始分}/100 |
| **优化后平均分** | {优化分}/100 |
| **平均提升** | +{提升分}分 |
| **需要重定向** | {重定向数}条301重定向 |

---

## 🔍 抽样反向验证结果

**通过率：{通过率}% ({通过数}/5篇)**

| 文章编号 | 声称分数 | 验证分数 | 差异 | 状态 |
|---------|---------|---------|------|------|
| Article {编号1} | {分数} | {验证分} | {差异} | {状态} |
| Article {编号2} | {分数} | {验证分} | {差异} | {状态} |
| Article {编号3} | {分数} | {验证分} | {差异} | {状态} |
| Article {编号4} | {分数} | {验证分} | {差异} | {状态} |
| Article {编号5} | {分数} | {验证分} | {差异} | {状态} |

---

## 📁 生成的文件

1. **批次结果**: `data/llm-two-phase-batch-{起始}-{结束}.json`
2. **重定向配置**: `data/REDIRECT-CONFIGURATION-BATCH-{批次号}.json`
3. **验证报告**: `/tmp/batch{批次号}-reverse-validation-report.json`

---

## 🎯 质量评级

- **优秀** ⭐⭐⭐⭐⭐: 通过率100%, 平均分90+
- **良好** ⭐⭐⭐⭐: 通过率80-99%, 平均分88-90
- **合格** ⭐⭐⭐: 通过率60-79%, 平均分85-88
- **需改进** ⭐⭐: 通过率<60%, 平均分<85
```

---

## 🚨 常见问题排查

### 问题1: Task文件JSON格式错误

**症状**:
```
jq: parse error: Expected another key-value pair at line X
```

**解决方案**:
1. 单独验证每个Task结果文件
2. 找到格式错误的文件，手动修复或重新生成
3. 使用jq验证: `jq '.results | length' /tmp/batch{批次号}-task{任务号}-results.json`

---

### 问题2: 合并后文章数量不是50

**症状**:
```json
{
  "total_articles": 45  // 应该是50
}
```

**解决方案**:
1. 检查每个Task文件的文章数: `jq '.results | length' /tmp/batch{批次号}-task*.json`
2. 确认所有10个Task文件都存在
3. 重新运行缺失的Task

---

### 问题3: 验证通过率低于预期

**通过率 <60%时的处理流程**:
1. 查看验证报告详细问题
2. 识别共同模式（如都是Description问题）
3. **选项A**: 接受现状，标记为"需改进"批次
4. **选项B**: 重新优化失败的文章
5. 向用户报告情况，由用户决定

---

## 📋 批次优化检查清单

### 开始前
- [ ] 执行 `/compact` 压缩对话
- [ ] 确认上一批次已完成
- [ ] 确定新批次范围（起始-结束文章编号）

### 执行中
- [ ] 提取文章数据到临时文件
- [ ] 创建10个并行Tasks
- [ ] 等待所有Tasks完成
- [ ] 验证每个Task输出文件格式正确
- [ ] 合并所有Task结果

### 完成后
- [ ] 生成重定向配置
- [ ] 执行反向验证
- [ ] 生成批次报告
- [ ] 向用户汇报结果
- [ ] 清理临时文件（可选）

---

## 📊 进度追踪

**全局进度查询**:
```bash
total=$(jq 'length' /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/articles-index.json)
optimized=$(ls -1 /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-*.json | while read f; do jq '.summary.total_articles // (.phase1_metadata.optimization_results | length) // (.optimized_articles | length)' "$f" 2>/dev/null; done | paste -sd+ | bc)
remaining=$((total - optimized))
echo "已优化: $optimized / $total ($(awk "BEGIN {printf \"%.2f\", $optimized * 100 / $total}")%)"
echo "剩余: $remaining 篇"
```

---

## 🎯 质量保证原则

1. **严格评分** - 使用MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md公式，不虚高
2. **用户优先** - 转换技术术语为用户搜索语言
3. **语义完整** - 确保Description包含Title核心概念
4. **QA一致性** - 问题式Title需要Description直接回答
5. **独立验证** - 反向验证必须独立评分，不信任声称分数

---

**维护者**: Claude Code
**最后更新**: 2026-03-21
**适用版本**: MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1
