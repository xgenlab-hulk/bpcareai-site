# BPCareAI SEO/GEO 内容自动化体系设计 v1.0

## 一、系统目标

基于GSC数据监测 + Perplexity用户意图识别 + AI内容生成，构建一个**数据驱动、自动运转、持续优化**的内容体系，实现SEO/GEO效果最大化。

## 二、系统全貌

```
┌─────────────────────────────────────────────────────────────┐
│                    数据层（每天自动执行）                       │
│                                                               │
│  GSC数据拉取 → 存储去重 → 脚本计算指标 → LLM深度分析          │
│  输出：趋势、机会词、CTR异常、内容缺口                         │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    决策层（每周 + 每天）                        │
│                                                               │
│  每周：GSC周报 + Perplexity深挖 → 更新选题库                  │
│  每天：快速趋势扫描 → 有突发则插入紧急选题                     │
│                                                               │
│  两条输出线：                                                  │
│  线A：新内容生成 → 选题 → 文章生成 → 发布                     │
│  线B：已有内容优化 → 高展示低CTR文章 → 优化标题/描述           │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    执行层（每天自动执行）                       │
│                                                               │
│  从选题库取Top N → 生成文章 → 去重检查 → 内链 → 发布          │
│  同时：优化已有文章的metadata（如果决策层有建议）               │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    验证层（每周/每月）                          │
│                                                               │
│  每周：对比上周的展示/点击/CTR变化，验证优化是否有效           │
│  每月：全面策略复盘，调整cluster优先级和内容方向               │
└─────────────────────────────────────────────────────────────┘
```

## 三、具体工作流

### 工作流1：每天 08:00 — GSC数据拉取+分析

```
触发：GitHub Actions cron 或手动
脚本：scripts/gsc-daily-analysis.ts
流程：
  1. 拉取最近7天GSC数据（query + page维度）
  2. 按日期去重存储到 data/seo/raw/
  3. 脚本计算：3天趋势、展示量变化、CTR异常
  4. 如果有高分趋势警报（score≥50）→ 写入 urgent-topics.json
  5. 清理12个月前的旧数据
耗时：~15秒
成本：免费（GSC API免费）
```

### 工作流2：每周一 09:00 — 深度分析+选题更新

```
触发：GitHub Actions cron 或手动
脚本：scripts/weekly-topic-refresh.ts（需集成LLM分析）
流程：
  1. 脚本汇总最近7天GSC数据（展示/点击/CTR/排名/趋势）
  2. 脚本识别：高展示低CTR文章、新出现的搜索词、排名变化
  3. 将汇总数据喂给LLM做深度分析：
     - 搜索意图分类
     - CTR异常归因
     - 被忽视的机会
     - 选题优先级建议
     - 已有文章优化建议
  4. [未来] 对LLM识别的内容缺口，调Perplexity深挖：
     - "关于[缺口方向]，用户最常问的问题是什么？"
     - "竞品在这个方向写了什么我们没有的？"
  5. 基于分析结果生成新选题（带评分）
  6. 更新选题库
  7. 输出"已有文章优化建议"列表（线B）
  8. 保存周报到 data/seo/analysis/weekly-{week}.json
耗时：~3-5分钟
成本：Qwen API ~$0.05 + [未来] Perplexity ~$0.10
```

### 工作流3：每天 12:00 — 文章生成

```
触发：GitHub Actions cron 或手动
脚本：scripts/auto-generate-daily.ts
流程：
  1. 检查 urgent-topics.json（紧急选题优先）
  2. 从选题库取选题（round-robin均衡 + 评分排序）
  3. 逐篇生成：
     a. LLM生成正文（GEO结构：Quick Answer + Key Facts + FAQ）
     b. LLM优化metadata（title/desc/pk/slug）
     c. 格式验证（validateAndFixMetadata）
     d. 生成后去重检查（embedding相似度>0.80则丢弃换新）
     e. 智能内链（用优化后metadata匹配相关文章）
     f. Cluster匹配（映射到已有25个cluster）
     g. YAML安全写入（>- 格式）
  4. 保存embedding、更新选题库、重建索引
  5. Git commit + push → Vercel自动部署
耗时：~10-15分钟（5篇）
成本：Qwen API ~$0.20
```

### 工作流4：每天/按需 — 已有文章优化（线B）

```
触发：周度分析产出优化建议时执行
流程：
  1. 读取周度分析的"已有文章优化建议"
  2. 对每篇建议优化的文章：
     a. 读取当前metadata
     b. 基于GSC搜索词+LLM建议，重写title/description/PK
     c. 格式验证
     d. YAML安全写入
  3. 不改正文内容，只改metadata
耗时：~1分钟
成本：几乎为零（不调LLM，直接用分析建议）
```

### 工作流5：每月1日 — 策略复盘

```
触发：手动或cron
流程：
  1. 汇总当月GSC数据：展示/点击/CTR月度趋势
  2. 对比上月：哪些方向增长、哪些下降
  3. 评估：本月生成的文章中，哪些已经有GSC展示？CTR如何？
  4. LLM分析：策略调整建议
  5. 更新 automation-config.json 的优先级和angles
  6. 保存月报
```

## 四、Perplexity接入方案（下一步）

### 在哪里接入

在工作流2（每周深度分析）的Step 4：

```
LLM分析发现内容缺口：
  "用户在搜'cholesterol lowering soups for seniors'，但我们没有好内容"
      ↓
调Perplexity：
  "What are the most searched questions about cholesterol-lowering
   soups for adults over 60? What do top-ranking articles cover?"
      ↓
Perplexity返回（基于真实搜索数据）：
  - "best soups to lower cholesterol fast"
  - "does chicken soup lower cholesterol"
  - "heart healthy soup recipes for seniors"
  - 竞品文章覆盖了：食材列表、每周菜单、钠含量对比
      ↓
转化为具体选题，带入选题库
```

### 需要做什么

1. 申请Perplexity API key
2. 新建 `lib/llm/perplexity-client.ts`（Sonar API封装）
3. 在 `weekly-topic-refresh.ts` 中加入Perplexity调用
4. 每周成本：~$0.50（约25次调用）

## 五、验证体系

### 短期验证（1-2周）

| 指标 | 基线（当前） | 目标 | 怎么看 |
|------|------------|------|--------|
| 3篇优化文章的CTR | 0-0.2% | 2-5% | GSC每天看 |
| 新文章被Google收录 | — | 7天内出现在GSC | GSC看新页面 |
| 选题库评分 | 均匀40-60分 | 有GSC信号的选题明显高分 | weekly报告 |

### 中期验证（1-3月）

| 指标 | 基线 | 目标 | 怎么看 |
|------|------|------|--------|
| 有展示的页面数 | 133/2209 (6%) | 300+ (15%+) | GSC月度 |
| 月度总展示量 | 135 | 500+ | GSC月度 |
| 月度总点击量 | 1 | 50+ | GSC月度 |
| 整站CTR | 0.54% | 2%+ | GSC月度 |

### 长期验证（3-6月）

| 指标 | 目标 |
|------|------|
| 月度有机流量 | 1000+ 次点击 |
| 排名Top 10关键词数 | 50+ |
| 被AI搜索引用次数 | 可通过Perplexity监控 |

## 六、关键技术组件清单

| 组件 | 文件 | 状态 |
|------|------|------|
| GSC API客户端 | `lib/seo/gsc-client.ts` | ✅ 完成 |
| GSC数据存储 | `lib/seo/data-store.ts` | ✅ 完成 |
| 趋势检测引擎 | `lib/seo/trend-detector.ts` | ✅ 完成 |
| 选题评分系统 | `lib/seo/topic-scorer.ts` | ✅ v2.1完成 |
| 每日GSC分析 | `scripts/gsc-daily-analysis.ts` | ✅ 完成 |
| 每周选题更新 | `scripts/weekly-topic-refresh.ts` | ✅ 基础完成（需集成LLM分析） |
| 文章生成引擎 | `lib/llm/qwen-articles.ts` | ✅ v2.1完成 |
| 选题生成 | `lib/llm/qwen-topics.ts` | ✅ v2.1完成 |
| 文章生成调度 | `scripts/auto-generate-daily.ts` | ✅ 完成（含去重+紧急选题） |
| Perplexity客户端 | `lib/llm/perplexity-client.ts` | ❌ 待接入 |
| 已有文章优化脚本 | — | ❌ 待建 |
| 月度复盘脚本 | — | ❌ 待建 |
| GitHub Actions workflows | `.github/workflows/` | ❌ 待配置cron |

## 七、反向验证逻辑

每次做出改动后，验证闭环：

```
改动 → 等7天 → GSC数据反馈
  ↓
新文章：是否出现在GSC？展示量多少？排名多少？
优化文章：CTR是否提升？点击是否增加？
  ↓
有效 → 继续这个方向
无效 → 分析原因 → 调整策略
  ↓
数据积累 → 更精准的决策 → 更好的内容 → 更多流量
```
