# 并行批次优化执行指南

**创建时间**: 2026-03-23
**最后更新**: 2026-03-24
**总待优化文章**: 1,749篇
**总待优化批次数**: 37个
**建议并行session数**: 5-8个

---

## 📊 批次总览

### ✅ 已完成批次 (10个，共460篇)

| 批次 | 文章范围 | 文章数 | 状态 | 结果文件 |
|------|---------|-------|------|---------|
| batch-001 | 11-20 | 10篇 | ✅ 已完成 | llm-two-phase-batch-11-20.json |
| batch-002 | 21-40 | 20篇 | ✅ 已完成 | llm-two-phase-batch-21-40.json |
| batch-003 | 46-95 | 50篇 | ✅ 已完成 | llm-two-phase-batch-46-95.json |
| batch-004 | 96-145 | 50篇 | ✅ 已完成 | llm-two-phase-batch-96-145.json |
| batch-005 | 146-195 | 50篇 | ✅ 已完成 | llm-two-phase-batch-146-195.json |
| batch-006 | 196-245 | 50篇 | ✅ 已完成 | llm-two-phase-batch-196-245.json |
| batch-007 | 246-295 | 50篇 | ✅ 已完成 | llm-two-phase-batch-246-295.json |
| batch-008 | 296-345 | 50篇 | ✅ 已完成 | llm-two-phase-batch-296-345.json |
| batch-009 | 346-395 | 50篇 | ✅ 已完成 | llm-two-phase-batch-346-395.json |
| batch-010 | 396-475 | 80篇 | ✅ 已完成 | llm-two-phase-batch-396-475.json |

---

## 🎯 待优化批次分配 (37个批次)

### 🔴 高优先级批次 (补齐缺口 + 继续推进)

| 批次ID | 文章范围 | 数量 | 说明 | 执行命令 |
|--------|---------|------|------|---------|
| **batch-011** | 1-10 | 10篇 | 补齐开头缺口 | `优化 batch-011` |
| **batch-012** | 41-45 | 5篇 | 补齐中间缺口 | `优化 batch-012` |
| **batch-013** | 476-525 | 50篇 | 继续推进 | `优化 batch-013` |
| **batch-014** | 526-575 | 50篇 | 继续推进 | `优化 batch-014` |
| **batch-015** | 576-625 | 50篇 | 继续推进 | `优化 batch-015` |

### 🟡 正常优先级批次 (32个)

| 批次ID | 文章范围 | 数量 | Session建议 |
|--------|---------|------|------------|
| batch-016 | 626-675 | 50篇 | Session 2 |
| batch-017 | 676-725 | 50篇 | Session 2 |
| batch-018 | 726-775 | 50篇 | Session 2 |
| batch-019 | 776-825 | 50篇 | Session 3 |
| batch-020 | 826-875 | 50篇 | Session 3 |
| batch-021 | 876-925 | 50篇 | Session 3 |
| batch-022 | 926-975 | 50篇 | Session 3 |
| batch-023 | 976-1025 | 50篇 | Session 4 |
| batch-024 | 1026-1075 | 50篇 | Session 4 |
| batch-025 | 1076-1125 | 50篇 | Session 4 |
| batch-026 | 1126-1175 | 50篇 | Session 4 |
| batch-027 | 1176-1225 | 50篇 | Session 5 |
| batch-028 | 1226-1275 | 50篇 | Session 5 |
| batch-029 | 1276-1325 | 50篇 | Session 5 |
| batch-030 | 1326-1375 | 50篇 | Session 5 |
| batch-031 | 1376-1425 | 50篇 | Session 6 |
| batch-032 | 1426-1475 | 50篇 | Session 6 |
| batch-033 | 1476-1525 | 50篇 | Session 6 |
| batch-034 | 1526-1575 | 50篇 | Session 6 |
| batch-035 | 1576-1625 | 50篇 | Session 7 |
| batch-036 | 1626-1675 | 50篇 | Session 7 |
| batch-037 | 1676-1725 | 50篇 | Session 7 |
| batch-038 | 1726-1775 | 50篇 | Session 7 |
| batch-039 | 1776-1825 | 50篇 | Session 8 |
| batch-040 | 1826-1875 | 50篇 | Session 8 |
| batch-041 | 1876-1925 | 50篇 | Session 8 |
| batch-042 | 1926-1975 | 50篇 | Session 8 |
| batch-043 | 1976-2025 | 50篇 | Session 9 |
| batch-044 | 2026-2075 | 50篇 | Session 9 |
| batch-045 | 2076-2125 | 50篇 | Session 9 |
| batch-046 | 2126-2175 | 50篇 | Session 10 |
| batch-047 | 2176-2209 | 34篇 | Session 10 |

---

## 🔧 并行执行方案

### 方案A: 10个Session并行

| Session | 负责批次 | 文章范围 | 总文章数 |
|---------|---------|---------|---------|
| **Session 1** | batch-011 ~ batch-015 | 1-10, 41-45, 476-625 | 165篇 |
| **Session 2** | batch-016 ~ batch-018 | 626-775 | 150篇 |
| **Session 3** | batch-019 ~ batch-022 | 776-975 | 200篇 |
| **Session 4** | batch-023 ~ batch-026 | 976-1175 | 200篇 |
| **Session 5** | batch-027 ~ batch-030 | 1176-1375 | 200篇 |
| **Session 6** | batch-031 ~ batch-034 | 1376-1575 | 200篇 |
| **Session 7** | batch-035 ~ batch-038 | 1576-1775 | 200篇 |
| **Session 8** | batch-039 ~ batch-042 | 1776-1975 | 200篇 |
| **Session 9** | batch-043 ~ batch-045 | 1976-2125 | 150篇 |
| **Session 10** | batch-046 ~ batch-047 | 2126-2209 | 84篇 |

---

## 📝 Session执行命令模板

### 新Session启动命令

在新的Claude Code session中输入以下任一命令：

```bash
# 方式1: 直接指定批次ID
优化 batch-013

# 方式2: 指定文章范围
优化文章 476-525

# 方式3: 完整命令
按照 BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md 执行 batch-013 (文章476-525)
```

### 连续执行多个批次

```bash
# 在同一个session中按顺序执行
优化 batch-013
# 等待完成后...
优化 batch-014
# 等待完成后...
优化 batch-015
```

---

## ⚠️ 重要注意事项

### 1. 避免批次冲突

- ✅ **正确**: Session 1执行batch-013，Session 2执行batch-016
- ❌ **错误**: Session 1和Session 2都执行batch-013

### 2. 执行顺序建议

1. **优先执行高优先级批次** (batch-011 ~ batch-015)
2. 按照Session分配表依次执行
3. 每个Session完成后，更新 `BATCH-EXECUTION-PLAN.json` 中的状态

### 3. 结果文件命名规范

每个批次完成后会生成：
- `data/llm-two-phase-batch-{范围}.json` (如: `llm-two-phase-batch-476-525.json`)
- `data/REDIRECT-CONFIGURATION-BATCH-{编号}.json` (如: `REDIRECT-CONFIGURATION-BATCH-13.json`)

### 4. 质量检查

每个批次完成后会自动进行反向验证，检查：
- 所有字段是否≥85分
- 字符长度是否符合标准
- 301重定向配置是否正确

---

## 📊 进度追踪

### 完成后更新状态

每完成一个批次，在 `BATCH-EXECUTION-PLAN.json` 中更新：

```json
{
  "batch_id": "batch-013",
  "status": "completed",
  "completed_date": "2026-03-24",
  "result_file": "data/llm-two-phase-batch-476-525.json"
}
```

### 实时进度查询

在任意session中执行：

```bash
统计优化进度
```

---

## 📐 数据一致性校验

| 项目 | 数值 | 计算方式 |
|------|------|---------|
| 已完成文章数 | 460 | 10+20+50+50+50+50+50+50+50+80 |
| 待优化文章数 | 1,749 | 10+5+1,734 |
| 总文章数 | 2,209 | 460+1,749 ✅ |
| 已完成批次 | 10个 | batch-001 ~ batch-010 |
| 待优化批次 | 37个 | batch-011 ~ batch-047 |
| 完成率 | 20.83% | 460/2209 |

---

## ✅ 执行检查清单

开始前确认：
- [ ] 已阅读 `MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md`
- [ ] 已阅读 `BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md`
- [ ] 已分配各Session的批次范围（避免冲突）
- [ ] 已了解执行命令格式
- [ ] 已准备好追踪进度
