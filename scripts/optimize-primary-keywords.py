#!/usr/bin/env python3
"""
批量优化 PrimaryKeyword
基于 audit-v2 结果更新 markdown 文件的 frontmatter
"""

import json
import os
import re
from typing import Dict, List

def read_markdown_file(file_path: str) -> tuple[str, str]:
    """
    读取markdown文件，分离frontmatter和body
    返回: (frontmatter_text, body)
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 匹配 frontmatter (---之间的内容)
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        return match.group(1), match.group(2)
    else:
        return '', content

def update_frontmatter_keyword(frontmatter_text: str, new_keyword: str) -> str:
    """
    更新frontmatter中的primaryKeyword字段
    """
    # 匹配 primaryKeyword 行
    pattern = r'^primaryKeyword:\s*"([^"]*)"$'

    lines = frontmatter_text.split('\n')
    updated_lines = []

    for line in lines:
        if re.match(r'^primaryKeyword:', line):
            # 替换primaryKeyword
            updated_lines.append(f'primaryKeyword: "{new_keyword}"')
        else:
            updated_lines.append(line)

    return '\n'.join(updated_lines)

def write_markdown_file(file_path: str, frontmatter: str, body: str):
    """
    写入markdown文件
    """
    content = f"---\n{frontmatter}\n---\n{body}"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("🔄 开始优化 PrimaryKeyword...")
    print("=" * 80)

    # 读取audit v2结果
    with open('data/primary-keyword-audit-v2.json', 'r', encoding='utf-8') as f:
        audit = json.load(f)

    articles_to_optimize = audit['needs_optimization']
    total = len(articles_to_optimize)

    print(f"\n📊 待优化文章: {total} 篇")
    print(f"   🔴 严重问题: {audit['quality_distribution']['critical']} 篇")
    print(f"   🟠 需要改进: {audit['quality_distribution']['needs_improvement']} 篇\n")

    articles_dir = 'content/articles'
    success_count = 0
    failed_count = 0
    failed_list = []

    # 按优先级排序：严重问题优先
    articles_sorted = sorted(articles_to_optimize, key=lambda x: x['new_score'])

    print("─" * 80)

    for i, article in enumerate(articles_sorted, 1):
        slug = article['slug']
        old_keyword = article['current_keyword']
        new_keyword = article['suggested_keyword']
        score = article['new_score']

        file_path = os.path.join(articles_dir, f"{slug}.md")

        if not os.path.exists(file_path):
            print(f"[{i}/{total}] ❌ 文件不存在: {slug}.md")
            failed_count += 1
            failed_list.append({'slug': slug, 'reason': 'File not found'})
            continue

        try:
            # 读取文件
            frontmatter, body = read_markdown_file(file_path)

            # 更新primaryKeyword
            updated_frontmatter = update_frontmatter_keyword(frontmatter, new_keyword)

            # 写回文件
            write_markdown_file(file_path, updated_frontmatter, body)

            priority = "🔴" if score < 40 else "🟠"
            print(f"[{i}/{total}] {priority} {slug[:50]}...")
            print(f"         旧: \"{old_keyword}\" ({len(old_keyword)} chars)")
            print(f"         新: \"{new_keyword}\" ({len(new_keyword)} chars)")
            print(f"         分数: {score}/100\n")

            success_count += 1

        except Exception as e:
            print(f"[{i}/{total}] ❌ 处理失败: {slug}.md")
            print(f"         错误: {str(e)}\n")
            failed_count += 1
            failed_list.append({'slug': slug, 'reason': str(e)})

    print("=" * 80)
    print(f"\n✅ 优化完成!")
    print(f"   成功: {success_count}/{total} 篇")
    print(f"   失败: {failed_count}/{total} 篇")

    if failed_list:
        print(f"\n❌ 失败列表:")
        for item in failed_list:
            print(f"   - {item['slug']}: {item['reason']}")

    # 保存优化记录
    optimization_log = {
        'timestamp': '2026-03-06',
        'total_optimized': success_count,
        'total_failed': failed_count,
        'optimized_articles': [
            {
                'slug': article['slug'],
                'old_keyword': article['current_keyword'],
                'new_keyword': article['suggested_keyword'],
                'old_score': article['new_score'],
                'new_score_expected': 'Will be re-evaluated after regenerating index'
            }
            for article in articles_sorted[:success_count]
        ],
        'failed_articles': failed_list
    }

    log_path = 'data/primary-keyword-optimization-log.json'
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(optimization_log, f, ensure_ascii=False, indent=2)

    print(f"\n💾 优化记录已保存: {log_path}")
    print("\n📝 下一步:")
    print("   1. 运行 npm run build:articles-index 重新生成索引")
    print("   2. 验证优化效果")
    print("   3. Commit 并 push 到 GitHub\n")

if __name__ == '__main__':
    main()
