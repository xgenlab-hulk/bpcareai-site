#!/usr/bin/env python3
"""
提取所有文章的PrimaryKeyword并生成映射文档
"""

import json

def main():
    print("🔍 提取所有文章的PrimaryKeyword...")
    print("=" * 80)

    # 读取articles-index.json
    with open('data/articles-index.json', 'r', encoding='utf-8') as f:
        articles = json.load(f)

    total = len(articles)
    print(f"\n📊 总文章数: {total}\n")

    # 生成Markdown映射文档
    md_lines = [
        "# PrimaryKeyword 映射文档",
        "",
        f"**总文章数**: {total}",
        f"**生成时间**: 2026-03-06",
        "",
        "---",
        "",
        "## 所有文章的PrimaryKeyword列表",
        "",
        "| # | Slug | Title | PrimaryKeyword | 长度 | TopicCluster |",
        "|---|------|-------|----------------|------|--------------|"
    ]

    # 按topicCluster分组
    by_cluster = {}

    for i, article in enumerate(articles, 1):
        slug = article['slug']
        title = article['title']
        pk = article.get('primaryKeyword', '')
        cluster = article.get('topicCluster', 'uncategorized')
        length = len(pk)

        # 添加到总表
        # 截断过长的title和slug以适应表格
        short_slug = slug[:40] + '...' if len(slug) > 40 else slug
        short_title = title[:50] + '...' if len(title) > 50 else title
        short_pk = pk[:40] + '...' if len(pk) > 40 else pk

        md_lines.append(f"| {i} | `{short_slug}` | {short_title} | **{short_pk}** | {length} | {cluster} |")

        # 按cluster分组
        if cluster not in by_cluster:
            by_cluster[cluster] = []
        by_cluster[cluster].append({
            'slug': slug,
            'title': title,
            'primaryKeyword': pk,
            'length': length
        })

    # 添加按TopicCluster分组的统计
    md_lines.extend([
        "",
        "---",
        "",
        "## 按TopicCluster分组统计",
        "",
        "| TopicCluster | 文章数 | 平均长度 |",
        "|--------------|--------|----------|"
    ])

    for cluster in sorted(by_cluster.keys()):
        articles_in_cluster = by_cluster[cluster]
        count = len(articles_in_cluster)
        avg_length = sum(a['length'] for a in articles_in_cluster) / count if count > 0 else 0

        md_lines.append(f"| {cluster} | {count} | {avg_length:.1f} chars |")

    # 添加长度分布统计
    length_ranges = {
        '<25': 0,
        '25-30': 0,
        '30-50': 0,
        '51-60': 0,
        '>60': 0
    }

    for article in articles:
        pk = article.get('primaryKeyword', '')
        length = len(pk)

        if length < 25:
            length_ranges['<25'] += 1
        elif 25 <= length <= 30:
            length_ranges['25-30'] += 1
        elif 30 <= length <= 50:
            length_ranges['30-50'] += 1
        elif 51 <= length <= 60:
            length_ranges['51-60'] += 1
        else:
            length_ranges['>60'] += 1

    md_lines.extend([
        "",
        "---",
        "",
        "## 长度分布统计",
        "",
        "| 长度范围 | 文章数 | 占比 | 评级 |",
        "|---------|--------|------|------|",
        f"| <25 chars | {length_ranges['<25']} | {length_ranges['<25']/total*100:.1f}% | ⚠️ 过短 |",
        f"| 25-30 chars | {length_ranges['25-30']} | {length_ranges['25-30']/total*100:.1f}% | ✅ 可接受 |",
        f"| 30-50 chars | {length_ranges['30-50']} | {length_ranges['30-50']/total*100:.1f}% | ✅ 理想 |",
        f"| 51-60 chars | {length_ranges['51-60']} | {length_ranges['51-60']/total*100:.1f}% | ✅ 可接受 |",
        f"| >60 chars | {length_ranges['>60']} | {length_ranges['>60']/total*100:.1f}% | ⚠️ 过长 |",
        "",
        "---",
        "",
        "## 使用说明",
        "",
        "此文档用于快速查看和检索所有文章的PrimaryKeyword。",
        "",
        "- **理想长度**: 30-50 chars",
        "- **可接受长度**: 25-60 chars",
        "- **不合格**: <25 或 >60 chars",
        ""
    ])

    # 保存为Markdown文件
    output_path = 'data/primary-keyword-mapping.md'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))

    print(f"✅ 映射文档已生成: {output_path}")
    print(f"\n📊 长度分布:")
    for range_name, count in length_ranges.items():
        print(f"   {range_name}: {count} 篇 ({count/total*100:.1f}%)")

    # 同时生成JSON版本便于后续处理
    json_output = {
        'total_articles': total,
        'generated_date': '2026-03-06',
        'length_distribution': length_ranges,
        'by_cluster': {
            cluster: {
                'count': len(articles_list),
                'avg_length': sum(a['length'] for a in articles_list) / len(articles_list),
                'articles': articles_list
            }
            for cluster, articles_list in by_cluster.items()
        },
        'all_mappings': [
            {
                'slug': article['slug'],
                'title': article['title'],
                'primaryKeyword': article.get('primaryKeyword', ''),
                'length': len(article.get('primaryKeyword', '')),
                'topicCluster': article.get('topicCluster', 'uncategorized')
            }
            for article in articles
        ]
    }

    json_output_path = 'data/primary-keyword-mapping.json'
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(json_output, f, ensure_ascii=False, indent=2)

    print(f"✅ JSON映射已生成: {json_output_path}")
    print("\n✅ 完成!")

if __name__ == '__main__':
    main()
