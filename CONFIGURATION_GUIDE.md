# Admin Panel 配置完整指南

## 📋 目录

1. [本地开发环境配置](#1-本地开发环境配置)
2. [GitHub 配置](#2-github-配置)
3. [Google Search Console API 配置](#3-google-search-console-api-配置)
4. [Vercel 配置](#4-vercel-配置)
5. [验证配置](#5-验证配置)
6. [常见问题](#6-常见问题)

---

## 1. 本地开发环境配置

### 步骤 1.1：创建 .env 文件

```bash
# 在项目根目录执行
cd /Users/hulksi/Desktop/IOS_APPS/bpcareai-site
cp .env.example .env
```

### 步骤 1.2：生成 NEXTAUTH_SECRET

```bash
# 方法 1：使用 OpenSSL（推荐）
openssl rand -base64 32

# 方法 2：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3：在线生成
# 访问 https://generate-secret.vercel.app/32
```

**示例输出**：
```
K7J9mXvN2pQwRtYuI8oLkMnBvCxZaS1dFgHjKl3PoI=
```

复制这个值，稍后会用到。

### 步骤 1.3：编辑 .env 文件

使用任何文本编辑器打开 `.env` 文件：

```bash
# 使用 VS Code
code .env

# 或使用 vim
vim .env

# 或使用 nano
nano .env
```

填写以下内容：

```bash
# ==================== 必需配置（立即需要） ====================

# Qwen API Key（已有）
QWEN_API_KEY=sk-xxxxxxxxxxxxx  # 保持原值不变

# Admin 认证
ADMIN_USERNAME=XGenLab
ADMIN_PASSWORD=Shx9484007!

# NextAuth.js
NEXTAUTH_SECRET=K7J9mXvN2pQwRtYuI8oLkMnBvCxZaS1dFgHjKl3PoI=  # 粘贴刚才生成的值
NEXTAUTH_URL=http://localhost:3000  # 本地开发环境

# ==================== 可选配置（Phase 2-4 需要） ====================

# GitHub API（先留空，稍后配置）
GITHUB_TOKEN=

# Google Search Console API（先留空，Phase 4 需要）
GOOGLE_SERVICE_ACCOUNT_KEY=
GSC_SITE_URL=https://bpcareai.com
```

**保存文件**（VS Code: Cmd+S，vim: `:wq`，nano: Ctrl+O 然后 Enter，Ctrl+X）

### 步骤 1.4：验证 .env 文件

```bash
# 检查文件是否存在
ls -la .env

# 查看文件内容（确认配置正确）
cat .env | grep -E "ADMIN_|NEXTAUTH_"

# 应该看到类似输出：
# ADMIN_USERNAME=XGenLab
# ADMIN_PASSWORD=Shx9484007!
# NEXTAUTH_SECRET=K7J9mXvN2pQwRtYuI8oLkMnBvCxZaS1dFgHjKl3PoI=
# NEXTAUTH_URL=http://localhost:3000
```

### 步骤 1.5：确认 .env 在 .gitignore 中

```bash
# 检查 .gitignore
cat .gitignore | grep .env

# 应该看到：
# .env
# .env.local
# .env*.local
```

**⚠️ 重要**：如果没有看到 `.env`，立即添加：

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 步骤 1.6：构建和启动

```bash
# 先构建验证没有错误
npm run build

# 启动开发服务器
npm run dev
```

**期望输出**：
```
  ▲ Next.js 14.2.15
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### 步骤 1.7：测试登录

1. 打开浏览器访问：`http://localhost:3000/admin`
2. 应该自动跳转到：`http://localhost:3000/auth/signin`
3. 输入凭证：
   - 用户名：`XGenLab`
   - 密码：`Shx9484007!`
4. 点击 "Sign In"
5. 登录成功后应该看到 Dashboard 页面

**✅ 如果看到 Dashboard，本地配置成功！**

---

## 2. GitHub 配置

### 为什么需要 GitHub Token？

Admin Panel 需要通过 GitHub API 修改配置文件（如添加 topic、修改调度配置）。由于 Vercel 是只读文件系统，我们通过 GitHub API 提交更改，然后触发自动部署。

### 步骤 2.1：创建 GitHub Personal Access Token

#### 2.1.1 访问 GitHub Token 设置页面

访问：https://github.com/settings/tokens

或者：
1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单滚动到底部 → **Developer settings**
4. 左侧菜单 → **Personal access tokens** → **Tokens (classic)**

#### 2.1.2 生成新 Token

1. 点击 **"Generate new token"** → **"Generate new token (classic)"**
2. 填写表单：

   **Note（备注）**：
   ```
   BPCare AI Admin Panel - Config Management
   ```

   **Expiration（过期时间）**：
   - 选择 **No expiration**（不过期）
   - 或选择 **90 days**（90 天），到期前需要重新生成

   **Select scopes（权限范围）**：
   - ✅ **repo**（勾选整个 repo 部分）
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events

   **⚠️ 重要**：必须勾选 `repo` 及其所有子项！

3. 滚动到页面底部，点击绿色按钮 **"Generate token"**

#### 2.1.3 复制 Token

**⚠️ 非常重要**：Token 只会显示一次！

1. 页面会显示类似这样的 Token：
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **立即复制 Token**（点击复制图标或手动复制）

3. **妥善保存**：
   - 粘贴到安全的地方（如密码管理器）
   - 或者立即添加到 `.env` 文件（下一步）

**如果不小心关闭页面没有复制**：
- Token 将永久无法查看
- 需要删除该 Token 并重新生成

### 步骤 2.2：将 Token 添加到本地 .env

```bash
# 编辑 .env 文件
code .env  # 或使用 vim/nano
```

找到 `GITHUB_TOKEN=` 这行，粘贴 Token：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

保存文件。

### 步骤 2.3：验证 Token 有效性

```bash
# 替换为你的实际 Token 测试
curl -H "Authorization: token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  https://api.github.com/user

# 应该返回你的 GitHub 用户信息（JSON 格式）
# {
#   "login": "your-username",
#   "id": 123456,
#   ...
# }
```

如果返回错误 `401 Unauthorized`，说明 Token 无效，需要重新生成。

### 步骤 2.4：检查 Rate Limit

```bash
# 替换为你的实际 Token
curl -H "Authorization: token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  https://api.github.com/rate_limit

# 应该看到：
# {
#   "resources": {
#     "core": {
#       "limit": 5000,
#       "remaining": 5000,
#       ...
#     }
#   }
# }
```

**limit: 5000** 表示每小时可以调用 5000 次（足够使用）。

---

## 3. Google Search Console API 配置

**⚠️ 注意**：此配置仅在实施 **Phase 4（SEO Analytics）** 时需要。Phase 1-3 可以跳过此步骤。

如果您想提前配置，请按照以下步骤操作：

### 步骤 3.1：创建 Google Cloud Project

#### 3.1.1 访问 Google Cloud Console

访问：https://console.cloud.google.com/

如果是首次使用，需要：
1. 同意服务条款
2. 选择国家/地区
3. 点击"同意并继续"

#### 3.1.2 创建新项目

1. 点击顶部项目选择器（显示"选择项目"或当前项目名称）
2. 点击 **"新建项目"**
3. 填写项目信息：
   - **项目名称**：`BPCare AI SEO Analytics`
   - **组织**：无组织（或选择您的组织）
   - **位置**：无组织（保持默认）
4. 点击 **"创建"**
5. 等待项目创建完成（约 10-30 秒）
6. 点击 **"选择项目"** 切换到新项目

### 步骤 3.2：启用 Search Console API

#### 3.2.1 访问 API 库

1. 在 Google Cloud Console 中
2. 左侧菜单 → **API 和服务** → **库**
3. 或直接访问：https://console.cloud.google.com/apis/library

#### 3.2.2 搜索并启用 API

1. 在搜索框输入：`Search Console`
2. 点击 **"Google Search Console API"**
3. 点击蓝色按钮 **"启用"**
4. 等待启用完成（约 5-10 秒）

### 步骤 3.3：创建 Service Account

#### 3.3.1 访问凭据页面

1. 左侧菜单 → **API 和服务** → **凭据**
2. 或访问：https://console.cloud.google.com/apis/credentials

#### 3.3.2 创建 Service Account

1. 点击顶部 **"+ 创建凭据"** → **"服务账号"**
2. 填写服务账号详细信息：
   - **服务账号名称**：`bpcareai-gsc-reader`
   - **服务账号 ID**：自动生成（如 `bpcareai-gsc-reader`）
   - **服务账号说明**：`Read-only access to GSC data for BPCare AI admin panel`
3. 点击 **"创建并继续"**
4. **授予此服务账号对项目的访问权限**：
   - 跳过此步骤（不需要分配角色）
   - 点击 **"继续"**
5. **向用户授予访问此服务账号的权限**：
   - 跳过此步骤
   - 点击 **"完成"**

#### 3.3.3 创建密钥

1. 在凭据页面，找到刚创建的服务账号
2. 点击服务账号邮箱（如 `bpcareai-gsc-reader@xxx.iam.gserviceaccount.com`）
3. 切换到 **"密钥"** 标签
4. 点击 **"添加密钥"** → **"创建新密钥"**
5. 选择密钥类型：**JSON**
6. 点击 **"创建"**
7. JSON 密钥文件会自动下载到您的电脑（如 `bpcareai-xxx-xxxxx.json`）

**⚠️ 重要**：
- 这个 JSON 文件包含敏感信息，妥善保管
- 不要提交到 Git
- 不要分享给他人

#### 3.3.4 复制 Service Account 邮箱

在服务账号详情页面，复制邮箱地址：
```
bpcareai-gsc-reader@bpcareai-xxx.iam.gserviceaccount.com
```

**保存此邮箱**，下一步需要用到。

### 步骤 3.4：在 Google Search Console 中添加用户

**⚠️ 关键步骤**：如果跳过此步骤，API 调用会返回 403 错误！

#### 3.4.1 访问 Google Search Console

访问：https://search.google.com/search-console

确保已登录您的 Google 账号（bpcareai.com 的所有者）。

#### 3.4.2 选择资源

1. 在左上角选择资源：**https://bpcareai.com**
2. 如果没有此资源，需要先验证网站所有权

#### 3.4.3 添加用户

1. 左侧菜单 → **设置**（齿轮图标）
2. 点击 **"用户和权限"**
3. 点击右上角 **"添加用户"**
4. 填写信息：
   - **电子邮件地址**：粘贴刚才复制的 Service Account 邮箱
     ```
     bpcareai-gsc-reader@bpcareai-xxx.iam.gserviceaccount.com
     ```
   - **权限级别**：选择 **"受限"**（只读权限即可）
5. 点击 **"添加"**

**验证**：
- 用户列表中应该出现该 Service Account
- 权限显示为"受限"

### 步骤 3.5：配置环境变量

#### 3.5.1 读取 JSON 密钥文件

```bash
# 查看下载的 JSON 文件位置（通常在 Downloads 文件夹）
ls ~/Downloads/*.json

# 读取文件内容
cat ~/Downloads/bpcareai-xxx-xxxxx.json
```

**输出示例**：
```json
{
  "type": "service_account",
  "project_id": "bpcareai-xxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "bpcareai-gsc-reader@bpcareai-xxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

#### 3.5.2 复制 JSON 内容到 .env

**方法 1：使用命令行（推荐）**

```bash
# 将 JSON 压缩为单行并复制到剪贴板（Mac）
cat ~/Downloads/bpcareai-xxx-xxxxx.json | jq -c . | pbcopy

# Linux 用户使用 xclip
cat ~/Downloads/bpcareai-xxx-xxxxx.json | jq -c . | xclip -selection clipboard
```

然后编辑 `.env`：
```bash
code .env
```

找到 `GOOGLE_SERVICE_ACCOUNT_KEY=`，粘贴：
```bash
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"bpcareai-xxx",...}
```

**方法 2：手动复制**

1. 打开 JSON 文件
2. 复制整个 JSON 内容
3. **删除所有换行符**，变成单行
4. 粘贴到 `.env` 文件的 `GOOGLE_SERVICE_ACCOUNT_KEY=` 后面

**⚠️ 重要**：
- JSON 必须是单行（没有换行符）
- 不要有多余的空格
- 确保 JSON 格式正确（用 https://jsonlint.com/ 验证）

#### 3.5.3 验证配置

```bash
# 检查环境变量是否设置
node -e "console.log(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}').client_email)"

# 应该输出 Service Account 邮箱
# bpcareai-gsc-reader@bpcareai-xxx.iam.gserviceaccount.com
```

---

## 4. Vercel 配置

### 步骤 4.1：访问 Vercel 项目设置

1. 登录 Vercel：https://vercel.com
2. 选择项目：**bpcareai-site**
3. 点击顶部 **Settings** 标签
4. 左侧菜单点击 **Environment Variables**

或直接访问：
```
https://vercel.com/[your-team]/bpcareai-site/settings/environment-variables
```

### 步骤 4.2：添加环境变量

为每个环境变量执行以下步骤：

#### 必需变量（Phase 1）

**1. ADMIN_USERNAME**
- Key: `ADMIN_USERNAME`
- Value: `XGenLab`
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

**2. ADMIN_PASSWORD**
- Key: `ADMIN_PASSWORD`
- Value: `Shx9484007!`
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

**3. NEXTAUTH_SECRET**
- Key: `NEXTAUTH_SECRET`
- Value: `<粘贴本地生成的 secret>`（如 `K7J9mXvN2pQwRtYuI8oLkMnBvCxZaS1dFgHjKl3PoI=`）
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

**4. NEXTAUTH_URL**
- Key: `NEXTAUTH_URL`
- Value:
  - Production: `https://bpcareai.com`
  - Preview/Development: 可以留空或设置为 `https://bpcareai.com`
- Environments: 勾选 ✅ Production
- 点击 **Save**

#### 可选变量（Phase 2-3）

**5. GITHUB_TOKEN**
- Key: `GITHUB_TOKEN`
- Value: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

#### 可选变量（Phase 4）

**6. GOOGLE_SERVICE_ACCOUNT_KEY**
- Key: `GOOGLE_SERVICE_ACCOUNT_KEY`
- Value: `{"type":"service_account",...}`（整个 JSON 单行）
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

**7. GSC_SITE_URL**
- Key: `GSC_SITE_URL`
- Value: `https://bpcareai.com`
- Environments: 勾选 ✅ Production、✅ Preview、✅ Development
- 点击 **Save**

### 步骤 4.3：验证环境变量

在 Vercel Environment Variables 页面，应该看到：

**Phase 1（必需）**：
- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL
- ✅ QWEN_API_KEY（已有）

**Phase 2-3（可选）**：
- GITHUB_TOKEN

**Phase 4（可选）**：
- GOOGLE_SERVICE_ACCOUNT_KEY
- GSC_SITE_URL

### 步骤 4.4：重新部署

**⚠️ 重要**：添加环境变量后必须重新部署！

#### 方法 1：通过 Git Push 触发部署（推荐）

```bash
# 提交并推送代码
git add .
git commit -m "chore: trigger redeploy for env vars"
git push origin main
```

#### 方法 2：通过 Vercel Dashboard 手动部署

1. 在 Vercel 项目页面
2. 点击顶部 **Deployments** 标签
3. 找到最新的部署
4. 点击右侧三个点 **"..."** → **"Redeploy"**
5. 勾选 **"Use existing Build Cache"**（可选）
6. 点击 **"Redeploy"**

### 步骤 4.5：等待部署完成

1. 在 Vercel Deployments 页面
2. 等待 "Building" → "Deploying" → "Ready"（约 1-2 分钟）
3. 部署完成后，状态显示绿色 ✅

---

## 5. 验证配置

### 5.1 本地验证

```bash
# 构建项目
npm run build

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000/admin
```

**测试步骤**：
1. ✅ 自动跳转到登录页
2. ✅ 输入用户名 `XGenLab` 和密码 `Shx9484007!`
3. ✅ 登录成功后看到 Dashboard
4. ✅ Dashboard 显示统计数据（文章数、Topics 数等）
5. ✅ 侧边栏导航可见
6. ✅ 点击 "Sign Out" 可以退出登录

### 5.2 生产环境验证

```bash
# 访问生产环境
# https://bpcareai.com/admin
```

**测试步骤**：
1. ✅ 自动跳转到 `https://bpcareai.com/auth/signin`
2. ✅ 输入凭证登录
3. ✅ 登录成功后看到 Dashboard
4. ✅ 数据显示正常

---

## 6. 常见问题

### Q1: 本地登录后出现 "Callback URL mismatch"

**原因**：`NEXTAUTH_URL` 配置不正确。

**解决方案**：
```bash
# 确保本地 .env 中：
NEXTAUTH_URL=http://localhost:3000

# 不要有多余的斜杠
# ❌ NEXTAUTH_URL=http://localhost:3000/
# ✅ NEXTAUTH_URL=http://localhost:3000
```

重启开发服务器。

### Q2: Vercel 部署后登录失败，显示 "Configuration Error"

**原因**：环境变量未正确设置。

**解决方案**：
1. 检查 Vercel 环境变量中是否有 `NEXTAUTH_SECRET`
2. 检查 `NEXTAUTH_URL` 是否为 `https://bpcareai.com`
3. 重新部署

### Q3: npm run build 失败

**可能原因**：
1. TypeScript 类型错误
2. 环境变量未设置
3. 依赖缺失

**解决方案**：
```bash
# 检查错误信息
npm run build

# 如果是类型错误，修复代码
# 如果是依赖问题：
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Q4: GitHub API 返回 403 或 401 错误

**原因**：Token 无效或权限不足。

**解决方案**：
```bash
# 测试 Token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# 如果返回 401，Token 无效，需要重新生成
# 如果返回 403，检查 Token 是否有 repo 权限
```

### Q5: GSC API 返回 403 "User does not have sufficient permission"

**原因**：Service Account 未在 GSC 中添加为用户。

**解决方案**：
1. 访问 https://search.google.com/search-console
2. 设置 → 用户和权限
3. 确认 Service Account 邮箱已添加
4. 权限至少为"受限"

---

## 📝 配置检查清单

### 本地开发

- [ ] `.env` 文件已创建
- [ ] `ADMIN_USERNAME` = `XGenLab`
- [ ] `ADMIN_PASSWORD` = `Shx9484007!`
- [ ] `NEXTAUTH_SECRET` 已生成（32 字节 base64）
- [ ] `NEXTAUTH_URL` = `http://localhost:3000`
- [ ] `.env` 在 `.gitignore` 中
- [ ] `npm run build` 成功
- [ ] `npm run dev` 启动成功
- [ ] 可以访问 `http://localhost:3000/admin`
- [ ] 可以成功登录

### Vercel 生产环境

- [ ] 所有环境变量已在 Vercel 中添加
- [ ] `NEXTAUTH_URL` = `https://bpcareai.com`
- [ ] 重新部署已完成
- [ ] 可以访问 `https://bpcareai.com/admin`
- [ ] 可以成功登录
- [ ] Dashboard 数据显示正常

### GitHub API（Phase 2-3）

- [ ] GitHub Personal Access Token 已创建
- [ ] Token 有 `repo` 权限
- [ ] `GITHUB_TOKEN` 已添加到本地 `.env`
- [ ] `GITHUB_TOKEN` 已添加到 Vercel
- [ ] Token 有效性已验证

### GSC API（Phase 4）

- [ ] Google Cloud Project 已创建
- [ ] Search Console API 已启用
- [ ] Service Account 已创建
- [ ] Service Account JSON 密钥已下载
- [ ] Service Account 已在 GSC 中添加为用户
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` 已添加到本地 `.env`
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` 已添加到 Vercel
- [ ] `GSC_SITE_URL` = `https://bpcareai.com`

---

## 🚀 下一步

完成所有配置后：

1. **验证 Phase 1**：确保登录和 Dashboard 正常工作
2. **开始 Phase 2**：实现内容管理模块
3. **Phase 3**：实现任务调度模块
4. **Phase 4**：集成 GSC Analytics

如有任何问题，请参考常见问题部分或查看错误日志。
