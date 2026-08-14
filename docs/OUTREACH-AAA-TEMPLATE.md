# 本地老龄机构外联模板（AAA / 老年中心 / 图书馆）

> ⚠️ **必须由你本人发送。** 我不会代发，也不该代发 —— 冒充真人联系机构是不可接受的。
> 模板里所有 `[方括号]` 都必须替换成真实信息，尤其是你的真实姓名。

---

## 为什么是这批机构（依据）

调研结论里赔率最好的一条路径，理由是**机制而非案例**：

- 全美 **600+ 个 Area Agency on Aging (AAA)**，可在 [usaging.org/findyouraaa](https://www.usaging.org/findyouraaa) 按州查
- 它们在《老年人法案》(Older Americans Act) 下的**法定职能就包含「信息与转介服务」** —— 发布社区资源页、对外链接是本职工作，不是人情
- 长期缺人手，工作人员真心在找可用的照护者材料

**诚实标注**：调研没找到量化这条路径成功率的案例，属于「机制合理但未经验证」。别期望高回复率。

---

## 🔴 三条铁律

**1. 给的是工具，不是文章。**
可打印血压记录表 ≠ 又一篇健康文章。这些机构不会链接后者，但会链接前者 ——
因为它们的服务对象**真的需要一张能打印出来带去看医生的表**。

**2. 绝不暗示医学权威。**
你的站点没有医学审核人。任何"我们的专家建议…"的措辞一旦被核实，
不仅这次外联失败，还会损害机构对你的长期信任。
措辞要停在「我做了一个免费工具」，不要越界到「我们提供健康建议」。

**3. 不要群发。**
这些是小机构，工作人员彼此认识。群发痕迹（比如没改机构名）会被识别，
而且一封被标记，整批都会受影响。**每天 5-10 封手写，好过一次 200 封。**

---

## 模板 A：Area Agency on Aging / 老年活动中心

**主题行**（三选一，别用感叹号）：
- `Free printable blood pressure log for your clients`
- `A printable BP tracking sheet — free to share or print`
- `Large-print blood pressure log — no cost, no signup`

**正文：**

```
Hi [具体人名，找不到就用 "there"],

I built a free printable blood pressure log designed for older adults —
large print, high contrast, and enough room to actually write in the boxes.
It's here if it's useful to you:

https://bpcareai.com/blood-pressure-log

A few things that might matter for your clients:

- No signup, no email required — it just prints
- Fits one week per page (morning + evening), which is what most
  doctors ask patients to bring in
- It only records readings. It doesn't interpret them or give advice —
  that's deliberate, so it doesn't get in the way of what your clients'
  own doctors tell them

You're welcome to print it, hand it out, or link to it from your
resources page. No attribution needed.

I'm [你的真名] — I build a blood pressure tracking app, and I made this
because a lot of people told me they still prefer paper. If there's a
different format that would work better for the people you serve
(bigger type, a month per page, Spanish), tell me and I'll make it.

Best,
[你的真名]
[你的真实邮箱]
```

**为什么这样写：**

- **第一句就给东西**，不寒暄、不铺垫 —— 收件人 5 秒内要能判断这封信有没有用
- **"No attribution needed"** 是关键的一句：它把这封信从「求链接」变成「给资源」。有些机构反而因此更愿意加链接
- **主动披露利益关系**（"I build an app"）—— 不说反而更可疑，而且机构一查就知道
- **结尾问需求** —— 这是唯一能把一次性外联变成持续关系的钩子，而且西班牙语版是真实需求

---

## 模板 B：公共图书馆（老年服务 / 健康资源馆员）

图书馆有专门的健康资源页，馆员通常受过资源评估训练，**更看重"是否可免费获取"和"是否无营销陷阱"**。

**主题行：** `Free printable health tracking sheet for your patrons`

```
Hi [人名],

I noticed [图书馆名] has a [health resources / senior services] page.
I made a free printable blood pressure log that might fit there:

https://bpcareai.com/blood-pressure-log

It's a plain tracking sheet — large print, one week per page, prints on
standard letter paper. No account, no paywall, no data collection.
It records readings only and doesn't offer medical guidance.

Full disclosure: I also make a blood pressure app, and there's a link to
it on that page. The printable itself is free and has no strings attached —
if you'd rather link to a version without any app mention, I'll host one.

[你的真名]
[你的真实邮箱]
```

**关键差异**：主动提出「可以给一个不含 app 提及的版本」。
馆员最警惕的就是商业植入，把这个顾虑提前化解掉，通过率会明显高于回避它。

---

## 执行建议

| 项 | 建议 |
|---|---|
| **节奏** | 每天 5-10 封，不要批量 |
| **优先级** | 先发你所在州及邻州的 AAA（本地感更强） |
| **找联系人** | 机构官网 "Staff" / "Contact" 页，优先找 Information & Referral Specialist |
| **跟进** | 10-14 天后跟进**一次**，之后不再发 |
| **记录** | 建个表记录：机构名 / 联系人 / 发送日 / 结果 |

**预期**：回复率大概率是个位数百分比。**这是正常的**，不代表方法错了。

---

## 效果怎么量

工具页的下载按钮带 `ct=web_qr_bp_log_tool` / `ct=web_bp_log_tool`，
所以能在 **App Store Connect** 按 campaign token 看到它带来的真实安装。

GA4 里看 `page_view`（`page_path = /blood-pressure-log`）和
`download_click`（`position = bp_log_tool`）。

⚠️ **外链本身的效果要 4-8 周后才可能在 GSC 里看出来**，别提前下结论。

---

## 如果这条路走不通

调研给出的下一优先级是**原创数据** —— 用你 app 里真实的、匿名化的血压数据
做一份小型调研报告。这是 Mayo Clinic 也复制不了的东西，
而 data-led 内容是所有外链战术里证据最强的一类（平均每次 campaign 获 42 个引荐域名）。

但那需要先想清楚数据合规与用户同意，是另一个话题。
