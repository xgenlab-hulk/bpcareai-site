# 外联联系人名单（AAA / 老年机构 / 图书馆）

> 配套邮件模板见 [OUTREACH-AAA-TEMPLATE.md](./OUTREACH-AAA-TEMPLATE.md)
> 收集日期：2026-08-14 · **45 家机构，24 家可直接发邮件**
> 每条附来源 URL，发信前请点开核对（机构邮箱会变）

## 这份名单怎么来的（决定它能不能信）

- ✅ 只收录**机构官网上以纯文本公示的邮箱**
- ❌ **绝不从人名推导邮箱**（不会由 "Jane Smith" 造出 `jsmith@`）
- ❌ 第三方目录里有、但官网查不到的，一律不收
- 🔒 被 Cloudflare/JS 混淆的邮箱，记为「仅表单」，不猜

**✔️ = 我本人二次抓取核验过**（不只信收集方报告，共核 23 条）。

> ⚠️ **踩过的坑**：裸 curl 抓取会让真实邮箱误判为"页面上没有"。
> 换带浏览器 User-Agent 重抓后全部找到。**你手动打开若没看到邮箱，多刷一次或换浏览器。**

**优先级定义**：
- **HIGH** = 资源页确有指向**第三方网站**的外链（社交/字体/CDN 不算）
- **MEDIUM** = 有资源页，但外链未确认
- **LOW** = 无对外资源页

---

## 🔥 第一批：只发这 12 封（HIGH + 有邮箱）

这批**已经在链接外部资源** —— 你的请求符合它们的既有习惯，成功率最高。

| # | 机构 | 州 | 邮箱 | 已核到的外链 |
|---|---|---|---|---|
| 1 | **Northwest Florida AAA** | FL 彭萨科拉 | `info@nwflaaa.org` ✔️ | `uwwf.org/211`、`ncea.acl.gov` |
| 2 | **AAA of Pasco-Pinellas** | FL 圣彼得堡 | `adrc.helpline@aaapp.org` ✔️ | `navigateresources.net`、`floridahealthfinder.gov` |
| 3 | **Senior Resource Alliance** | FL 奥兰多 | `info@sraflorida.org` ✔️ | `nia.nih.gov`、`fns.usda.gov`、`diabetes.org` |
| 4 | **AAA District 7** | OH | `info@aaa7.org` ✔️ | `consumer.ftc.gov`、`eldercare.acl.gov` |
| 5 | **Buckeye Hills (AAA8)** | OH | `info@buckeyehills.org` ✔️ | 外部服务商链接 |
| 6 | **Senior Resources of West MI** | MI 马斯基根 | `ContactOptions@seniorresourceswmi.org` ✔️ | `alz.org`、`michigan.gov`、`MSU Extension` |
| 7 | **AAA of Northwest Michigan** | MI 特拉弗斯城 | `info@aaanm.org` ✔️ | `alz.org`、`aarp.org`、`ncoa.org`、`medlineplus.gov` |
| 8 | **Valley Area Agency on Aging** | MI 弗林特 | `info@valleyaaa.org` ✔️ | 州级/全国资源外链 |
| 9 | **Alamo AAA (AACOG)** | TX 圣安东尼奥 | `asc@aacog.gov` ✔️ | `acl.gov`、`medicare.gov`、`benefitscheckup.org` |
| 10 | **Delaware County COSA** | PA | `COSA@co.delaware.pa.us` ✔️ | 社区资源外链 |
| 11 | **Allegheny County SeniorLine** | PA 匹兹堡 | `SeniorLine@alleghenycounty.us` ✔️ | `pa211sw.org`、PA Care Kit |
| 12 | **Miami-Dade Public Library** | FL 迈阿密 | `customercare@mdpls.org` ✔️ | `agefriendlymiami.org`、`card.miami.edu` |

第 12 家是图书馆，用**模板 B**。另有 **Detroit Public Library** `ask-a-librarian@detroitpubliclibrary.org` ✔️（健康主题页外链 MedlinePlus）也属 HIGH，可一并发。

---

## 📩 第二批（有邮箱，MEDIUM，第一批有回应再发）

| 机构 | 州/地区 | 邮箱 |
|---|---|---|
| Senior Connection Center (PSA 6) | FL 坦帕 | `Info@SCCmail.org` ✔️ |
| AAA Region One | AZ 凤凰城 | `info@aaaphx.org` ✔️ |
| Central Arizona Aging | AZ 卡萨格兰德 | `info@pgcsc.org` |
| Lancaster County Office of Aging | PA | `aging@co.lancaster.pa.us` ✔️ |
| Harris County AAA（休斯顿卫生局）| TX | `aging@houstontx.gov` ✔️ |
| Dallas AAA | TX | `impact@ccadvance.org` ✔️ |
| Tarrant County ADRC | TX 沃思堡 | `info@tarrantcountyadrc.org` ✔️ |
| NCTCOG AAA | TX 阿灵顿 | `sross@nctcog.org`（Sheryl Ross, **Outreach Specialist**）✔️ |
| AAA Region 9 | OH 剑桥 | `kjdennis@aaa9.org` |

⚠️ 最后两条是**具名员工邮箱**。发给个人务必个性化，别当群发地址。

> **Harris County 已从 HIGH 降级** —— 我核了它的资源页，外链只有 Google 字体和社交媒体，不符合 HIGH 标准。

### ⚠️ 两条需你手动确认

| 机构 | 邮箱 | 问题 |
|---|---|---|
| Cumberland County Aging | PA | `aging@cumberlandcountypa.gov` | **我和收集方各自复查都没在官网找到**，已降级为未验证。**发前务必自己打开确认** |
| AAA of the Capital Area (CAPCOG) | TX 奥斯汀 | `pbordie@capcog.org`（Patricia Bordie, AAA 主任）✔️ | 邮箱本身核验通过，**但来源是州级协会页面而非机构官网**（官网 TLS 错误 + 403）。可用，但知道这个出处差异 |

---

## 📝 仅联系表单（成本高 —— 手填耗时是发邮件 3-5 倍）

**建议：除非第一批已跑通，否则跳过整批。**

唯一例外是 **Tri-County Office on Aging (MI 兰辛)** —— 它的资源目录有个 **"Print and Share"** 版块，和"可打印表格"的契合度异常地高，值得单独填一次：
[表单](https://www.tcoa.org/contact-us/)

其余 HIGH 但只有表单的：
| 机构 | 州 | 表单 |
|---|---|---|
| Area Office on Aging of NW Ohio | OH 托莱多 | [表单](https://www.areaofficeonaging.com/contact) |
| ElderSource (PSA 4) | FL 杰克逊维尔 | [表单](https://myeldersource.org/contact-us/) |
| AAA Palm Beach/Treasure Coast (PSA 9) | FL | [表单](https://www.aaapbtc.org/contact-us/) |
| Chester County Aging | PA | [官网](https://www.chesco.org/aging) |
| Montgomery County Aging | PA | [官网](https://www.montgomerycountypa.gov/departments/health-human-services/office-aging-services) |
| COAAA | OH 哥伦布 | [表单](https://www.coaaa.org/connect/contact-us/) |
| SEAGO AAA | AZ | [表单](https://form.jotform.com/61228394662157) |
| WACOG AAA | AZ | 电话 1-800-782-1886 |
| AAA for Southwest FL | FL | 热线 866-413-5337 |

MEDIUM/LOW 表单：Houston-Galveston (TX)、Bucks County (PA)、Council on Aging SW Ohio、Ohio District 5、Pima Council on Aging (AZ)、AgeWays (MI)、NEMCSA Region 9 (MI)、Houston Public Library、NCOA。

> **COAAA 特别说明**：它官网公示了 11 个员工邮箱，但**全是高管/IT/媒体**，没有一个是信息转介或对外咨询岗 —— 按规则不采用，走表单。

---

## ❌ 未能核实（别瞎发）

抓取被机器人防护挡住，**不代表没有联系方式** —— 你手动打开多半能看到：

- **FL**：Elder Options (PSA 3)、Alliance for Aging 迈阿密
- **AZ**：NACOG（6 次拒绝连接）
- **PA**：Philadelphia PCA、Berks、Lehigh、Northampton、Westmoreland、York
- **MI**：AAA of Western Michigan、Region VII 贝城
- **图书馆**：哥伦布、费城、匹兹堡、克利夫兰、凤凰城、圣安东尼奥（8 家只成功 3 家）

⚠️ 搜索快照里出现过 `aaadir@nacog.org`、`aging@countyofberks.com`、`agingandadult@lehighcounty.org`、`aaainfo@aaawm.org`、`aging@nemcsa.org` —— **官网都没验证到，不要用**。

---

## 📊 实话实说

| 项 | 数字 |
|---|---|
| 总计 | **45 家**（FL 8 · AZ 6 · PA 7 · OH 7 · MI 6 · TX 7 · 图书馆/全国 4） |
| **可直接发邮件** | **24 家（53%）** |
| 仅表单 | 17 家（38%） |
| 无验证 / 仅电话 | 4 家（9%） |
| 我亲自核验 | **23 条**（20 条确认存在 + 3 条确认「确实没有邮箱」） |

**两处收集方报错、被复核拦下**：
1. **Cumberland County** 报了个邮箱，两次独立复查都找不到 → 降级
2. **COAAA** 有 11 个员工邮箱，但无一符合"对外咨询岗"标准 → 改走表单

**主要失败原因是机器人防护,不是没有联系方式** —— PA 的县级站点、图书馆系统封锁最严重。

### 执行计划

1. **第 1 周** — 发第一批 **12-13 封**（HIGH + 有邮箱）
2. **有任何回应** → 继续发第二批 9 个邮箱
3. **全部零回应** → **停**，别碰那 17 个表单

**止损线：24 封邮件发完、等 3 周、零回应即止损。**
