---
id: openhands
track: harness
family: general-harness
name: OpenHands Agent Canvas
vendor: OpenHands（All-Hands-AI）
homepage: https://openhands.dev
mark: OH
accent: "#F97316"
stars: 89675
license: MIT
latest_version: 1.24.0
language: TypeScript（前端/编排） + Python（Agent Server）

# 支持哪些模型 provider（本站第一决策点）
providers:
  - 官方称「Bring your own model — Use with any LLM」（README 特性表原文）
  - 支持 LLM profiles 多配置并存（官方文档 llm-settings#llm-profiles）
  - 具体可选清单与本地模型支持方式，本次未核验（需读官方 llm-settings 页）

pricing:
  model: freemium
  monthly_usd: 0
  monthly_label: 开源自托管 Free（MIT，1 用户）/ Cloud Individual Free（1 用户，每日 10 轮对话）/ Enterprise 定制报价
  note: >-
    **本站收录的是可自托管的开源部分，不是商业版。**
    核验依据：主仓 MIT（经license API）、README 的四份 docker / npm 安装命令全部指向自建、
    官方定价页（核验 2026-10-01）。
    **⚠ 本轮核验的结论可能与预期不同：官方定价页上没有「付费个人档」**——
    三档里两档是$0，一档是定制：
    **① Open Source — Free**（本地跑：Web GUI + Terminal UI + CLI、Git 集成、
    社区支持、model agnostic，**1 用户**、**每日对话数 Unlimited**）；
    **② SaaS Individual — Free**（云端访问，支持桌面与移动端、API 用于自动化与脚本、
    Jira 与 Slack 集成，**1 用户**）；
    **③ SaaS 或 Self-hosted Enterprise — Custom pricing**（可部署在客户自有 VPC、
    Enterprise SAML/SSO、**每用户无限并发会话**、Large Codebase SDK、
    优先支持 + 共享 Slack 频道、**Named Customer Engineer**、**用户数 Unlimited**）。
    **最关键的一条硬数字：Individual 档「Max Daily Conversations = 10」。**
    对照 Open Source 档的同 一栏是 **Unlimited** ——
    **即「免费」不等于「不限量」，云端免费档每天只有 10 轮对话，
    本地自托管才是 Unlimited。** 这是选型时极易踩的落差。
    **另一条重要机制（官方 FAQ 原文）**：Individual 档**支持自带 key（BYOK）**，
    没有 key 时可用 OpenHands LLM provider，官方强调
    "**at cost, with no markup**"（按成本价、**零加价**，按量付费）——
    并可在 Settings > API 生成 API key，供 CLI / Local Web UI / Software Agent SDK 使用。
    ⚠ 「零加价」的**实际单价表本站未核验**，只能确认官方声明不加价。
pricing_pitfalls:
  - 以为「MIT 免费」等于「零成本」—— 模型推理费用、跑 agent 的机器/容器资源都要自己承担
  - 把自托管版与 OpenHands Cloud / Enterprise 混谈 —— 后者是商业托管服务，不是这个仓
  - 以为本地跑就安全 —— README 自己在两个安装选项上打了 WARNING，见 permissions
  - **以为「云端免费档」等于「不限量」—— Individual 档每天只有 10 轮对话**
    （官方对比表Max Daily Conversations：Open Source = Unlimited，
    Individual = 10，Enterprise = Unlimited）。想不限量只能本地跑或上Enterprise
  - 以为 Enterprise 只是「多几个用户」—— 它实际是另一套东西：
    可部署在**客户自有 VPC**、SAML/SSO、RBAC、集中账单、
    Large Codebase SDK、Named Customer Engineer，**报价需联系销售**

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站收录的第一个「平台型」对象 —— 它不是 SDK，是一个带Web UI 的自托管控制中心。**
  官方 README 现在的标题是 **Agent Canvas**，定位原文：
  "The self-hosted developer control center for coding agents and automations."
  （注意：仓库名与description 仍是 OpenHands / "AI-Driven Development"，
  但 README 首屏标题已改成 Agent Canvas —— **这是选型时容易踩的认知落差**。）
  **关键澄清：它能跑的不只是 OpenHands 自己的 agent。**
  README 原文："Run OpenHands, Claude Code, Codex, Gemini, or **any ACP-compatible agent**
  across local, remote, and cloud backends."
  也就是说 **Codex SDK / Claude Agent SDK 收录的这些 CLI agent，都可能被它调度** ——
  它是**位于其它 harness 之上的调度层**，不是它们的竞品。
  架构上是三个仓协作（官方 README 的 Repository boundaries 表原文列出）：
  本仓 `OpenHands/OpenHands` = 前端控制中心 + 后端选择 + 本地栈编排；
  `OpenHands/software-agent-sdk`（Python，MIT，1,190★）= Agent Server、agents、tools、conversations；
  `OpenHands/automation`（Python，MIT，32★）= 定时与 webhook 分发。
  **本站收录主仓**（星数与社区在这），但实际「编程入口」在 software-agent-sdk —— 见下方 pitfalls。
  按本站三种形态分类，它属于**第3 类：自带完整运行时**（含Web UI、REST API、多后端调度）。

axes:
  model_access: >-
    **官方口径是「任何 LLM」，但这是特性表里的一句营销式表述，本站未取到完整 provider 清单。**
    已核验的部分：README 特性表有一行 "Bring your own model — **Use with any LLM**"，
    指向官方文档 `usage/settings/llm-settings#llm-profiles`（LLM profiles，可配多套并存）。
    ⚠ **未核验**：具体支持哪些 provider（是否走 LiteLLM 一类的网关层）、
    本地量化模型能否接、以及「any LLM」在工具调用与 structured output 上的对齐度。
    **这一项对本对象尤其重要**，因为它同时是别人的调度层 ——
    「Codex / Claude Code 跑在它上面」时，能用哪些模型由那个 agent 自己决定，不由Canvas 决定。
  runtime: >-
    **四种官方部署形态并存，这是本对象最有实用价值的部分**（README 四个Option 全核验）：
    **Option 1 无沙箱本地跑**：`npm install -g @openhands/agent-canvas` 然后 `agent-canvas`，
    起完整本地栈，**要 Node.js 24+ 与 uv**；可用 `--frontend-only` / `--backend-only` 拆开跑。
    **Option 2 Docker 沙箱**：`docker run` 官方镜像，需预先准备 `PROJECTS_PATH` 宿主目录，
    agent 可访问该目录下的项目。
    **Option 3 每会话独立容器**：`OH_CONVERSATION_RUNTIME=docker agent-canvas`，
    每次新会话起自己的容器与 Agent Server，适合并发跑多个 agent；
    官方说明容器会挂载会话的 workspace 与持久化状态，**容器替换后文件与对话历史仍在**。
    **Option 4 从源码跑**：clone + `npm install` + `npm run dev`。
    入口统一在 `http://localhost:8000`（Docker 镜像是 `/canvas`）。
    **后端可远程切换**：官方说 Agent Server 可跑在笔记本 / Mac Mini / 云上 VM /
    OpenHands Cloud，Canvas 前端可在多个 Server 间切换 —— **这条是它作为「调度层」的核心能力**。
  local_files: >-
    **本地文件访问范围由你选的部署形态决定，官方把这个变量讲得很清楚。**
    无沙箱形态：README 两次打 WARNING——
    "This runs the agent-server directly on the machine you're installing on —
    **the agent will have full access to your filesystem!**"
    Docker 形态：访问范围收敛到 `PROJECTS_PATH` 挂载的目录。
    每会话容器形态：官方提示**共享同一宿主工作区的会话仍会共用同一批文件**，
    建议用独立目录或 worktree 避免冲突编辑。
    ⚠ 后端远程时（云上 VM / Cloud），你的仓库要么在远端、要么靠工具从本地取 ——
    具体同步机制本站未核验。
  background: >-
    **这是本对象最突出的强项，也是它与其他 harness 站对象最大的差别。**
    官方 README 明确：把 agent 跑在云上服务器的最大好处是
    "allows your agents to **continue running even when your laptop is shut**"，
    且更容易通过 Slack / GitHub / Datadog 等第三方服务触发。
    配套有独立仓 `OpenHands/automation`（核验2026-10-01：Python，MIT，32★，活跃）
    提供定时（schedule）与 webhook 事件触发两种触发方式，
    官方特性表列了可集成的第三方：Slack、GitHub、Linear、Notion。
    **对照本站其余对象**：OpenAI Agents SDK、Deep Agents、Codex SDK 的 thread 状态都在
    自己进程 / 自己机器上，关了就没了；这是唯一把「关掉笔记本后 agent 仍在跑」当卖点做的。
  tools: >-
    **工具面来自它所调度的那个 agent，而不是 Canvas 自己。**
    官方原文明确它能跑 "OpenHands, Claude Code, Codex, Gemini, or any ACP-compatible agent"
    —— 即**通过 Agent Client Protocol（ACP）接入第三方 agent**。
    真正的工具/agent 定义在 `OpenHands/software-agent-sdk`
    （官方职责表：agents, tools, conversations, workspaces, events）。
    ⚠ **本对象没有以 MCP 为接口**（README 与仓库结构里未见 MCP 相关表述）——
    它用的是 ACP。这两个协议的定位差异本站未展开，标记为未核验。
  context: >-
    **⚠ 这一维度是本对象的重大信息缺口，本站明确记为未知。**
    已核验的只有持久化方向：`automation` 仓负责 run history，
    每会话容器形态下官方说「workspace files and conversation history survive container replacement」。
    **但对话上下文长了之后如何压缩、摘要或落盘，README 与本文所引文档均未说明**，
    software-agent-sdk 的具体上下文策略本站未核验。
    按本站主张「状态 ≠ 上下文」：**它把「状态」做得很完整（定时触发 + run 历史 + 容器可替换），
    但「上下文」这一侧本站拿不到证据**，不能因为它有持久化就推断它有上下文管理。
  permissions: >-
    **这是本对象最需要认真读的部分，也是它官方做得最细的一块。**
    **沙箱**：见 local_files —— 官方提供 Docker 沙箱与每会话独立容器两种收敛手段，
    但也明确提供了无沙箱形态并两次挂 WARNING。
    **认证**：`docs/SELF_HOSTING.md`（核验 286行）给的是 **API key 机制而非用户体系**：
    生成 key 用 `openssl rand -base64 32` 赋给 `LOCAL_BACKEND_API_KEY`；
    `--public` 模式下 **key 不烘进前端**，用户首次打开 UI 要手动粘贴 key 才能用，
    之后每个 `/api/*` 请求都要带 `X-Session-API-Key` 头。
    **默认绑定是 loopback-only**（127.0.0.1），官方说明这是为了让自动注入的 session key
    不被局域网其他机器拿到；要监听 `0.0.0.0` 时 key 不再注入、改用同样的 API-key 输入界面。
    官方还提醒用 `export` 而不是命令行参数传 key，避免出现在 `ps aux` 进程列表里。
    **暴露到公网时官方另有防火墙要求**（Cloud Firewall / AWS Security Group / GCP firewall rule）。
    ⚠ **未核验**：多用户与权限分级（这是它作为团队级平台最可能被追问的点，
    SELF_HOSTING.md 里的证据集中在「怎么保护单个 key」，未见用户/角色体系）。
  fit: >-
    **适合**：要把agent 放到自己服务器上 7×24 跑；需要定时或 webhook 触发（Slack / GitHub / Linear / Notion）；
    想用一个界面统管多种agent（含Codex、Claude Code、Gemini 等 ACP 兼容的）；
    需要 per-conversation 隔离容器；团队里前端/平台与 agent 运行时分离部署。
    **不适合**：只想要一个轻量库把agent 嵌进自己的 Python 进程（用 software-agent-sdk 或 OpenAI Agents SDK）；
    单机临时用一下（它是一整套栈，不是库）；
    需要细粒度多用户权限与审计（本站未核验其能力）。

pitfalls:
  - 以为是 Python SDK —— **主仓是 TypeScript 的 Web 控制中心**；编程入口在 `OpenHands/software-agent-sdk`（另 1,190★）
  - 看仓库名与 description 以为是「AI 驱动的软件开发工具」 —— **README 首屏标题已是 Agent Canvas**，定位是控制中心
  - 以为它是 Codex SDK / Claude Agent SDK 的竞品 —— **它是它们的调度层**（README 明确说能跑这些 agent）
  - 直接跑 Option 1 就上线 —— 官方在该选项上打 WARNING：agent 对你的文件系统有全量访问权限
  - 把 `--public` 模式理解成「更方便」—— 它是**不把 key 烘进前端**的防护手段，用于非本机访问
  - 以为「有 run history」就等于「有上下文管理」—— 前者是状态，后者本站未核验
  - 以为它用 MCP —— 它用的是 ACP（Agent Client Protocol），不是 MCP

tags: [TypeScript, Python, 开源, MIT, 自托管, 平台型, WebUI, 调度层, ACP, 沙箱, 定时任务, webhook, 多后端]

sources:
  - label: OpenHands/OpenHands · 仓库（Agent Canvas 控制中心，89,675★，MIT，核验 2026-10-01）
    url: https://github.com/OpenHands/OpenHands
    kind: repo
  - label: 主README（Agent Canvas 定位、四种部署形态、ACP 接入、Repository boundaries 表）
    url: https://github.com/OpenHands/OpenHands/blob/main/README.md
    kind: docs
  - label: docs/SELF_HOSTING.md（API key、--public 模式、loopback 默认、防火墙要求）
    url: https://github.com/OpenHands/OpenHands/blob/main/docs/SELF_HOSTING.md
    kind: docs
  - label: 官方定价页（核验 2026-10-01：Open Source $0 / Cloud Individual $0 / Enterprise 定制；**Individual Max Daily Conversations = 10** 而 Open Source 为 Unlimited；BYOK 与 "at cost, with no markup"；Enterprise 可部署客户自有 VPC、SAML/SSO、RBAC、每用户无限并发）
    url: https://www.all-hands.dev/pricing
    kind: pricing
  - label: OpenHands/software-agent-sdk · 仓库（Python SDK 与 Agent Server 的真实所在，1,190★，MIT）
    url: https://github.com/OpenHands/software-agent-sdk
    kind: repo
  - label: OpenHands/automation · 仓库（定时与 webhook 分发，32★，MIT）
    url: https://github.com/OpenHands/automation
    kind: repo
  - label: Releases（v1.24.0 @ 2026-09-25）
    url: https://github.com/OpenHands/OpenHands/releases
    kind: changelog
  - label: 官方文档 · LLM settings / LLM profiles（README 指向，本次未取到正文）
    url: https://docs.openhands.dev/openhands/usage/settings/llm-settings
    kind: docs
  - label: 官方文档 · ACP Agents（README 指向）
    url: https://docs.openhands.dev/openhands/usage/agent-canvas/acp-agents
    kind: docs
  - label: npm 包@openhands/agent-canvas（README 安装入口）
    url: https://www.npmjs.com/package/@openhands/agent-canvas
    kind: repo

link:
  url: https://openhands.dev
  kind: official

related:
  - id: codex-sdk
    note: **调度关系，不是竞争关系**：README 明确 Agent Canvas 能跑 Codex。本档案讲的是「谁给你调度」，codex-sdk 讲的是「被调度的是什么」。
  - id: claude-agent-sdk
    note: 同上，Claude Code 也是它声明可调度的 agent 之一。
  - id: deepagents
    note: 都是batteries-included 那一档，但 deepagents 是一个库、OpenHands 是一整套带Web UI 的栈。
  - id: langgraph
    note: 若要的是「用代码定义流程」而非「用界面调度 agent」，编排框架才是对应层。

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**「自托管的 agent 控制中心」** —— 官方 README 现在给它起的名字是 **Agent Canvas**，
定位原文：

> The self-hosted developer control center for coding agents and automations.
> Run OpenHands, Claude Code, Codex, Gemini, or **any ACP-compatible agent**
> across local, remote, and cloud backends.

## 形态澄清：这不是 SDK，是平台，且它在别人之上

本站三种编程底座形态里，它属于第3 类 **自带完整运行时**，而且是**唯一带 Web UI 的一个**。

### 三个容易踩的认知落差

**① 主品牌已改成 Agent Canvas，但仓库名没变。**
仓库 description 还是 "🙌 OpenHands: AI-Driven Development"，但 README 首屏标题是 Agent Canvas。
另外它现在的定位是 **control center（控制中心）**，不再是「一个开发工具」。

**② 它能跑的不只是 OpenHands 自己的 agent。**
README 原文列了 "OpenHands, Claude Code, Codex, Gemini, or any ACP-compatible agent"。

> **这意味着它和本站收录的 Codex SDK / Claude Agent SDK 不是竞品，而是调度层与被调度者的关系。**
> 选型问题不是「选它还是选 Codex」，而是「要不要一个界面来统管 Codex / Claude Code / Gemini」。

**③ 真正的编程入口在另一个仓。**
官方 README 有一张 Repository boundaries 表，本档逐字记录：

| 仓库 | 职责 | 核验（2026-10-01） |
|---|---|---|
| `OpenHands/OpenHands` | 前端控制中心、后端选择、本地栈编排 | 89,675★ · MIT · TypeScript |
| `OpenHands/software-agent-sdk` | **Python SDK、Agent Server、agents、tools、conversations、workspaces、events** | 1,190★ · MIT · Python |
| `OpenHands/automation` | 定时调度、webhook、run history、分发 | 32★ · MIT · Python |

⚠ **89,675★ 是控制中心的星数，不是 SDK 的星数**。
如果你要的是「嵌进自己 Python 进程的 SDK」，那对象是 `software-agent-sdk`（1,190★），不是本条目。
**本站本次未单独收录它** —— 见下方实测建议第 1 条。

## 定价：三档里两档是 $0，但「免费」有个硬上限

2026-10-01 核验官方定价页。**结论可能与预期不同：没有「付费个人档」。**

| 档位 | 价格 | 部署 | 用户 | 每日对话 |
|---|---|---|---|---|
| **Open Source** | **Free** | 本地 | 1 | **Unlimited** |
| **SaaS Individual** | **Free** | 云端 | 1 | **10** |
| **Enterprise** | **Custom**（Contact Us） | SaaS 或**客户自有 VPC** | Unlimited | Unlimited |

**① 最关键的一条落差：云端免费档每天只有 10 轮对话。**
官方对比表同一栏：Open Source = **Unlimited**，Individual = **10**，Enterprise = Unlimited。
**即「免费」不等于「不限量」—— 想不限量只有两条路：本地跑，或上Enterprise。**

**② Individual 支持自带 key（BYOK）。**
官方 FAQ 原文：Open Source 与 Cloud 各档都支持自带 LLM key。
没有 key 时可用 OpenHands LLM provider，官方强调 "**at cost, with no markup**"
（按成本价、**零加价**，按量付费），可在 Settings > API 生成 API key
供 CLI / Local Web UI / Software Agent SDK 使用。
⚠ 「零加价」的**实际单价表未公开**，只能确认官方声明不加价。

**③ Individual 还有一批 OSS 档没有的东西**：云端访问（桌面 + 移动端）、
Cloud API 用于自动化与脚本、Jira 与 Slack 集成、Secrets、组织支持。

**④ Enterprise 实际是另一套东西，不是「多几个用户」**：
可部署在**客户自有 VPC**、Enterprise SAML/SSO、多用户 RBAC、集中团队账单、
**每用户无限并发会话**、Large Codebase SDK、
**Named Customer Engineer + 共享 Slack 频道 + 优先支持**。报价需联系销售。

## 四种部署形态：这是本对象最实用的部分

README 的四个 Option 全部核验：

| 形态 | 命令要点 | 沙箱 | 要Node 24+/uv？ |
|---|---|---|---|
| **① 无沙箱本地** | `npm i -g @openhands/agent-canvas` → `agent-canvas` | ❌ 无 | 是 |
| **② Docker 沙箱** | `docker run ... ghcr.io/openhands/agent-canvas:1.24.0` | ✅收敛到 `PROJECTS_PATH` | 否 |
| **③ 每会话独立容器** | `OH_CONVERSATION_RUNTIME=docker agent-canvas` | ✅每会话隔离 | 是 + Docker |
| **④ 从源码** | clone → `npm install` → `npm run dev` | ❌ 无 | 是 |

**① 和 ④ 官方都挂了同一条 WARNING**：

> This runs the agent-server directly on the machine you're installing on —
> **the agent will have full access to your filesystem!**

**③ 适合并发**：每次新会话起自己的容器与 Agent Server。
官方特别说明容器会挂载会话的 workspace 与持久化状态，**容器替换后文件与对话历史仍在** ——
这对本站关心的「可靠长期运行」是正面证据。
但官方也提醒：**用同一宿主工作区的会话仍会共用同一批文件**，建议用独立目录或 worktree 避免冲突编辑。

## 背景任务：这是它最突出的强项

README 说得很直接：

> The most powerful way to run OpenHands is on a server in the cloud.
> This allows your agents to **continue running even when your laptop is shut**,
> and makes it easier to trigger your agents through third-party services like
> Slack, GitHub, and Datadog.

配套是独立仓 `OpenHands/automation`（核验 2026-10-01：Python · MIT · 32★ · 活跃），
提供定时与 webhook 两种触发，官方特性表列了可集成的第三方：**Slack、GitHub、Linear、Notion**。

**对照本站其他对象**：OpenAI Agents SDK 的 session、Codex SDK 的 thread
都活在你自己进程 / 自己机器上，关掉就没了。**「关掉笔记本后 agent 仍在跑」只有这个对象是当卖点做的。**

## 权限与安全：官方做得细，但你要选对形态

`docs/SELF_HOSTING.md`（核验 286 行）的关键设计是**API key 而非用户体系**：

| 机制 | 官方原文 / 参数 | 作用 |
|---|---|---|
| key 生成 | `openssl rand -base64 32` → `LOCAL_BACKEND_API_KEY` | 256 位 |
| `--public` 模式 | key **不烘进前端**，用户首次打开 UI 要粘贴 key | 防止 key 被前端代码泄露 |
| 请求头 | 每个 `/api/*` 都要带 `X-Session-API-Key` | 会话级鉴权 |
| 默认绑定 | **loopback-only（127.0.0.1）** | 官方说明：为了不让自动注入的 session key 被局域网其他机器拿到 |
| 监听全网卡 | `--host 0.0.0.0` 或 `OH_BIND_HOST` | 此时 key 不再注入，改用同样的输入界面 |
| 传 key 的姿势 | 用 `export` 而非命令行参数 | **避免出现在 `ps aux` 进程列表里** |
| 公网暴露 | 官方要求另配防火墙（Cloud Firewall / AWS SG / GCP firewall rule） | |

⚠ **未核验：多用户与权限分级。** SELF_HOSTING.md 的证据集中在「怎么保护单个 key」，
没有看到用户 / 角色 / 审计体系。**团队级使用时这一点要先问清。**

## 上下文维度：本站明确记为未知

这档对象持久化做得很好（run history、容器可替换后历史仍在），
**但对话上下文长了之后如何压缩、摘要或落盘，README 与本文所引文档均未说明。**

按本站主张「**状态 ≠ 上下文**」：
- **状态** ✅ 有官方证据（定时/webhook 触发、run history、容器可替换后历史保留）
- **上下文** ❓ 拿不到证据

**不能因为它有持久化就推断它有上下文管理** —— 这正是本站反复强调的那条分野。

## 协议：它用 ACP，不是 MCP

README 讲第三方 agent 接入时用的是 **Agent Client Protocol（ACP）**，仓内结构未见 MCP 表述。
ACP 与 MCP 的定位差异本站未展开研究，标记为未核验。

**这一条对选型有直接影响**：如果你已有的 MCP server 生态想直接复用，
在 OpenHands 上能不能用、走什么路径，本站尚无答案。

## 适合与不适合

**适合**：agent 要放自己服务器 7×24 跑；需要定时/webhook 触发（Slack / GitHub / Linear / Notion）；
想一个界面统管 Codex / Claude Code / Gemini 等多种 agent；需要 per-conversation 容器隔离；
前端与运行时分离部署。
**不适合**：只想把 agent 嵌进自己的 Python 进程（用 software-agent-sdk 或 OpenAI Agents SDK）；
单机临时用一下（它是一整套栈）；需要细粒度多用户权限（本站未核验其能力）。

## 核验说明

`confidence: partial` 的依据：

**为什么不是 verified**：八维度里 `context` 这一维**证据缺失**——
对话上下文长了之后如何压缩、摘要或落盘，README 与本文所引官方文档均未说明。
本站的validate 规则会检查「verified 的条目八个维度里不能出现『未知』」，本条触线了，故降级。
换句话说：**本条目的「有」都核得很实（形态、部署、权限、背景任务），
但「长任务怎么撑住」这个本站最看重的维度没有答案。**

已核验（这部分扎实）：仓库存在与星数（89,675）、许可（MIT，经 license API）、
最近推送（2026-10-01，仍活跃）、最新版 **v1.24.0**（releases @ 2026-09-25）、
README 全文九节（定位、四项特性表、Quickstart 四种 Option、Architecture 与
Repository boundaries 表、More documentation）、`docs/SELF_HOSTING.md` 286 行的安全机制要点、
仓库顶层目录结构（`helm/`、`vercel.json`、`electron-builder.config.mjs`、`.openhands/`、`docker/` 等）、
`software-agent-sdk`（1,190★ · MIT · Python）与 `automation`（32★ · MIT · Python）两仓元数据

未核验：**对话上下文压缩与摘要策略（降级主因）**、
「any LLM」的完整 provider 清单与 LiteLLM 类网关的存在形式、LLM profiles 的具体配置格式、
本地量化模型能否接入、ACP 与 MCP 的定位差异、多用户/角色/审计体系是否存在、
后端远程时本地仓库的同步机制、
`software-agent-sdk` 的 API 形态

**本轮（2026-10-01）补上的**：官方定价页三档已核实 ——
Open Source $0 / Cloud Individual $0 / Enterprise 定制；
**Individual 每日 10 轮对话上限**（对照Open Source 的 Unlimited）；
Individual 支持 BYOK、无 key 时走 OpenHands provider 且官方声明 **at cost, no markup**；
Enterprise 可部署客户自有 VPC、SAML/SSO、RBAC、每用户无限并发。
Enterprise 的具体报价与「零加价」的实际单价表仍未核验。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按本对象形态定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | `software-agent-sdk` 单独用（不启 Canvas）能不能跑最小 agent | 决定你到底需不需要这一整套栈 |
| 2 | 长任务（跨天）对话上下文如何处理、成本如何变化 | 补上本站最大的信息缺口 |
| 3 | 每会话容器模式的**真实隔离强度**（同宿主工作区会共用文件这条要实测） | 官方已提示冲突风险 |
| 4 | Docker 形态下 agent 能否绕过 `PROJECTS_PATH` 触达宿主其他路径 | 沙箱有效性是选型前提 |
| 5 | 挂 Claude Code / Codex 作为 ACP agent 的实际接入成本 | 它最独特的卖点，值不值得取决于这个 |
| 6 | webhook 触发的幂等性与重复触发处理 | 定时/webhook 是它的主打场景 |

## 未知项清单

- 「any LLM」的具体 provider 清单与能力对齐度
- 对话上下文压缩/摘要/落盘策略（**本站最看重的维度，证据缺失**）
- 多用户、角色与审计体系是否存在
- ACP 与 MCP 的关系：能否复用已有 MCP server 生态
- **Enterprise 的具体报价**（官方仅标 Custom pricing / Contact Us）
- OpenHands LLM provider「at cost, no markup」的**实际单价表**（官方声明不加价，数字未公开）
- Individual 每日 10 轮之外，超出后的行为（停用 / 提示升级 / 其它，官方页未写）
- 后端远程部署时本地代码库的同步机制
- `software-agent-sdk` 的 API 形态与版本独立节奏
- 每会话容器在并发压测下的资源与稳定性

## 相关条目

- [Codex SDK](./codex-sdk.md) — **调度关系**：README 明确 Agent Canvas 能跑 Codex
- [Claude Agent SDK](./claude-agent-sdk.md) — 同上，Claude Code 也是它声明可调度的 agent
- [Deep Agents](./deepagents.md) — 同为 batteries-included 那一档，但它是库、这个是整套栈
- [LangGraph](./langgraph.md) — 要「用代码定义流程」而非「用界面调度 agent」时的对应层