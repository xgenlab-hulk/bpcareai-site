# 📍 URL重定向管理标准

**版本**: v1.0
**创建时间**: 2026-03-20
**适用场景**: 所有metadata优化导致slug变更的文章
**重定向类型**: 301永久重定向

---

## 🎯 核心原则

### 为什么需要301重定向？

1. ✅ **SEO友好** - 保留旧URL的权重和排名
2. ✅ **用户体验** - 已收藏/分享的链接自动跳转
3. ✅ **外部链接** - 其他网站引用的链接不会404
4. ✅ **搜索引擎** - 告知搜索引擎URL永久迁移

### 什么时候需要重定向？

| 场景 | 是否需要 | 原因 |
|------|---------|------|
| **修改已上线文章的slug** | ✅ **必须** | 旧URL已被索引 |
| **新文章首次上线** | ❌ 不需要 | 从未有旧URL |
| **修改title/description** | ❌ 不需要 | URL未变化 |
| **修改primaryKeyword** | ❌ 不需要 | URL未变化 |

---

## 📋 标准执行流程

### Step 1: 修复文章metadata后检查

每次修复文章后，**必须检查**是否需要重定向：

```bash
# 1. 检查文章的原始slug (从文件名推断)
ORIGINAL_SLUG=$(basename "$FILENAME" .md)

# 2. 检查文章的新slug (从文件内容读取)
NEW_SLUG=$(grep "^slug:" "$FILENAME" | cut -d' ' -f2)

# 3. 对比是否变化
if [ "$ORIGINAL_SLUG" != "$NEW_SLUG" ]; then
  echo "✅ 需要创建重定向: $ORIGINAL_SLUG → $NEW_SLUG"
else
  echo "❌ Slug未变化，无需重定向"
fi
```

### Step 2: 记录重定向规则

将需要重定向的文章记录到 `optimized-articles-index.json`：

```json
{
  "filename": "原始文件名.md",
  "original_slug": "从文件名推断的原始slug",
  "optimized_slug": "优化后的新slug",
  "needs_redirect": true,  // ← 添加此字段
  "redirect_config": {
    "source": "/articles/原始slug",
    "destination": "/articles/新slug",
    "permanent": true
  }
}
```

### Step 3: 生成重定向配置文件

每个批次完成后，自动生成重定向配置：

```bash
# 从optimized-articles-index.json提取所有重定向规则
jq '.batches[] | .articles[] | select(.needs_redirect == true) | .redirect_config' \
  data/optimized-articles-index.json > data/REDIRECT-CONFIGURATION-BATCH-X.json
```

### Step 4: 更新next.config.js

```javascript
// next.config.js
async redirects() {
  const slugRedirects = [
    // 手动添加或使用脚本自动导入
    ...require('./data/REDIRECT-CONFIGURATION-BATCH-1-2.json').redirects,
    // 其他重定向
  ];

  return slugRedirects;
}
```

---

## 🔧 批次优化集成流程

### 修复任务执行时 (每篇文章)

**修复前**:
```yaml
# 原文件内容
slug: 10-foods-that-activate-nrf2-pathway-to-reduce-oxidative-stress...
```

**修复后**:
```yaml
# 新文件内容
slug: foods-strengthen-blood-vessels-naturally-seniors
```

**同步操作**:
1. ✅ 使用Edit工具修改文章metadata
2. ✅ 记录original_slug到索引文件
3. ✅ 标记needs_redirect = true

### 批次完成后 (自动化)

```markdown
## 批次完成检查清单

- [ ] 所有文章已修复
- [ ] 反向验证通过
- [ ] **生成重定向配置文件** ← 新增
- [ ] 更新optimized-articles-index.json
- [ ] 更新MASTER-OPTIMIZATION-PROGRESS-TRACKER.md
- [ ] 更新REAL-TIME-EXECUTION-LOG.md
```

---

## 📊 重定向配置文件格式

### 标准JSON格式

**文件名**: `data/REDIRECT-CONFIGURATION-BATCH-{批次编号}.json`

```json
{
  "metadata": {
    "created_date": "2026-03-20",
    "total_redirects": 35,
    "batches_covered": ["batch-001", "batch-002"],
    "purpose": "为Batch X优化的文章提供301永久重定向配置"
  },
  "redirects": [
    {
      "source": "/articles/原始超长slug",
      "destination": "/articles/优化后短slug",
      "permanent": true
    }
  ],
  "instructions": {
    "step_1": "打开 next.config.js 文件",
    "step_2": "找到 async redirects() 函数",
    "step_3": "将redirects数组添加到配置中",
    "step_4": "保存并重新部署网站"
  }
}
```

---

## ✅ 验证重定向是否生效

### 本地测试

```bash
# 启动开发服务器
npm run dev

# 测试重定向 (应返回301/308状态码)
curl -I http://localhost:3000/articles/原始slug

# 预期响应
HTTP/1.1 308 Permanent Redirect
Location: /articles/新slug
```

### 生产环境测试

```bash
# 测试生产环境重定向
curl -I https://yourdomain.com/articles/原始slug

# 预期响应
HTTP/2 301 Moved Permanently
location: https://yourdomain.com/articles/新slug
```

---

## 🔄 更新optimized-articles-index.json格式

### 添加重定向追踪字段

```json
{
  "batches": [
    {
      "batch_id": "batch-001",
      "articles": [
        {
          "filename": "10-foods-that-activate-nrf2-pathway...",
          "original_slug": "10-foods-that-activate-nrf2-pathway-to-reduce-oxidative-stress-in-coronary-endothelium-backed-by-microvascular-reactivity-testing-in-adults-62-76-with-microvascular-angina",
          "optimized_slug": "foods-strengthen-blood-vessels-naturally-seniors",
          "needs_redirect": true,  // ← 新增字段
          "redirect_created": true,  // ← 新增字段
          "redirect_file": "data/REDIRECT-CONFIGURATION-BATCH-1-2.json",  // ← 新增字段
          "score_before": 47.75,
          "score_after": 88.5,
          "optimized_date": "2026-03-20"
        }
      ]
    }
  ]
}
```

---

## 🚨 常见错误与预防

### 错误1: 忘记创建重定向

**后果**:
- ❌ 旧URL返回404
- ❌ SEO排名丢失
- ❌ 用户体验差

**预防**:
- ✅ 在批次完成检查清单中强制检查
- ✅ 自动化脚本生成重定向配置

### 错误2: 重定向目标与实际slug不一致

**示例**:
```javascript
// ❌ 错误
{
  "source": "/articles/old-slug",
  "destination": "/articles/wrong-slug",  // 与文章实际slug不符
  "permanent": true
}

// ✅ 正确
{
  "source": "/articles/old-slug",
  "destination": "/articles/foods-strengthen-blood-vessels-naturally-seniors",  // 与文章metadata的slug一致
  "permanent": true
}
```

**预防**:
- ✅ 从optimized-articles-index.json自动生成重定向
- ✅ 而非手动编写

### 错误3: 使用302临时重定向

**问题**:
```javascript
// ❌ 错误 - 使用302临时重定向
{
  "source": "/articles/old-slug",
  "destination": "/articles/new-slug",
  "permanent": false  // ← 错误！
}

// ✅ 正确 - 使用301永久重定向
{
  "source": "/articles/old-slug",
  "destination": "/articles/new-slug",
  "permanent": true  // ← 正确
}
```

**影响**:
- 302不会转移SEO权重
- 搜索引擎会继续索引旧URL

---

## 📝 执行检查清单

### 每篇文章修复后

- [ ] 记录original_slug (从文件名推断)
- [ ] 记录optimized_slug (从metadata读取)
- [ ] 标记needs_redirect = true (如果slug变化)

### 每个批次完成后

- [ ] 生成REDIRECT-CONFIGURATION-BATCH-X.json
- [ ] 验证重定向配置格式正确
- [ ] 确认source与destination一致
- [ ] 更新optimized-articles-index.json添加redirect字段
- [ ] 将重定向配置文件路径记录到追踪文档

### 部署前

- [ ] 将重定向配置合并到next.config.js
- [ ] 本地测试重定向是否生效
- [ ] 确认所有permanent = true

### 部署后

- [ ] 生产环境测试重定向
- [ ] 使用Google Search Console提交URL变更
- [ ] 监控404错误日志

---

## 🎯 自动化脚本模板

### 生成重定向配置

```bash
#!/bin/bash
# scripts/generate-redirects-for-batch.sh

BATCH_ID=$1
OUTPUT_FILE="data/REDIRECT-CONFIGURATION-BATCH-${BATCH_ID}.json"

jq --arg batch_id "$BATCH_ID" '
{
  metadata: {
    created_date: (now | strftime("%Y-%m-%d")),
    total_redirects: (.batches[] | select(.batch_id == $batch_id) | .articles | length),
    batches_covered: [$batch_id],
    purpose: "为Batch \($batch_id)优化的文章提供301永久重定向配置"
  },
  redirects: [
    .batches[] |
    select(.batch_id == $batch_id) |
    .articles[] |
    {
      source: ("/articles/" + (.filename | gsub("\\.md$"; ""))),
      destination: ("/articles/" + .optimized_slug),
      permanent: true
    }
  ]
}
' data/optimized-articles-index.json > "$OUTPUT_FILE"

echo "✅ 重定向配置已生成: $OUTPUT_FILE"
```

**使用方法**:
```bash
bash scripts/generate-redirects-for-batch.sh batch-001
bash scripts/generate-redirects-for-batch.sh batch-002
```

---

## 📚 参考资料

### HTTP状态码

- **301 Moved Permanently** - 永久重定向 ✅ 使用这个
- **302 Found** - 临时重定向 ❌ 不使用
- **307 Temporary Redirect** - 临时重定向 ❌ 不使用
- **308 Permanent Redirect** - 永久重定向 ✅ Next.js默认使用

### SEO最佳实践

1. ✅ 使用301/308永久重定向
2. ✅ 避免重定向链 (A→B→C)
3. ✅ 尽快更新sitemap.xml
4. ✅ 在Google Search Console提交URL变更

---

**维护者**: Claude Code
**最后更新**: 2026-03-20
**下次审查**: 完成Batch 3后
