---
id: zed
track: ide
name: Zed
vendor: Zed Industries
homepage: https://zed.dev
mark: Z
accent: "#3AB7FF"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 有 Zed-Hosted 模型计费路径，档位未核验
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    模型接入有 **5 条路径**（官方文档列明）：Zed-Hosted Models（经 Zed 计费）、
    API Access、Existing Subscription（复用 ChatGPT / Claude / Copilot 订阅）、
    Gateway（OpenRouter / Bedrock / Vercel 等）、Local Model（本地或自托管）。
    **编辑器的免费/付费分层与模型额度关系本次未核验。**
pricing_pitfalls:
  - 以为必须用 Zed 的模型才能用它的 Agent，其实有 5 条接入路径
  - 以为「Zed 定价」等于「模型费用」，二者是分开的计费口径

axes:
  model_access: >-
    **官方列出 5 条模型接入路径**（docs/src/ai/llm-providers.md）：
    一是 Zed-Hosted Models（经 Zed 计费）；
    二是 API Access（用自己的 provider 额度，含 Anthropic 兼容与 OpenAI 兼容两种）；
    三是 Use an Existing Subscription（复用已付费的 ChatGPT / Claude / Copilot 等）；
    四是 Use a Gateway（经 OpenRouter / Bedrock / Vercel 等网关路由）；
    五是 **Use a Local Model**（本地运行或自托管）。
    **路径选择由用户决定，不是绑定的单一供应商。**
  runtime: >-
    **本地桌面应用**（Rust 实现，非浏览器端）。
    官方自述来自 Atom 与 Tree-sitter 的创造者，主打性能与多人协作。
    文档含 `dev-containers.md`（开发容器）与 `toolchains.md`（工具链管理）。
    关闭应用即停止。
  local_files: >-
    直接读写工作区，**基于 Tree-sitter 做语法解析**（其核心优势之一），
    为符号级编辑提供基础。
    文档站有 `edit-prediction.md`（编辑预测），且**编辑预测有独立的 provider 配置**
    （与 LLM provider 分开设置）。
    **索引算法与大仓库表现本次未核验，记为未知。**
  background: >-
    **官方明确区分三类 agent path**，其中 External Agents 与 Terminal Threads
    依赖外部进程（ACP agent 进程 / 原生 CLI），
    因此**其在线条件取决于那个外部工具，而非 Zed 本身**。
    Zed 不提供云端后台执行。**具体行为本次未核验，记为未知。**
  tools: >-
    **明确支持 MCP**，官方文档 `mcp.md` 列明当前支持 **Tools 与 Prompts** 两类特性
    （Discovery / Sampling / Elicitation 尚未覆盖，官方欢迎贡献）。
    另处理 `notifications/tools/list_changed`——
    server 运行时增删改工具时 Zed 自动重载列表，无需重启 server。
    MCP 可通过两种方式接入：作为 extension 安装，或在
    Settings → AI → MCP Servers 里添加本地 / 远程 server。
    官方列出的热门 extension server 包括 Context7、GitHub、Puppeteer、Gem、
    Brave Search、Framelink Figma、Resend 等。
  context: >-
    **Zed Agent 的上下文由 instructions + skills + MCP 组合而成**
    （见 agents.md 的 Zed Agent 行）。
    支持并行 agent（`parallel-agents.md`），线程类型分三类。
    **上下文窗口大小与压缩策略本次未核验，记为未知。**
  permissions: >-
    **权限边界跟随所选的 agent path**——
    Zed Agent 用 Zed 配置的 provider 与原生工具；
    External Agents 用 ACP agent 进程**自己的 auth/config**；
    Terminal Threads 用**原生 CLI 的 auth/config**。
    也就是说选了外部 agent，权限就由那个工具决定。
    **沙箱与审批的具体形态本次未核验，记为未知。**
  fit: >-
    重视编辑器性能（Rust 实现）、语法解析准确度（Tree-sitter）与多人协作的场景。
    **想在一个编辑器里同时用 Zed 原生 Agent 和外部 CLI Agent（Claude / Codex / OpenCode / Copilot / Cursor）的用户**
    —— 这是 Zed 最独特的价值：它是 agent 的**运行与编排层**，不是单一 agent。

pitfalls:
  - 把 Zed 当成又一个 AI 编码工具，它实际是「三种 agent path 的编排层」，能用 Claude / Codex / OpenCode / Cursor
  - 以为模型是绑定的，实际有 5 条接入路径，含本地模型与复用现有订阅
  - 选了 External Agent 后以为权限由 Zed 管，实际由那个 agent 自己的 auth/config 决定

tags: [编程, IDE, 本地, 协作]

sources:
  - label: Zed · LLM Providers（五条模型接入路径）
    url: https://zed.dev/docs/ai/llm-providers
    kind: docs
  - label: Zed · Agents（三类 agent path 对比）
    url: https://zed.dev/docs/ai/agents
    kind: docs
  - label: Zed · MCP（支持的协议特性与三种 agent path 的 MCP 行为）
    url: https://zed.dev/docs/ai/mcp
    kind: docs
  - label: Zed · Releases（v1.21.0 @ 2026-09-23）
    url: https://github.com/zed-industries/zed/releases
    kind: changelog
  - label: Zed · 仓库
    url: https://github.com/zed-industries/zed
    kind: repo
  - label: Zed · 文档站
    url: https://zed.dev/docs
    kind: docs

link:
  url: https://zed.dev
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**不是「又一个 AI 编码工具」，而是三种 agent path 的编排层** —— 能在同一个编辑器里用 Zed 原生 Agent，也能挂 Claude / Codex / OpenCode / Copilot / Cursor。

## 最重要的发现：Zed 自己就用「harness」这个词

官方 `agents.md` 原文：

> An agent path is sometimes called **a harness**. It is the way agentic work is started,
> displayed, configured, and controlled in Zed.

**这句话把 AgentClash 那个「Harness 章节」的理论直接落到了产品文档里**：
Agent 产品对比和 Harness 对比不是两件事，AgentClash 区分它们是因为它们落在不同的层，
而 Zed 明确说「agent path 有时也叫 harness」。

## 三类 agent path（官方表格原文）

| Agent path | 运行在 | 用什么 | 适合 |
|---|---|---|---|
| **Zed Agent** | Agent Panel + Threads 侧栏 | Zed 配置的 LLM provider、原生工具、skills、instructions、MCP | 想要 Zed 的原生集成 |
| **External Agents** | Agent Panel + Threads 侧栏 | **ACP agent 进程及其自己的 auth/config** | 想用 Claude、Codex、OpenCode、Copilot、Cursor、Pi 等 |
| **Terminal Threads** | Threads 侧栏 + 终端 | **原生 CLI / TUI 的 auth/config** | 想保留该工具的命令行体验 |

**这张表的信息量很大**：

- External Agents 明确支持 **Claude、Codex、OpenCode、Copilot、Cursor** —— 都是本仓库收录的对象
- **权限由谁决定，答案在第二、三列**：选了 External Agent，auth/config 就是那个 agent 的
- Zed 把自己定位成「怎么启动、显示、配置、控制 agent」的那一层

## 五条模型接入路径（这个赛道独一份）

| 路径 | 适合 | 真相源 |
|---|---|---|
| **Zed-Hosted Models** | 想让 Zed 代计费 | Account & Billing |
| **API Access** | 已有 provider 额度 | 含 Anthropic 兼容 / OpenAI 兼容 |
| **Existing Subscription** | **已经付了 ChatGPT / Claude / Copilot** | 复用订阅 |
| **Gateway** | 经 OpenRouter / Bedrock / Vercel 路由 | 网关配置 |
| **Local Model** | **本地跑或自托管** | 本地配置 |

**第 3 条和第 5 条是差异化**：
- 复用已有订阅 = 边际成本可以是 0
- 本地模型 = 数据完全不出机器

**另一条重要区分**（官方明确）：
> Model access paths do not configure External Agents or Terminal Threads.
> External Agents and Terminal Threads usually own their own model access, auth, and configuration.

**即：Zed 的模型设置管不到外部 agent。** 这是很容易误解的点。

## MCP 支持的确切范围

| 项目 | 状态 |
|---|---|
| **Tools** | ✅ 支持 |
| **Prompts** | ✅ 支持 |
| Discovery / Sampling / Elicitation | ❌ 尚未覆盖（官方欢迎贡献） |
| `notifications/tools/list_changed` | ✅ 处理——server 运行时改工具列表会**自动重载，无需重启** |

**两种接入方式**：
1. 作为 **extension** 安装（官方列了 Context7 / GitHub / Puppeteer / Gem / Brave Search / Figma / Resend 等）
2. 在 **Settings → AI → MCP Servers** 里添加本地或远程 server

**三种 agent path 的 MCP 行为不同**：

| agent path | MCP 行为 |
|---|---|
| Zed Agent | 直接用 Zed 配置的 MCP server |
| External Agents | Zed **可通过 ACP 转发**已配置的 server；agent 也可读自己的原生 MCP 配置 |
| Terminal Threads | **原生 CLI/TUI 读自己的 MCP 配置** |


## 适合与不适合

重视编辑器性能（Rust）、语法解析准确度（Tree-sitter）与多人协作的场景。
**想在一个编辑器里混用原生 Agent 与外部 CLI Agent** 的用户 —— 这是它最独特的价值。

**不适合**把「编辑器自带 AI」当唯一卖点去找的用户 ——
Zed 的定位是 agent 的编排层，不是「我自带一个模型」。
也不适合需要实测才知道大仓库表现的人 —— 索引策略官方未公开说明。

## 与本站其他站点的关系

Zed 的 External Agents 直接涉及本仓库收录的多个对象：

| Zed 里的 agent path | 对应本仓库条目 |
|---|---|
| External Agents 列表 | [Claude Code](./claude-code.md) · [Codex IDE](./codex-ide.md) · [Cline](./cline.md) · [Copilot](./copilot.md) · [Cursor](./cursor.html) |
| Terminal Threads | 本仓库 [cli 赛道](../cli/_track.md) 全部对象 |
| MCP 扩展 | [mcp 赛道](../mcp/_track.md) |

**这意味着 Zed 是本仓库三赛道的一个交叉点** ——
它把 ide / cli / mcp 三层的边界画得比任何一家都清楚。

## 采集限制（诚实说明）

**本次从 `zed-industries/zed` 仓库的 `docs/src/ai/` 逐篇读取官方文档**，
已补齐 6 个维度中的 5 个。

**仍未核验**：
- 索引算法与大仓库表现（`edit-prediction.md` 讲的是编辑预测，不是全库索引）
- 上下文窗口与压缩策略
- 沙箱与审批的具体形态
- 编辑器免费/付费分层与模型额度的关系
- 三类 agent path 在「客户端关闭后」的实际行为

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应是**混合 agent 场景** ——
比如在 Zed 里挂 Claude Code 做 T01 任务，与直接用 Claude Code CLI 对比，
验证「编排层 + 外部 agent」是否比纯 CLI 更顺手，还是只是多一层壳。

## 未知项清单

- 索引算法与大仓库表现
- 上下文窗口与压缩策略
- 沙箱与审批的具体形态
- 编辑器定价与模型额度的关系
- 客户端关闭后各 agent path 的行为

## 相关条目

- [Cline](./cline.md) — 同为三形态覆盖，但形态是 Zed Agent / 外部 / 终端而非编辑器扩展
- [Claude Code](./claude-code.md) — 可作为 Zed 的 External Agent 运行
- [Aider](./aider.md) — 同属「编辑器外挂 watch 模式」思路
