# BPCare AI Admin Panel - Setup Guide

## 📋 概述

SEO 管理后台允许您：
- 管理已发布文章和待生成文章
- 添加/删除 Topics（包括 AI 自然语言提取）
- 配置和监控自动化任务
- 查看 GSC SEO 数据分析
- 通过 GitHub API 修改配置文件

## 🚀 Phase 1 完成情况

✅ **已完成功能**：
- NextAuth.js 认证系统
- 登录页面 (`/auth/signin`)
- Admin 布局（侧边栏导航）
- Middleware 路由守卫
- GitHub API 客户端封装
- GSC API 客户端封装
- 基础 Dashboard 页面

## 🔐 环境变量配置

### 1. 必需的环境变量

复制 `.env.example` 到 `.env` 并填写以下值：

#### Admin 认证
\`\`\`bash
ADMIN_USERNAME=XGenLab
ADMIN_PASSWORD=Shx9484007!
\`\`\`

#### NextAuth.js
\`\`\`bash
# 生成密钥: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=https://bpcareai.com
\`\`\`

#### GitHub API（用于修改配置文件）
\`\`\`bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
\`\`\`

**获取步骤**：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限（Full control of private repositories）
4. 生成并复制 token

#### Google Search Console API（Phase 4 需要）
\`\`\`bash
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GSC_SITE_URL=https://bpcareai.com
\`\`\`

**获取步骤**（Phase 4 实施时需要）：
1. 访问 https://console.cloud.google.com/
2. 创建项目
3. 启用 "Search Console API"
4. 创建 Service Account
5. 下载 JSON 凭证文件
6. 将 JSON 内容作为字符串填入环境变量
7. **重要**：在 Google Search Console 中添加 Service Account 邮箱为用户

### 2. Vercel 环境变量配置

在 Vercel 项目设置中添加所有环境变量：

1. 访问 https://vercel.com/your-team/bpcareai-site/settings/environment-variables
2. 添加所有上述环境变量
3. 选择 Environment: Production, Preview, Development
4. 保存

## 📱 使用指南

### 访问 Admin Panel

1. **本地开发**：
   \`\`\`bash
   npm run dev
   # 访问 http://localhost:3000/admin
   \`\`\`

2. **生产环境**：
   \`\`\`
   访问 https://bpcareai.com/admin
   \`\`\`

3. **登录凭证**：
   - 用户名：`XGenLab`
   - 密码：`Shx9484007!`

### 页面路由

| 路由 | 功能 | 状态 |
|------|------|------|
| `/admin` | Dashboard 首页 | ✅ 完成 |
| `/admin/articles` | 已发布文章管理 | ⏳ Phase 2 |
| `/admin/topics` | Topics 管理 | ⏳ Phase 2 |
| `/admin/topics/planned` | 待生成文章 | ⏳ Phase 2 |
| `/admin/tasks` | 任务调度配置 | ⏳ Phase 3 |
| `/admin/tasks/history` | 任务执行历史 | ⏳ Phase 3 |
| `/admin/seo` | SEO Analytics | ⏳ Phase 4 |
| `/admin/settings` | 设置 | ⏳ Phase 5 |

## 🏗️ 技术架构

### 认证流程

\`\`\`
用户访问 /admin
    ↓
Middleware 检查登录状态
    ↓
未登录 → 重定向到 /auth/signin
    ↓
登录成功 → 跳转到 /admin
\`\`\`

### 配置修改流程

\`\`\`
Admin Panel UI
    ↓
调用 API Route
    ↓
GitHub API 提交更改
    ↓
触发 Vercel 部署（30-60秒）
    ↓
配置生效
\`\`\`

## ⚠️ 重要注意事项

### 1. 配置修改延迟

通过 Admin Panel 修改配置后：
- 更改会通过 GitHub API 提交到仓库
- Vercel 自动检测并重新部署
- **需要等待 30-60 秒才能生效**
- UI 会显示"配置已提交，预计 1 分钟后生效"

### 2. 安全性

- **绝不在代码中硬编码密码**（已使用环境变量）
- `.env` 文件已在 `.gitignore` 中（不会提交到 Git）
- Admin 路由不会被搜索引擎索引（`robots: { index: false }`）
- 官网中没有 Admin Panel 的入口链接

### 3. GitHub API Rate Limit

- Personal Access Token: 5000 次/小时
- 每次配置修改消耗 2-3 次 API 调用
- 批量操作使用 `batchUpdateFiles()` 更高效

## 📊 已安装的依赖包

\`\`\`json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.30",
    "@octokit/rest": "^22.0.1",
    "@googleapis/searchconsole": "^5.0.0",
    "@tanstack/react-table": "^8.21.3",
    "recharts": "^3.5.0",
    "lucide-react": "^0.555.0",
    "react-hook-form": "^7.66.1",
    "zod": "^4.1.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  }
}
\`\`\`

## 🔄 下一步（Phase 2）

Phase 2 将实现：
- ✅ 已发布文章管理页面
- ✅ 待生成文章管理页面
- ✅ Topics CRUD 功能
- ✅ AI Topic 提取集成

预计时间：8-10 小时

## 🐛 故障排查

### 登录失败

1. 检查环境变量是否正确设置
   \`\`\`bash
   # 本地开发
   cat .env | grep ADMIN

   # Vercel
   访问项目设置检查环境变量
   \`\`\`

2. 确认 `NEXTAUTH_SECRET` 已设置
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

### GitHub API 403 错误

1. 检查 `GITHUB_TOKEN` 是否有效
2. 确认 Token 有 `repo` 权限
3. 检查 Rate Limit：
   \`\`\`bash
   curl -H "Authorization: token $GITHUB_TOKEN" \\
     https://api.github.com/rate_limit
   \`\`\`

### Middleware 循环重定向

如果遇到无限重定向：
1. 清除浏览器缓存和 Cookies
2. 检查 `middleware.ts` 的 `matcher` 配置
3. 确认 NextAuth 配置正确

## 📝 开发日志

- **2025-01-27**: Phase 1 完成
  - ✅ 基础架构搭建
  - ✅ 认证系统
  - ✅ Admin 布局
  - ✅ API 客户端封装
  - ✅ Dashboard 页面
