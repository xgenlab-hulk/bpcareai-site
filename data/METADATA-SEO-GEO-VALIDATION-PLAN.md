# Metadata SEO/GEO 验证执行计划

**生成时间**: 2026-03-20
**执行范围**: 82篇已完成初步优化的文章
**评估标准**: `.claude/skills/METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md` v1.0
**目标**: 识别并修复影响搜索排名和AI推荐的metadata问题

---

## 🎯 执行目标

### 核心目标
1. **SEO排名最大化**: 确保metadata有利于Google搜索排名
2. **GEO推荐最大化**: 确保metadata有利于AI推荐
3. **点击率最大化**: 确保metadata在SERP中吸引点击
4. **转化最大化**: 引导用户下载App

### 成功标准
- **优秀文章 (≥85分)**: 保持不动
- **良好文章 (75-84分)**: 可选优化
- **一般文章 (60-74分)**: 建议修复
- **差文章 (<60分)**: 必须立即修复

---

## 📋 执行步骤

### Step 1: 分批准备 ✅ 已完成

82篇文章分成6批：
- Batch 1: Articles 1-14 (14篇)
- Batch 2: Articles 15-28 (14篇)
- Batch 3: Articles 29-42 (14篇)
- Batch 4: Articles 43-56 (14篇)
- Batch 5: Articles 57-70 (14篇)
- Batch 6: Articles 71-82 (12篇)

**文章清单**: `/tmp/metadata-validation-batches.json`

---

### Step 2: 启动6个并行LLM验证Tasks

**每个Task的职责**:
1. 读取指定批次的文章
2. 加载评估标准文档
3. 对每篇文章的metadata进行SEO/GEO评分
4. 生成详细评估报告（JSON格式）
5. 保存到指定文件

**Task配置**:

#### Task 1: 验证 Batch 1 (Articles 1-14)

**输入**:
- 文章列表: Articles 1-14
- 标准文档: `.claude/skills/METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md`

**输出**:
- 文件: `/tmp/seo-geo-validation-batch-1.json`
- 格式: 按标准文档规定的JSON结构

**评估重点**:
- PrimaryKeyword: 搜索量(35%) + 竞争度(25%) + 搜索意图(20%)
- Title: 关键词优化(30%) + 点击率优化(30%)
- Description: 关键词密度(25%) + 点击诱因(25%)

#### Task 2-6: 同上，分别验证 Batch 2-6

---

### Step 3: 汇总验证结果

**汇总脚本**: 读取6个JSON文件，生成总体报告

**汇总维度**:

1. **整体统计**:
   - 总文章数: 82
   - 优秀 (≥85分): X篇
   - 良好 (75-84分): Y篇
   - 一般 (60-74分): Z篇
   - 差 (<60分): W篇

2. **问题分布**:
   - PrimaryKeyword问题: X篇
   - Title问题: Y篇
   - Description问题: Z篇

3. **优先级分类**:
   - **CRITICAL** (必须立即修复): 总分<60的文章
   - **HIGH** (建议修复): 总分60-74的文章
   - **MEDIUM** (可选优化): 总分75-84的文章
   - **LOW** (保持): 总分≥85的文章

4. **SEO/GEO潜力评估**:
   - SEO排名潜力 HIGH: X篇
   - SEO排名潜力 MEDIUM: Y篇
   - SEO排名潜力 LOW: Z篇
   - GEO推荐潜力 HIGH: X篇
   - GEO推荐潜力 MEDIUM: Y篇
   - GEO推荐潜力 LOW: Z篇

**输出文件**:
- `/tmp/seo-geo-validation-summary.json` (JSON格式)
- `data/METADATA-SEO-GEO-VALIDATION-REPORT.md` (人类可读报告)

---

### Step 4: 生成修复清单

**针对需要修复的文章** (总分<75)，生成详细修复清单：

```json
{
  "generated_date": "2026-03-20",
  "total_articles_needing_fix": X,
  "priority_breakdown": {
    "critical": Y,  // <60分
    "high": Z       // 60-74分
  },
  "articles": [
    {
      "filename": "article-name.md",
      "current_score": 68.5,
      "priority": "HIGH",
      "issues": {
        "primaryKeyword": {
          "score": 55,
          "problems": ["搜索量低", "语法错误"],
          "current": "foods endothelial glycocalyx prediabetes",
          "recommended": "foods to avoid with prediabetes and heart disease"
        },
        "title": {
          "score": 72,
          "problems": ["关键词位置靠后", "缺少点击诱因"],
          "current": "For Seniors: Ways to Manage Blood Pressure",
          "recommended": "Lower Blood Pressure Naturally: 12 Ways for Seniors 60+"
        },
        "description": {
          "score": 78,
          "problems": ["略长"],
          "current": "...",
          "recommended": "..."
        }
      },
      "estimated_improvement": "+15-20分"
    }
  ]
}
```

**输出文件**: `data/metadata-seo-geo-fix-list.json`

---

## 🤖 LLM Task Prompt 模板

每个Task使用的prompt结构：

````markdown
# Metadata SEO/GEO 质量验证 - Batch X

你正在进行**SEO/GEO最大化**的metadata质量评估。

## 核心目标（按优先级）

1. **搜索排名优化** - Google搜索第1页
2. **AI推荐优化** - ChatGPT/Perplexity/Claude推荐概率
3. **点击率优化** - SERP中脱颖而出
4. **转化优化** - 引导App下载
5. **可读性** - 在不影响以上目标的前提下

## 重要原则

✅ **搜索量 > 可读性**
✅ **点击率 > 完美语法**
✅ **有流量才有转化**

## 评估标准

**必读文档**: `/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md`

请仔细阅读该文档，理解评分标准和评估方法。

## 评估维度

### PrimaryKeyword (100分)
- **搜索量** (35分): 月搜索量估算，越高越好
- **竞争度** (25分): 排名难度，低竞争+高搜索量最佳
- **搜索意图** (20分): 是否匹配用户真实搜索意图
- **转化潜力** (10分): 搜索者的下载/行动意愿
- **GEO友好** (10分): AI是否容易理解和推荐

### Title (100分)
- **关键词优化** (30分): 主关键词在前60字符内
- **点击率优化** (30分): 数字、问号、情感词、权威信号
- **SERP显示** (20分): 50-60字符避免截断，差异化
- **GEO信号** (10分): 问题型、AI易理解
- **转化导向** (10分): 引导行动

### Description (100分)
- **关键词密度** (25分): 主关键词+2-3个LSI词
- **点击诱因** (25分): 价值主张、具体示例、时间承诺
- **长度优化** (20分): 120-155字符
- **行动号召** (15分): Discover、Learn、Get等动词
- **GEO友好** (15分): 完整句子、AI可提取

## 要评估的文章

[列出Batch X的文章清单]

## 输出要求

1. **读取标准文档**: 完整阅读并理解评估标准
2. **逐篇评估**: 对每篇文章严格按标准打分
3. **给出建议**: 每个低分项必须给出具体优化建议
4. **JSON格式**: 严格按照标准文档中的JSON结构输出

**输出文件**: `/tmp/seo-geo-validation-batch-X.json`

## 评分示例

**优秀PrimaryKeyword (90分)**:
```
"lower blood pressure naturally seniors over 60"
- 搜索量: 32/35 (高搜索量)
- 竞争度: 23/25 (长尾词，竞争适中)
- 搜索意图: 19/20 (明确的信息型+行动意图)
- 转化潜力: 9/10 (用户愿意采取行动)
- GEO友好: 7/10 (自然语言，略长)
```

**差PrimaryKeyword (45分)**:
```
"foods endothelial glycocalyx prediabetes"
- 搜索量: 5/35 (几乎无搜索)
- 竞争度: 10/25 (虽低竞争但无意义)
- 搜索意图: 8/20 (意图不明，语法错误)
- 转化潜力: 3/10 (过于技术化)
- GEO友好: 19/10 (AI难以理解)
建议: "foods to avoid with prediabetes and heart disease"
```

开始评估，严格按标准打分，给出具体建议。
````

---

## 📊 预期产出

### 1. 6个批次评估报告
- `/tmp/seo-geo-validation-batch-1.json`
- `/tmp/seo-geo-validation-batch-2.json`
- `/tmp/seo-geo-validation-batch-3.json`
- `/tmp/seo-geo-validation-batch-4.json`
- `/tmp/seo-geo-validation-batch-5.json`
- `/tmp/seo-geo-validation-batch-6.json`

### 2. 汇总报告
- `/tmp/seo-geo-validation-summary.json` (机器可读)
- `data/METADATA-SEO-GEO-VALIDATION-REPORT.md` (人类可读)

### 3. 修复清单
- `data/metadata-seo-geo-fix-list.json`

### 4. 统计数据
- 优秀文章数量和列表
- 需修复文章数量和优先级
- 常见问题分析
- SEO/GEO潜力评估

---

## ⏱️ 预估时间

- **Step 2** (6个并行Tasks): 12-15分钟
- **Step 3** (汇总结果): 2-3分钟
- **Step 4** (生成修复清单): 1-2分钟
- **总计**: 约15-20分钟

---

## ✅ 验证清单

执行前确认：
- [ ] 标准文档已落盘: `.claude/skills/METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md`
- [ ] 文章分批清单已生成: `/tmp/metadata-validation-batches.json`
- [ ] Task prompt包含标准文档路径
- [ ] Task prompt明确SEO/GEO优先级
- [ ] Task prompt要求严格按标准打分
- [ ] 输出格式符合标准文档规定

执行后验证：
- [ ] 6个批次报告全部生成
- [ ] 每篇文章有完整的评分
- [ ] 每个低分项有具体建议
- [ ] 汇总报告统计准确
- [ ] 修复清单包含所有需修复文章

---

## 🚀 下一步行动

1. **用户确认**: 确认执行计划和标准文档
2. **启动验证**: 运行6个并行Tasks
3. **审查结果**: 检查评估报告
4. **执行修复**: 根据修复清单优化metadata
5. **验证效果**: 修复后重新评估

---

**计划制定者**: Claude Code
**计划状态**: 待用户批准执行
**关联文档**: `.claude/skills/METADATA-SEO-GEO-OPTIMIZATION-STANDARD.md`
