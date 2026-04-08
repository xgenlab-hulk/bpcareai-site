# 执行清单：处理文章21-40

## ✅ 准备阶段（已完成）

- [x] 从articles-index.json提取20篇文章（索引20-39）
- [x] 创建完整的处理脚本（scripts/process-two-phase-batch.py）
- [x] 验证所有技能文件存在
- [x] 创建完整文档和使用说明
- [x] 生成示例输出格式

## ⏳ 执行阶段（待完成）

### 第1步：环境设置
```bash
# 检查Python版本（需要3.9+）
python3 --version

# 检查anthropic包
python3 -c "import anthropic; print('OK')"

# 如果没有，安装：
pip3 install anthropic
```

### 第2步：设置API密钥
```bash
# 设置环境变量
export ANTHROPIC_API_KEY="your-anthropic-api-key-here"

# 验证
echo $ANTHROPIC_API_KEY
```

### 第3步：运行处理
```bash
# 进入项目目录
cd /Users/hulksi/Desktop/IOS_APPS/bpcareai-site

# 运行脚本
python3 scripts/process-two-phase-batch.py --start 21 --end 40

# 或者分批运行（推荐新手）：
python3 scripts/process-two-phase-batch.py --start 21 --end 25
python3 scripts/process-two-phase-batch.py --start 26 --end 30
python3 scripts/process-two-phase-batch.py --start 31 --end 35
python3 scripts/process-two-phase-batch.py --start 36 --end 40
```

### 第4步：监控进度

脚本运行时会显示：
```
================================================================================
Article 21: warning-signs-your-normal-blood-pressure...
================================================================================
  Phase 1a: Metadata audit...
    Score: 45/100
  Phase 1b: Optimizing metadata...
    Optimized Score: 88/100
  Phase 1c: Content audit...
    Content Score: 82/100
    → Flagged for Phase 2
```

预计时间：30-60分钟

### 第5步：验证结果

```bash
# 检查输出文件是否生成
ls -lh data/llm-two-phase-batch-21-40.json

# 查看摘要
python3 << 'PYEOF'
import json
with open('data/llm-two-phase-batch-21-40.json') as f:
    data = json.load(f)
    s = data['summary']
    print(f"成功处理: {s['successfully_processed']}/{s['total_articles']}")
    print(f"Metadata原始平均分: {s['metadata_stats']['original_avg_score']}")
    print(f"Metadata优化后平均分: {s['metadata_stats']['final_avg_score']}")
    print(f"Content平均分: {s['content_stats']['avg_score']}")
    print(f"需要Phase 2: {s['content_stats']['articles_needing_phase2']}")
PYEOF
```

## 📊 预期结果

### Metadata优化
- [ ] 原始平均分：55-65/100
- [ ] 优化后平均分：87-92/100
- [ ] 所有文章最终分数≥85
- [ ] 优化了16-18篇文章

### Content审计
- [ ] 平均内容分数：72-80/100
- [ ] 6-8篇文章分数≥85
- [ ] 12-14篇文章需要Phase 2

### 输出文件
- [ ] data/llm-two-phase-batch-21-40.json 生成
- [ ] 文件包含batch_info
- [ ] 文件包含detailed_results（20篇）
- [ ] 文件包含summary统计

## 🔍 质量检查

```bash
# 检查JSON有效性
python3 -m json.tool data/llm-two-phase-batch-21-40.json > /dev/null && echo "✓ JSON有效"

# 检查文章数量
python3 -c "import json; d=json.load(open('data/llm-two-phase-batch-21-40.json')); print(f'处理了 {len(d[\"detailed_results\"])} 篇文章')"

# 检查所有metadata分数≥85
python3 << 'PYEOF'
import json
with open('data/llm-two-phase-batch-21-40.json') as f:
    data = json.load(f)
    scores = [r.get('metadata_final_score', 0) for r in data['detailed_results']]
    all_above_85 = all(s >= 85 for s in scores)
    print(f"所有metadata分数≥85: {'✓ 是' if all_above_85 else '✗ 否'}")
    if not all_above_85:
        below_85 = [i for i, s in enumerate(scores, 21) if s < 85]
        print(f"分数<85的文章: {below_85}")
PYEOF
```

## 📋 后续步骤

- [ ] 提取优化后的metadata
- [ ] 更新文章文件的metadata
- [ ] 识别需要Phase 2的文章
- [ ] 规划内容优化优先级
- [ ] 监控SEO效果改善

## 🆘 问题排查

### 问题1: API密钥错误
```
错误: "ANTHROPIC_API_KEY environment variable not set"
解决: export ANTHROPIC_API_KEY="your-key"
```

### 问题2: 模块未找到
```
错误: "ModuleNotFoundError: No module named 'anthropic'"
解决: pip3 install anthropic
```

### 问题3: 中途失败
```
- 检查已处理的文章数量
- 从上次成功的文章继续
- 或重新运行（脚本会覆盖）
```

### 问题4: 某些文章分数<85
```
- 检查optimization_result中的问题描述
- 可能需要手动调整
- 或重新运行该文章的优化
```

## 📁 文件清单

### 输入文件
- ✅ data/articles-index.json (2209篇文章)
- ✅ /tmp/batch-21-40.json (提取的20篇)

### 处理脚本
- ✅ scripts/process-two-phase-batch.py (11KB)

### 技能文件
- ✅ .claude/skills/llm-article-audit-comprehensive.md
- ✅ .claude/skills/llm-article-optimization-comprehensive.md
- ✅ .claude/skills/article-content-quality-audit.md

### 输出文件
- ⏳ data/llm-two-phase-batch-21-40.json (待生成)

### 文档文件
- ✅ QUICK-START-BATCH-21-40.md (2KB)
- ✅ data/BATCH-21-40-SUMMARY-REPORT.md (9.9KB)
- ✅ data/TWO-PHASE-BATCH-21-40-IMPLEMENTATION-GUIDE.md (12KB)
- ✅ data/llm-two-phase-batch-21-40-README.md (4.8KB)
- ✅ data/llm-two-phase-batch-21-40-SAMPLE.json (5.6KB)
- ✅ data/EXECUTION-CHECKLIST-21-40.md (本文件)

## 🎯 成功标准

处理完成且成功的标志：

- ✅ 20篇文章全部处理完成（无错误）
- ✅ 所有metadata最终分数≥85
- ✅ 所有文章完成内容审计
- ✅ 输出文件为有效JSON
- ✅ summary统计正确计算
- ✅ 清晰标识需要Phase 2的文章列表

## 📞 获取帮助

参考文档：
1. 快速开始：QUICK-START-BATCH-21-40.md
2. 详细摘要：data/BATCH-21-40-SUMMARY-REPORT.md
3. 完整指南：data/TWO-PHASE-BATCH-21-40-IMPLEMENTATION-GUIDE.md
4. 使用说明：data/llm-two-phase-batch-21-40-README.md

---

**创建日期**: 2026-03-16
**当前状态**: ✅ 准备完成，⏳ 待执行
**下一步**: 设置API密钥并运行脚本
