---
id: context7
track: mcp
name: Context7
vendor: Upstash
homepage: https://github.com/upstash/context7
mark: C7
accent: "#F97316"

pricing:
  model: freemium
  monthly_usd: 0
  monthly_label: Free $0（1,000 次/月）；Pro $10 每席位/月（2,000 次/席位）；Enterprise 定制
  annual_usd: null
  annual_label: 官方未列年付档（页面只有月付 per seat）
  note: >-
    **开源部分为 MIT，但索引/解析/服务端是Upstash 的私有托管服务** ——
    官方 README 自己划了界：这个仓只托管 MCP server 的源码，
    API 后端、解析引擎与爬取引擎均为私有。
    **定价（2026-10-01 核验官方 context7.com/docs/plans-pricing.md，该页是 plans 页的 307 目标）**：
    | 档 | 价格 | 含额度 | 超出计费 |
    |---|---|---|---|
    | **Free** | **$0** | **1,000 次/月**（Search API + Context API） | 阻塞 |
    | **Pro** | **$10 每席位/月** | **2,000 次/席位** | **Unlimited（$5 / 1,000 次）** |
    | **Enterprise** | **Custom** | Custom | Custom |
    **另有一项独立计费项（易被漏看）**：
    **Private Repo Parsing = $5 / 1M tokens** —— 私有库文档解析按token 单独计费，
    与 API 调用额度是**两个独立的钱包**。
    **Free 档的三项能力**（官方对比表）：Public Repos、Access Control、OAuth 2.0。
    **Pro 解锁**：Private Repos、Team Collaboration、**Unlimited API Calls**。
    **Enterprise 解锁**：SOC-2、SSO（SAML / OIDC）、**Self-Hosted（On-Premise）**，
    且支持把额度与私有解析都按Custom 定制。
    **⚠ 一条必须提醒的口径冲突**：多个第三方站（aicoolies / decodo 等，2026-09 前后）
    称Pro 是「5,000 次/席位」，**与官方页面的 2,000 不一致**。
    本档案按官方页面写**2,000**，第三方数字视为旧制或臆测。
    ⚠ Free 档超出 1,000 次后的**具体行为**（完全阻塞 / 降速 / 每日 bonus）
    官方页面只列了问题标题、未给答案正文，本档案不做推测。
pricing_pitfalls:
  - 以为是纯本地工具，实际核心是远程服务，会把你的查询发到 Upstash
  - 以为不配 key 就能无限用 —— Free 档只有 1,000 次/月，且超出后行为官方未明示
  - **以为 Pro 的「Unlimited API Calls」= 不限速不限量** —— 它是「不阻塞」，
    超出 2,000 次/席位后按 **$5 / 1,000 次** 计费
  - **漏看 Private Repo Parsing 是独立计费项**（$5 / 1M tokens）——
    与 API 额度是两个钱包，Pro 的 $10 也不含它
  - 拿第三方站（aicoolies 等）的 Pro「5,000 次/席位」做预算 —— **官方页面是 2,000**

axes:
  model_access: >-
    本身不调用模型，是被客户端调用的接口实现。
    为 Agent 提供**版本感知的库与 API 文档**，
    解决模型训练数据滞后导致的使用错误。
  runtime: >-
    **远程托管 HTTP 服务**（`https://mcp.context7.com/mcp`），
    由 Upstash 运营。**这是本赛道唯一默认走远程的条目**，
    其余 reference server 均为本地 stdio 进程。
  local_files: >-
    **无任何本地文件访问能力**。纯文档检索服务。
  background: >-
    **作为远程托管服务始终可用**，与客户端进程生命周期无关——
    这是本赛道唯一不受本机开关影响的条目。
    但**服务可用性取决于 Upstash 侧的服务状态**，
    本仓库的 releases 不能保证服务端可用性，两者需分开判断。
  tools: >-
    提供 MCP 工具用于检索库文档。
    README 强调正确用法：使用 Library Id、**指定版本**（Specify a Version）、
    以及通过 rule 声明「需要库文档时总是使用 Context7」。
    输出为结构化文档内容。
  context: >-
    无跨会话记忆，但**文档检索本身是"外部记忆"**——
    弥补模型训练数据滞后，这是它的核心定位。
  permissions: >-
    **权限风险与本地 server 完全不同**：
    不碰本地文件，但要**把查询内容发送到 Upstash 服务器**。
    传入 Library Id 与具体问题即产生网络请求。
    认证用 API Key（`Authorization: Bearer YOUR_API_KEY`）。
    无独立审批机制。
  fit: >-
    需要查当前版本库文档的场景：库升级后的 API 变更、
    新版本引入的配置项、模型不确定的第三方库用法。
    不适合查内部代码或私有库。

pitfalls:
  - 以为是纯本地工具，实际查询会发到 Upstash 的远程服务器
  - 不指定版本号会拿到不匹配的文档，README 专门强调Specify a Version
  - 以为开源就等于全部本地，代码 MIT 但核心是托管服务

mcp:
  transport: >-
    **远程 Streamable HTTP**，服务端点为 `https://mcp.context7.com/mcp`。
    **本赛道唯一以远程服务为默认形态的条目**——
    其余官方 reference server 均为本地 stdio 进程。
  auth: >-
    **需 API Key**，通过 `Authorization: Bearer YOUR_API_KEY` 头传递。
    README 说明可经 OAuth 流程由安装器自动生成 key。
    **额度档位本轮已核验（2026-10-01，官方 plans 页）**：
    Free **1,000 次/月**（Search API + Context API 合计）、
    Pro **2,000 次/席位/月**、超出 **$5 / 1,000 次**不阻塞。
    另Free 档本身就用 OAuth 2.0（官方对比表把 OAuth 2.0 列为 Free 的能力）。
    ⚠ **Free 超出额度后的确切行为官方页面未给答案正文**，只列了问题标题。
  scope: >-
    **无本地权限风险，但有数据出境风险**：
    查询内容会发送到 Upstash 服务器。
    传入的库名与问题文本属于对外传输内容，
    涉密场景需评估。
    **本轮补一条官方对隐私的明确承诺**（官方 FAQ 标题即
    "How do you keep the privacy of my queries?"）：
    查询只发**文档问题与库名/ID**，
    不发完整 prompt、源代码与对话历史；
    且官方要求agent 不要在查询里带凭据、个人数据或专有代码。
    服务端自身的文档索引范围由 Upstash 掌握，客户端不可见。

tags: [检索, 网络, 远程]

sources:
  - label: Upstash · Context7 README（API Key 与远程端点说明、**「本仓只托管 MCP server 源码，API 后端/解析/爬虫为私有」的自述**）
    url: https://github.com/upstash/context7
    kind: docs
  - label: 官方 Pricing & Plans（核验 2026-10-01：Free $0/1,000 次每月、Pro $10 每席位每月/2,000 次每席位/超出 $5 每 1,000 次、Private Repo Parsing $5 每 1M tokens、Enterprise Custom 含 SOC-2/SSO/Self-Hosted；**与第三方「Pro 5,000 次」冲突，按官方 2,000**）
    url: https://context7.com/docs/plans-pricing.md
    kind: pricing
  - label: Upstash · Context7 Releases（ctx7@0.5.12）
    url: https://github.com/upstash/context7/releases
    kind: changelog
  - label: Upstash · Context7 Commits
    url: https://github.com/upstash/context7/commits/main
    kind: changelog
  - label: Model Context Protocol · 规范
    url: https://modelcontextprotocol.io/specification
    kind: docs

link:
  url: https://github.com/upstash/context7
  kind: official

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**MCP 赛道上唯一的远程托管条目** —— 为 Agent 提供版本感知的库文档，MIT 开源但核心服务在 Upstash 侧。

## 为什么它和其他条目不一样

| 维度 | 其余 reference server | Context7 |
|---|---|---|
| 运行形态 | 本地进程（stdio） | **远程 HTTP 服务** |
| 数据流向 | 本机内 | **查询发到 Upstash** |
| 认证 | 无（靠进程权限） | **需 API Key** |
| 额度 | 无 | **有**（官方提"更高额度"） |
| 开源许可 | 参考实现，无商业形态 | MIT 代码 + 托管服务 |

**这带来的是完全不同的一类风险**：
其他 server 的风险是「能碰你的什么」，
Context7 的风险是「你的查询会发到哪里去」。

## 变更记录说明

本对象有独立 releases：

| 版本 | 日期 |
|---|---|
| `ctx7@0.5.12` | 2026-09-22 |
| `@upstash/context7-sdk@0.5.0` | 2026-09-22 |
| `@upstash/context7-tools-ai-sdk@1.0.2` | 2026-09-22 |

**一个仓库发多个包**，版本号不同步，引用时要注意包名。

## 正确用法（README 强调的三点）

这是最有操作价值的信息：

| 要点 | 说明 |
|---|---|
| **Use Library Id** | 用库 ID 而非模糊名字查询 |
| **Specify a Version** | **指定版本** —— 不指定会拿到不匹配的文档 |
| **Add a Rule** | 声明规则：需要库文档时总是使用 Context7 |

**「Specify a Version」这一条尤其重要**——
模型训练数据滞后是这类工具要解决的核心问题，
如果不指定版本，很可能拿到的是新版本文档，行为却按老版本写。

## 认证方式与额度：三档，两处容易看错

```
手动配置：使用服务端点 https://mcp.context7.com/mcp
并通过 Authorization: Bearer YOUR_API_KEY 头传递 key
```

安装器支持 OAuth 流程自动生成 key。Free 档本身即支持 **OAuth 2.0**。

**官方原话**：API Key Recommended —— 获取免费 key 以获得更高额度。

### 额度档位（2026-10-01 核验官方 plans 页）

| 档 | 价格 | 含额度 | 超出后 |
|---|---|---|---|
| **Free** | **$0** | **1,000 次/月** | 阻塞（具体行为官方未明示） |
| **Pro** | **$10 / 席位 / 月** | **2,000 次 / 席位** | **不阻塞，$5 / 1,000 次** |
| **Enterprise** | **Custom** | Custom | Custom |

**两处最容易看错的地方**：

**① Pro 的「Unlimited API Calls」不是「不限量免费」，是「不阻塞」。**
官方对比表把 Pro 的 Additional API Calls 一栏写成
"**Unlimited ($5 / 1,000)**" —— 前半句是不阻塞，后半句才是真实单价。

**② Private Repo Parsing 是完全独立的计费项：$5 / 1M tokens。**
它与 API 调用额度是**两个钱包**，Pro 的 $10 并不包含它。
要把私有库文档接进来，这笔钱要单独算。

### 第三方数字与官方不一致（已按官方为准）

多个第三方站（2026-09 前后）称 Pro 是「**5,000 次/席位**」——
**官方页面是 2,000**。本档案采官方，第三方数字视为旧制或臆测。

### 开源的边界要划清

官方 README 自己说明：**这个仓只托管 MCP server 的源码，
API 后端、解析引擎、爬取引擎都是私有的。**
所以「MIT」指的是那部分客户端代码，不是整个服务。

## 风险评估

| 风险类型 | 评价 |
|---|---|
| 本地文件泄露 | **无** — 不碰本地文件 |
| 内网探测 | **无** — 不访问任意 URL |
| **数据出境** | **有，但范围窄** — 只发**文档问题 + 库名/ID**；不发完整 prompt、源代码、对话历史（官方声明，见下方说明） |
| 凭据风险 | 低 — 只用一个 API Key，无文件权限；官方还要求 agent 不要在查询里带凭据 |
| 服务可用性 | 依赖 Upstash 服务，本仓库无 releases 可保证服务状态 |
| **预算失控** | **有** — Free 超 1,000 次/月后行为不明；Pro 超出按 $5/1,000 次不阻塞；私有库解析另按 $5/1M tokens 计 |

**涉密场景要评估的部分**：如果你查的库名、报错信息、代码片段本身敏感，
这些会离开本机。

**但本轮补到一条官方对隐私的明确承诺**（官方 FAQ 设了专题
"How do you keep the privacy of my queries?"）：
查询只发送**文档问题与库名/ID**，
**不发送完整 prompt、源代码与对话历史**；
官方并要求 agent 不要在查询里携带凭据、个人数据或专有代码。

⚠ 这条声明是**官方自述**，本站未实测验证 —— 即没有抓包确认发出去的内容真如所述。

## 适合与不适合

需要查当前版本库文档的场景：库升级后的 API 变更、
新版本引入的配置项、模型不确定的第三方库用法。

**不适合**涉密场景**——查询内容会发送到 Upstash 服务器，需先评估数据出境。
也不适合查内部代码或私有库。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个 server 的实测重点与其他条目不同——
要测的是**文档准确度**（给定库与版本，返回的文档是否匹配当前 API），
而非能否调用成功。

## 未知项清单

- **Free 档超出 1,000 次/月后的确切行为**（官方页面只列了问题标题，未给答案正文；不做推测）
- Enterprise 的具体报价
- 文档索引的覆盖范围与更新频率（官方有「Keeping Libraries Fresh」专题，本轮未取正文）
- 服务端 SLA
- 官方隐私声明（只发查询与库名、不发源码与对话历史）**未实测验证**

## 相关条目

- [Playwright MCP Server](./playwright.md) — 同为社区维护，权限设计更透明
- [Fetch MCP Server](./fetch.md) — 同为网络访问方向
