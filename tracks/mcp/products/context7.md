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
  monthly_usd: null
  monthly_label: 未核验定价方案
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    **README 明确写「API Key Recommended」并指向 context7.com/dashboard 获取免费 key 以获得更高额度。**
    **本次未核验具体的额度档位与付费方案，记为未知。**
    开源部分为 MIT，但服务端为托管形态。
pricing_pitfalls:
  - 以为是纯本地工具，实际核心是远程服务，会把你的查询发到 Upstash
  - 以为不配 key 就能无限用，官方推荐配 key 以获得更高额度，反过来说明有额度限制

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
    官方推荐配置 key 以获得更高额度，
    **具体额度档位本次未核验，记为未知**。
  scope: >-
    **无本地权限风险，但有数据出境风险**：
    查询内容会发送到 Upstash 服务器。
    传入的库名与问题文本属于对外传输内容，
    涉密场景需评估。
    服务端自身的文档索引范围由 Upstash 掌握，客户端不可见。

tags: [检索, 网络, 远程]

sources:
  - label: Upstash · Context7 README（API Key 与远程端点说明）
    url: https://github.com/upstash/context7
    kind: docs
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

last_verified: 2026-09-29
last_updated: 2026-09-29
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

## 认证方式

```
手动配置：使用服务端点 https://mcp.context7.com/mcp
并通过 Authorization: Bearer YOUR_API_KEY 头传递 key
```

安装器支持 OAuth 流程自动生成 key。

**官方原话**：API Key Recommended —— 获取免费 key 以获得更高额度。

**注意这句话的反面含义**：不配 key 时额度更低，说明**确实存在额度限制**，
但具体限制是多少，README 未说明，本次未核验。

## 风险评估

| 风险类型 | 评价 |
|---|---|
| 本地文件泄露 | **无** — 不碰本地文件 |
| 内网探测 | **无** — 不访问任意 URL |
| **数据出境** | **有** — 查询内容发到 Upstash |
| 凭据风险 | 低 — 只用一个 API Key，无文件权限 |
| 服务可用性 | 依赖 Upstash 服务，本仓库无 releases 可保证服务状态 |

**涉密场景要评估的部分**：如果你查的库名、报错信息、代码片段本身敏感，
这些会离开本机。

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

- **额度档位与付费方案**（官方提到"更高额度"但未列具体数字）
- 不配置 API Key 时的具体限制
- 文档索引的覆盖范围与更新频率
- 服务端 SLA

## 相关条目

- [Playwright MCP Server](./playwright.md) — 同为社区维护，权限设计更透明
- [Fetch MCP Server](./fetch.md) — 同为网络访问方向
