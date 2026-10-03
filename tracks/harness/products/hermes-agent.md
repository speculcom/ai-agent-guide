---
id: hermes-agent
track: harness
family: general-harness
name: Hermes Agent
vendor: Nous Research
homepage: https://hermes-agent.nousresearch.com/
mark: HA
accent: "#FFD700"
stars: 250401
license: MIT
latest_version: v2026.9.24
language: Python

# 支持哪些模型 provider（本站第一决策点）
providers:
  - Nous Portal（自家，README 提到可跳过 API key 收集）
  - OpenRouter、OpenAI、自建endpoint（README 明示）
  - 完整清单见官方 docs/integrations/providers（本次未取到正文）

pricing:
  model: open-source
  monthly_usd: 0
  monthly_label: 框架免费（MIT）；推理按你选的 provider 计费；Nous Portal 另有订阅（免费层 + 付费档，官网未公开定价页）
  note: >-
    **框架 MIT 免费，推理与后端资源自理。**
    核验依据：仓库 MIT（经 license API）、README 的安装命令与 Nous Portal 入口。
    **有三条可能产生额外成本的路**：
    （1）OpenAI / Anthropic 等按量的API；
    （2）**Modal / Daytona 等 serverless 后端** —— 官方说这两家提供
    "serverless persistence"，agent 环境空闲时休眠、按需唤醒，"costing nearly nothing between sessions"；
    （3）自建GPU 集群或 $5 VPS（官方举例）。
    **⚠ Nous Portal 的计费本轮核验结果是「官网不公开，只有第三方口径」**：
    抓取 `portal.nousresearch.com` 首页**只有定性描述，没有一个价格数字** ——
    原文是 "the models, the tools, the cloud"、模型目录
    "spans hundreds of models from every frontier lab, with **free options and
    Portal-only discounts**"，只说有免费选项和 Portal 专属折扣，
    **没给任何档位与金额**。`portal.nousresearch.com/pricing` 返回 **404（Page not found）**。
    四个互相独立的第三方来源（hostinger、moscarillo、aiidelist、standardcompute、
    toolin）给出一致口径：**Free $0 / Plus $20 每月含 $22 额度 /
    Super $100 含 $110 / Ultra $200 含 $220**，另称付费档含Tool Gateway
    （搜索/图像/语音/浏览器自动化）、免费档不含额度也不含 Tool Gateway、
    额度可按月 rollover（有上限）。
    ⚠ **这些数字本站标为「第三方口径，未获官方确认」** ——
    四个来源一致不等于官方确认，且按 v3 铁律「未知就说未知」，不写成已核实。
    **选型前请以登录后 Portal 内的账单页为准。**
    **另有一条值得单独记**：有第三方明确写出
    「$20 买到 $22 额度是**预付计量表**，不是包月无限」——
    即订阅价 ≠ 月度账单，实际取决于用量。长agent 循环能几天烧完一档额度。
    ⚠ 该说法本身也来自第三方，本站未实证。
pricing_pitfalls:
  - 以为「跑在 $5 VPS 上」就是低成本的全部 —— 多后端并行、或用 Modal/Daytona 的
    唤醒频率决定实际账单，官方没给成本模型
  - 把 serverless 后端理解成「永远关着」—— 官方说的是**休眠**（hibernates when idle），
    唤醒有延迟，且持久化语义需自己验证
  - 以为免费模型能跑全部功能 —— 模型能力与工具调用可靠性取决于所选 provider，本站未核验
  - **把 Nous Portal 的订阅价当成月度账单** —— 多个第三方来源指出额度制
    （$20 档含$22 额度）是**预付计量**、额度按月 rollover 有上限，
    长 agent 循环消耗速度远高于普通聊天
  - 把第三方站（hostinger / standardcompute 等）列的 Portal 档位当官方数字 ——
    **Nous Research 官网没有公开定价页**，首页只有定性描述，
    `portal.nousresearch.com/pricing` 是 404，数字全来自第三方

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站收录对象里星数最高、且形态最特殊的一个 —— 它是「通用助手型」而不是「编程型」。**
  官方自述："**The self-improving AI agent** built by Nous Research.
  It's the only agent with a **built-in learning loop** — it creates skills from experience,
  improves them during use, **nudges itself to persist knowledge**, searches its own past
  conversations, and builds a deepening model of who you are across sessions."
  ⚠ **本站对「the only agent with a built-in learning loop」这句话的态度**：
  这是官方自我宣传语，本站**未做跨产品对比测试来验证 "only" 是否成立**，
  标记为官方声明而非本站结论。
  **形态分类**：按本站三种形态，它属于第 3 类「自带完整运行时」，且是最彻底的一个 ——
  官方说它 "Run it on a $5 VPS, a GPU cluster, or serverless infrastructure...
  **It's not tied to your laptop** — talk to it from Telegram while it works on a cloud VM."
  ⚠ **重要提醒：它与本站其它 harness 不是同一层的东西。**
  本站其它 general-harness 成员（Deep Agents）面向「编程任务」，
  而 Hermes 的官方定位是**跨平台常驻的个人助手**（Telegram / Discord / Slack / WhatsApp /
  Signal / Email + Home Assistant），编程只是它能做的事之一。
  **⚠ 它有一个前身**：README 有独立的 "Migrating from OpenClaw" 章节，
  提供 `hermes claw migrate` 命令可从 `~/.openclaw` 自动导入
  设置、记忆、技能与 API keys（含 `--dry-run` 预览与 `--preset user-data` 不导入密钥的选项）。
  **OpenClaw 与 Hermes 的关系本站未核验**（是否同一团队、是否改名、迁移路径是否完整），
  仅记录 README 的一手事实。

axes:
  model_access: >-
    **官方给了四种路径并强调无锁定，是本站收录对象里对模型自由度表述最直白的。**
    README 原文："Use any model you want — **Nous Portal**, **OpenRouter, OpenAI,
    your own endpoint**, and many others. **Switch with `hermes model` — no code changes,
    no lock-in.**"
    **「your own endpoint」这一条对本站读者最有用** —— 自建网关/自托管推理可以直接接。
    换模型的操作是**运行时命令 `/model [provider:model]`**（CLI 与消息平台共用，
    见 CLI vs Messaging 对照表），不是改代码。
    ⚠ **未核验**：完整 provider 清单（官方 `docs/integrations/providers` 未取到正文）、
    换模型后的能力对齐度、本地量化模型在多后端下的行为差异。
  runtime: >-
    **这是本对象最强的一维：七种终端后端 + 两个入口。**
    README 原文列举："**Seven terminal backends** — **local, Docker, SSH, Singularity,
    Modal, Daytona, and Vercel Sandbox**."
    官方特别指出 **Daytona 与 Modal 提供 serverless persistence** ——
    "your agent's environment **hibernates when idle and wakes on demand**,
    costing nearly nothing between sessions"。
    **两个入口**（README 有专门的 CLI vs Messaging 对照表）：
    终端 TUI 启动 `hermes`；或跑 gateway 后从
    **Telegram / Discord / Slack / WhatsApp / Signal / Email** 以及 Home Assistant 聊天。
    ⚠ 这对本站是最有价值的一格：**它是唯一收录对象里明确说「agent 可以跑在云 VM 上、
    你从 Telegram 指挥它」的** —— 与OpenHands 的「关掉笔记本后agent 仍在跑」是同一类诉求，
    但它把这个能力做成了默认形态而不是可选部署项。
  local_files: >-
    **本地文件能力通过终端后端间接获得，且有明确的隔离机制（见 permissions）。**
    它的工作区由所选后端决定（local 后端 = 本机，Docker/SSH/Singularity 等各有隔离）。
    **Context Files 是官方的一等概念**（文档 `features/context-files`）：
    "Project context that shapes every conversation" —— 项目上下文文件会影响**每一次**对话。
    ⚠ **未核验**：context files 的确切格式与加载优先级、
    工作区与「本地文件」的边界在哪（local 后端下的默认文件访问范围）。
  background: >-
    **这一维它是全站最强的，而且有官方三重机制。**
    **① 内建cron 调度器**：官方特性表写"Built-in **cron scheduler** with delivery to
    any platform. Daily reports, nightly backups, weekly audits — all in natural language,
    **running unattended**."（文档 `features/cron`）。
    **② serverless 休眠后唤醒**：Daytona / Modal 后端空闲时休眠、需唤醒 —— 本站未核验唤醒延迟。
    **③ 常驻网关进程**：gateway 一旦运行，就能从六个消息平台随时触发。
    ⚠ **未核验**：cron 未触发任务的补偿逻辑、网关断线后的任务补跑、
    跨休眠/唤醒的状态一致性。
  tools: >-
    **官方说 40+ 工具，并且明确支持 MCP。**
    文档目录里有独立的 "**Tools & Toolsets**" 页，副标题原文
    "**40+ tools**, toolset system, **terminal backends**"（文档 `features/tools`）。
    **MCP Integration** 也是独立文档页："Connect **any MCP server** for extended capabilities"
    （文档 `features/mcp`）。
    **还有一项很特别的能力：子代理 RPC。** 官方原文："Spawn **isolated subagents** for
    parallel workstreams. **Write Python scripts that call tools via RPC**,
    collapsing multi-step pipelines into **zero-context-cost turns**."
    ⚠ 「zero-context-cost」这个说法本站**理解为「把多步管线移到上下文之外执行」**
    （即产物只回传结果），**官方未给出具体的上下文节省量，本站标记为推断**。
    社区还维护了一个 Linux 桌面控制 MCP server（computer-use-linux，
    AT-SPI 无障碍树 + Wayland/X11 输入 + 截图），README 明确写了它是给
    "Hermes and other MCP hosts" 用的。
  context: >-
    **⚠ 这是本站最看重的一维，而它恰好是本对象宣传力度最大的 —— 必须分开核实。**
    **官方声明（README 特性表 "A closed learning loop" 一行原文）**：
    "Agent-curated memory with **periodic nudges**. Autonomous skill creation after complex tasks.
    **Skills self-improve during use.** **FTS5 session search with LLM summarization
    for cross-session recall.** Honcho dialectic user modeling.
    Compatible with the agentskills.io open standard."
    **但只要把官方给的机制逐个归位，就会发现它不是一个维度而是三个**：
    | 官方说法 | 本站归类 | 说明 |
    |---|---|---|
    | periodic nudges（自我提示） | 状态面 | 机制触发器，不是压缩算法 |
    | FTS5 session search + LLM summarization | **上下文面 ✅** | 检索 + 摘要，**这是真正的上下文管理** |
    | Skills（自主创建 + 使用中自我改进） | 独立一层 | 程序性记忆，与对话上下文不同 |
    | Honcho dialectic user modeling | 独立一层 | 对用户的长期建模 |
    **关键区分点：它有明确的 `/compress` 命令**（CLI 与消息平台都有，
    对照表里与 `/usage`、`/insights` 并列），**说明压缩是用户显式触发的，
    而不是自动的**。
    **能落到文件名的证据**（来自 "Migrating from OpenClaw" 章节，这是少见的官方一手清单）：
    `SOUL.md`（persona）、`MEMORY.md` 与 `USER.md`（记忆条目）、`AGENTS.md`（工作区指令）、
    以及 `~/.hermes/skills/openclaw-imports/`（技能目录）。
    **这说明记忆是明文的 markdown 文件，可读可迁移** —— 对本站读者来说是重要优点。
  permissions: >-
    **官方文档目录里有一节独立的 "Security"，这是本站判断它权限面做得比较细的依据。**
    该节副标题原文（核验自 README 文档目录表）：
    "**Command approval, DM pairing, container isolation**"。
    逐项解读：
    **① Command approval** —— 命令级审批（与 OpenHands 的 API key、
    Codex SDK 的 ApprovalMode 属不同层面的做法；本站未核验其粒度与默认值）。
    **② DM pairing** —— 私聊配对，即**只有配对过的用户能指挥它**。
    **这一点在六个消息平台入口的前提下极其重要** ——
    一个能通过 Telegram/WhatsApp 接指令、还能在文件系统上动手的 agent，
    「谁能给它下指令」就是最关键的安全问题。
    **③ Container isolation** —— 容器隔离。
    ⚠ **未核验**：三者的默认状态（默认开还是默认关）、
    command approval 的粒度与是否可白名单化、
    gateway 暴露面与端口安全。
    ⚠ 另有一处需要注意：`hermes claw migrate --preset user-data` 之类的迁移会涉及
    API keys（README 列出 Telegram / OpenRouter / OpenAI / Anthropic / ElevenLabs），
    **迁移脚本本身接触密钥** —— 用 dry-run 预览是官方给的手段。
  fit: >-
    **适合**：想要一个**常驻的跨平台个人助手**（Telegram/Discord/Slack/WhatsApp/Signal/Email）；
    把它放在云VM / serverless 上而不绑在自己笔记本；需要定时任务无人值守跑；
    需要跨会话记忆与技能自积累；想用自建 endpoint 或 OpenRouter 等多provider；
    需要命令级审批与 DM 配对做安全边界。
    **不适合**：只做编程任务（它是通用助手，编程只是其一）；
    需要拿它当嵌入式 SDK（它是完整运行时，不是库）；
    需要详细的「状态 vs 上下文」分层保证（它机制多但官方没按这两层分）；
    需要企业级多用户与审计（本次未核验）。

pitfalls:
  - 当成编程框架用 —— **它是通用个人助手**，编程只是它能做的事之一，形态与 LangGraph/CrewAI 完全不同
  - 相信「the only agent with a built-in learning loop」是本站结论—— **那是官方宣传语，本站未做跨产品对比验证**
  - 把七种终端后端理解成七种部署方式 —— 官方说的是 terminal backends（工具执行的后端），且其中Modal/Daytona 提供的是**休眠**不是常驻
  - 以为 `/compress` 是自动的 —— **它是显式命令**，不触发就不会压缩
  - 忽略 DM pairing 的重要性 —— 一个能接六个消息平台、还能在文件系统动手的 agent，谁能指挥它就是最关键的安全问题
  - 跑 `hermes claw migrate` 前不看 dry-run —— 该命令会接触 API keys（README 列出五家）
  - 不确认就迁移 —— Hermes 与 OpenClaw 的关系本站未核验，只记录 README 的一手事实

tags: [Python, 开源, MIT, 通用harness, 通用助手, 常驻, 跨平台消息, 定时任务, MCP, 子代理, RPC, 技能系统, 记忆, 上下文压缩, 权限审批, 自托管]

sources:
  - label: NousResearch/hermes-agent · 仓库（250,401★，MIT，核验 2026-10-01）
    url: https://github.com/NousResearch/hermes-agent
    kind: repo
  - label: 主 README（定位、六项特性表含七种终端后端与学习闭环、CLI vs Messaging 对照表、文档目录、安全与 MCP 页、OpenClaw 迁移清单）
    url: https://github.com/NousResearch/hermes-agent/blob/main/README.md
    kind: docs
  - label: 官方文档首页
    url: https://hermes-agent.nousresearch.com/docs/
    kind: docs
  - label: Security（Command approval / DM pairing / container isolation）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/security
    kind: docs
  - label: Memory（Persistent memory、user profiles、best practices）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
    kind: docs
  - label: MCP Integration（Connect any MCP server）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
    kind: docs
  - label: Tools & Toolsets（40+ tools、toolset system、terminal backends）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
    kind: docs
  - label: Cron Scheduling（Scheduled tasks with platform delivery）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
    kind: docs
  - label: Context Files（Project context that shapes every conversation）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
    kind: docs
  - label: Skills System（Procedural memory、Skills Hub）
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
    kind: docs
  - label: Nous Portal（可跳过 API key 收集）
    url: https://portal.nousresearch.com
    kind: docs
  - label: Nous Portal 首页（核验 2026-10-01：**只有定性描述、无任何价格数字**；原文含 "with free options and Portal-only discounts"；`/pricing` 路径返 404，故本站判定官方不公开定价）
    url: https://portal.nousresearch.com/
    kind: pricing
  - label: agentskills.io开放标准（官方称兼容）
    url: https://agentskills.io
    kind: docs
  - label: Releases（v2026.9.24 @ 2026-09-24）
    url: https://github.com/NousResearch/hermes-agent/releases
    kind: changelog

link:
  url: https://hermes-agent.nousresearch.com/
  kind: official

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**「唯一带学习闭环的常驻个人助手」** —— 官方 README 这么写：

> **The self-improving AI agent** built by Nous Research.
> It's the only agent with a **built-in learning loop** — it creates skills from experience,
> improves them during use, **nudges itself to persist knowledge**, searches its own past
> conversations, and builds a deepening model of who you are across sessions.
> Run it on a $5 VPS, a GPU cluster, or serverless infrastructure that costs nearly nothing when idle.
> **It's not tied to your laptop** — talk to it from Telegram while it works on a cloud VM.

⚠ **本站对「the only agent」这句话的态度**：这是**官方自我宣传语**，
本站**未做跨产品对比测试来验证 "only" 是否成立**。记录为官方声明，不是本站结论。

## 选型第一提醒：它不是编程框架

这是本页最需要先说清的一件事。**Hermes 与本站收录的其它 harness 不在同一层：**

| 对象 | 定位 | 入口 |
|---|---|---|
| LangGraph / Google ADK / CrewAI | 编程任务的编排框架 | Python 代码 |
| Deep Agents | 编程用batteries-included harness | Python 代码 |
| OpenHands | 自托管 agent 控制中心 | Web UI |
| **Hermes Agent** | **跨平台常驻的个人助手** | **TUI + 六个消息平台** |

编程只是 Hermes 能做的事之一。官方把它描述成"runs anywhere, not just your laptop"的常驻助手，
支持 **Telegram、Discord、Slack、WhatsApp、Signal、Email**，以及 Home Assistant。

⚠ **另有一条本站必须记的前身信息**：README 有独立的
**"Migrating from OpenClaw"** 章节，`hermes setup` 会自动检测 `~/.openclaw` 并提供迁移。
**Hermes 与 OpenClaw 的关系（是否同一团队、是否改名）本站未核验**，
这里只记录 README 的一手事实。

## 两种形态都是一等公民

README 有一张完整的 CLI vs Messaging 对照表。两个入口：

| 操作 | CLI | 消息平台 |
|---|---|---|
| 开始 | `hermes` | `hermes gateway setup` + `gateway start`，然后给bot 发消息 |
| 新会话 | `/new`、`/reset` | 同 |
| 换模型 | `/model [provider:model]` | 同 |
| 压缩上下文 | `/compress` | `/compress` |
| 用量与洞察 | `/usage`、`/insights [--days N]` | 同 |
| 技能 | `/skills` 或 `/<skill-name>` | `/<skill-name>` |
| 打断当前工作 | `Ctrl+C` 或发新消息 | `/stop` 或发新消息 |

**注意 `/compress` 是两边都有的显式命令** —— 见下方 context 维度。

## 七种终端后端：这是它最独特的一格

README 原文：

> **Seven terminal backends** — **local, Docker, SSH, Singularity, Modal, Daytona,
> and Vercel Sandbox**.
> Daytona and Modal offer **serverless persistence** — your agent's environment
> **hibernates when idle and wakes on demand**, costing nearly nothing between sessions.

⚠ **两点要说清**：

**① 这是 terminal backend（工具执行的后端），不是七种部署方式。**
local 就是本机执行，Docker/Singularity 是容器，SSH 是远端机，Modal/Daytona/Vercel 是 serverless。

**② 「空闲时休眠」不等于「常驻」** —— 官方用词是 hibernate，唤醒有延迟，
且休眠期间的状态一致性本站未核验。

对比 [OpenHands](./openhands.md)：它也主打「关掉笔记本后 agent 仍在跑」，
但那是**可选的部署形态**；Hermes 把它做成了**默认形态**。

## 记忆与上下文：机制最多，但官方没按本站关心的两层分

这是本对象宣传力度最大的维度，也是本站必须仔细拆的地方。

**官方声明（特性表 "A closed learning loop" 一行原文）**：
> Agent-curated memory with **periodic nudges**. Autonomous skill creation after complex tasks.
> **Skills self-improve during use.** **FTS5 session search with LLM summarization
> for cross-session recall.** Honcho dialectic user modeling.
> Compatible with the agentskills.io open standard.

**把官方给的机制逐个归位，会发现这是三个不同维度混在一句话里**：

| 官方说法 | 本站归类 | 说明 |
|---|---|---|
| periodic nudges（自我提示） | 状态面 | 机制触发器，不是压缩算法 |
| **FTS5 session search + LLM summarization** | **上下文面 ✅** | 检索 + 摘要，**这是真正的上下文管理** |
| Skills（自主创建 + 使用中自我改进） | 独立一层 | 程序性记忆，与对话上下文不同 |
| Honcho dialectic user modeling | 独立一层 | 对用户的长期建模 |

**关键区分点：压缩是显式触发的。** `/compress` 在 CLI 与消息平台都有，
与 `/usage`、`/insights` 并列 —— **不触发就不会压缩。**

### 记忆是明文的 markdown 文件（这是重要优点）

来自 "Migrating from OpenClaw" 章节的迁移清单 —— 这是少见的官方一手文件级证据：

| 文件 / 目录 | 内容 |
|---|---|
| `SOUL.md` | persona 文件 |
| `MEMORY.md`、`USER.md` | 记忆条目 |
| `AGENTS.md` | 工作区指令 |
| `~/.hermes/skills/openclaw-imports/` | 用户创建的技能 |

**记忆是可读、可diff、可手改的 markdown**，不像数据库里的黑盒。
另有一个独立的 **Context Files** 概念（文档 `features/context-files`）——
"Project context that shapes **every** conversation"，即项目上下文文件会影响每一次对话。

⚠ 未核验：context files 的确切格式与加载优先级。

## 权限：六个平台入口让「谁能指挥它」成为核心问题

README 的文档目录里有一节独立的 **Security**，副标题原文：

> **Command approval, DM pairing, container isolation**

**逐项解读**：

**① Command approval** —— 命令级审批。
与OpenHands 的 API key 机制、Codex SDK 的四种 `ApprovalMode` 属不同层面的做法。
⚠ 未核验粒度与默认状态。

**② DM pairing** —— 私聊配对，即**只有配对过的用户能指挥它**。

> **这一项在六个消息平台入口的前提下极其重要。**
> 一个能通过 Telegram / WhatsApp 接指令、还会在文件系统上动手的 agent，
> **「谁能给它下指令」就是最关键的安全问题** —— 这也是本站把它单独列出来的理由。

**③ Container isolation** —— 容器隔离。
⚠ 未核验默认状态，以及 command approval 与容器隔离是否默认同时开启。

## 工具：40+ 且支持 MCP，还有一项很特别的能力

README 文档目录（本次核验的原文副标题）：

| 文档节 | 官方副标题 |
|---|---|
| Tools & Toolsets | "**40+ tools**, toolset system, terminal backends" |
| MCP Integration | "Connect **any MCP server** for extended capabilities" |
| Cron Scheduling | "Scheduled tasks with platform delivery" |

**特别能力：子代理 RPC。** 官方原文：

> Spawn **isolated subagents** for parallel workstreams.
> **Write Python scripts that call tools via RPC**, collapsing multi-step pipelines
> into **zero-context-cost turns**.

⚠ **「zero-context-cost」本站读作「把多步管线移到上下文之外执行，产物只回传结果」**
（这是对它的合理解释），**但官方未给出具体的上下文节省量，标记为推断而非官方表述。**

社区还维护了一个 Linux 桌面控制 MCP server（`computer-use-linux`，
AT-SPI 无障碍树 + Wayland/X11 输入 + 截图 + 窗口定向），
README 明确说它是给 "Hermes and other MCP hosts" 用的 —— 这是 MCP 生态的一个真实案例。

## 定时任务：常驻形态的第三重保障

README 特性表原文：

> Built-in **cron scheduler** with delivery to any platform.
> Daily reports, nightly backups, weekly audits — all in **natural language**,
> **running unattended**.

**常驻这件事官方给了三重机制**：① 内建 cron；② serverless 休眠后唤醒；
③ 常驻网关进程（六平台随时触发）。

⚠ 未核验：cron 未触发任务的补偿逻辑、网关断线后的补跑、跨休眠/唤醒的状态一致性。

## 迁移脚本会碰密钥：用 dry-run

`hermes claw migrate` 涉及的迁移清单里有：

> **API keys** — allowlisted secrets (**Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs**)

**也就是说迁移脚本本身会接触五家服务的密钥。** 官方给的手段是：

```bash
hermes claw migrate --dry-run              # 预览会迁移什么
hermes claw migrate --preset user-data     # 不导入密钥
```

**跑之前先 dry-run，这是官方自己设计的用法。**

## 适合与不适合

**适合**：想要常驻的跨平台个人助手；放云 VM / serverless 不绑在自己笔记本；
需要定时任务无人值守；需要跨会话记忆与技能自积累；想用自建 endpoint 或多provider；
需要命令级审批 + DM 配对做安全边界。
**不适合**：只做编程任务；需要当嵌入式 SDK；需要「状态 vs 上下文」分层保证；
需要企业级多用户与审计。

## 核验说明

`confidence: partial` 的依据：

**为什么不是 verified**：`permissions` 三项机制的**默认状态**未核验
（command approval / container isolation 默认开还是关，是部署安全的前提）；
`local_files` 的工作区边界与 context files 加载优先级未核验；
`background` 的休眠/唤醒与 cron 补偿语义未核验。

已核验：仓库存在与星数（250,401，**本站收录对象里最高**）、许可（MIT，经 license API）、
最近推送（2026-10-01，仍活跃）、最新版 **v2026.9.24**（releases @ 2026-09-24）、
README 全文 243 行（定位段、六项特性表、七种终端后端原文、
CLI vs Messaging 完整对照表、十四节文档目录含 Security/Memory/MCP/Cron/Context Files、
OpenClaw 迁移清单含文件级条目、社区与许可段）、
仓库有中文与西语等README 分支、Nous Portal 入口

未核验：完整 provider 清单与换模型后的对齐度、
command approval 的粒度与默认值、container isolation 的默认状态、
context files 格式与优先级、休眠唤醒延迟与状态一致性、
cron 未触发任务的补偿逻辑、「zero-context-cost」的量化值、
Honcho 用户建模与 skills 自改进的实际效果、
Hermes 与 OpenClaw 的确切关系

**本轮（2026-10-01）补上的**：Nous Portal 计费的**官网状态**已核验 ——
**官网不公开定价**（首页只有定性描述、无一个数字；`/pricing` 返404），
第三方口径（Free / Plus $20 含$22 / Super $100 含 $110 / Ultra $200 含 $220）已记入档案
但**标注为未获官方确认**。这一条从「完全未核验」变成「已核验到官网不公开」。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按通用助手 + 常驻形态定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | **DM pairing 与 command approval 的默认状态** | 部署安全的前提，也是本站最大的缺口 |
| 2 | `/compress` 压缩后信息保留的实际效果 | 它是本站最看重的维度，但压缩是手动触发的 |
| 3 | Modal/Daytona 休眠后唤醒的延迟与状态一致性 | 官方强调省成本，但唤醒体验决定能否日用 |
| 4 | 用自建 endpoint 接本地量化模型跑一轮 | README 明确支持，本站读者关心的组合 |
| 5 | 子代理 RPC 的「zero context cost」实际省了多少 | 官方说法未量化 |
| 6 | cron 任务在网关重启后的行为 | 无人值守场景的核心可靠性问题 |
| 7 | 只用它做编程任务 vs 专用编程框架的体验差 | 它定位是通用助手，本站要给出诚实判断 |

## 未知项清单

- command approval 的粒度、是否可白名单化、默认状态
- container isolation 的默认状态与覆盖范围
- DM pairing 的配对流程与撤销机制
- Context Files 的格式、加载顺序与优先级
- serverless 后端的唤醒延迟与跨休眠状态一致性
- cron 未触发时的补偿与补跑逻辑
- 「zero-context-cost」的实际上下文节省量
- skills 自我改进的边界（会不会越学越歪）
- Honcho 用户建模的数据去向与隐私
- Hermes 与 OpenClaw 的确切关系（团队、是否改名、迁移完整性）
- Nous Portal 的**官方**定价（官网不公开，第三方口径未获确认）
- Nous Portal 额度制的实际消耗速度（长agent 循环能几天烧完一档，第三方说法未实证）
- Nous Portal 与 OpenRouter 的差异（同样走credit，但模型目录与工具网关不同）
- 完整 provider 清单与本地模型的可靠性

## 相关条目

- [OpenHands](./openhands.md) — **常驻诉求的同类，但形态不同**：两者都主打「关掉笔记本后agent 仍在跑」。OpenHands 是带 Web UI 的控制中心 + 定时/webhook 触发；本对象是 TUI + 六个消息平台 + 内建 cron，且定位是通用助手而非纯编程。
- [Deep Agents](./deepagents.md) — 同为 general-harness 家族，但 Deep Agents 面向编程任务（filesystem + 子代理是卖点），本对象面向跨平台常驻的个人助手。
- [LangGraph](./langgraph.md) — **记忆与状态的分野对照**：LangGraph 明确区分 working memory 与 persistent memory、checkpoint 每 superstep 落盘；本对象机制更丰富但官方未按这两层分，且记忆是明文 markdown 文件。
