# 🤖 自动批次优化触发器

**版本**: v1.0
**创建时间**: 2026-03-23
**用途**: 在任何新Session中自动识别优化命令并执行标准化workflow

---

## 🎯 触发关键词

当用户说出以下**任何一个命令**时，自动触发批次优化流程：

### 触发词列表

1. `优化下一批次`
2. `优化下一批`
3. `继续优化`
4. `优化 batch-XXX` (如: `优化 batch-012`)
5. `执行 batch-XXX`
6. `优化文章 XXX-XXX` (如: `优化文章 396-445`)
7. `继续批次优化`
8. `下一批次`

---

## 🔄 自动执行流程

### Step 0: 读取核心标准文件

**必须先读取以下文件** (按顺序):

1. **优化标准**
   ```
   /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md
   ```

2. **批次执行计划**
   ```
   /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/BATCH-EXECUTION-PLAN.json
   ```

3. **工作流标准**
   ```
   /Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md
   ```

---

### Step 1: 自动检测待优化批次

**检测逻辑**:

```python
# 1. 读取批次计划
batch_plan = read_json('data/BATCH-EXECUTION-PLAN.json')

# 2. 如果用户指定了批次ID (如 "优化 batch-012")
if user_specified_batch_id:
    target_batch = find_batch_by_id(batch_plan, batch_id)

# 3. 如果用户说 "优化下一批次"
else:
    # 扫描已完成的批次
    completed_files = glob('data/llm-two-phase-batch-*.json')
    completed_ranges = extract_ranges(completed_files)

    # 找到第一个未完成的批次
    for batch in batch_plan['remaining_batches']:
        if batch['status'] == 'pending':
            target_batch = batch
            break
```

**输出示例**:
```
✅ 检测到待优化批次: batch-012
📍 文章范围: 446-495
📊 文章数量: 50篇
```

---

### Step 2: 提取文章数据

```python
# 从articles-index.json提取指定范围的文章
articles = load_articles(
    file='data/articles-index.json',
    start_index=batch['start_index'] - 1,  # 转换为0-based
    end_index=batch['end_index']
)

# 保存到临时文件
save_to_temp(articles, f'/tmp/batch{batch_number}-articles.json')
```

---

### Step 3: 启动10个并行Tasks

**Task配置**:
- **总数**: 10个Task并行执行
- **每个Task**: 处理5篇文章
- **Task提示模板**: 从 `BATCH-OPTIMIZATION-STANDARD-WORKFLOW.md` 中读取

**关键约束** (必须在Task提示中强制执行):

```markdown
**CRITICAL CHARACTER LIMITS** (违反立即失败):

1. PrimaryKeyword: 25-50 chars (严格)
2. Slug: 30-38 chars (严格)
3. Title: 50-65 chars (严格)
4. Description: 130-150 chars (严格)

**STRICT SCORING** (所有字段≥85):

- 使用 MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md 公式
- 不允许分数膨胀
- 字符超限自动扣分

**VALIDATION BEFORE OUTPUT**:

在输出results前，必须验证:
- [ ] PrimaryKeyword length <= 50
- [ ] Slug length <= 38
- [ ] Title length <= 65
- [ ] Description length <= 150
- [ ] All scores >= 85
```

---

### Step 4: 合并Task结果

```python
# 收集10个Task的输出
task_results = []
for i in range(1, 11):
    result = read_json(f'/tmp/batch{batch_number}-task{i}-results.json')
    task_results.extend(result['results'])

# 生成最终批次文件
final_batch = {
    'batch_info': {
        'batch_id': batch['batch_id'],
        'article_range': batch['article_range'],
        'total_articles': batch['total_articles'],
        'created_date': today(),
        'optimization_standard': 'MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md'
    },
    'summary': {
        'total_articles': len(task_results),
        'average_original_score': avg([r['original_scores']['overall'] for r in task_results]),
        'average_optimized_score': avg([r['optimized_scores']['overall'] for r in task_results]),
        'redirects_needed': count([r for r in task_results if r['needs_redirect']])
    },
    'phase1_metadata': {
        'optimization_results': task_results
    }
}

# 保存到最终位置
save_json(
    final_batch,
    f'data/llm-two-phase-batch-{batch["article_range"]}.json'
)
```

---

### Step 5: 生成301重定向配置

```python
# 提取需要重定向的文章
redirects = []
for article in task_results:
    if article.get('needs_redirect', False):
        redirects.append({
            'source': f'/articles/{article["original_slug"]}',
            'destination': f'/articles/{article["optimized_slug"]}',
            'permanent': True
        })

# 生成重定向配置文件
redirect_config = {
    'metadata': {
        'created_date': today(),
        'total_redirects': len(redirects),
        'batches_covered': [batch['batch_id']]
    },
    'redirects': redirects
}

save_json(
    redirect_config,
    f'data/REDIRECT-CONFIGURATION-BATCH-{batch_number}.json'
)
```

---

### Step 6: 反向验证 (抽样5篇)

```python
# 随机抽取5篇文章
sampled_articles = random.sample(task_results, 5)

# 使用独立的Task agent进行严格评分
validation_task = Task(
    subagent_type='general-purpose',
    description='Reverse validation',
    prompt='''
    独立评分以下5篇文章，使用STRICT标准，不看原始分数。

    必须严格按照v2.1公式:
    - PrimaryKeyword: length(25) + intent(40) + concise(20) + density(15)
    - Slug: length(30) + keywords(35) + readable(20) + seo(15)
    - Title: length(15) + emotion(30) + value(25) + audience(20) + keywords(10)
    - Description: length(10) + opening(20) + value(30) + audience(15) + cta(10) + semantic(8) + qa(7)

    字符超限必须扣分:
    - PrimaryKeyword >50 chars: 扣10-15分
    - Slug >38 chars: 扣5-10分
    - Title >65 chars: 扣5-10分
    - Description >150 chars: 扣5分

    返回格式:
    Article X: PK=X, Slug=X, Title=X, Desc=X, Overall=X - PASS/FAIL
    Pass Rate: X/5 (X%)
    '''
)

# 报告验证结果
print(f"✅ 反向验证通过率: {pass_rate}%")
```

---

### Step 7: 更新批次计划状态

```python
# 更新BATCH-EXECUTION-PLAN.json中的状态
batch_plan['remaining_batches'][batch_index]['status'] = 'completed'
batch_plan['remaining_batches'][batch_index]['completed_date'] = today()
batch_plan['remaining_batches'][batch_index]['result_file'] = result_file_path

save_json(batch_plan, 'data/BATCH-EXECUTION-PLAN.json')
```

---

### Step 8: 生成执行报告

```markdown
## ✅ Batch {batch_id} 优化完成

### 📊 统计结果
- 优化文章: {total_articles}篇
- 文章范围: {article_range}
- 平均提升: +{improvement}分
- 301重定向: {redirects_count}条

### 🔍 反向验证
- 抽样数量: 5篇
- 通过率: {pass_rate}%
- 问题说明: {issues_summary}

### 📁 生成文件
- data/llm-two-phase-batch-{range}.json
- data/REDIRECT-CONFIGURATION-BATCH-{number}.json

### 📈 总体进度
- 已完成: {completed_total}篇 / 2,209篇
- 完成率: {percentage}%
- 剩余批次: {remaining_batches}个
```

---

## 🎯 用户命令映射表

| 用户输入 | 自动行为 | 批次选择 |
|---------|---------|---------|
| `优化下一批次` | 执行完整流程 | 自动检测第一个pending批次 |
| `优化 batch-012` | 执行完整流程 | 指定batch-012 |
| `优化文章 396-445` | 执行完整流程 | 自动匹配对应批次 |
| `继续优化` | 执行完整流程 | 自动检测下一批次 |
| `统计优化进度` | 只统计，不执行优化 | N/A |

---

## 🔒 质量保证机制

### 硬性约束 (任何Task违反立即标记失败)

1. **字符长度限制**
   - PrimaryKeyword: 25-50 chars (超过50 = 失败)
   - Slug: 30-38 chars (超过38 = 失败)
   - Title: 50-65 chars (超过65 = 失败)
   - Description: 130-150 chars (超过150 = 失败)

2. **评分阈值**
   - 所有4个字段必须≥85分
   - Overall必须≥85分

3. **语义完整性**
   - Description必须包含Q&A结构
   - Description必须包含具体实体/数字

### 自动修复机制

如果Task输出不合格:
1. 记录失败原因
2. 自动重新生成该文章
3. 最多重试2次
4. 仍失败则标记为需人工审查

---

## 📋 执行前自检清单

每次触发优化前，自动检查:

- [ ] MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md 是否存在
- [ ] BATCH-EXECUTION-PLAN.json 是否存在
- [ ] articles-index.json 是否存在
- [ ] 目标批次是否为pending状态
- [ ] 目标批次范围是否有效 (1-2209)
- [ ] /tmp 目录是否可写

如果任何检查失败，立即报错并停止。

---

## 🚨 错误处理

### 常见错误和处理

1. **批次已完成**
   ```
   ❌ 错误: batch-012 已完成
   💡 建议: 执行 "优化下一批次" 或指定其他批次ID
   ```

2. **批次ID不存在**
   ```
   ❌ 错误: batch-999 不存在
   💡 建议: 查看 data/BATCH-EXECUTION-PLAN.json 获取有效批次列表
   ```

3. **文章范围超出索引**
   ```
   ❌ 错误: 文章3000-3050超出总数2209
   💡 建议: 检查文章范围是否正确
   ```

4. **Task输出格式错误**
   ```
   ❌ 错误: Task 5 输出JSON格式错误
   💡 处理: 自动使用备用方案重新生成
   ```

---

## 📖 使用示例

### 示例1: 新Session中自动继续

**用户**:
```
优化下一批次
```

**系统自动执行**:
1. ✅ 读取 MASTER-METADATA-OPTIMIZATION-STANDARD-v2.1.md
2. ✅ 读取 BATCH-EXECUTION-PLAN.json
3. ✅ 检测到第一个pending批次并执行
4. ✅ 提取10篇文章
5. ✅ 启动1个Task (10篇文章小于50篇，只需1个Task)
6. ✅ 生成结果文件
7. ✅ 生成重定向配置
8. ✅ 执行反向验证
9. ✅ 更新批次状态
10. ✅ 报告结果

### 示例2: 指定批次ID

**用户**:
```
优化 batch-012
```

**系统自动执行**:
1. ✅ 读取标准文件
2. ✅ 定位 batch-012 (文章446-495)
3. ✅ 提取50篇文章
4. ✅ 启动10个并行Tasks
5. ✅ 执行完整流程...

### 示例3: 指定文章范围

**用户**:
```
优化文章 796-845
```

**系统自动执行**:
1. ✅ 自动匹配到 batch-019
2. ✅ 执行完整流程...

---

## 🔄 Session间连续性保证

### 新Session启动时自动加载

无论在哪个Session，只要用户说 `优化下一批次` 或 `优化 batch-XXX`，系统都会:

1. **自动读取核心文件** (不依赖对话历史)
2. **自动检测进度** (通过扫描data/目录下的结果文件)
3. **自动应用标准** (从.claude/skills/读取最新标准)
4. **自动执行workflow** (按照固化流程)

### 不会丢失的信息

| 信息类型 | 存储位置 | Session间共享 |
|---------|---------|--------------|
| 优化标准 | .claude/skills/*.md | ✅ 是 |
| 批次计划 | data/BATCH-EXECUTION-PLAN.json | ✅ 是 |
| 已完成批次 | data/llm-two-phase-batch-*.json | ✅ 是 |
| 重定向规则 | data/REDIRECT-CONFIGURATION-*.json | ✅ 是 |
| 对话历史 | Session内存 | ❌ 否 (不需要) |

---

## ✅ 固化检查清单

- [x] 触发关键词定义明确
- [x] 自动检测逻辑完整
- [x] Task提示模板包含硬性约束
- [x] 字符限制强制执行
- [x] 评分标准严格应用
- [x] 反向验证自动执行
- [x] 批次状态自动更新
- [x] 错误处理覆盖常见场景
- [x] Session间连续性保证
- [x] 文档存储在 .claude/skills/ (全局可读)

---

**此文件将在任何新Session中被自动读取和执行！**

**用户只需说: "优化下一批次" 或 "优化 batch-XXX"**

**系统会自动完成所有步骤，无需记忆对话历史！**
