# 手动生成文章数量控制指南

## 📋 问题说明

### 为什么手动执行会生成 30 篇文章？

在修复之前，手动在 GitHub Actions 执行 "Daily Article Generation & Deployment" 时会自动生成 30 篇文章，这是因为：

1. **自动阶段检测机制**：`auto-generate-daily.ts` 根据 `automation-config.json` 中的 `projectStartDate` 计算当前是第几天，然后根据阶段配置决定生成数量：
   - Day 1-20: 15 篇/天
   - Day 21-40: 20 篇/天
   - Day 41+: **30 篇/天**

2. **日期配置问题**：如果 `projectStartDate` 设置不当（例如设置为未来日期），会导致天数计算异常，系统会使用**最后一个阶段的配置**（30 篇/天）作为 fallback。

3. **参数未传递**：虽然 GitHub Actions 工作流定义了 `articles_count` 输入参数，但**没有传递给执行脚本**。

---

## ✅ 解决方案

已对系统进行以下改进：

### 1. 支持手动指定文章数量

现在手动执行时可以通过环境变量 `ARTICLES_COUNT_OVERRIDE` 覆盖自动计算的数量。

**GitHub Actions 工作流**（`.github/workflows/daily-article-generation.yml`）已更新：
- 读取用户输入的 `articles_count` 参数
- 通过环境变量 `ARTICLES_COUNT_OVERRIDE` 传递给脚本
- 脚本优先使用覆盖值，如果未提供则自动检测

**自动化脚本**（`scripts/auto-generate-daily.ts`）已更新：
- 检查 `ARTICLES_COUNT_OVERRIDE` 环境变量
- 如果存在且为有效数字，使用该值
- 否则按照阶段配置自动计算

### 2. 修正项目启动日期

已将 `automation-config.json` 中的 `projectStartDate` 更新为 `"2025-11-27"`（今天），确保天数计算正确。

### 3. 改进异常处理

当天数计算异常（< 1）时，系统会：
- 显示警告信息
- 使用第一阶段配置作为 fallback（15 篇/天）
- 而不是默认使用最后阶段的 30 篇/天

---

## 🚀 使用方法

### 方法 1：在 GitHub Actions 手动执行（推荐）

1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择左侧的 **"Daily Article Generation & Deployment"** 工作流
4. 点击右侧的 **"Run workflow"** 按钮
5. 在弹出框中：
   - **Branch**: 选择 `main`
   - **Override article count**: 输入你想生成的文章数量（例如：`5`）
   - 如果留空，则自动根据天数检测（Day 1-20: 15篇，Day 21-40: 20篇，Day 41+: 30篇）
6. 点击绿色的 **"Run workflow"** 按钮

**示例**：
- 输入 `5` → 生成 5 篇文章
- 输入 `10` → 生成 10 篇文章
- 留空 → 根据当前是第几天自动决定（Day 1 = 15篇）

---

### 方法 2：本地执行并指定数量

在本地终端中执行：

```bash
# 生成 5 篇文章
ARTICLES_COUNT_OVERRIDE=5 npm run auto:generate

# 生成 10 篇文章
ARTICLES_COUNT_OVERRIDE=10 npm run auto:generate

# 使用自动检测（根据天数）
npm run auto:generate
```

**注意**：本地执行需要在 `.env` 文件中配置 `QWEN_API_KEY`。

---

## 📊 阶段配置说明

当前配置（`automation-config.json`）：

| 阶段 | 天数范围 | 文章数/天 | 说明 |
|------|---------|----------|------|
| Initial growth phase | Day 1 - 20 | 15 篇 | 初期增长阶段 |
| Acceleration phase | Day 21 - 40 | 20 篇 | 加速阶段 |
| Mature phase | Day 41+ | 30 篇 | 成熟阶段（持续） |

**项目启动日期**：2025-11-27

**计算方式**：
- 今天是 2025-11-27 → Day 1 → 15 篇/天
- 明天是 2025-11-28 → Day 2 → 15 篇/天
- 2025-12-16 → Day 20 → 15 篇/天
- 2025-12-17 → Day 21 → 20 篇/天
- 2026-01-06 → Day 41 → 30 篇/天
- 之后每天都是 30 篇

---

## 🔧 日志示例

### 自动检测模式（未手动指定）

```
╔════════════════════════════════════════════════════════╗
║      Daily Article Generation Automation              ║
╚════════════════════════════════════════════════════════╝

📅 Project start date: 2025-11-27
📊 Days since start: Day 1

📌 Current stage: Initial growth phase
🎯 Target articles: 15
```

### 手动覆盖模式（指定数量）

```
╔════════════════════════════════════════════════════════╗
║      Daily Article Generation Automation              ║
╚════════════════════════════════════════════════════════╝

📅 Project start date: 2025-11-27
📊 Days since start: Day 1

🔧 Manual override detected!
📌 Stage: Manual override
🎯 Target articles: 5 (overridden)
```

---

## 💡 最佳实践

### 日常自动执行（定时任务）

- ✅ **不需要手动操作**
- ✅ 每天北京时间 10:00 (UTC 02:00) 自动执行
- ✅ 根据天数自动调整生成数量（15 → 20 → 30）

### 手动测试/补充

- ✅ 使用 GitHub Actions 手动执行功能
- ✅ 指定较小的数量（例如 3-5 篇）进行测试
- ✅ 用于紧急补充或特殊情况

### 本地开发测试

```bash
# 只生成 1 篇文章进行测试
ARTICLES_COUNT_OVERRIDE=1 npm run auto:generate

# 测试完整流程但只生成 3 篇
ARTICLES_COUNT_OVERRIDE=3 npm run auto:generate
```

---

## ⚠️ 注意事项

1. **API 成本**：生成数量越多，消耗的 API token 越多，成本越高
   - 1 篇文章 ≈ 2000-3000 tokens (生成) + 1024 tokens (embedding)
   - 30 篇文章 ≈ 90,000 tokens

2. **执行时间**：每篇文章生成约需 5-10 秒
   - 5 篇 ≈ 30-60 秒
   - 15 篇 ≈ 2-3 分钟
   - 30 篇 ≈ 5-10 分钟

3. **Topics 库存**：如果库存不足（< 30），系统会自动补充 50 个新 topics
   - 补充 topics 也会消耗 API token
   - 建议保持充足的 topics 库存

4. **GitHub Actions 限制**：
   - 免费账户每月 2000 分钟执行时间
   - 工作流超时时间设置为 120 分钟（足够生成 100+ 篇文章）

---

## 📝 总结

现在你可以完全控制手动执行时生成的文章数量：

- 🎯 **手动执行 + 指定数量** → 精确控制（推荐用于测试）
- 🤖 **手动执行 + 不指定** → 自动检测（根据天数）
- ⏰ **定时执行** → 自动检测（每天北京时间 10:00）

再也不会意外生成 30 篇文章了！🎉
