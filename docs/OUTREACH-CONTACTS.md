# 外联联系人名单（AAA / 老年机构 / 图书馆）

> 配套邮件模板见 [OUTREACH-AAA-TEMPLATE.md](./OUTREACH-AAA-TEMPLATE.md)
> 收集日期：2026-08-14 · 每条附来源 URL，发信前请点开核对（机构邮箱会变）

## 这份名单怎么来的（决定它能不能信）

- ✅ 只收录**机构官网上以纯文本公示的邮箱**
- ❌ **绝不从人名推导邮箱**（不会由 "Jane Smith" 造出 `jsmith@`）
- ❌ 第三方目录里有、但官网查不到的，一律不收
- 🔒 被 Cloudflare/JS 混淆的邮箱，记为「仅表单」，不猜

**✔️ 标记 = 我本人二次抓取核验过**（不是只信收集方的报告）。

> ⚠️ **踩过的坑**：首轮用裸 curl 抓取时，3 个真实存在的邮箱被误判为"页面上没有"。
> 换带浏览器 User-Agent 重抓后全部找到。**你手动打开时若没看到邮箱，多刷一次或换浏览器。**

---

## 🔥 第一批就发这 6 家（HIGH + 有邮箱）

这批**官网确实在链接第三方资源** —— 说明它们有对外推荐资源的习惯，最可能接受。

| 机构 | 州 | 邮箱 | 来源 |
|---|---|---|---|
| **Harris County AAA**（休斯顿卫生局） | TX | `aging@houstontx.gov` ✔️ | [官网](https://www.houstonhealth.org/services/aging) |
| **Alamo AAA / AACOG** | TX | `asc@aacog.gov` | [官网](https://aacog.gov/who-we-serve/area-agencies-on-aging/) |
| **AAA District 7** | OH | `info@aaa7.org` | [资源页](https://www.aaa7.org/resources) |
| **Buckeye Hills (AAA8)** | OH | `info@buckeyehills.org` | [联系页](https://buckeyehills.org/about/contact-us/) |
| **Allegheny County SeniorLine** | PA 匹兹堡 | `SeniorLine@alleghenycounty.us` ✔️ | [官网](https://connect.alleghenycounty.us/older-adults/) |
| **Delaware County COSA** | PA | `COSA@co.delaware.pa.us` ✔️ | [联系页](https://www.delcopa.gov/cosa/contact-us) |

**我亲自核到的外链证据**（不是听收集方说的）：
- Houston → `hhs.texas.gov`、`ncea.acl.gov`、`txsac.org`
- AACOG → `acl.gov`、`medicare.gov`、`benefitscheckup.org`、`cms.gov`
- AAA7 → `consumer.ftc.gov`、`eldercare.acl.gov`、`proseniors.org`
- NW Ohio → `acl.gov`、`benefitscheckup.org`、`ssa.gov`

---

## 🟢 第二批（HIGH，密歇根 —— 外链已核验）

| 机构 | 地区 | 邮箱 | 我核到的外链 |
|---|---|---|---|
| **AAA of Northwest Michigan** | 特拉弗斯城 | `info@aaanm.org` | ✔️ `alz.org`、`aarp.org`、`medlineplus.gov`、`alzheimers.gov` |
| **Senior Resources of West Michigan** | 马斯基根 | `ContactOptions@seniorresourceswmi.org` ✔️ | ✔️ `alz.org`、`michigan.gov`、`safeseniors.info`、`canr.msu.edu` |
| **Valley Area Agency on Aging** | 弗林特 | `info@valleyaaa.org` ✔️ | 资源页疑似 JS 渲染，外链未直接核到 |

---

## 📩 第三批（有邮箱，MEDIUM）

### 佛罗里达
| 机构 | 地区 | 邮箱 | 来源 |
|---|---|---|---|
| Northwest Florida AAA (PSA 1) | 彭萨科拉 | `info@nwflaaa.org` | [联系页](https://nwflaaa.org/contact-us) |
| Senior Connection Center (PSA 6) | 坦帕 | `Info@SCCmail.org` ✔️ | [联系页](https://www.seniorconnectioncenter.org/contact-us/) |
| Senior Resource Alliance (PSA 7) | 奥兰多 | `info@sraflorida.org`、`communications@sraflorida.org` ✔️ | [联系页](https://seniorresourcealliance.org/contact/) |

### 德州
| 机构 | 地区 | 邮箱 | 来源 |
|---|---|---|---|
| Dallas AAA | 达拉斯 | `impact@ccadvance.org` | [官网](https://www.ccadvance.org/daaa) |
| Tarrant County ADRC | 沃思堡 | `info@tarrantcountyadrc.org` | [官网](https://www.unitedwaytarrant.org/aging-disability-resource-center) |
| North Central Texas AAA | 阿灵顿 | `sross@nctcog.org`（Sheryl Ross, Outreach Specialist）| [员工页](https://www.nctcog.org/aging-services/staff-contacts) |

### 亚利桑那 / 宾州 / 俄亥俄
| 机构 | 地区 | 邮箱 | 来源 |
|---|---|---|---|
| AAA Region One | AZ 凤凰城 | `info@aaaphx.org` ✔️ | [官网](https://aaaphx.org/) |
| Central Arizona Aging | AZ 卡萨格兰德 | `info@pgcsc.org` | [官网](https://www.caaging.org/) |
| Lancaster County Office of Aging | PA | `aging@co.lancaster.pa.us` | [县目录](https://co.lancaster.pa.us/Directory/Home/DepartmentListing?DID=32) |
| COAAA | OH 哥伦布 | `games@coaaa.org`（Grant Ames, 主任）| [资源页](https://www.coaaa.org/resources/aging-in-place/) |
| AAA Region 9 | OH 剑桥 | `kjdennis@aaa9.org` | [出版物页](https://aaa9.org/publications/) |

⚠️ 后 3 条是**具名员工邮箱**（机构公示的）。发给个人要更个性化，别当群发地址。

### ⚠️ 存疑一条
| Cumberland County Aging | PA 卡莱尔 | `aging@cumberlandcountypa.gov` | **我三次抓取都没在官网找到** —— 收集方说见过。**发之前务必自己打开确认** |

---

## 📝 仅联系表单（成本高，放最后 / 或直接跳过）

| 机构 | 州 | 表单 | 优先级 |
|---|---|---|---|
| Area Office on Aging of NW Ohio | OH 托莱多 | [表单](https://www.areaofficeonaging.com/contact) | **HIGH**（外链已核验，值得填） |
| Chester County Aging | PA | [官网](https://www.chesco.org/aging) | HIGH |
| Montgomery County Aging | PA | [官网](https://www.montgomerycountypa.gov/departments/health-human-services/office-aging-services) | HIGH |
| Tri-County Office on Aging | MI 兰辛 | [表单](https://www.tcoa.org/contact-us/) | HIGH |
| SEAGO AAA | AZ | [预约表单](https://form.jotform.com/61228394662157) | HIGH |
| AAA for Southwest FL | FL | 热线 866-413-5337 | HIGH |
| WACOG AAA | AZ | 电话 1-800-782-1886 | HIGH |
| Houston-Galveston AAA | TX | [表单](https://www.h-gac.com/contact/form) | MEDIUM |
| ElderSource | FL 杰克逊维尔 | [表单](https://myeldersource.org/contact-us/) | MEDIUM |
| AAA Pasco-Pinellas | FL | [表单](https://agingcarefl.org/contact/) | MEDIUM |
| AAA Palm Beach | FL | [表单](https://aaapbtc.org/contact-us/) | MEDIUM |
| AgeWays (AAA 1-B) | MI | [表单](https://www.ageways.org/contact-us/) | MEDIUM |
| Bucks County AAA | PA | [官网](https://www.buckscounty.gov/231/Aging) | MEDIUM |
| Council on Aging SW Ohio | OH 辛辛那提 | [表单](https://www.help4seniors.org/contact/general-message/) | MEDIUM |
| Ohio District 5 AAA | OH | 首页 Microsoft Forms | MEDIUM |
| Pima Council on Aging | AZ 图森 | [表单](https://pcoa.org/about-pcoa/contact-us/) | MEDIUM |
| Region 9 AAA (NEMCSA) | MI 阿尔皮纳 | [官网](https://www.nemcsa.org/services/senior-services/region-9-area-agency-on-aging.html) | LOW |

---

## 📚 图书馆 / 全国机构

| 机构 | 联系方式 | 来源 |
|---|---|---|
| **Detroit Public Library** 🔥HIGH | `ask-a-librarian@detroitpubliclibrary.org` | [Ask-a-Librarian](https://detroitpubliclibrary.org/research/ask-a-librarian) · [健康主题页外链 medlineplus.gov](https://detroitpubliclibrary.org/research/subject/health-and-medicine) |
| **Miami-Dade Public Library** 🔥HIGH | `customercare@mdpls.org` | [联系页](https://www.mdpls.org/contact-us) · [社区资源页外链](https://www.mdpls.org/community-resources) |
| Houston Public Library | [表单](https://askhpl.houstonlibrary.org/) | 无公开邮箱 |
| NCOA（全国老龄理事会） | 仅表单（`press@ncoa.org` 仅限媒体）| [联系页](https://www.ncoa.org/page/contact-us/) |

**这两家图书馆已核实有对外资源链接，值得放进第一批。**

图书馆用 [模板 B](./OUTREACH-AAA-TEMPLATE.md)（主动提出"可给不含 app 提及的版本"）。

---

## ❌ 未能核实（别瞎发）

抓取被挡，**不代表没有联系方式** —— 你手动打开多半能看到：

- **AZ**：NACOG（6 次拒绝连接）
- **TX**：CAPCOG / 奥斯汀
- **FL**：Elder Options（403）、Alliance for Aging 迈阿密
- **MI**：AAA of Western Michigan（JS 渲染）、Region VII 贝城
- **PA**：Philadelphia PCA（503）、Berks、Lehigh、Northampton、Westmoreland、York
- **图书馆**：凤凰城、圣安东尼奥、哥伦布、费城、匹兹堡、克利夫兰（全部 403）

⚠️ 搜索快照里出现过 `aaadir@nacog.org`、`aging@countyofberks.com`、`agingandadult@lehighcounty.org`、`aaainfo@aaawm.org`、`aging@nemcsa.org` —— **官网都没验证到，不要直接用**。

---

## 📊 实话实说

| 项 | 数字 |
|---|---|
| 总计 | **41 家** |
| **可直接发邮件** | **21 家（51%）** |
| 仅表单 | 17 家（41%） |
| 只有电话 | 2 家 |
| 存疑 1 家 · 未核实 16+ 家 | — |
| 我**亲自**核验 | 9 条邮箱 + 6 组外链证据 |

**对执行的影响**：**四成机构只能填表单**，手填耗时是发邮件的 3-5 倍。

### 建议的执行顺序

1. **第 1 周** — 发最上面那 6 家（HIGH + 有邮箱），外加密歇根 3 家 = **9 封**
2. **有任何回应** → 继续发第三批那 12 个邮箱
3. **9 封全部零回应** → **停**。别去填那 17 个表单

**止损线：21 封邮件发完、等 3 周、零回应即止损。** 表单那批是投入产出比最差的一档，除非前面已经跑通，否则不值得做。
