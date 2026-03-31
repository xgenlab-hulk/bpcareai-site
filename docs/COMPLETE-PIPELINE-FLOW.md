# BPCareAI 内容自动化完整流程说明

## 总览

整个系统有 **4条工作流**，按执行频率从高到低排列：

```
每天 08:00  →  工作流A：GSC数据拉取 + 趋势扫描
每天 12:00  →  工作流B：文章生成（从选题库取选题 → 生成文章）
每周六      →  工作流C：选题库更新（GSC分析 + Perplexity + LLM选题生成）
按需执行    →  工作流D：已有文章metadata优化
```

它们之间的关系：

```
工作流A（每天数据拉取）
    │
    ├─→ 积累数据 → 供工作流C使用
    │
    └─→ 发现突发趋势？─→ 是 → 生成紧急选题 → 插入工作流B
                         │
                         否 → 什么都不做

工作流C（每周选题生成）
    │
    ├─→ 生成35个选题 → 写入选题库 → 供工作流B消费
    │
    └─→ 输出"已有文章优化建议" → 供工作流D执行

工作流B（每天文章生成）
    │
    └─→ 从选题库取5个 → 生成文章 → 发布

工作流D（已有文章优化）
    │
    └─→ 读取优化建议 → 修改已有文章的标题/描述 → 提升CTR
```

---

## 工作流A：每天GSC数据拉取

**脚本**：`scripts/gsc-daily-analysis.ts`
**触发**：每天08:00（GitHub Actions cron，目前未启用）
**命令**：`npm run seo:daily`

```
Step 1: 连接GSC API
    │  使用OAuth2认证（.env中的GOOGLE_SEO_*变量）
    │  工具：lib/seo/gsc-client.ts
    ▼
Step 2: 拉取最近7天数据
    │  维度：搜索词(query) + 页面(page)
    │  每天一个文件：data/seo/raw/2026-03-31.json
    │  去重：同日期覆盖写入
    ▼
Step 3: 趋势分析（纯脚本计算）
    │  工具：lib/seo/trend-detector.ts
    │  方法：最近3天 vs 过去28天基线对比
    │  检测3种异常：
    │    - SURGE：展示量 ≥ 基线3倍
    │    - NEW_QUERY：新出现的搜索词（连续2天以上）
    │    - RANK_JUMP：排名提升 ≥ 10位
    │  输出：alerts数组（每个alert有score 0-100）
    ▼
Step 4: 保存分析结果
    │  文件：data/seo/analysis/daily-2026-03-31.json
    ▼
Step 5: 如果有高分警报（score≥50）→ 生成紧急选题
    │  调用LLM：lib/seo/llm-analyzer.ts → convertUrgentQueryToTopic()
    │    输入：搜索词 + 展示量 + 排名 + 警报原因
    │    输出：完整选题（title + description + PK + cluster）
    │  去重检查：embedding相似度 > 0.80 则丢弃
    │  写入：data/seo/urgent-topics.json（3天后自动过期）
    ▼
Step 6: 清理12个月前的旧数据

耗时：~15秒
成本：免费（GSC API免费）
```

---

## 工作流B：每天文章生成

**脚本**：`scripts/auto-generate-daily.ts`
**触发**：每天12:00（GitHub Actions cron，目前未启用）
**命令**：`npm run auto:generate`

```
Step 1: 读取配置
    │  文件：automation-config.json
    │  确定今天生成几篇（当前配置：5篇/天）
    ▼
Step 2: 检查选题库存
    │  扫描所有 data/planned-topics-*.json
    │  如果总数 < 30 → 触发自动补充（调用replenish流程）
    ▼
Step 3: 检查紧急选题
    │  读取 data/seo/urgent-topics.json
    │  如果有未过期的紧急选题 → 优先放入生成队列
    ▼
Step 4: 从选题库取选题
    │  工具：lib/topics/manager.ts → selectRandomTopicsForGeneration()
    │  策略：按score降序取（高分优先）
    │  多样性：同一cluster最多占 ceil(5/分类数) 个
    │  取 count+3 个（多3个备选，用于去重淘汰后替补）
    ▼
Step 5: 逐篇生成文章
    │
    │  对每一篇：
    │  ┌─────────────────────────────────────────────────┐
    │  │ 5a. LLM生成正文（Qwen Plus）                      │
    │  │     工具：lib/llm/qwen-articles.ts                │
    │  │     prompt角色：心血管专科医生                      │
    │  │     要求结构：                                      │
    │  │       # H1标题（含PK）                              │
    │  │       ## Quick Answer（2-3句直接回答，AI可引用）     │
    │  │       ## Key Facts（5个带数字的要点）                │
    │  │       ## ⚠️ When to See Doctor（具体阈值）          │
    │  │       ## 理解主题（200+词，术语桥接，权威引用）      │
    │  │       ## 你能做什么（证据基础建议）                  │
    │  │       ## 监测进展                                    │
    │  │       ## 结论                                        │
    │  │       ### FAQ（5个，首句直接回答）                   │
    │  │     最低1200词                                       │
    │  │                                                      │
    │  │ 5b. 验证正文结构                                    │
    │  │     检查：词数≥500、有H1、有H2≥3、有FAQ             │
    │  │                                                      │
    │  │ 5c. LLM优化metadata（Qwen Plus, temperature 0.3）  │
    │  │     输入：原始选题 + 已生成正文前2000字              │
    │  │     输出：title(40-70c) + description(120-160c)     │
    │  │            + primaryKeyword(15-60c) + slug           │
    │  │                                                      │
    │  │ 5d. 格式验证（纯脚本）                              │
    │  │     validateAndFixMetadata()                          │
    │  │     检查长度、YAML安全字符、术语黑名单               │
    │  │     不合格 → 自动修正或重试（最多2次）               │
    │  │                                                      │
    │  │ 5e. Cluster映射（纯脚本）                           │
    │  │     matchTopicCluster()                               │
    │  │     把选题cluster映射到已有25个cluster               │
    │  │     关键词匹配 → 模糊匹配 → 无法匹配则保留原值      │
    │  └─────────────────────────────────────────────────┘
    ▼
Step 6: 生成后去重检查
    │  为文章生成embedding → 与2209篇已有文章对比
    │  相似度 > 0.80 → 丢弃，从备选池取下一个选题
    │  相似度 ≤ 0.80 → 通过
    ▼
Step 7: 智能内链
    │  用优化后的metadata查找相关文章（Top 3-5）
    │  双向链接：新文章→旧文章 + 旧文章→新文章
    ▼
Step 8: 写入文件
    │  YAML >- 折叠格式 + sanitize安全清理
    │  文件：content/articles/{slug}.md
    ▼
Step 9: 保存embedding + 更新选题库 + 重建索引
    │
    ▼
Step 10: Git commit + push → Vercel自动部署

耗时：~10-15分钟（5篇）
成本：Qwen API ~$0.20（每篇2次LLM调用）
```

---

## 工作流C：每周选题库更新

**脚本**：`scripts/weekly-topic-refresh.ts`
**触发**：每周六（GitHub Actions cron，目前未启用）
**命令**：`npm run seo:weekly`

```
Step 1: 检查本周剩余选题
    │  扫描 planned-topics-*.json
    │  评分≥30的保留，其余丢弃
    │  计算：需要新生成 = 35 - 保留数
    ▼
Step 2: 汇总最近7天GSC数据（纯脚本）
    │  从 data/seo/raw/ 读取7天数据
    │  汇总：每个搜索词的展示量、点击量、排名
    │  汇总：每个页面的展示量、点击量、CTR
    ▼
Step 3: LLM深度分析（Qwen Plus）
    │  工具：lib/seo/llm-analyzer.ts → runWeeklyDeepAnalysis()
    │  输入：GSC搜索词数据 + 页面数据
    │  输出：
    │    - 搜索意图分析
    │    - CTR异常归因（为什么高展示低点击）
    │    - 被忽视的机会
    │    - 选题优先级建议
    │    - 已有文章优化建议（→ 给工作流D）
    ▼
Step 3.5: Perplexity搜索真实用户问题
    │  工具：lib/seo/llm-analyzer.ts → discoverUserQuestions()
    │  对每个P1/P2关键词方向调一次Perplexity API
    │  输入：关键词 + 我们已有的20个相关文章标题
    │  输出（一次调用返回3个字段）：
    │    - questions：15个用户真实搜索问题（核心）
    │    - competitorCoverage：竞品都覆盖了什么
    │    - whyItMatters：为什么这个方向现在重要
    │  成本：~$0.005/方向 × 4个P1/P2方向 = ~$0.02
    ▼
Step 4: 生成新选题候选（Qwen Plus）
    │  工具：lib/llm/qwen-topics.ts → generateTopicCandidatesForKeyword()
    │  按优先级分配：P1方向50% + P2方向30% + P3方向20%
    │
    │  Qwen收到的信息（全部通过angles参数传入）：
    │    - 预定义的内容角度（diet, exercise, medication等）
    │    - Perplexity的15个真实搜索问题
    │    - Perplexity的竞品覆盖分析
    │    - Perplexity的趋势原因
    │    - 200个已有PK（避免重复）
    │    - 50个已有标题
    │
    │  格式验证：validateTopicCandidate()
    │    - Title 20-80字符
    │    - PK 12-60字符 + 术语黑名单
    │    - Description 100-170字符
    │    - 不合格直接丢弃
    ▼
Step 5: 评分排序（纯脚本）
    │  工具：lib/seo/topic-scorer.ts → scoreTopics()
    │  4个维度（总分0-100）：
    │    - 主题集群覆盖需求 (0-30)：集群缺口越大分越高
    │    - 搜索需求验证 (0-25)：GSC有数据+有点击则高分
    │    - 内容差异化 (0-25)：与2209篇已有文章的PK重叠越低越高分
    │    - 时效性 (0-20)：上升趋势高分，下降趋势低分
    ▼
Step 6: 写入选题库
    │  保留的旧选题 + 新高分选题 = 写入 planned-topics-*.json
    │  每个选题带score和scheduledWeek字段
    ▼
Step 7: 输出已有文章优化建议
    │  保存到 data/seo/analysis/article-optimizations-pending.json
    │  → 供工作流D读取执行
    ▼
Step 8: 保存周报
    │  文件：data/seo/analysis/weekly-2026-W14.json
    │  包含：GSC数据、LLM分析、Perplexity发现、评分排序、选题库状态

耗时：~5-8分钟
成本：Qwen ~$0.10 + Perplexity ~$0.02 = ~$0.12
```

---

## 工作流D：已有文章metadata优化

**脚本**：`scripts/apply-article-optimizations.ts`
**触发**：手动执行（工作流C产出建议后）
**命令**：`npm run seo:optimize-articles`

```
Step 1: 读取待执行的优化建议
    │  文件：data/seo/analysis/article-optimizations-pending.json
    │  来源：工作流C的LLM分析输出
    ▼
Step 2: 对每篇建议优化的文章
    │  验证新metadata格式（title 20-75c, desc 80-165c, pk 10-65c）
    │  读取当前文件
    │  修改 title / description / primaryKeyword
    │  使用 >- YAML安全格式写回
    │  不改正文内容
    ▼
Step 3: 保存执行历史 + 清空pending列表

耗时：~10秒
成本：免费（不调LLM，只修改文件）
```

---

## 数据流向图

```
Google Search Console
    │
    │ [每天] 拉取搜索词+页面数据
    ▼
data/seo/raw/*.json（91天历史数据）
    │
    ├─→ [每天] 趋势检测 ─→ 突发？─→ LLM转化 → urgent-topics.json
    │                                               │
    │                                               ▼
    │                                    [每天] 文章生成（优先取紧急选题）
    │
    ├─→ [每周] 脚本汇总 ─→ LLM深度分析
    │                           │
    │                           ├─→ 选题建议 ─→ (暂时只保存，未直接指导选题)
    │                           └─→ 文章优化建议 ─→ pending.json → 工作流D
    │
    └─→ [每周] 供评分系统使用
              │
              ▼
Perplexity API
    │
    │ [每周] 对P1/P2方向各调一次
    │ 返回：用户搜索问题 + 竞品洞察 + 趋势原因
    ▼
Qwen LLM（选题生成）
    │
    │ 输入：预定义angles + Perplexity真实数据 + 已有PK去重
    │ 输出：选题候选（title + desc + PK + cluster）
    ▼
评分系统（纯脚本）
    │
    │ 4维度打分 → 按score排序
    ▼
planned-topics-*.json（选题库，每周35个）
    │
    │ [每天] 按score降序取5个
    ▼
Qwen LLM（文章生成）
    │
    │ 正文生成 → metadata优化 → 格式验证
    ▼
embedding去重 → 内链 → YAML写入 → Git push → Vercel部署
```

---

## 所有文件对照表

| 文件 | 工作流 | 类型 | 用途 |
|------|--------|------|------|
| `scripts/gsc-daily-analysis.ts` | A | 脚本+LLM | 每天GSC拉取+趋势检测+紧急选题 |
| `scripts/weekly-topic-refresh.ts` | C | 脚本+LLM+Perplexity | 每周选题生成 |
| `scripts/auto-generate-daily.ts` | B | 脚本+LLM | 每天文章生成 |
| `scripts/apply-article-optimizations.ts` | D | 纯脚本 | 已有文章优化 |
| `lib/seo/gsc-client.ts` | A | 纯脚本 | GSC API客户端 |
| `lib/seo/data-store.ts` | A,C | 纯脚本 | 数据存储+去重+清理 |
| `lib/seo/trend-detector.ts` | A | 纯脚本 | 趋势检测（3天vs28天） |
| `lib/seo/topic-scorer.ts` | C | 纯脚本 | 选题评分（4维度） |
| `lib/seo/llm-analyzer.ts` | A,C | LLM+Perplexity | 深度分析+紧急选题转化+Perplexity |
| `lib/llm/qwen-topics.ts` | C | LLM | 选题候选生成 |
| `lib/llm/qwen-articles.ts` | B | LLM | 文章正文+metadata生成 |
| `lib/topics/manager.ts` | B,C | 纯脚本 | 选题库管理+选取逻辑 |
| `lib/topics/replenish.ts` | B | LLM | 选题自动补充 |
| `automation-config.json` | C | 配置 | coreTopics+angles+优先级 |
| `data/seo/raw/*.json` | A→C | 数据 | GSC原始数据（按日期存储） |
| `data/seo/analysis/*.json` | A,C | 数据 | 分析报告（日/周） |
| `data/seo/urgent-topics.json` | A→B | 数据 | 紧急选题（3天过期） |
| `data/planned-topics-*.json` | C→B | 数据 | 选题库（6个分类） |
