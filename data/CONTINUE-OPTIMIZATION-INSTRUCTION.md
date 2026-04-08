# 文章元数据优化 - 继续工作指令

**最后更新**: 2026-03-24
**用途**: 新 session 启动时的标准指令文档

---

## 📊 当前优化进度

### 总体状态
- **总文章数**: 2,209 篇
- **已完成**: 380 篇（已应用到实际文件）
- **待优化**: 1,829 篇
- **完成进度**: 17.20%

### 已完成批次（9个批次，共380篇）
```
✅ Batch 11-20    | 文章  11-20   | 10篇  | 已完成
✅ Batch 21-40    | 文章  21-40   | 20篇  | 已完成
✅ Batch 46-95    | 文章  46-95   | 50篇  | 已完成
✅ Batch 96-145   | 文章  96-145  | 50篇  | 已完成
✅ Batch 146-195  | 文章 146-195  | 50篇  | 已完成
✅ Batch 196-245  | 文章 196-245  | 50篇  | 已完成
✅ Batch 246-295  | 文章 246-295  | 50篇  | 已完成
✅ Batch 296-345  | 文章 296-345  | 50篇  | 已完成
✅ Batch 346-395  | 文章 346-395  | 50篇  | 已完成
```

### 待优化范围
```
⏳ 文章   1-10    | 索引   0-9    | 10篇
⏳ 文章  41-45    | 索引  40-44   |  5篇
⏳ 文章 396-2209  | 索引 395-2208 | 1814篇
```

### ⚠️ 特殊情况说明

**Batch 12 (文章 396-475)** 状态：
- ✅ 已生成优化方案（存储在 `data/llm-two-phase-batch-396-475.json`）
- ✅ 已完成质量评分（10个并行任务，平均分 96.9/100）
- ❌ **未应用到实际文件**
- ❌ **未添加重定向配置**
- ❌ **未计入已完成统计**

**原因**: 按照用户指示暂不优化，需等待进一步指令

---

## 🎯 给新 Session 的启动指令

### 方案 A：继续 Batch 12（推荐）

如果用户决定继续完成 Batch 12，请执行：

```
请继续完成 Batch 12（文章 396-475）的优化工作。

当前状态：
- 优化方案已生成（data/llm-two-phase-batch-396-475.json）
- 10个并行任务已完成评分
- 需要执行的步骤：
  1. 应用优化到实际文件（80篇）
  2. 生成重定向配置
  3. 更新 next.config.js
  4. 更新进度跟踪文件

请按照 BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md 标准流程执行。
```

### 方案 B：跳过 Batch 12，优化其他范围

如果用户决定跳过 Batch 12，请执行：

```
请优化以下待优化范围的文章：

选项 1：优化文章 1-10（10篇）
选项 2：优化文章 41-45（5篇）
选项 3：优化文章 476-525（50篇，新的 Batch 13）

请告诉我您选择哪个范围，我将按照标准流程执行优化。
```

### 方案 C：批量优化大批次

如果用户希望加速优化进度：

```
请优化文章 476-575（100篇），分为两个批次：

Batch 13a: 文章 476-525（50篇）
Batch 13b: 文章 526-575（50篇）

使用 10 个并行任务 × 每任务 5-10 篇的策略，按照 v2.1 标准执行。
```

---

## 📁 关键文件位置

### 进度跟踪文件
- **JSON 报告**: `data/OPTIMIZATION-PROGRESS-REPORT.json`
- **快速状态**: `data/QUICK-STATUS.txt`
- **使用说明**: `data/OPTIMIZATION-PROGRESS-README.md`
- **查询脚本**: `data/query-optimization-status.sh`

### 优化标准
- **主标准**: `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md`
- **工作流程**: `.claude/skills/BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md`

### 数据文件
- **文章索引**: `data/articles-index.json`（2,209篇文章的主列表）
- **批次数据**: `data/llm-two-phase-batch-*.json`
- **重定向配置**: `data/REDIRECT-CONFIGURATION-BATCH-*.json`

### 配置文件
- **Next.js 配置**: `next.config.js`（包含所有重定向规则）

---

## 🔍 验证当前进度的命令

在新 session 中，建议先运行以下命令验证进度：

```bash
# 查看快速状态
cat data/QUICK-STATUS.txt

# 或使用查询脚本
chmod +x data/query-optimization-status.sh
./data/query-optimization-status.sh summary

# 查看待优化文章
./data/query-optimization-status.sh pending 20

# 查看已完成批次
./data/query-optimization-status.sh batch-list
```

---

## ⚙️ 标准优化流程（参考）

新 session 执行优化时，请遵循以下流程：

### 第一阶段：准备（Phase 1: Preparation）
1. 读取 `data/articles-index.json` 获取目标文章范围
2. 创建批次数据文件 `data/llm-two-phase-batch-{range}.json`
3. 创建 TodoWrite 任务列表

### 第二阶段：优化（Phase 2: Optimization）
4. 启动 10 个并行 Task agents，每个处理 5-10 篇文章
5. 按照 v2.1 标准评分（≥85分）
6. 收集所有 agent 结果

### 第三阶段：应用（Phase 3: Application）
7. 合并所有 agent 结果到批次 JSON 文件
8. 应用优化到实际 `.md` 文件（更新 frontmatter）
9. 生成重定向配置文件
10. 更新 `next.config.js` 添加重定向

### 第四阶段：更新（Phase 4: Update Progress）
11. 更新 `OPTIMIZATION-PROGRESS-REPORT.json`
12. 更新 `QUICK-STATUS.txt`
13. 创建批次总结报告 `BATCH-{n}-OPTIMIZATION-SUMMARY.md`

---

## 🎯 质量标准（v2.1）

所有优化必须达到以下标准：

### PrimaryKeyword（≥85分）
- 长度：30-50 字符
- 用户友好术语（非学术术语）
- 无介词开头
- 包含年龄/人群指示器

### Slug（≥85分）
- 长度：30-38 字符（理想）
- 使用缩写（BP, CGM, HRV, AFib, MCI）
- SEO 优化
- 可读性强

### Title（≥85分）
- 长度：50-65 字符
- 优先使用问句格式
- 包含具体年龄范围
- 个性化表达（使用 "Your"）

### Description（≥85分，v2.1 新增要求）
- 长度：130-150 字符
- **语义完整性**（8分）：包含标题所有核心概念 + 相关医学实体
- **问答一致性**（7分）：与标题问题形成完整问答
- 开头吸引力（5分）
- 可数价值（如 "3个技巧"、"5个信号"）
- 紧迫性词汇（"今天"、"必备"、"已证实"）

### Overall（≥85分）
- 四个字段的加权平均分

---

## 🚨 重要注意事项

1. **数据一致性**:
   - 只有真正应用到文件的优化才计入已完成统计
   - 生成优化方案 ≠ 完成优化

2. **重定向管理**:
   - 所有 slug 变更必须添加 301 重定向
   - 避免重定向链（A→B→C）

3. **质量保证**:
   - 每个字段必须 ≥85 分
   - Overall 分数必须 ≥85 分
   - 不达标的必须重新优化

4. **进度更新**:
   - 每完成一个批次立即更新进度跟踪文件
   - 保持 JSON 报告与实际文件状态一致

---

## 📞 快速启动示例

### 示例 1：继续默认流程
```
请查看当前优化进度（data/QUICK-STATUS.txt），
然后按照标准流程继续优化下一个批次。

使用 v2.1 标准，10 个并行任务，确保所有评分 ≥85。
```

### 示例 2：指定批次
```
请优化文章 476-525（50篇），按照以下配置：
- 批次名称：Batch 13
- 并行任务：10 个
- 每任务文章数：5 篇
- 优化标准：v2.1
- 目标分数：≥85

完成后更新所有进度跟踪文件。
```

### 示例 3：验证进度
```
请先验证当前优化进度的准确性：
1. 读取 OPTIMIZATION-PROGRESS-REPORT.json
2. 抽查 5-10 篇已完成文章的实际文件
3. 确认 slug 是否已优化
4. 报告验证结果

然后再规划下一步工作。
```

---

**生成日期**: 2026-03-24
**标准版本**: v2.1
**工作流程版本**: BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md
