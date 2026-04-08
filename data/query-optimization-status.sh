#!/bin/bash
# 优化进度查询脚本
# 使用方法: ./query-optimization-status.sh [command] [args]

REPORT_FILE="/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/OPTIMIZATION-PROGRESS-REPORT.json"

# 显示帮助信息
show_help() {
    cat << EOF
========================================
文章优化进度查询工具
========================================

使用方法:
  ./query-optimization-status.sh [命令] [参数]

命令列表:

  summary
    显示优化进度概览

  article <编号>
    查询指定文章的优化状态
    示例: ./query-optimization-status.sh article 100

  batch <批次名>
    查询指定批次的详情
    示例: ./query-optimization-status.sh batch "Batch 11-20"

  changed
    列出所有 slug 发生变化的文章

  pending [数量]
    列出待优化的文章（默认显示前10篇）
    示例: ./query-optimization-status.sh pending 20

  batch-list
    列出所有已完成的批次

  quick
    显示快速状态（同 cat QUICK-STATUS.txt）

  help
    显示此帮助信息

========================================
EOF
}

# 显示概览
show_summary() {
    echo "========================================="
    echo "优化进度概览"
    echo "========================================="
    jq -r '
        "总文章数:    \(.summary.total_articles) 篇",
        "已优化:      \(.summary.optimized_count) 篇",
        "待优化:      \(.summary.pending_count) 篇",
        "完成进度:    \(.summary.completion_percentage)%"
    ' "$REPORT_FILE"
    echo "========================================="
}

# 查询文章
query_article() {
    local article_num=$1
    echo "查询文章 #$article_num ..."
    echo ""
    jq -r --arg num "$article_num" '
        .optimized_articles[] |
        select(.article_number == ($num | tonumber)) |
        "文章编号: \(.article_number)\n" +
        "索引位置: \(.index)\n" +
        "原始 slug: \(.original_slug)\n" +
        "优化 slug: \(.optimized_slug)\n" +
        "Slug变更: \(if .slug_changed then "是 ✓" else "否" end)\n" +
        "优化分数: \(.optimization_score // "N/A")\n" +
        "原始标题: \(.original_title)\n" +
        "优化标题: \(.optimized_title)"
    ' "$REPORT_FILE"

    if [ $? -ne 0 ] || [ -z "$(jq -r --arg num "$article_num" '.optimized_articles[] | select(.article_number == ($num | tonumber))' "$REPORT_FILE")" ]; then
        echo "未找到文章 #$article_num 的优化记录"
        echo "检查是否在待优化列表中..."
        jq -r --arg num "$article_num" '
            .pending_articles[] |
            select(.article_number == ($num | tonumber)) |
            "文章编号: \(.article_number)\n" +
            "索引位置: \(.index)\n" +
            "Slug: \(.slug)\n" +
            "标题: \(.title)\n" +
            "状态: ⏳ 待优化"
        ' "$REPORT_FILE"
    fi
}

# 查询批次
query_batch() {
    local batch_name=$1
    echo "查询批次: $batch_name"
    echo ""
    jq -r --arg name "$batch_name" '
        .completed_batches[] |
        select(.batch_name == $name) |
        "批次名称: \(.batch_name)\n" +
        "文章范围: \(.article_range)\n" +
        "文章数量: \(.article_count) 篇\n" +
        "起始索引: \(.start_index)\n" +
        "结束索引: \(.end_index)\n" +
        "数据文件: \(.file_name)\n" +
        "优化状态: \(.optimization_status)"
    ' "$REPORT_FILE"
}

# 列出 slug 变更的文章
list_changed() {
    echo "Slug 发生变化的文章:"
    echo "========================================="
    jq -r '
        .optimized_articles[] |
        select(.slug_changed == true) |
        "[\(.article_number)] \(.original_slug) -> \(.optimized_slug)"
    ' "$REPORT_FILE" | head -20

    local total=$(jq '[.optimized_articles[] | select(.slug_changed == true)] | length' "$REPORT_FILE")
    echo ""
    echo "总计: $total 篇文章的 slug 发生了变化"
    echo "(仅显示前20条，完整列表请查看 JSON 报告)"
}

# 列出待优化文章
list_pending() {
    local count=${1:-10}
    echo "待优化文章 (前 $count 篇):"
    echo "========================================="
    jq -r --arg count "$count" '
        .pending_articles[0:($count | tonumber)][] |
        "[\(.article_number)] \(.slug)"
    ' "$REPORT_FILE"

    local total=$(jq '.pending_articles | length' "$REPORT_FILE")
    echo ""
    echo "待优化文章总数: $total 篇"
}

# 列出所有批次
list_batches() {
    echo "已完成的批次:"
    echo "========================================="
    jq -r '
        .completed_batches[] |
        "\(.batch_name) | 文章 \(.article_range) | \(.article_count)篇 | ✅ \(.optimization_status)"
    ' "$REPORT_FILE"
}

# 显示快速状态
show_quick() {
    cat /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/QUICK-STATUS.txt
}

# 主逻辑
case "$1" in
    summary)
        show_summary
        ;;
    article)
        if [ -z "$2" ]; then
            echo "错误: 请指定文章编号"
            echo "用法: $0 article <编号>"
            exit 1
        fi
        query_article "$2"
        ;;
    batch)
        if [ -z "$2" ]; then
            echo "错误: 请指定批次名称"
            echo "用法: $0 batch <批次名>"
            exit 1
        fi
        query_batch "$2"
        ;;
    changed)
        list_changed
        ;;
    pending)
        list_pending "$2"
        ;;
    batch-list)
        list_batches
        ;;
    quick)
        show_quick
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo "未知命令: $1"
        echo "使用 '$0 help' 查看帮助"
        exit 1
        ;;
esac
