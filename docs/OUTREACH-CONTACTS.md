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

---

# 🆕 第二轮深挖新增（2026-08-14 晚）

> 新渠道：YMCA 血压自监测项目 / 新英格兰 COA / 州老龄厅 / 加州华州 AAA。
> 同一套规则；✔️ = 我本人二次核验。**部分渠道仍在收集，后续追加。**

## 🩸 YMCA 血压自监测项目（BPSM）—— 主题最对口的渠道

这些 YMCA 开设的就是"血压自我监测"项目 —— 参与者需要在两次课之间记录血压，
**可打印记录表就是它们课程的天然配套材料**。

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| Gateway Region YMCA | 圣路易斯 | `communityhealth@gwrymca.org` ✔️ | HIGH（外链 dss.mo.gov 等） |
| YMCA of Metro Denver | 丹佛 | `bpsm@denverymca.org` ✔️（**专用 BPSM 信箱**） | MEDIUM |
| YMCA Metro Washington | 华盛顿DC | `health@ymcadc.org` | MEDIUM |
| YMCA of NW North Carolina | 温斯顿-塞勒姆 | `c.mullins@ymcanwnc.org`（具名：Chelsea Mullins，社区健康）| MEDIUM |
| ⚠️ YMCA of Greater Cleveland | 克利夫兰 | `healthyliving@clevelandymca.org` —— **我复查页面未见此邮箱**，发前自行打开确认 | — |

## 🏘️ 新英格兰 Councils on Aging（发纸质月刊，最佳分发场景）

| 机构 | 城市 | 邮箱 | 备注 |
|---|---|---|---|
| Age Strong Commission | 波士顿 | `agestrong@boston.gov` ✔️ | 市级老龄委 |
| Somerville COA | 萨默维尔 | `aspeliotis@somervillema.gov` ✔️ | 月刊多次提及 |
| Cambridge COA | 剑桥 | `aliciaj@cambridgema.gov`（具名：Alicia Johnson，中心主任）| 有 COA 月刊 PDF |
| Medford COA | 梅德福 | `pkelly@medford-ma.gov`（具名：Pamela Kelly，主任）；另有外联协调员 `galbert@medford-ma.gov` | 有月刊 |

（该渠道仍在收集，波士顿周边多镇 403 被挡，最终表后续追加）

## 🏛️ 州老龄厅（.gov 高权重）

| 州 | 机构 | 邮箱 | 优先级 |
|---|---|---|---|
| 内华达 | Aging and Disability Services Division | `adsd@adsd.nv.gov` ✔️ | **HIGH**（资源页外链 nevada211.org 等） |
| 弗吉尼亚 | Dept. for Aging & Rehabilitative Services | `dars@dars.virginia.gov` ✔️ | 未评 |
| 密苏里 | DHSS（厅级总信箱） | `info@health.mo.gov` | 未评 |

（50 州里大部分州政府站对自动抓取封锁极严——MA/MI/MN/NH 硬 403，MT/NE TLS 失败。
搜索快照见过 `dda.aging@tn.gov`、`agingservices@utah.gov`，**未核实勿用**）

## 🌉 加州 / 华州 AAA

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| LA City Department of Aging | 洛杉矶 | `aging@lacity.org` | **HIGH**（cms.gov、healthcarerights.org） |
| Orange County Office on Aging | 橙县 | `areaagencyonaging@occr.ocgov.com` | **HIGH**（adrcoc.org） |
| Snohomish County LTC & Aging | 华州埃弗里特 | `ltca.referrals@snoco.org` | **HIGH**（benefitscheckup.org、waclc.org） |
| SF Dept. of Disability & Aging Services | 旧金山 | `DAS@sfgov.org` | MEDIUM |
| Seattle-King County ADS | 西雅图 | `aginginfo@seattle.gov` | MEDIUM |
| ⚠️ Pierce County ADR | 塔科马 | `adrc@piercecountywa.gov` —— **来源是第三方目录**（官网 403），发前自行确认 | — |

## 🏔️ 北卡 / 弗吉尼亚 / 乔治亚 AAA

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| Central Pines Regional Council AAA | 罗利-达勒姆 | `connect@centralpinesnc.gov` | **HIGH**（nc211.org、aarp.org、ncdhhs.gov） |
| Land of Sky Regional Council AAA | 阿什维尔 | `info@landofsky.org` | **HIGH**（coabc.org、wncsource.org） |
| Fairfax Area Agency on Aging | 弗州费尔法克斯 | `FairfaxAAA@fairfaxcounty.gov` | **HIGH**（seniornavigator.org、mwcog.org） |
| Centralina Regional Council AAA | 夏洛特 | `info@centralina.org` | MEDIUM |
| Atlanta ARC / Empowerline | 亚特兰大 | 邮箱被 Cloudflare 混淆，仅[表单](https://atlantaregional.org/contact-arc/)（官网 403，人工访问可见） | HIGH但仅表单 |
| Senior Connections Richmond | 里士满 | 混淆，仅[表单](https://seniorconnections-va.org/contact) | HIGH但仅表单 |
| Bay Aging | 弗州 Urbanna | 仅[表单](https://bayaging.org/contact/)（电话优先文化） | HIGH但仅表单 |

## 🏙️ 麻省补充

| 机构 | 城市 | 邮箱 | 备注 |
|---|---|---|---|
| Worcester Senior Center / Elder Affairs | 伍斯特 | `elderaffairs@worcesterma.gov` | 官网核验（收集方） |

## 🗽 纽约 / 新泽西

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| Bergen County Senior Services | 新泽西哈肯萨克 | `seniors@bergencountynj.gov` | **HIGH**（GetSetUp、Ready.gov、AARP Age-Friendly） |
| NYC Aging (DFTA) | 纽约市 | 仅[表单](https://www.nyc.gov/site/dfta/about/contact-aging-connect.page) | MEDIUM |

（Westchester/Nassau/Suffolk 全部被网络封锁未验证；搜索快照里的 `aging.office@suffolkcountyny.gov`、`seniors@hhsnassaucountyny.us` **未核实勿用**）

## 🧑‍🦳 照护者资源中心

| 机构 | 地区 | 邮箱 | 优先级 |
|---|---|---|---|
| Caregiver Action Network | 全国（DC） | `info@caregiveraction.org` | **HIGH**（资源页外链多家机构） |
| Well Spouse Association | 新泽西 | `info@wellspouse.org` | **HIGH**（Mainstay 会刊） |
| Southern Caregiver Resource Center | 圣地亚哥 | `scrc@caregivercenter.org` | **HIGH**（有 newsletter 存档） |
| Valley Caregiver Resource Center | 弗雷斯诺 | `info@valleycrc.org` | **HIGH**（外链 acl.gov、alzfdn.org） |
| Del Oro CRC | 萨克拉门托地区 | `mnevins@deloro.org`（具名员工，唯一公示邮箱） | **HIGH**（Toolkit 外链） |
| Inland CRC | 圣贝纳迪诺 | `info@inlandcaregivers.org` | MEDIUM |

（Family Caregiver Alliance/加州 CRC 官网枢纽等 8 家为仅表单或 JS 渲染无邮箱）

## 🏡 Village 互助会（全部有 newsletter，转载角度最佳）

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| San Francisco Village | 旧金山 | `info@sfvillage.org` | **HIGH**（月刊存档 2020-2026） |
| Ashby Village | 伯克利 | `info@ashbyvillage.org` | **HIGH**（newsletter 存档） |
| Capitol Hill Village | 华盛顿DC | `info@capitolhillvillage.org` | **HIGH**（年度 newsletter 存档） |
| Northwest Neighbors Village | 华盛顿DC | `info@nnvdc.org` | **HIGH**（资源页外链 iona.org 等） |
| Pasadena Village | 帕萨迪纳 | `info@pasadenavillage.org` | **HIGH**（newsletter 存档） |
| Beacon Hill Village | 波士顿 | `info@BeaconHillVillage.org`（页面混淆已解码） | **HIGH** |
| The Village Chicago | 芝加哥 | `info@thevillagechicago.org`（页面混淆已解码） | MEDIUM |

（Marin Villages 仅表单；Mill Valley 站点不可达）

## 🌆 伊利诺伊 / 明尼苏达 / 科罗拉多 AAA

| 机构 | 城市 | 邮箱 | 优先级 |
|---|---|---|---|
| Trellis / Metropolitan AAA | 双城（metroaging.org，原 trellisconnects.org 已改名） | `info@metroaging.org` | **HIGH**（外链 mayoclinic.org、Stanford） |
| Chicago DFSS Senior Services | 芝加哥市 | `Aging@CityofChicago.org` | MEDIUM（外链 BenefitsCheckUp） |
| AgeOptions | 芝加哥郊县 | `info@ageoptions.org` | MEDIUM |
| DRCOG AAA | 丹佛 | `aaa-drcog@drcog.org` | MEDIUM |

（AgeGuide 混淆仅表单；Pikes Peak 的 `ppacg@ppacg.org` **来源第三方目录未核实勿用**——
其官网员工目录甚至有自家域名拼错的邮箱，佐证不猜格式的规则）

## 🎓 大学 Cooperative Extension（.edu 高价值）

**规则：每个团队只发一人**（同团队多人互相对照邮件=群发痕迹）。已选最对口者，其余为备用。

| 大学 | 项目 | 发送对象 | 备用（勿同时发） |
|---|---|---|---|
| Ohio State | FCS Healthy People（HIGH，老龄页外链 acl.gov/aarp/alz.org） | `fcs@osu.edu` | — |
| Illinois | Family Life 老龄/照护 | `cburcham@illinois.edu`（Cheri Burcham，Elder Care） | `hoferm@`、`sattig@illinois.edu` |
| Nebraska | Food & Health（HIGH） | `food@unl.edu` | — |
| Utah State | **Living Well with Chronic Conditions（HIGH·全渠道最对口）** | `gabriela.murza@usu.edu` | `cara.murray@`、`ashley.yaugher@usu.edu` |
| NC State | Steps to Health | `jayne_mcburney@ncsu.edu` | `lisa_benavente@`、`benahor@ncsu.edu` |
| Clemson | HGIC | `HGIC@clemson.edu` | — |
| UF/IFAS | Alachua 县办公室 | `alachua@ifas.ufl.edu` | — |
| Purdue | Tippecanoe 县 HHS | `tippecanoeces@purdue.edu` | — |
| K-State | 营养项目 | `pbrenes@ksu.edu` | — |
| UW-Madison | Aging Program（全所信箱转交） | `info@extension.wisc.edu` | — |
| Arizona | 营养与运动项目 | `benally3@arizona.edu` | `mbawden@cals.arizona.edu`、`cantu1@arizona.edu` |

仅表单：Penn State（[表单](https://extension.psu.edu/contact-us)）、Oregon State Healthy Aging（HIGH，[Ask Extension](https://extension.oregonstate.edu/ask-extension)值得填）。
未通：密歇根州立/爱荷华州立/明尼苏达（机器人墙）、Texas A&M（连接失败）。

## 🌐 其他

| 机构 | 说明 | 邮箱 |
|---|---|---|
| Cyber-Seniors | 老年科技辅导公益（有 newsletter；主题相关性弱） | `info@cyberseniors.org` |

