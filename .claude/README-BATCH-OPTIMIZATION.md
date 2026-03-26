# 🚀 批次优化快速启动指南

**版本**: v1.0
**最后更新**: 2026-03-23

---

## ⚡ 一句话启动

在**任何新的Claude Code Session**中，只需输入以下任一命令：

```bash
# 方式1: 自动检测下一个待优化批次
优化下一批次

# 方式2: 指定批次ID
优化 batch-012

# 方式3: 指定文章范围
优化文章 446-495
```

**就这么简单！** 系统会自动完成所有步骤。

---

## 🤖 系统自动执行的步骤

当你输入上述命令后，系统会自动：

1. ✅ 读取优化标准 (MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md)
2. ✅ 读取批次计划 (BATCH-EXECUTION-PLAN.json)
3. ✅ 检测待优化批次 (自动跳过已完成)
4. ✅ 提取文章数据 (从articles-index.json)
5. ✅ 启动10个并行Tasks (每个处理5篇文章)
6. ✅ 应用严格评分标准 (字符限制+≥85分)
7. ✅ 合并Task结果
8. ✅ 生成301重定向配置
9. ✅ 执行反向验证 (抽样5篇)
10. ✅ 更新批次状态
11. ✅ 生成执行报告

**你不需要做任何额外操作！**

---

## 📊 当前进度查询

想知道优化进度？输入：

```bash
统计优化进度
```

会显示：
- ✅ 已完成文章数 / 总文章数
- ✅ 完成百分比
- ✅ 剩余批次数

---

## 📋 查看批次清单

想知道有哪些批次待优化？查看以下文件：

```bash
# 完整批次清单 (JSON格式)
data/BATCH-EXECUTION-PLAN.json

# Session分配指南 (Markdown格式)
data/SESSION-ALLOCATION-CHECKLIST.md

# 并行执行详细指南
data/PARALLEL-BATCH-EXECUTION-GUIDE.md
```

---

## 🔒 质量保证

每个批次都会自动执行：

### ✅ 严格字符限制
- PrimaryKeyword: 25-50字符
- Slug: 30-38字符
- Title: 50-65字符
- Description: 130-150字符

### ✅ 严格评分标准
- 所有字段≥85分
- 使用v2.1公式精确计算
- 字符超限自动扣分

### ✅ 自动反向验证
- 随机抽样5篇文章
- 独立重新评分
- 报告真实通过率

---

## 📁 输出文件

每个批次完成后会自动生成：

### 1️⃣ 优化结果文件
```
data/llm-two-phase-batch-{范围}.json
```
示例: `data/llm-two-phase-batch-446-495.json`

### 2️⃣ 重定向配置文件
```
data/REDIRECT-CONFIGURATION-BATCH-{编号}.json
```
示例: `data/REDIRECT-CONFIGURATION-BATCH-12.json`

---

## 🎯 多Session并行执行

### 方案A: 保守型 (5个Session)

打开5个Claude Code窗口，分别执行：

**Session 1**:
```
优化 batch-010
优化 batch-011
优化 batch-012
优化 batch-013
```

**Session 2**:
```
优化 batch-014
优化 batch-015
优化 batch-016
优化 batch-017
```

...以此类推

### 方案B: 激进型 (10个Session)

打开10个窗口，每个执行4个批次。

详见: `data/SESSION-ALLOCATION-CHECKLIST.md`

---

## ⚠️ 重要注意事项

### ✅ 避免批次冲突
**千万不要在两个Session中执行相同的批次ID！**

### ✅ 按顺序执行
在同一Session中，等前一个批次完成后再执行下一个。

### ✅ 不依赖对话历史
每个命令都会重新读取标准文件，不需要记住之前的对话。

### ✅ 随时中断和恢复
可以随时关闭Session，下次重新打开后继续执行。

---

## 🔧 故障排除

### 问题1: 批次已完成
```
❌ 错误: batch-012 已完成
💡 解决: 执行 "优化下一批次"
```

### 问题2: 不知道执行哪个批次
```
💡 解决: 直接说 "优化下一批次"，系统会自动检测
```

### 问题3: Task输出格式错误
```
💡 解决: 系统会自动重试，无需人工干预
```

---

## 📖 相关文档

| 文档 | 位置 | 用途 |
|------|------|------|
| **自动触发器** | `.claude/skills/AUTO-BATCH-OPTIMIZATION-TRIGGER.md` | 技术实现细节 |
| **优化标准** | `.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md` | 评分公式 |
| **执行流程** | `.claude/skills/BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md` | 详细步骤 |
| **批次计划** | `data/BATCH-EXECUTION-PLAN.json` | 所有批次清单 |
| **Session分配** | `data/SESSION-ALLOCATION-CHECKLIST.md` | 并行执行指南 |

---

## ✅ 快速检查清单

开始前确认：

- [ ] 已打开Claude Code
- [ ] 已定位到项目目录: `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site`
- [ ] 已了解执行命令: `优化下一批次` 或 `优化 batch-XXX`

**就这样！开始执行吧！** 🚀

---

## 💡 使用技巧

### 技巧1: 快速统计
```bash
统计优化进度
```

### 技巧2: 批量执行
在同一Session中依次输入多个命令：
```bash
优化 batch-010
# 等待完成...
优化 batch-011
# 等待完成...
优化 batch-012
```

### 技巧3: 并行加速
打开多个窗口，每个窗口执行不同的批次ID。

---

**准备好了吗？**

**在新Session中输入**: `优化下一批次`

**系统会自动完成所有工作！** ✨
