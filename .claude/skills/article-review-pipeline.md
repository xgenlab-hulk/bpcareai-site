# 文章质量反向检验 — Pipeline 产出评估

**触发词**: `检查新文章`、`review新文章`、`拉取检查`、`检查最近生成的文章`、`review articles`

---

## 执行流程

### Step 1: 拉取最新代码

```bash
git pull origin main
```

### Step 2: 确定检查范围

读取 `data/pipeline-review-cursor.json`（如果存在），获取上次检查的截止日期。

```json
{
  "lastReviewDate": "2026-04-02",
  "lastReviewedSlugs": ["slug1", "slug2", ...],
  "reviewCount": 3
}
```

如果文件不存在，则检查最近 7 天生成的文章。

**识别新文章**: 从 `data/articles-index.json` 中筛选 `date > lastReviewDate` 的文章，排除 `lastReviewedSlugs` 中已检查过的。

### Step 3: 逐篇评估

对每篇新文章，读取 `content/articles/{slug}.md` 完整内容，按以下维度评分（每项 1-10 分）：

#### 3.1 结构完整性
- H1 标题是否存在且含 PK
- Quick Answer 段落（H1 后 2-3 句直接回答）
- Key Facts 列表（✅ 格式，5+ 个，含数据点）
- ⚠️ When to See Your Doctor（4-5 个具体阈值）
- H2 × 3（理解/行动/监测）各 200+ 词
- Conclusion（含 PK）
- FAQ × 5（问题含 PK 变体，首句完整回答）

#### 3.2 SEO 优化
- PK 在正文出现 4-6 次
- 3-5 个同义词/相关词使用
- Title 40-70 字符，含 PK 核心变体
- Description 120-160 字符，含数据点 + 医学实体
- H2 中至少 2 个含主题关键词

#### 3.3 GEO 可引用性
- Quick Answer 是否自包含（AI 可直接引用）
- Key Facts 每条是否独立可引用
- 每个 H2 段落是否有 1+ 个 AI 可引用的事实陈述
- FAQ 首句是否直接回答问题

#### 3.4 E-E-A-T 信号
- 至少 2 个医学指南引用（AHA/ACC/WHO/ESC/KDIGO 等）
- "according to [source]" 归因
- 具体研究引用（年份 + 期刊名）
- When to See Doctor 段落的阈值是否具体

#### 3.5 数据密度
- 每个主要段落至少 1 个具体数字（百分比/mmHg/时间/剂量）
- 全文数据点总数

#### 3.6 术语桥接
- 每个首次出现的医学术语是否有通俗解释
- "通俗表述 (专业术语)" 格式使用

#### 3.7 Metadata 质量（v3.0 标准）
- PK 是否是自然语言查询格式（通过"65岁老母会搜吗"测试）
- Title 是否多样化（不是模板化）
- Description 是否结构独特、含医学实体、含数据点
- Title 和 Description 语义是否一致

### Step 4: 生成评估报告

对每篇文章输出：

```
=== 文章评估: {title} ===
Slug: {slug}
日期: {date}
PK: {primaryKeyword}
字数: {wordCount}

维度评分:
  结构完整性:    X/10  [缺失/问题说明]
  SEO优化:      X/10  [PK出现N次, ...]
  GEO可引用性:  X/10  [...]
  E-E-A-T信号:  X/10  [引用N个指南, ...]
  数据密度:     X/10  [N个数据点]
  术语桥接:     X/10  [...]
  Metadata质量: X/10  [...]

总分: XX/70 (XX%)

优化建议:
  [如果有需要改进的地方，列出具体建议]
  [如果分数>=85%，标记为✅ 质量达标]
```

### Step 5: 更新检查游标

将本次检查的信息写入 `data/pipeline-review-cursor.json`：

```json
{
  "lastReviewDate": "2026-04-05",
  "lastReviewedSlugs": ["new-slug-1", "new-slug-2", ...],
  "reviewCount": 4
}
```

### Step 6: 汇总报告

```
========================================
Pipeline 产出质量检查报告
检查时间: {datetime}
检查范围: {lastReviewDate} ~ {today}
新文章数: {count}
========================================

平均分: XX/70 (XX%)
最高分: {title} — XX/70
最低分: {title} — XX/70

质量达标 (>=85%): N篇
需优化 (60-84%): N篇
质量不合格 (<60%): N篇

[如果有不合格的文章，询问用户是否需要立即优化]
```

---

## 评分标准对齐

本 skill 的评分维度直接对应以下标准文件：
- `.claude/skills/OPTIMIZATION-STANDARD-v3.0.md` — Metadata 质量标准
- `lib/llm/qwen-articles.ts` 中 `generateArticleBody()` 的 prompt — 文章结构标准

## 注意事项

1. **不重复检查**: 严格依赖 `pipeline-review-cursor.json` 的游标，只检查新文章
2. **游标文件不存在时**: 检查最近 7 天的文章，然后创建游标文件
3. **评估方式**: 使用 Agent 并行评估（每个 agent 评估 2-3 篇），提高效率
4. **如果没有新文章**: 报告"没有新文章需要检查"，并显示上次检查时间和距今天数
5. **优化建议要具体**: 不说"需要更多数据点"，要说"H2 Section 2 缺少具体数字，建议在第3段加入 AHA 推荐的运动频率数据"
