#!/usr/bin/env python3
"""
文章 SEO 质量分析脚本
分析所有文章的质量、结构相似性、AI痕迹等
"""

import os
import re
import json
from collections import Counter, defaultdict
from pathlib import Path
import frontmatter

# AI 高频特征词
AI_MARKERS = [
    "it's important to note",
    "it is important to note",
    "moreover",
    "delve",
    "navigating",
    "here's what you can do",
    "who should pay special attention",
    "final thoughts: a connected approach",
    "doesn't require drastic changes",
    "small shifts",
]

def read_article(file_path):
    """读取文章并解析"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            return {
                'slug': post.get('slug', Path(file_path).stem),
                'title': post.get('title', ''),
                'description': post.get('description', ''),
                'primaryKeyword': post.get('primaryKeyword', ''),
                'topicCluster': post.get('topicCluster', ''),
                'tags': post.get('tags', []),
                'relatedSlugs': post.get('relatedSlugs', []),
                'content': post.content,
            }
    except Exception as e:
        print(f"错误读取 {file_path}: {e}")
        return None

def extract_headings(content):
    """提取 H2 和 H3 标题"""
    h2_pattern = r'^##\s+(.+)$'
    h3_pattern = r'^###\s+(.+)$'

    h2_headings = re.findall(h2_pattern, content, re.MULTILINE)
    h3_headings = re.findall(h3_pattern, content, re.MULTILINE)

    return {
        'h2': h2_headings,
        'h3': h3_headings,
        'h2_count': len(h2_headings),
        'h3_count': len(h3_headings),
    }

def calculate_similarity(headings1, headings2):
    """计算两篇文章H2标题的相似度（0-100）"""
    if not headings1 or not headings2:
        return 0

    # 简化标题（去除具体内容，保留结构词）
    def simplify(heading):
        heading = heading.lower()
        # 保留结构性词汇
        structure_words = ['why', 'how', 'what', 'when', 'practical', 'steps',
                          'final', 'thoughts', 'faq', 'understanding', 'science']
        words = [w for w in heading.split() if w in structure_words or len(w) <= 4]
        return ' '.join(words)

    simple1 = [simplify(h) for h in headings1]
    simple2 = [simplify(h) for h in headings2]

    # 计算交集比例
    if not simple1 or not simple2:
        return 0

    matches = sum(1 for s1 in simple1 for s2 in simple2 if s1 and s2 and s1 == s2)
    avg_len = (len(simple1) + len(simple2)) / 2

    return int((matches / avg_len) * 100) if avg_len > 0 else 0

def detect_ai_markers(content):
    """检测 AI 痕迹"""
    content_lower = content.lower()
    found_markers = []

    for marker in AI_MARKERS:
        if marker in content_lower:
            count = content_lower.count(marker)
            found_markers.append((marker, count))

    return found_markers

def count_words(content):
    """统计字数（英文单词）"""
    words = re.findall(r'\b\w+\b', content)
    return len(words)

def calculate_keyword_density(content, keyword):
    """计算关键词密度"""
    if not keyword:
        return 0

    content_lower = content.lower()
    keyword_lower = keyword.lower()

    keyword_count = content_lower.count(keyword_lower)
    total_words = count_words(content)

    if total_words == 0:
        return 0

    return (keyword_count / total_words) * 100

def score_article(article, headings, all_articles_headings):
    """为文章评分"""
    scores = {
        'seo_tech': 0,      # SEO技术元素 /20
        'content': 0,       # 内容质量 /30
        'keyword': 0,       # 关键词优化 /15
        'ux': 0,           # 用户体验 /15
        'differentiation': 0,  # 差异化 /10
        'ai_penalty': 0,   # AI痕迹扣分 /10
    }

    issues = []

    # === SEO 技术元素评分 (20分) ===
    # 标题长度 (4分)
    title_len = len(article['title'])
    if 50 <= title_len <= 70:
        scores['seo_tech'] += 4
    elif 40 <= title_len <= 80:
        scores['seo_tech'] += 2
    else:
        issues.append(f"标题长度不佳({title_len}字符)")

    # Meta描述 (4分)
    desc_len = len(article['description'])
    if 140 <= desc_len <= 170:
        scores['seo_tech'] += 4
    elif 120 <= desc_len <= 180:
        scores['seo_tech'] += 2
    else:
        issues.append(f"描述长度不佳({desc_len}字符)")

    # 关键词策略 (4分)
    if article['primaryKeyword']:
        scores['seo_tech'] += 2
        if article['primaryKeyword'].lower() in article['title'].lower():
            scores['seo_tech'] += 2
        else:
            issues.append("标题未包含主关键词")
    else:
        issues.append("缺少主关键词")

    # 内链 (4分)
    related_count = len(article['relatedSlugs'])
    if related_count >= 3:
        scores['seo_tech'] += 4
    elif related_count >= 1:
        scores['seo_tech'] += 2
    else:
        issues.append("缺少内链")

    # 标签 (4分)
    tags_count = len(article['tags'])
    if 2 <= tags_count <= 5:
        scores['seo_tech'] += 4
    elif tags_count >= 1:
        scores['seo_tech'] += 2
    else:
        issues.append("缺少标签")

    # === 内容质量评分 (30分) ===
    word_count = count_words(article['content'])

    # 文章长度 (5分)
    if 1200 <= word_count <= 2500:
        scores['content'] += 5
    elif 800 <= word_count <= 3000:
        scores['content'] += 3
    elif word_count < 800:
        scores['content'] += 1
        issues.append(f"内容过短({word_count}词)")

    # 内容结构 (5分)
    if 4 <= headings['h2_count'] <= 7:
        scores['content'] += 5
    elif headings['h2_count'] >= 3:
        scores['content'] += 3
    else:
        issues.append(f"H2标题过少({headings['h2_count']}个)")

    # 专业深度 (10分)
    content_lower = article['content'].lower()
    has_research = any(word in content_lower for word in ['study', 'research', 'published', 'journal'])
    has_data = '%' in article['content'] or any(word in content_lower for word in ['statistics', 'data'])
    has_citations = 'american heart association' in content_lower or 'american college' in content_lower

    if has_research:
        scores['content'] += 4
    if has_data:
        scores['content'] += 3
    if has_citations:
        scores['content'] += 3

    if not (has_research or has_data):
        issues.append("缺少研究引用/数据支持")

    # 实用性 (10分)
    has_steps = any(word in content_lower for word in ['steps', 'tips', 'how to', 'what you can do'])
    has_examples = any(word in content_lower for word in ['example', 'for instance'])
    has_faq = 'faq' in content_lower or '####' in article['content']

    if has_steps:
        scores['content'] += 4
    if has_examples:
        scores['content'] += 3
    if has_faq:
        scores['content'] += 3
    else:
        issues.append("缺少FAQ部分")

    # === 关键词优化 (15分) ===
    if article['primaryKeyword']:
        density = calculate_keyword_density(article['content'], article['primaryKeyword'])

        # 密度评分 (5分)
        if 1.0 <= density <= 2.0:
            scores['keyword'] += 5
        elif 0.5 <= density <= 2.5:
            scores['keyword'] += 3
        elif density < 0.5:
            scores['keyword'] += 1
            issues.append(f"关键词密度过低({density:.2f}%)")
        else:
            issues.append(f"关键词密度过高({density:.2f}%)")

        # 位置分布 (7分)
        first_100_words = ' '.join(article['content'].split()[:100]).lower()
        keyword_lower = article['primaryKeyword'].lower()

        if keyword_lower in article['title'].lower():
            scores['keyword'] += 3
        if keyword_lower in first_100_words:
            scores['keyword'] += 2
        if any(keyword_lower in h.lower() for h in headings['h2']):
            scores['keyword'] += 2

        # LSI关键词 (3分) - 简化检测
        scores['keyword'] += 3  # 默认给分

    # === 用户体验 (15分) ===
    # 可读性 (8分) - 简化评估
    avg_words_per_para = word_count / max(article['content'].count('\n\n'), 1)
    if avg_words_per_para < 100:
        scores['ux'] += 8
    else:
        scores['ux'] += 4

    # 格式友好 (7分)
    has_lists = article['content'].count('\n- ') + article['content'].count('\n* ')
    if has_lists >= 5:
        scores['ux'] += 7
    elif has_lists >= 2:
        scores['ux'] += 4

    # === 差异化评分 (10分) ===
    # 计算与其他文章的平均相似度
    similarities = []
    for other_slug, other_headings in all_articles_headings.items():
        if other_slug != article['slug']:
            sim = calculate_similarity(headings['h2'], other_headings['h2'])
            similarities.append(sim)

    avg_similarity = sum(similarities) / len(similarities) if similarities else 0

    # 相似度越低，差异化分数越高
    if avg_similarity < 40:
        scores['differentiation'] += 10
    elif avg_similarity < 60:
        scores['differentiation'] += 7
    elif avg_similarity < 75:
        scores['differentiation'] += 4
    else:
        issues.append(f"结构高度模板化(相似度{avg_similarity:.0f}%)")

    # === AI 痕迹扣分 (10分) ===
    ai_markers = detect_ai_markers(article['content'])
    ai_score = min(len(ai_markers), 10)
    scores['ai_penalty'] = ai_score

    if ai_score >= 5:
        issues.append(f"AI痕迹明显({len(ai_markers)}个特征)")

    # 计算总分
    total = (scores['seo_tech'] + scores['content'] + scores['keyword'] +
             scores['ux'] + scores['differentiation'] - scores['ai_penalty'])

    return {
        'scores': scores,
        'total': total,
        'issues': issues,
        'word_count': word_count,
        'ai_markers': ai_markers,
        'avg_similarity': avg_similarity,
    }

def main():
    print("开始分析 84 篇文章...")

    articles_dir = Path('content/articles')
    article_files = list(articles_dir.glob('*.md'))

    print(f"找到 {len(article_files)} 篇文章")

    # 第一轮：读取所有文章
    articles = []
    all_headings = {}

    for i, file_path in enumerate(article_files, 1):
        if i % 10 == 0:
            print(f"进度: {i}/{len(article_files)}")

        article = read_article(file_path)
        if article:
            headings = extract_headings(article['content'])
            article['headings'] = headings
            articles.append(article)
            all_headings[article['slug']] = headings

    print(f"成功读取 {len(articles)} 篇文章")

    # 第二轮：评分
    print("\n开始评分分析...")
    results = []

    for i, article in enumerate(articles, 1):
        if i % 10 == 0:
            print(f"评分进度: {i}/{len(articles)}")

        result = score_article(article, article['headings'], all_headings)
        results.append({
            'article': article,
            'result': result,
        })

    # 生成报告
    print("\n生成分析报告...")
    generate_report(results, all_headings)
    generate_csv(results)

    print("\n✅ 分析完成！")
    print("生成文件:")
    print("  - article-seo-analysis-report.md")
    print("  - article-seo-scores.csv")

def generate_report(results, all_headings):
    """生成中文 Markdown 报告"""
    # 按总分排序
    results.sort(key=lambda x: x['result']['total'], reverse=True)

    total_articles = len(results)
    avg_score = sum(r['result']['total'] for r in results) / total_articles

    excellent = [r for r in results if r['result']['total'] >= 80]
    good = [r for r in results if 70 <= r['result']['total'] < 80]
    needs_improve = [r for r in results if 60 <= r['result']['total'] < 70]
    poor = [r for r in results if r['result']['total'] < 60]

    report = []
    report.append("# 84篇文章 SEO 质量分析报告\n")
    report.append(f"**分析日期**: {__import__('datetime').date.today()}\n")
    report.append(f"**分析文章数**: {total_articles} 篇\n\n")

    # 一、执行摘要
    report.append("## 一、执行摘要\n\n")
    report.append(f"- **平均质量评分**: {avg_score:.1f}/100\n")
    report.append(f"- **优秀文章** (≥80分): {len(excellent)}篇 ({len(excellent)/total_articles*100:.1f}%)\n")
    report.append(f"- **良好文章** (70-79分): {len(good)}篇 ({len(good)/total_articles*100:.1f}%)\n")
    report.append(f"- **需优化文章** (60-69分): {len(needs_improve)}篇 ({len(needs_improve)/total_articles*100:.1f}%)\n")
    report.append(f"- **问题文章** (<60分): {len(poor)}篇 ({len(poor)/total_articles*100:.1f}%)\n\n")

    # 核心发现
    report.append("### 核心发现\n\n")
    avg_similarity = sum(r['result']['avg_similarity'] for r in results) / total_articles
    high_ai = [r for r in results if r['result']['scores']['ai_penalty'] >= 5]
    no_internal_links = [r for r in results if len(r['article']['relatedSlugs']) == 0]

    report.append(f"1. **结构同质化程度**: 平均相似度 {avg_similarity:.1f}%\n")
    report.append(f"2. **AI痕迹明显**: {len(high_ai)}篇文章 ({len(high_ai)/total_articles*100:.1f}%)\n")
    report.append(f"3. **缺少内链**: {len(no_internal_links)}篇文章\n\n")

    # 二、结构相似性分析
    report.append("## 二、结构相似性分析\n\n")

    # 识别常见H2模式
    h2_patterns = Counter()
    for slug, headings in all_headings.items():
        pattern = tuple(headings['h2'][:5])  # 前5个H2
        if len(pattern) >= 3:
            h2_patterns[pattern] += 1

    report.append("### 2.1 最常见的结构模板\n\n")
    for i, (pattern, count) in enumerate(h2_patterns.most_common(5), 1):
        report.append(f"**模板{i}** (使用次数: {count}篇)\n")
        report.append("```\n")
        for h2 in pattern:
            report.append(f"H2: {h2}\n")
        report.append("```\n\n")

    # 高度相似文章对
    report.append("### 2.2 高度相似文章对 (相似度>75%)\n\n")
    similar_pairs = []
    checked = set()
    for r1 in results:
        for r2 in results:
            if r1['article']['slug'] != r2['article']['slug']:
                pair = tuple(sorted([r1['article']['slug'], r2['article']['slug']]))
                if pair not in checked:
                    checked.add(pair)
                    sim = calculate_similarity(
                        r1['article']['headings']['h2'],
                        r2['article']['headings']['h2']
                    )
                    if sim > 75:
                        similar_pairs.append((pair, sim))

    similar_pairs.sort(key=lambda x: x[1], reverse=True)
    for (slug1, slug2), sim in similar_pairs[:10]:
        report.append(f"- `{slug1}` ↔ `{slug2}` - 相似度 **{sim}%**\n")

    if not similar_pairs:
        report.append("✅ 未发现高度相似的文章对\n")
    report.append("\n")

    # 三、Topic Cluster 分析
    report.append("## 三、按 Topic Cluster 质量分析\n\n")
    cluster_stats = defaultdict(list)
    for r in results:
        cluster = r['article']['topicCluster'] or '未分类'
        cluster_stats[cluster].append(r)

    for cluster, cluster_results in sorted(cluster_stats.items()):
        count = len(cluster_results)
        avg = sum(r['result']['total'] for r in cluster_results) / count
        best = max(cluster_results, key=lambda x: x['result']['total'])
        worst = min(cluster_results, key=lambda x: x['result']['total'])

        report.append(f"### {cluster} ({count}篇)\n\n")
        report.append(f"- 平均分: {avg:.1f}/100\n")
        report.append(f"- 最佳: `{best['article']['slug']}` ({best['result']['total']}分)\n")
        report.append(f"- 最差: `{worst['article']['slug']}` ({worst['result']['total']}分)\n\n")

    # 四、TOP/BOTTOM 10
    report.append("## 四、TOP 10 优秀文章\n\n")
    report.append("| 排名 | 文章 | 总分 | SEO | 内容 | 关键词 | UX | 差异化 | AI扣分 |\n")
    report.append("|------|------|------|-----|------|--------|----|---------|---------|\n")

    for i, r in enumerate(results[:10], 1):
        s = r['result']['scores']
        report.append(f"| {i} | `{r['article']['slug'][:40]}...` | {r['result']['total']} | "
                     f"{s['seo_tech']} | {s['content']} | {s['keyword']} | {s['ux']} | "
                     f"{s['differentiation']} | -{s['ai_penalty']} |\n")

    report.append("\n## 五、BOTTOM 10 问题文章\n\n")
    report.append("| 排名 | 文章 | 总分 | 主要问题 |\n")
    report.append("|------|------|------|----------|\n")

    for i, r in enumerate(results[-10:], 1):
        issues = ', '.join(r['result']['issues'][:2])
        report.append(f"| {i} | `{r['article']['slug'][:40]}...` | {r['result']['total']} | {issues} |\n")

    # 六、AI痕迹分析
    report.append("\n## 六、AI 痕迹分析\n\n")

    all_ai_markers = Counter()
    for r in results:
        for marker, count in r['result']['ai_markers']:
            all_ai_markers[marker] += count

    report.append("### 高频 AI 特征词统计\n\n")
    for marker, count in all_ai_markers.most_common(10):
        report.append(f"- `\"{marker}\"` - 出现 {count} 次\n")

    report.append("\n### AI 高风险文章 (扣分≥5分)\n\n")
    for r in [r for r in results if r['result']['scores']['ai_penalty'] >= 5]:
        report.append(f"- `{r['article']['slug']}` - AI扣分: {r['result']['scores']['ai_penalty']}分\n")

    # 七、优化建议
    report.append("\n## 七、优化优先级建议\n\n")

    report.append("### 🔥 高优先级 (Quick Wins)\n\n")
    report.append(f"1. **补充内链** - {len(no_internal_links)}篇文章缺少 relatedSlugs\n")

    no_keyword_in_title = [r for r in results if r['article']['primaryKeyword']
                           and r['article']['primaryKeyword'].lower() not in r['article']['title'].lower()]
    report.append(f"2. **标题优化** - {len(no_keyword_in_title)}篇标题未包含主关键词\n")

    no_faq = [r for r in results if 'faq' not in r['article']['content'].lower()]
    report.append(f"3. **添加 FAQ** - {len(no_faq)}篇文章缺少 FAQ 部分\n\n")

    report.append("### ⚠️ 中优先级 (需深度改写)\n\n")
    high_similarity = [r for r in results if r['result']['avg_similarity'] > 70]
    report.append(f"1. **降低结构同质化** - {len(high_similarity)}篇文章结构相似度过高\n")
    report.append(f"2. **减少 AI 痕迹** - {len(high_ai)}篇文章 AI 特征明显\n\n")

    report.append("### 📊 低优先级 (长期优化)\n\n")
    report.append("1. 增加图片和视觉元素 (所有文章 image 字段为空)\n")
    report.append("2. 扩充文章长度 (部分文章<1000词)\n")

    # 写入文件
    with open('article-seo-analysis-report.md', 'w', encoding='utf-8') as f:
        f.write(''.join(report))

def generate_csv(results):
    """生成 CSV 评分表"""
    import csv

    with open('article-seo-scores.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'slug', '总分', 'SEO技术分', '内容质量分', '关键词优化分',
            '用户体验分', '差异化分', 'AI痕迹扣分', '结构相似度%', '主要问题', '优化建议'
        ])

        for r in results:
            s = r['result']['scores']
            issues = '; '.join(r['result']['issues'][:2])
            suggestion = "补充内链" if not r['article']['relatedSlugs'] else "优化关键词密度"

            writer.writerow([
                r['article']['slug'],
                r['result']['total'],
                s['seo_tech'],
                s['content'],
                s['keyword'],
                s['ux'],
                s['differentiation'],
                s['ai_penalty'],
                f"{r['result']['avg_similarity']:.1f}",
                issues,
                suggestion,
            ])

if __name__ == '__main__':
    main()
