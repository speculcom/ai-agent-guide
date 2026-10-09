---
id: grok-bot
track: cloud
name: xAI Grok Bot
vendor: xAI
homepage: https://x.ai/news/introducing-grok-bot
mark: xAI
accent: "#000000"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 含在 SuperGrok 与 Cursor 各档订阅内（beta），用量与主套餐分开计
  annual_usd: null
  annual_label: 官方发布页未给年付口径
  note: >-
    **2026-10-03 以 x.ai 官方两篇发布页正文为准**：
    Grok Bot 首发在 beta，官方原文「available today for SuperGrok,
    SuperGrok Plus, and SuperGrok Heavy; Cursor Pro, Pro+, and Ultra;
    and Cursor Teams Standard and Premium subscribers on desktop and iOS」；
    后官方又扩大过一次范围，官方原文「Grok Bot is now included with
    all SuperGrok, Cursor Pro, and all Cursor Teams plans」。
    **三家对比里最特殊的一条计费口径**（两篇官方页都原文重复）：
    「Grok Bot comes with its own usage, separate from your Grok and Cursor plans,
    so anything you hand off to a Bot won't count against your existing usage」。
    即：**用量独立于主套餐另算** —— 这与 OpenAI Dot
    「与 Dot 的对话不占 ChatGPT 额度、但派给 Codex 的任务照常计入」
    是**两种不同结构**，不是同一种设计。
    ⚠ **具体用量数值官方两篇均未给出**，**本次未核验。**
pricing_pitfalls:
  - 把「独立用量」理解成免费 —— 官方只说与主套餐分开计，没说不计费
  - 以为只在 SuperGrok 可用 —— 官方已扩大到全部 SuperGrok 与全部 Cursor Teams 档
  - 按「Beta」预期它还不存在 —— 首发即今日可用，只是仍标beta

axes:
  model_access: >-
    **官方两篇发布页均未点名底层模型，也未给出「可换模型」的表述**
    （已查 x.ai「Introducing Grok Bot」与「Grok Bot is now included with
    more plans」两页）。
    站内平行证据：同期「Introducing Grok 4.6」页写
    「a particular focus on long-running agents」，与 Grok Bot 的常驻定位吻合，
    **但两页无互相点名**，故本站不写「Grok Bot 跑在 4.6 上」（R5：不推断）。
    与另两家对比：OpenAI Dot 明确写了 GPT‑6 Astra、Meta Muse 明确写了
    Muse Spark，**只有本条留白**。**是否可换模型、可换哪些，官方未说明。**
  runtime: >-
    **形态的答案与另两家同构**：官方原文「They have their own computer,
    work inside tools and apps like you do, and keep working 24/7」，
    另一篇写「They have their own computer in the cloud.
    It's always on, with browser and terminal access」。
    **有终端是本条与另两家的一个可辨差异** —— 官方明确写了
    browser **and terminal** access，而 Dot 与 Muse 官方均只提浏览器。
    官方强调的差异点是「工作在真正的工具里而不是聊天草稿」：
    「They sign into your apps and work happens in the actual tool
    instead of a chat draft」。
    可用端：官方写 desktop and iOS。
  local_files: >-
    **官方未提及本地文件系统**，工作面在它自己的云端机器（官方原文
    "They have their own computer. It's always on, with browser and terminal
    access"）。
    可间接看到的工作面是已登录的 app：官方例子里有 audit email, Drive, and
    paid subscriptions、以及「Works across apps and inboxes」，
    说明它确实在动邮箱与云盘。
    **权限粒度与是否全量同步，官方未说明**（已查两篇发布页与
    x.ai/bot 治理规范）。
  background: >-
    **官方直接给了时长承诺**：首发页原文「keep working 24/7」，
    另一篇「Bots work across apps and inboxes, keep going when you step away,
    and only pull you in for judgment calls」。
    **「only pull you in for judgment calls」是这一维度里最清楚的一句** ——
    它明确了回调条件是「需要判断的时候」，而不是定时汇报。
    另有官方给的固化机制：「Ask a Bot to follow along the next time you do the
    job, so it can run on its own after that」（教一次之后自己跑）。
    并明确它可并行：「Stand up a researcher, writer, and chief of staff.
    Put them in a group chat so they pass work between themselves」。
    **后台自主时工具的权限级别（只读还是读写），官方未说明**
    （已查两篇发布页与 x.ai/bot 治理规范，后者只列必审动作、不述权限级别）。
  tools: >-
    **官方用「例行工作」清单代替了能力表**，这份清单本身是选型依据。
    官方原文列的jobs：Bots doing today ——
    Sales prospector / Website builder / Digital declutterer / Customer support /
    Game artist / Office manager / Inbox manager / Meeting stand-in / Refunds manager。
    涉及的具体外部服务（官方点名）：payments provider、Gmail、Slack、ServiceTitan、
    Quo、client portal、Drive。
    **支付能力：官方未在 Grok Bot 发布页写它能直接结账**
    （Meta Muse 明确写了 Stripe Link，Dot 未提）—— **本站不推断，仅记录官方未提。**
    「Website builder」那条官方写了会purchases the domain and deploys
    the final version，**涉及采购**，审批归属未单独说明。
  context: >-
    **官方表述偏交互记忆，不是上下文窗口**：
    「They remember conversations, learn how you like things done,
    and get sharper the more work together」；
    接入口是「A text-thread UX. Message a Bot the way you would message someone
    on your team, from mobile or desktop, so you can pick up the same thread
    on either — with nothing to set up first」。
    **即跨端续同一条对话线程。**
    多 Bot 协作有独立描述（group chat 里互相传活，用户不在中间）。
    **上下文窗口大小与记忆的存储、删除机制，官方未说明**
    （已查两篇发布页与 x.ai/bot 治理规范；对比 Meta Muse 官方给了删除与
    forget skill，这是本条明显的信息缺口）。
  permissions: >-
    **发布页只有「回调即审批」一层，官方域内另有 Bot 治理规范补上审批清单**
    （2026-10-03 补，文档性质见正文「那份治理规范怎么读」一节）。
    发布页已核验三处：
    ① 回调即审批 —— 「only come back when something needs your approval」、
    「Leaves every send for you to approve in your inbox or navigator」；
    ② 例行任务自带保守动词 —— declutterer「Only discards or unsubscribes if
    you say so」、refunds manager「Comes back with the refund or discount it
    recovered」（不自行执行退款，把结果拿回来）；
    ③ 一个值得记的设计 —— Website builder 官方写
    「Helps configure plugins, delivers a live URL, and adds redirect rules」，
    **它连改域名解析都做，但官网未把它列为需审批项。**
    **官方域内 `x.ai/bot/…` 的 Bot 治理规范给出了明确的审批清单**
    （原文「Explicit approval required before…」），必审动作包括：
    创建/编辑/复制/隐藏/删除 Bot；保存或实质修改 Skill；
    创建/启用/编辑/暂停 Routine；创建或变更群聊；安装或认证连接器；
    **扩张权限**；写入外部源；发送或发布；联系外部人员；
    **采购、转账、改定价、商业承诺**；删除或覆写数据；改动生产环境；
    接受法律条款；敏感雇佣/医疗/法律/财务决策；创建公开分享链接或市场提交。
    三条与本档案直接相关的行为规约：
    「**Do not infer approval from silence, vague agreement, a previous
    approval, another version, or an example**」——**沉默不算同意**；
    「Approval applies only to the **exact action, target, scope, version,
    configuration, connection, permission, and schedule**」——**审批不外溢**；
    「**Never delete a Bot automatically**」+
    「Agents cannot be deleted by another agent; **the user deletes from the
    sidebar**」。另有两条凭据规则：「**Never store credentials**」、
    「Never request passwords, passkeys, 2FA, private keys, recovery codes,
    payment confirmations, or API secrets in chat」。
    **产品级机制（可自定义的权限规则界面、自动审核器、审计日志、
    凭据的技术保管方式、规范是产品级强制还是单个 Bot 的约束），官方未说明**
    —— 补到的是一份 Bot 行为规范，不是产品机制文档（已查两篇发布页与
    x.ai/bot 规范）。
  fit: >-
    官方给的是**岗位化的 jobs 清单**（见 tools 维），选型时可当清单用：
    销售线索、网站搭建、邮箱清理、客服、游戏素材、办公排程、收件箱、会议代听、退款跟进。
    **不适合**：需要权限机制可查可配置的人（本条最明显短板）；
    要本地文件读写的人；需要确认底层模型的人（官方未公布）；
    非英语地区用户（官方只写桌面与 iOS，**地区表述只到端、不含国家清单**）。

pitfalls:
  - 把「独立用量」当成免费 —— 官方只说与主套餐分开算
  - 期待能查到审批粒度与凭据机制 —— 官方发布页没写，本档案不替它补
  - 拿Grok 4.6 的「focus on long-running agents」反推它跑的就是 4.6 —— 两页没有互相点名
  - 以为只支持 SuperGrok —— 官方已扩大到全部 Cursor 档
  - 以为能像 Muse 那样直接付款 —— 官方 Grok Bot 页未提支付结账

tags: [编码agent, 云端, 厂商云, 常驻, 并行, beta, 岗位化]
related: [playwright]

sources:
  - label: xAI · Introducing Grok Bot（官方首发页，2026-08-11 beta 上线）
    url: https://x.ai/news/introducing-grok-bot
    kind: official
  - label: xAI · Grok Bot is now included with more plans（官方扩大范围公告）
    url: https://x.ai/news/grok-bot-more-plans
    kind: changelog
  - label: xAI · Bot 行为治理规范（x.ai/bot公开页，**补上审批必审动作清单**；性质是行为约束非产品文档，见正文「那份治理规范怎么读」）
    url: https://x.ai/bot/KZ9xav0Qad1U5QigEn7rh
    kind: docs
  - label: xAI · Introducing Grok 4.6（**仅用于确认底层模型未点名**，两页无互引）
    url: https://x.ai/news/grok-4-6
    kind: official

link:
  url: https://x.ai/news/introducing-grok-bot
  kind: official

last_verified: 2026-10-03
last_updated: 2026-10-03
lifecycle: active
confidence: partial
---

## 一句话定位

**三家同期发布里唯一一家官方页上能读到「jobs 清单」的** —— 它不谈机制，直接列了九个岗位（销售线索、网站搭建、收件箱、会议代听……）。

## 取证方式要先说清楚（与另两份不同）

| 档案 | 取证方式 |
|---|---|
| OpenAI Dot | Playwright 直抓 openai.com，5,166 字逐节核对 |
| Meta Muse | Playwright 直抓 about.fb.com，7,655 字逐节核对 |
| **本条** | **x.ai 直抓 ERR_CONNECTION_TIMED_OUT（连接超时）；正文取自域限定检索（`allowed_domains: x.ai`）返回的官方页内容** |

**为什么仍算官方源**：检索被限定在 `x.ai` 域内，返回的正文是该域页面的内容，
不是第三方转述。**但要如实说：没能直抓复核**，
所以需要逐字引用时应重新核验。

这也直接决定了 `permissions` 这一维的结论 —— 见下。

## 三份里只有本条查不到审批机制

这是本档案最该先说的一件事：

| | OpenAI Dot | Meta Muse | **Grok Bot** |
|---|---|---|---|
| 审批机制 | 自动审核 + 自定义规则 + **敏感动作永远人工** | **独立 Sentinel agent**，系统级隔离 | **发布页未描述**；域内 Bot 规范列了必审动作清单 |
| 凭据 | 用已存密码不向模型暴露 | Secure Credentials Store | **发布页未描述**；规范只写「Never store credentials」 |
| 审计 | 活动视图 | 完整轨迹，含「plans to do」 | **发布页未描述** |

**已核验的是「回调即审批」这一层**：
→ 「only come back when something needs your approval」、
→ 「Leaves every send for you to approve in your inbox or navigator」。

**2026-10-03 补**：域内那份 Bot 行为规范补上了**审批粒度**（哪些动作必审），
但**没有**补上「用户能否自己配置规则」「审计日志」「凭据如何保管」——
所以上表后两行仍标「发布页未描述」，这是准确的。

**选型含义仍然成立，但理由要换**：
若「审批机制是否可查可配」是硬要求，本条**依然无法从官方材料完整回答**——
补到的是一份 Bot 行为规范，不是产品机制文档。建议直接问 xAI，不要按「应该有」来假设。

## 那份治理规范怎么读（重要，别当成产品机制）

`x.ai` 域内有一份公开的 Bot 行为规范（`x.ai/bot/…`），
里面有一份相当完整的审批清单。**补上了发布页缺失的审批粒度**，
但**必须说清它的性质**：

| | 是什么 | 不是什么 |
|---|---|---|
| **是什么** | 一个 Bot 的**行为约束说明**（它自己该怎么做、什么该先问） | ❌ 不是产品文档 |
| **不是什么** | —— | ❌ 不是产品级的权限机制说明；❌ 不代表所有 Bot 都受同一套约束；❌ 不能替代「用户界面里能不能配规则」这个问题的答案 |

**这个区分为什么重要**：
它给的是「**这个 Bot 被要求怎么做**」，
不是「**这个产品允许你配置什么**」。

用户真正想知道的是「我能不能自己划定哪些动作要审批」——
**这份文档没有回答这个问题**，所以 `permissions` 仍不能算补齐。

**但它有两条设计值得单独记**（这两条与另两家形成有意思的对照）：

1. **「Do not infer approval from silence」** ——
   沉默不算同意。这比 Dot 的「Ask for some actions / Always ask」两档更严：
   **xAI 在规范层面明确禁止从「不反对」推出「同意」。**
2. **「Approval applies only to the exact action, target, scope, version,
   configuration, connection, permission, and schedule」** ——
   **审批精确到单个动作与单个配置，不外溢到下一次。**
   这与 Muse 的「Allow once / for this task / for this site / Always allow」
   是两种不同粒度的思路：Muse 提供**有效期选项**，
   Grok Bot 这份规范则**只承认一次性批准**。

**三家审批模型对照（补核验后）**

| | 审批粒度 | 沉默是否算同意 | 有效期选项 |
|---|---|---|---|
| OpenAI Dot | 自定义规则 + 内置底线 + 自动审核 | 未见表述 | 未见表述 |
| Meta Muse | 五档选项 | 未见表述 | 有（once / task / site / always） |
| **Grok Bot** | **规范列必审动作清单** | **明确不算** | **只认单次批准** |

## 两处值得单独记的细节

### ① 例行任务用保守动词

```
Digital declutterer — Audits email, Drive, and paid subscriptions around the clock.
Only discards or unsubscribes if you say so.

Refunds manager — Finds the claim, files it, and follows it through.
Comes back with the refund or discount it recovered.
```

declutterer **持续审计但只有你说了才丢**；
refunds manager **走完流程但把结果拿回来给你**。

**官方描述里，这些任务都没有「自行执行」** —— 这是官方页面文本呈现出的行为边界，
不是推测。

### ② 但Website builder 那条把采购和部署都做了

```
Website builder — Builds the site, purchases the domain, and deploys
the final version. Helps configure plugins, delivers a live URL,
and adds redirect rules.
```

**买域名 + 上线 + 改解析都做了，而官网没把它列成需审批项。**

这与 ① 的保守措辞形成不一致。**本站照实记录这个不一致** ——
不替厂商圆场，也不把它当作审批缺漏的定论（可能审批在产品内而不在发布页）。

## 底层模型：官方没点名，本档案不推断

- OpenAI Dot：明确 GPT‑6 Astra
- Meta Muse：明确 Muse Spark
- **Grok Bot：官方页未给模型名**

站内能看到 Grok 4.6 的发布页写着「a particular focus on long-running agents」，
而 Grok Bot 正是常驻型 —— **但两页没有互相点名**。

所以本站不写「Grok Bot 跑在 4.6 上」。
**理由**：v3 铁律「给判断依据不给虚假结论」——
「两个产品定位吻合」不是「同一模型」的依据。

## 计费：与另两家是不同的结构

```
Grok Bot comes with its own usage, separate from your Grok and Cursor plans,
so anything you hand off to a Bot won't count against your existing usage.
```

这句两篇官方页都重复了，是官方特别强调的点。三家的结构对比：

| | Dot | Muse | Grok Bot |
|---|---|---|---|
| 买什么 | Pro / Business Premium 附带 | 大部分需求免费 + 订阅档 | SuperGrok / Cursor 各档附带 |
| 与主套餐额度关系 | Dot 对话不计入；派给 Codex 的任务**照常计入** | 官方未说明 | **独立用量，与主套餐分开** |

**三家用三种不同的结构**，不要按「厂商云 agent 都一样」来理解。

⚠ **独立用量的具体数值官方两篇都没给**，需自行到官网核。

## 适合与不适合

**适合**（官方 jobs 清单，可直接当选型依据）：
销售线索、网站搭建、收件箱与订阅清理、客服、游戏素材、办公排程、会议代听、退款跟进。

**不适合**：
**要求审批机制可查可配置的人**（官方材料回答不了，本条最大短板）；
要本地文件读写的人；要确认底层模型的人。

## 采集限制

| 页面 | 状态 |
|---|---|
| Introducing Grok Bot | ⚠️ 直抓超时（ERR_CONNECTION_TIMED_OUT），正文取自 x.ai 域限定检索 |
| Grok Bot is now included with more plans | ⚠️ 同上 |
| Introducing Grok 4.6 | ⚠️ 同上；**仅用于确认「官方未点名」**，不用于推断模型 |
| `x.ai/bot/…` Bot 行为规范 | ✅ **2026-10-03 取到正文**，补上 `permissions` 的审批粒度（性质是行为约束，见正文） |

**三页发布页均未能直抓复核** —— 这是本条 confidence 定 partial 的原因之一。
**2026-10-03 变化**：另找到一份域内 Bot 行为规范正文，
把 `permissions` 从「官方页完全没写」推进到「有必审动作清单，
但产品级机制（可配规则 / 审计日志 / 凭据保管）仍无官方说明」。

**因此 confidence仍为 partial**，但缺口已从「权限机制整块空白」
收窄为「权限的产品级机制与审计日志」这一项。

**三页均未能直抓复核** —— 这是本条 confidence 定partial 的主要原因，
另外权限机制本身在官方页就没写，即使能抓也补不上。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：若能订阅 SuperGrok 或 Cursor 任一档，
本条最该测的是**审批触发点** —— 官方只说「needs your approval」，
那么「Website builder 买域名」到底弹不弹审批，是唯一能补上这个缺口的办法。
**不测跑分**：它和另两家一样本机不装东西，没有本地基准可跑。

## 未知项清单

- **底层模型是哪个**（官方未点名）
- **是否有自动审核器**（Dot 有，Grok Bot 发布页未描述）
- **凭据如何保管**（只知规范要求「Never store credentials」，技术方式未说明）
- **是否有可自定义的权限规则界面**（规范给了清单，但未说明用户能否自己配）
- **是否有审计日志**（官方未描述）
- 那份 Bot 行为规范是产品级强制，还是单个 Bot 的约束（文档未说明适用范围）
- 独立用量的具体数值
- 免费额度的存在与边界（官方只说分主套餐计算，没说是否可免费用）
- 地区可用性（官方只写端，不含国家清单）
- 后台自主时工具的权限级别（只读还是读写）

## 相关条目

- [OpenAI Dot](./openai-dot.md) — 同期发布，权限信息最完整的一份
- [Meta Muse](./meta-muse.md) — 同期发布，Sentinel 独立否决层
- [Codex](./codex-ide.md) — 本地 CLI 形态的对照项（机器归你）
