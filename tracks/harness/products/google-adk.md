---
id: google-adk
track: harness
family: orchestration
name: Google ADK（Agent Development Kit）
vendor: Google
homepage: https://google.github.io/adk-docs/
mark: GA
accent: "#4285F4"
stars: 21688
license: Apache-2.0
latest_version: 2.10.0
language: Python（主）/ TypeScript（1,426★）

# 支持哪些模型 provider（本站第一决策点）
providers:
  - 优化对象是 Gemini（README 原文 "While optimized for Gemini"）
  - 官方称 model-agnostic（README 原文 "ADK is model-agnostic, deployment-agnostic"）
  - 具体非 Gemini 模型的支持清单，本次未核验

pricing:
  model: open-source
  monthly_usd: 0
  monthly_label: 框架免费（Apache-2.0）；设 GOOGLE_GENAI_USE_ENTERPRISE 后走 Google Cloud 企业平台计费
  note: >-
    **框架免费，但部署与模型两处都可能产生费用**：
    （1）官方给的部署目标是 Cloud Run 与 Vertex AI Agent Engine，这两处都按云资源计费；
    （2）用 Gemini 走 Google 侧计费，用其它模型走各自 provider。
    **（3）`GOOGLE_GENAI_USE_ENTERPRISE` 的含义本轮已核验清楚 ——
    它不是「解锁企业版功能」的开关，而是「把请求从 Gemini Developer API
    切到 Google Cloud 企业平台（Gemini Enterprise Agent Platform / Vertex AI）」的
    路由开关，计费口径随之改变。**
    官方 codelab 对三个变量的说明原文（核验 2026-10-01）：
    `GOOGLE_GENAI_USE_ENTERPRISE` = "This tells the ADK that you intend to use Google's
    **Gemini Enterprise Agent Platform** service for your Generative AI operations."
    `GOOGLE_CLOUD_PROJECT` = "ADK needs this to correctly associate your agent with your
    cloud resources and **enable billing**."
    `GOOGLE_CLOUD_LOCATION` = 地域，如 `global`。
    **⚠ 最关键的一条：官方把「enable billing」明确挂在 `GOOGLE_CLOUD_PROJECT` 上。**
    设了这三个变量，agent 就落进你的 Google Cloud 项目开始计费；
    不设则走 Gemini Developer API 那条路（另有其免费层与配额）。
    **且三个变量必须成组出现** —— 官方所有示例都是三个一起设，没有只设其一的写法。
    ⚠ 官方示例里这个变量的取值不统一，有`1`（README / codelab .env）、`TRUE`、
    `True`（Cloud 文档）三种写法，**按Python 布尔语义大小写皆真，但取值不一致这点本身值得注意**。
    ⚠ 具体的 Gemini 单价与 Vertex AI Agent Engine / Cloud Run 的实际费率本站未逐项核验。
pricing_pitfalls:
  - 以为「Apache-2.0 免费」等于零成本 —— Cloud Run / Vertex Agent Engine 的云资源费用自理
  - 以为 model-agnostic 就等于各模型表现一致 —— 官方明确说 optimized for Gemini
  - **把 `GOOGLE_GENAI_USE_ENTERPRISE` 当成「解锁企业功能」的开关 —— 它实际是计费路径开关**。
    官方原文把「enable billing」挂在 `GOOGLE_CLOUD_PROJECT` 上，
    与它成组设置即意味着请求走 Google Cloud 企业平台并开始计费
  - 只设 `GOOGLE_GENAI_USE_ENTERPRISE` 不设 project/location —— 官方所有示例都是三个成组出现

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站收录的第一个真正的编排框架（orchestration 家族）** —— 前三个对象
  （OpenAI Agents SDK / Deep Agents / Claude Agent SDK / Codex SDK）给的都是「怎么跑一个 agent」，
  ADK 给的是「怎么把多个 agent 组织成一个有分支、有循环、有人工介入的流程」。
  证据是它 README 的第一项特性 **Workflow Runtime** 原文：
  "A graph-based execution engine for composing **deterministic execution flows** for agentic apps,
  with support for routing, fan-out/fan-in, **loops**, **retry**, **state management**,
  **dynamic nodes**, **human-in-the-loop**, and **nested workflows**."
  **关键词是 deterministic**：它要解决的不是「agent 能不能干活」，
  而是「多个 agent 组成的流程在多次运行之间是否可重复、可预期」。
  **这与本站反复讲的分野直接对应**：图执行引擎管的是控制流（状态），
  而长上下文压缩（上下文）是另一件事 —— ADK 在后者上的手段本站未核验。
  ⚠ **同厂还有 TypeScript 版**（`google/adk-js`，Apache-2.0，1,426★，独立仓，
  核验 2026-10-01），按本站「一个对象 = 一套决策依据」的粒度，本档只收录 Python 主体。
  另有样例仓 `google/adk-recipes`（10,404★，README 里叫 adk-recipes，
  仓库实际名`adk-recipes` → 显示为 `google/adk-recipes`）。

axes:
  model_access: >-
    **官方口径：optimized for Gemini，但 model-agnostic。**
    README 原文："While optimized for Gemini, ADK is **model-agnostic**,
    deployment-agnostic, and compatible with other frameworks."
    ⚠ **未核验**：model-agnostic 的具体实现路径（是否有 LiteLLM 一类适配层）、
    非 Gemini 模型下工具调用与 structured output 的可靠性、
    以及「optimized for Gemini」到底优化了什么。
  runtime: >-
    **四种运行形态，全部由 `adk` CLI 或容器提供**（README 核验）：
    **① 交互式 CLI**（`adk run <agent-folder>` 段落）；
    **② 内建 Web UI**：`adk web <agent-folder>`，官方说明支持 multi-agent directories
    或直接指向单个 agent 文件夹；
    **③ Development UI**：官方原文"A built-in development UI to help you test, evaluate,
    debug, and showcase your agent(s)" —— **这是内建的开发调试台**；
    **④ 容器化部署**：`adk deploy docker --with_ui <agent-folder>`。
    ⚠ 这四种都是**你本地或你的云上进程**，ADK 本身不提供托管服务
    （托管要靠 Vertex AI Agent Engine 或 Cloud Run，那是 Google 的产品而非本框架的）。
  local_files: >-
    **⚠ 本维度是本站最明显的证据缺口。**
    README 讲工具生态时列的是pre-built tools、custom functions、**OpenAPI specs**、
    MCP tools 与既有工具接入（"all for tight integration with the Google ecosystem"），
    **全文没有把「读写本地文件」列为一项能力，也没有描述默认的文件访问边界**。
    它给的是「怎么把工具接进来」，不是「文件访问受什么约束」。
    **未核验**：默认沙箱机制、文件系统权限模型、是否需要自行处理容器挂载。
  background: >-
    **图执行引擎本身就是「可靠运行」的答案** —— 官方列出的能力里，
    `retry`、`state management`、`human-in-the-loop`、`nested workflows`
    都是控制流层面的原语，**这正是「可靠长期运行」需要的构件**。
    单个 agent 内部的重试与循环可以由框架管（loops、retry 在特性列表里）。
    ⚠ **未核验**：跨进程/跨机的任务续跑语义（断掉后从哪个节点恢复）、
    分布式部署时的状态存储方案（官方给了 Cloud Run / Agent Engine 两条路，
    但状态持久化机制本文未核验）。
  tools: >-
    **工具生态是它最强调的部分，且MCP 是一等能力。**
    README 原文："Utilize pre-built tools, custom functions, **OpenAPI specs**,
    **MCP tools** or integrate existing tools"。
    ⚠ 但这里有个**本站必须标出的判断**：README 把MCP 与 OpenAPI specs 并列，
    说明它接MCP 的方式是**把 MCP 当作一种工具来源**，而不是像
    [OpenAI Agents SDK](openai-agents-sdk.md)（`mcp>=1.19.0` 在 `dependencies` 里）
    那样把 MCP 客户端做成框架级依赖。**两者不是同一量级的一等公民，本站标记为推断，未核验实现。**
    **另有一项官方独有能力：Tool Confirmation（HITL）** ——
    官方原文"a tool confirmation flow (HITL) that can guard tool execution with
    explicit confirmation and custom input"，对应文档 `tools/confirmation`。
    **这是本站已收录对象里少见的「工具级人工确认」**，与 OpenAI Agents SDK 的
    input/output guardrail 是不同层次的东西。
  context: >-
    **⚠ 未核验，本站不下结论。**
    README 的特性列表里没有上下文压缩、摘要或落盘的任何表述。
    图执行引擎的状态管理（`state management`）管的是**流程状态**，
    按本站「状态 ≠ 上下文」的主张，**不能据此推断它有上下文管理**。
    长任务里工具输出的落盘、对话历史的裁剪，官方文档本文未取到，标记为未核验。
  permissions: >-
    **官方给的是「工具级人工确认」这一个明确机制**：
    Tool Confirmation / HITL（文档 `tools/confirmation`），原文
    "can guard tool execution with explicit confirmation and custom input"。
    **但这只是「执行前问一下」，不是边界划定**：
    README 未提及沙箱机制、未提及文件系统权限模型、未提及网络访问控制
    （对比本站收录的 OpenHands 提供了明确的 Docker 沙箱与 API key 机制，
    Codex SDK 源码里有三档SandboxMode 枚举）。
    ⚠ **未核验**：容器部署时的默认权限、是否支持网络白名单、是否有其它隔离层。
  fit: >-
    **适合**：需要把多个 agent 组织成**有分支、有循环、有人工介入的确定性流程**；
    要用代码优先（code-first）定义 agent 与工具，便于测试与版本管理；
    团队在 Google 生态内（Cloud Run / Vertex / Gemini）；
    需要内建 eval 与开发 UI；希望用同一套框架覆盖 Python 与 TypeScript。
    **不适合**：只跑单个 agent、不需要图结构（用 OpenAI Agents SDK 或 Deep Agents 更轻）；
    运行时需要文件级/网络级沙箱边界且不想自己实现（本站未核验其沙箱能力）；
    长上下文的压缩与落盘是硬需求（本站未核验其手段）。

pitfalls:
  - 以为是「Google 版 OpenAI Agents SDK」—— **它是编排框架**，核心资产是 Workflow Runtime 的图执行引擎，不是单 agent 原语
  - 把 `state management` 读成「有上下文管理」—— 前者是流程状态，后者本站未核验
  - 把 MCP 当成它的核心依赖 —— README 只把 MCP 列为工具来源之一，与 OpenAI Agents SDK 把 `mcp>=1.19.0` 放进 `dependencies` 不是一回事
  - 以为 Tool Confirmation 等于沙箱 —— 它是「执行前问一句」，不是边界划定
  - 以为开源免费等于零成本 —— Cloud Run / Vertex Agent Engine 的云费用自理，且有 `GOOGLE_GENAI_USE_ENTERPRISE` 开关
  - 以为只有 Python —— 还有独立的 TypeScript 仓（`google/adk-js`，1,426★），本站按粒度只收录 Python 主体
  - 搞混仓库名 —— 样例仓显示为 `google/adk-recipes`，描述里写的是 adk-samples

tags: [Python, TypeScript, 开源, Apache-2.0, 编排框架, 图执行, 工作流, 多Agent, HITL, 工具确认, eval, CloudRun, MCP]

sources:
  - label: google/adk-python · 仓库（21,688★，Apache-2.0，核验 2026-10-01）
    url: https://github.com/google/adk-python
    kind: repo
  - label: 主 README（Workflow Runtime / Task API / Tool Confirmation / 部署方式 / eval）
    url: https://github.com/google/adk-python/blob/main/README.md
    kind: docs
  - label: 官方文档首页
    url: https://google.github.io/adk-docs/
    kind: docs
  - label: 官方文档 · Tool Confirmation（HITL）
    url: https://google.github.io/adk-docs/tools/confirmation/
    kind: docs
  - label: 官方文档 · Agent Config（不写代码建agent）
    url: https://google.github.io/adk-docs/agents/config/
    kind: docs
  - label: Google 官方 codelab · Building AI Agents with ADK: The Foundation（**`GOOGLE_GENAI_USE_ENTERPRISE` / `GOOGLE_CLOUD_PROJECT` / `GOOGLE_CLOUD_LOCATION` 三个变量的官方逐条说明，含 "enable billing" 表述**，核验 2026-10-01）
    url: https://codelabs.developers.google.com/devsite/codelabs/build-agents-with-adk-foundation
    kind: docs
  - label: Google Cloud 文档 · Manage sessions with Agent Development Kit（同一组三变量的另一种取值写法 TRUE / True，核验 2026-10-01）
    url: https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sessions/manage-with-adk
    kind: docs
  - label: google/adk-js · TypeScript 版（1,426★，Apache-2.0）
    url: https://github.com/google/adk-js
    kind: repo
  - label: google/adk-recipes · 样例集（10,404★）
    url: https://github.com/google/adk-recipes
    kind: repo
  - label: Releases（v2.10.0 @ 2026-09-25）
    url: https://github.com/google/adk-python/releases
    kind: changelog

link:
  url: https://google.github.io/adk-docs/
  kind: official

related:
  - id: langgraph
    note: **本站最该对照的一对**：同为图执行编排框架，且langgraph 的 checkpointer / interrupt 机制与 ADK 的 state management + HITL 是同类问题的两种答案。收录后者后本站才能给出编排框架内部的对照。
  - id: crewai
    note: 同为编排框架，但 crewai 以「角色/任务/流程」的抽象为中心，ADK 以「图节点」为中心 —— 抽象层次不同。
  - id: openai-agents-sdk
    note: 同为厂商系框架但形态相反：那个是单 agent 原语（primitives-only），ADK 是多 agent 编排。
  - id: openhands
    note: 反面对照：OpenHands 是带 Web UI 的调度平台、也可接第三方 agent；ADK 是 code-first 的库。两者都能编排，但一个面向界面、一个面向代码。

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**「code-first 的 agent 编排框架，核心资产是一个图执行引擎」** —— 官方 README 第一项特性就说明了它的身份：

> **Workflow Runtime**: A graph-based execution engine for composing **deterministic
> execution flows** for agentic apps, with support for routing, fan-out/fan-in,
> **loops**, **retry**, **state management**, **dynamic nodes**, **human-in-the-loop**,
> and **nested workflows**.

## 为什么把它归到 orchestration 而不是 coding-base

本站前四个编程底座（OpenAI Agents SDK / Deep Agents / Claude Agent SDK / Codex SDK）
回答的都是「**怎么跑一个 agent**」；ADK 回答的是「**怎么把多个 agent 组织成一个有分支、
有循环、有人工介入的流程**」。

**关键词是 deterministic。** 它要解决的不是「agent 能不能干活」，
而是「多个 agent 组成的流程在多次运行之间是否可重复、可预期」。

这也直接落到本站关心的分野上：

| 本站关注的面 | ADK 给的 |
|---|---|
| **状态**（流程控制） | ✅ 图执行引擎：routing / loops / retry / state management / nested workflows |
| **上下文**（长任务压缩） | ❓ 未核验 —— 特性列表里没有任何压缩、摘要或落盘表述 |

⚠ **不要把 `state management` 读成「有上下文管理」** —— 这正是本站反复强调的那条分野。

## 工具生态：MCP 是其中一员，但量级要注意

README 原文：

> Utilize pre-built tools, custom functions, **OpenAPI specs**, **MCP tools** or
> integrate existing tools to give agents diverse capabilities,
> all for tight integration with the Google ecosystem.

⚠ **本站的判断（推断，未核验实现）**：README 把 MCP 与 OpenAPI specs **并列**，
说明它接 MCP 的方式是「把 MCP 当作一种工具来源」。
这与 [OpenAI Agents SDK](./openai-agents-sdk.md) 不同—— 那个把 `mcp>=1.19.0,<3`
直接放在 `dependencies` 里，是框架级依赖。**两者不是同一量级的一等公民。**

### 一项值得单独看的官方能力：Tool Confirmation（HITL）

> A tool confirmation flow (HITL) that can **guard tool execution with explicit
> confirmation and custom input**.

文档在 `tools/confirmation`。**这是本站已收录对象里少见的「工具级人工确认」**，
与 OpenAI Agents SDK 的 input/output guardrail 是两个层次的东西：

- guardrail 是**校验内容**（这个输入/输出合不合规）
- tool confirmation 是**拦执行**（这个工具要不要真跑，可以附带自定义输入）

## 部署：四条命令，本地到 Google 云

README 给的四种运行/部署形态全部核验：

```bash
adk run<agent-folder>              # 交互式 CLI
adk web                <agent-folder>       # 内建 Web UI
adk deploy docker   --with_ui <agent-folder>         # 容器化
adk deploy cloud_run --with_ui <agent-folder>        # Cloud Run
```

**另有两个本站认为值得注意的点**：

**① 内建开发 UI 与内建 eval。**
官方原文：A built-in development UI to help you **test, evaluate, debug, and showcase** your agent(s)，
并且有 `adk eval <agent-folder> <evalset.json>` 命令与 `.evalset.json` 配置格式。

**这是本站已收录对象里唯一把「评估」做成框架内建命令的** ——
对「不要实测」的铁律来说，这类能力值得记一笔：它让用户能自己跑评测。

**② 有个部署级开关要注意，而且它本质上是「计费路径开关」。**
README 的 Cloud Run 示例里出现了 `GOOGLE_GENAI_USE_ENTERPRISE=1`。

**本轮已核验清楚（2026-10-01，Google 官方 codelab 与 Cloud 文档）**：
它**不是「解锁企业功能」的开关**，而是告诉 ADK
「把生成式 AI 请求发到 Google 的 **Gemini Enterprise Agent Platform**
（Vertex AI 侧）而不是 Gemini Developer API」。

官方 codelab 对三个变量的说明原文：

| 变量 | 官方含义 |
|---|---|
| `GOOGLE_GENAI_USE_ENTERPRISE` | "This tells the ADK that you intend to use Google's **Gemini Enterprise Agent Platform** service for your Generative AI operations." |
| `GOOGLE_CLOUD_PROJECT` | "ADK needs this to correctly associate your agent with your cloud resources and **enable billing**." |
| `GOOGLE_CLOUD_LOCATION` | 地域，如 `global` |

**最关键的一条：官方把 "enable billing" 明确写在 `GOOGLE_CLOUD_PROJECT` 上。**
也就是说，**这三个变量成组设上，agent 就落进你的 Google Cloud 项目并开始计费**；
不设则走 Gemini Developer API 那条路（它有另一套免费层与配额）。

**另外两点值得记**：
- **三个变量必须成组出现** —— 官方所有示例（README、codelab、Cloud 文档的
  Live API 指南）都是三个一起设，没有只设其一的写法。
- **取值不统一**：README 与 codelab 的 `.env` 写 `1`，
  Cloud 文档写 `TRUE` 或 `True`。按布尔语义皆真，但官方自己不一致这点值得注意。

⚠ 仍未核验：Gemini 的具体单价、Vertex AI Agent Engine 与 Cloud Run 的实际费率。

## 本地文件与沙箱：本站最大的证据缺口

README 讲工具生态时列的是 pre-built tools、custom functions、OpenAPI specs、MCP tools
—— 全是「怎么把工具接进来」，**没有把「读写本地文件」列为一项能力，
也没有描述默认的文件访问边界**。

对比本站其它对象在这块的做法：
- **OpenHands** 给了明确的 Docker 沙箱形态与 API key 机制，且在无沙箱安装选项上挂 WARNING
- **Codex SDK** 源码里有三档 `SandboxMode` 枚举
- **ADK 这边本站没有拿到任何沙箱或权限边界的官方表述**

⚠ **未核验**：默认沙箱机制、文件系统权限模型、网络访问控制。
**如果你选它，容器隔离要自己确认。**

## 同厂双版本 + 样例仓

| 仓库 | 用途 | 核验（2026-10-01） |
|---|---|---|
| `google/adk-python` | Python 主体（本档收录） | 21,688★ · Apache-2.0 |
| `google/adk-js` | TypeScript 版 | 1,426★ · Apache-2.0 |
| `google/adk-recipes` | 样例集（描述里写 adk-samples） | 10,404★ |

⚠ 按本站「一个对象 = 一套决策依据」的粒度，**只收录 Python 主体**。

## 适合与不适合

**适合**：要把多个 agent 组织成有分支、有循环、有人工介入的确定性流程；
要 code-first 定义逻辑便于测试与版本管理；团队在 Google 生态内；
需要内建 eval 与开发 UI。
**不适合**：只跑单个 agent、不需要图结构（用 OpenAI Agents SDK 更轻）；
需要文件级/网络级沙箱边界但不想自己实现；长上下文压缩是硬需求（本站未核验其手段）。

## 核验说明

`confidence: partial` 的依据：

**为什么不是 verified**：八维度里 `local_files`、`context`、`permissions` 三维证据不足 ——
没有拿到沙箱机制、文件权限模型、上下文压缩策略的官方表述，
且 `permissions` 维度能确认的只有「有 Tool Confirmation」这一项机制。

已核验：仓库存在与星数（21,688）、许可（Apache-2.0，经 license API）、
最近推送（2026-10-01，仍活跃）、最新版 **v2.10.0**（releases @ 2026-09-25）、
README 全文的六项特性列表与四类运行形态、两种 `adk deploy` 命令与
`GOOGLE_GENAI_USE_ENTERPRISE` 环境变量、`adk eval` 命令与 `.evalset.json` 格式、
`google/adk-js`（1,426★ · Apache-2.0）与 `google/adk-recipes`（10,404★）两仓元数据

**本轮（2026-10-01）补上的**：`GOOGLE_GENAI_USE_ENTERPRISE` 的确切含义
—— 它是**计费路径开关**（切到 Gemini Enterprise Agent Platform / Vertex AI），
不是企业功能开关；官方把 "enable billing" 挂在 `GOOGLE_CLOUD_PROJECT` 上，
三个变量须成组设置。来源为 Google 官方 codelab 与 Cloud 文档。

未核验：model-agnostic 的实现路径与实际对齐度、非 Gemini 模型下的工具调用可靠性、
默认沙箱与文件权限模型、网络访问控制、上下文压缩与落盘策略、
跨进程/跨机续跑语义、分布式状态存储、MCP 接入的实现层次（框架级依赖 vs 工具来源）、
Gemini 单价与 Vertex AI Agent Engine / Cloud Run 的实际费率

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按编排框架维度定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | 容器部署后的默认文件与网络权限边界 | 补上本站最大的缺口，也是选型前提 |
| 2 | 跑 `adk eval` 的最小完整案例 | 它是唯一内建 eval 的对象，值得看真实成本 |
| 3 | 流程中途 kill 进程后的恢复语义 | 官方有 retry / state management，但恢复粒度未核验 |
| 4 | Tool Confirmation 在长循环里的人工打断频率 | 官方说可 guard，但要测实际打断次数 |
| 5 | 换成非 Gemini 模型后工具调用与 structured output 的可靠性 | 官方说 model-agnostic，验证代价 |
| 6 | Python 版与 TS 版的能力差距 | 两个独立仓，官方没说是否对齐 |

## 未知项清单

- 默认沙箱机制、文件系统权限模型、网络访问控制
- 对话上下文压缩 / 摘要 / 落盘策略
- 跨进程、跨机的任务续跑与恢复粒度
- 分布式部署下的状态存储方案
- MCP 接入的实现层次（框架级依赖 vs 工具来源）
- Python 与 TypeScript 版的能力对齐度
- Vertex AI Agent Engine 部署时状态的托管方式
- Gemini 单价与 Vertex AI Agent Engine / Cloud Run 的实际费率
  （`GOOGLE_GENAI_USE_ENTERPRISE` 的**含义**已核验，**费率**未核验）

## 相关条目

- [LangGraph](./langgraph.md) — **本站最该对照的一对**：同为图执行编排框架，等它收录后可给编排框架内部的对照
- [CrewAI](./crewai.md) — 同为编排框架但抽象中心不同（角色/任务 vs 图节点）
- [OpenAI Agents SDK](./openai-agents-sdk.md) — 同为厂商系，形态相反：那个是单 agent 原语
- [OpenHands](./openhands.md) — 反面对照：带 Web UI 的调度平台 vs code-first 的库