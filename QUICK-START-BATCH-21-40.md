# Quick Start: 处理文章21-40（两阶段审计优化）

## 最快执行方式

```bash
# 1. 设置API密钥
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# 2. 进入项目目录
cd /Users/hulksi/Desktop/IOS_APPS/bpcareai-site

# 3. 运行处理
python3 scripts/process-two-phase-batch.py --start 21 --end 40

# 完成！等待30-60分钟
```

## 查看结果

```bash
# 查看摘要
cat data/llm-two-phase-batch-21-40.json | python3 -m json.tool | head -50

# 查看统计
python3 -c "import json; d=json.load(open('data/llm-two-phase-batch-21-40.json')); print(json.dumps(d['summary'], indent=2))"
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `scripts/process-two-phase-batch.py` | 主处理脚本 |
| `data/llm-two-phase-batch-21-40.json` | 输出结果（运行后生成） |
| `data/BATCH-21-40-SUMMARY-REPORT.md` | 详细摘要报告 |
| `data/TWO-PHASE-BATCH-21-40-IMPLEMENTATION-GUIDE.md` | 完整实施指南 |
| `data/llm-two-phase-batch-21-40-README.md` | 使用说明 |

## 处理内容

- **文章数量**: 20篇（第21-40篇）
- **Phase 1**: Metadata审计+优化（确保≥85分）
- **Phase 2准备**: 内容审计（标记需优化的文章）

## 预期输出

- ✅ Metadata原始平均分: 55-65/100
- ✅ Metadata优化后平均分: 87-92/100  
- ✅ Content平均分: 72-80/100
- ✅ 需要Phase 2的文章: 12-14篇

## 时间和成本

- ⏱️ **时间**: 30-60分钟
- 💰 **成本**: $10-15 (API使用)
- 📞 **API调用**: 60-100+次

## 问题排查

### API密钥问题
```bash
echo $ANTHROPIC_API_KEY  # 检查是否设置
export ANTHROPIC_API_KEY="sk-..."  # 设置密钥
```

### 依赖问题
```bash
pip3 install anthropic  # 安装依赖
python3 -c "import anthropic"  # 验证安装
```

## 详细文档

查看完整文档:
- 摘要报告: `data/BATCH-21-40-SUMMARY-REPORT.md`
- 实施指南: `data/TWO-PHASE-BATCH-21-40-IMPLEMENTATION-GUIDE.md`
- 使用说明: `data/llm-two-phase-batch-21-40-README.md`

---

**创建日期**: 2026-03-16
**状态**: 准备就绪，待执行
