# 发信邮箱配置指南（bpcareai.com）

> 目的：拿到 `hello@bpcareai.com` 的**发信**能力，用于外联那 81 个联系人。
> 所有数值均来自官方文档并已核实，附来源链接。**未核实的项已明确标注。**

---

## 为什么必须做这一步

**你的域名现在只能收，不能发。** 实测 DNS：

```
MX:     eforward1-5.registrar-servers.com   → Namecheap 转发服务，不能发信
SPF:    v=spf1 include:spf.efwd.registrar-servers.com ~all  → 只覆盖转发
DKIM:   无
DMARC:  无
```

域名注册于 **2025-11-20**（约 9 个月），**从未发过任何邮件** ——
所以对收件方而言这是一个「零发信历史」的域名。

---

## 方案对比（价格均已核实，除标注外）

| 方案 | 价格 | 适合你吗 |
|---|---|---|
| **Google Workspace Business Starter** | ⚠️ 美元价未核实（见下） | ✅ **推荐** |
| Microsoft 365 Business Basic | $7/用户/月（年付） | ✅ 同样可行 |
| iCloud+ 50GB | $0.99/月 | 🟡 能发信，但见下方风险 |
| Purelymail | $10/年 | 🟡 便宜，共享 IP 信誉未知 |
| Namecheap Private Email Starter | $14.88/年 | 🟡 你已是其客户 |
| ❌ Zoho | $0–4/用户/月 | **不可用**：使用政策明文禁止外联类邮件 |
| ❌ Migadu | $19/年 | **不可用**：条款含最高 $500 罚则 |
| ❌ Cloudflare Email Routing | 免费 | **不可用**：只能收/转发，不能发 |

> ⚠️ **Google Workspace 的美元价我没能核实** —— 其定价页按访问者 IP 显示本地货币，
> 且价格由 JS 渲染，源码里取不到。**请你用美国网络自行打开
> [workspace.google.com/pricing](https://workspace.google.com/pricing.html) 确认。**
> 页面确认有 **14 天免费试用**、Business Starter **每用户 30GB**、年付比月付省 16%。

**为什么推荐 Google/Microsoft 而不是便宜的：**
你要发给 **21 个 `.gov` + 11 个 `.edu`**，这些机构跑 Proofpoint / Microsoft Defender
等最严格的过滤。廉价服务商共用出口 IP，容易被上游信誉拖累。
省下的钱，不值得拿 81 个逐条核验过的联系人去赌。

**为什么不推荐 iCloud+**（虽然你可能已在付费）：
Apple 官方确认它**能用自定义域名发信**，任何 iCloud+ 档位都支持，
「最多 5 个域名，每域名 3 个地址」，要求 Apple 账号开启双重认证。
但你**无法自定义 DKIM 选择器、无法灵活调整 DMARC 策略** ——
而你恰好是「零发信历史 + 收件方过滤最严」的组合，这时候能自控认证策略是有价值的。
（来源：[support.apple.com/en-us/102540](https://support.apple.com/en-us/102540)）

---

## Google Workspace 配置步骤

### 第 0 步：先别动 DNS

⚠️ **改 MX 会立刻切断你现有的 Namecheap 转发。**
先把 Workspace 账号建好、验证完域名，最后再切 MX。

### 第 1 步：注册并验证域名

1. 打开 [workspace.google.com](https://workspace.google.com) → 开始免费试用（14 天）
2. 填入域名 `bpcareai.com`
3. 建首个用户：建议 **`hello@bpcareai.com`**
4. Google 会给一条 **TXT 验证记录** → 加到 Namecheap（见第 2 步的操作位置）

### 第 2 步：在 Namecheap 加 DNS 记录

位置：**Domain List → 找到 bpcareai.com → Manage → Advanced DNS**

#### ① MX 记录

**先删除现有 5 条 `eforward1-5` 的 MX 记录**，然后新增一条：

| Type | Host | Value | Priority |
|---|---|---|---|
| MX Record | `@` | `smtp.google.com` | `1` |

> ✅ 已核实：Google 现行为**单条 MX**，值就是 `smtp.google.com`。
> 2023 年前开的老账号用的是 `aspmx...` 五条制，仍受支持但不是现在的标准做法。
> 生效最长需 **72 小时**。
> 来源：[Google MX 官方文档](https://knowledge.workspace.google.com/admin/domains/set-up-mx-records-for-google-workspace)

#### ② SPF 记录

🔴 **必须「编辑」现有那条，绝对不能新增第二条** ——
一个域名只允许有一条 SPF 记录，加第二条会让 SPF 直接失效。

找到现有的：
```
v=spf1 include:spf.efwd.registrar-servers.com ~all
```
改成：
```
v=spf1 include:_spf.google.com ~all
```

（`google-site-verification=...` 那条 TXT 是另一回事，保持不动）

#### ③ DKIM 记录

**必须先在 Google 后台生成**，密钥是按域名生成的，无法预先写好。

1. 进 [admin.google.com](https://admin.google.com)
2. 路径：**Menu → Apps → Google Workspace → Gmail → Authenticate email**
3. 选 **2048-bit**（Namecheap 支持）
4. 把生成的值加到 Namecheap：

| Type | Host | Value |
|---|---|---|
| TXT Record | `google._domainkey` | `v=DKIM1; k=rsa; p=<后台给你的长密钥>` |

5. 回到后台点 **Start authentication**

> ✅ 已核实：路径、2048/1024 位选项、`google._domainkey` 选择器、值以 `v=DKIM1` 开头。
> **生效最长 48 小时**；后台可能持续显示「You must update the DNS records」
> 达 48 小时 —— 官方说明：只要记录加对了，**可以忽略这个提示**。
> 来源：[Google DKIM 官方文档](https://knowledge.workspace.google.com/admin/security/set-up-dkim)

#### ④ DMARC 记录（你现在完全没有）

| Type | Host | Value |
|---|---|---|
| TXT Record | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@bpcareai.com; fo=1` |

🔴 **务必从 `p=none` 起步**（只监控、不拦截）。
一上来就 `quarantine`/`reject`，配置有任何闪失都会把自己的信拦掉。
跑顺一两周、确认报告正常后再考虑收紧。

**没有 DMARC 到底影响多大 —— 别被吓到也别忽视：**
Google / Microsoft 的**强制**要求针对「每天 5,000 封以上」的批量发信方，
你远低于门槛，**不会被自动拒收**。但无 DMARC 的域名可能被判定为可疑而进垃圾箱。
对你这 81 封发给安全意识极强的机构，这个软信号值得消除。

---

## 第 3 步：验证配置是否生效

加完记录**等 24–48 小时**，然后跑：

```bash
dig +short MX bpcareai.com
dig +short TXT bpcareai.com | grep spf
dig +short TXT google._domainkey.bpcareai.com
dig +short TXT _dmarc.bpcareai.com
```

**期望结果：**
- MX → `1 smtp.google.com.`
- SPF → `v=spf1 include:_spf.google.com ~all`（**只有一条**）
- DKIM → 一长串以 `v=DKIM1` 开头
- DMARC → `v=DMARC1; p=none; ...`

**再做一次真实投递测试**：用 [mail-tester.com](https://www.mail-tester.com)
发一封过去，目标是 **10/10 或 9/10**。低于 8 分先别开始外联。

---

## 第 4 步：发信前的预热

**9 个月零发信 = 确实算新发信域名**（信誉看的是发信历史，不是注册时长）。

**但 81 封分两周（约 6 封/天）本身就低于常规预热速率**（业界起步值约 15–20 封/天），
所以不需要专业预热工具 —— 那是给每天几百封准备的。

实操顺序：

1. DNS 配好后**等 24–48 小时**
2. 先给自己和朋友的 **Gmail / Outlook 发 10–20 封真人邮件，并让对方回复**
   —— 收到回复是最强的正面信誉信号
3. 前 3 天：每天 3–5 封
4. 之后：每天 8–10 封
5. **逐封单发，绝不用 BCC 或邮件合并**；措辞保持差异
6. 带真实签名和可用的回信地址

> 🔴 **最大的投递风险不是服务商，是退信。**
> `.gov`/`.edu` 的地址容易失效，新域名上高退信率比什么都伤信誉。
> **发每一封前，先打开该机构官网确认地址仍在。**

---

## 一个务实的折中方案

如果你不确定要不要为此付费：

1. **先用 iCloud+ 发 5 封测试**（你可能已在付费，边际成本为零）
2. 观察是否进收件箱、有无退信
3. **顺利就继续用；一旦发现进垃圾箱或被退，立刻换 Google Workspace**

这样最差情况只损失 5 个联系人，而不是 81 个。

---

## 未核实项汇总（诚实标注）

| 项 | 状态 |
|---|---|
| Google Workspace 美元价 | ❌ **未核实** —— 定价页按 IP 显示本地货币且 JS 渲染。请自行用美国网络确认 |
| iCloud+ 自定义域名的具体点击路径 | ❌ **未核实** —— Apple 页面 JS 渲染，抓不到分步说明。入口在 [icloud.com/settings](https://www.icloud.com/settings)，界面有向导 |
| Google MX / DKIM 配置细节 | ✅ 已核实（官方文档，链接见上） |
| iCloud+ 支持发信、档位、数量限制 | ✅ 已核实（Apple 官方文档） |
| Zoho / Migadu 政策禁止 | ✅ 已核实（其官方政策页原文） |
