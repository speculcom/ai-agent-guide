---
id: openai-agents-sdk
track: harness
family: coding-base
name: OpenAI Agents SDK
vendor: OpenAI
homepage: https://openai.github.io/openai-agents-python/
mark: OA
accent: "#10A37F"
stars: 29792
license: MIT
latest_version: 0.22.3
language: Python 3.10+

# 支持哪些模型 provider（本站第一决策点）
providers:
  - OpenAI Responses API
  - OpenAI Chat Completions API
  - 100+ 其他 LLM（官方原文 provider-agnostic）

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 库本身免费（MIT）
  note: >-
    **框架免费 ≠ 运行免费。** 库是 MIT 开源的，但：
    （1）默认需要 `OPENAI_API_KEY`，模型推理费用自理；
    （2）官方示例全部以 OpenAI 模型为主；
    （3）Traces 默认上报到 OpenAI 的后端（可用 `trace` 相关开关禁用）。
pricing_pitfalls:
  - 以为 provider-agnostic 就等于「换 provider 零成本」—— 代码零改动，但换到非 OpenAI 模型后能力对齐度需实测
  - 以为框架免费就没有账单—— 推理费用、可能的 tracing 存储都是要付费的

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **Python 生态里最贴近「薄 harness」的一档**：只提供 agent loop 原语（agent / handoff / guardrail / session / trace），
  **不预置 filesystem、不预置规划、不预置记忆**。
  与 Deep Agents 的差别正好是本站反复强调的那条分野：
  Deep Agents 走 batteries-included（预置 filesystem + 子代理 + 上下文管理），
  OpenAI Agents SDK 走 primitives-only（你要什么自己加）。
  **官方对 JS/TS 版是独立仓库**（openai-agents-js，MIT，3,882★）——
  同一产品的两种语言实现，本站只收录 Python 主体，JS 版在下方记录。

axes:
  model_access: >-
    **官方自述 provider-agnostic**，README 首段原文：
    「It is provider-agnostic, supporting the OpenAI Responses and Chat Completions APIs,
    as well as **100+ other LLMs**.」
    实现路径有两层证据：核心依赖是 `openai>=3.0.0`；可选依赖里有
    `litellm`（`openai-agents[litellm]`）与 `any-llm`（`openai-agents[any-llm]`，要求 Python ≥3.11）。
    **换 provider 的实际改动量本站未核验**（文档说 provider-agnostic，但没给「零改动」的量化承诺）。
  runtime: >-
    **你自己运营进程** —— 它是库不是服务。README 的四种运行方式全部是本地代码调用
    （`Runner.run_sync` / `RealtimeRunner.run` / `VoicePipeline.run` / sandbox client）。
    唯一例外是 **SandboxAgent 的 hosted sandbox client** —— 官方提到可以用托管沙箱，
    但那依赖 OpenAI 侧的容器服务，不是「整个 agent 托管」。
  local_files: >-
    **本地文件能力明确存在但不在默认 agent 里**。官方为「需要检查文件、跑命令、打补丁、
    或在长任务间保留工作区状态」的场景单独提供了 **`SandboxAgent`**：
    README 原文说 SandboxAgent 是 preconfigured to work with a container to perform work over
    long time horizons，且 default_manifest 里可以声明 `GitRepo(repo=..., ref=...)`。
    **沙箱客户端分平台**：`UnixLocalSandboxClient`（macOS / Linux）；
    Windows 须用 `DockerSandboxClient`（需 `openai-agents[docker]` extra）或 hosted sandbox client。
    **这条是本站选型时的实用信息：Windows 用户不能直接用本地 Unix 沙箱路径。**
  background: >-
    **自托管 = 关了就停。** README 没有托管执行选项（Realtime 是长连接但进程仍在自己手里）。
    **断点续跑有官方支撑**：Sessions 章节写明「Automatic conversation history management
    across agent runs」，配合 SQLite（SQLAlchemy 依赖）与 Redis（`openai-agents[redis]`）后端。
    SandboxAgent 的 default_manifest 也面向「preserve workspace state across longer tasks」。
  tools: >-
    **工具面是官方列出的四类**：functions、MCP、hosted tools，以及 **agents as tools**
    （把别的 agent 当工具调，与 handoffs 并列为核心委派机制）。
    **MCP 是核心依赖而非可选**：`mcp>=1.19.0,<3` 在 `dependencies` 里（不是 optional-dependencies）——
    这说明 MCP 接入是SDK 的一等能力。
    **Guardrails 可配置**：官方列「Configurable safety checks for input and output validation」，
    分 input 与 output 两个方向。
  context: >-
    **官方原文只有 Sessions**：Automatic conversation history management across agent runs。
    可选后端有 Redis（`openai-agents[redis]`）与 SQLAlchemy（SQLAlchemy + asyncpg 依赖）。
    **注意与本站主张的分野**：Sessions 管的是**会话历史**，
    本站的「状态 ≠ 上下文」主张里，**把大工具输出落盘**这类手段在本 SDK 属用户自建
    （SandboxAgent 的沙箱工作区可以承担这个角色，但官方没有把它宣传成 context 管理层）。
  permissions: >-
    **内建 Guardrails（输入 + 输出双向校验）+ Human in the loop（跨多次运行引入人工）**
    —— 这是本站目前见到的**权限面最完整**的内建方案：
    「Configurable safety checks for input and output validation」与
    「Built-in mechanisms for involving humans across agent runs」。
    与 Deep Agents 的「trust the LLM，边界责任交给你」形成鲜明对照。
    **具体边界强度本次未核验**（guardrail 能否拦住文件/网络访问类型的越权，文档未在README 展开）。
  fit: >-
    **适合**：想要「薄 harness」—— 只要 agent loop 原语，filesystem / 规划 / 记忆都想自己挑；
    需要 guardrails 与 human-in-the-loop 是内建的；需要 MCP 一等支持；团队是 Python 栈。
    **不适合**：想要开箱即用的长任务工作区（用 Deep Agents 或该 SDK 的 SandboxAgent 路线）；
    追求 TypeScript 生态（该用 openai-agents-js）。

pitfalls:
  - 以为「provider-agnostic」= 换provider 零改动 —— 文档给了 100+ 的承诺但没给量化保证，本站标记为未核验
  - 以为 SandboxAgent 在 Windows 上开箱可用 —— 本地路径只有 `UnixLocalSandboxClient`（macOS/Linux），Windows 要走 Docker 或 hosted
  - 以为 Guardrails 能当权限护栏用 —— 它是输入/输出校验，不是沙箱边界；两者能解决的风险类型不同
  - 以为这是 OpenAI 闭源 SDK 的「官方壳」 —— 它本身是 MIT 开源框架，官方明确「committed to continuing to build the Agents SDK as an open source framework」

tags: [Python, 开源, MIT, 编程底座, 通用harness, guardrails, MCP, human-in-the-loop, sandbox]

sources:
  - label: OpenAI Agents SDK · 仓库（Python）
    url: https://github.com/openai/openai-agents-python
    kind: repo
  - label: 官方文档首页
    url: https://openai.github.io/openai-agents-python/
    kind: docs
  - label: Sandbox agents（官方专章）
    url: https://openai.github.io/openai-agents-python/sandbox_agents
    kind: docs
  - label: Guardrails（官方专章）
    url: https://openai.github.io/openai-agents-python/guardrails/
    kind: docs
  - label: Human in the loop（官方专章）
    url: https://openai.github.io/openai-agents-python/human_in_the_loop/
    kind: docs
  - label: Sessions（官方专章）
    url: https://openai.github.io/openai-agents-python/sessions/
    kind: docs
  - label: Sandbox clients（平台差异与 hosted client）
    url: https://openai.github.io/openai-agents-python/sandbox/clients/
    kind: docs
  - label: Agents SDK JS/TS（独立仓，MIT，3,882★，核验 2026-09-30）
    url: https://github.com/openai/openai-agents-js
    kind: repo
  - label: Releases（0.22.3 @ 2026-09-17）
    url: https://github.com/openai/openai-agents-python/releases
    kind: changelog

link:
  url: https://openai.github.io/openai-agents-python/
  kind: official

last_verified: 2026-09-30
last_updated: 2026-09-30
lifecycle: active
confidence: partial
---

## 一句话定位

**「primitives-only 的多agent harness」** —— 官方自述 lightweight yet powerful：
只给agent loop 的原语，不替你决定 filesystem / 规划 / 记忆怎么做。

## 官方首段就写明了 provider-agnostic

> The OpenAI Agents SDK is a lightweight yet powerful framework for building multi-agent workflows.
> It is **provider-agnostic**, supporting the OpenAI Responses and Chat Completions APIs,
> as well as **100+ other LLMs**.

**这是本站的第一决策点。** 代码层面的证据也一致：
核心依赖 `openai>=3.0.0`，另有 `litellm` 与 `any-llm` 两个可选 extra 作为非OpenAI 路径。

⚠ 但要说清边界：**「100+」是官方声明，本站未实测具体各家 provider 的能力对齐度**
（工具调用、structured output、多模态在各家差异很大）。

## 与 Deep Agents 的对照：本站最该给用户看的一张表

两个都在 Python agent harness 档，风格完全相反：

| 维度 | **OpenAI Agents SDK** | **Deep Agents** |
|---|---|---|
| 风格 | primitives-only，薄 | batteries-included，厚 |
| filesystem | 不预置（要自己接，或用 SandboxAgent） | **核心卖点**，可插拔后端 |
| 子代理 | agents as tools / handoffs（需自己建） | **预置** sub-agents |
| 上下文管理 | 只有 Sessions（会话历史） | summarize + **落盘** + 跨会话记忆 |
| 权限 | **内建 guardrails + human-in-the-loop** | 官方明说「trust the LLM」，边界归你|
| 运行形态 | 你自己跑（本地/容器/Redis） | 你自己跑 |

**选型口诀**：想要「安全内建」选前者，想要「功能内建」选后者。

## SandboxAgent：本地文件能力的官方答案，但有个 Windows 坑

普通 `Agent` 不带本地工作区。官方为此单独提供 **`SandboxAgent`**：

> Use a `SandboxAgent` when the agent needs to inspect files, run commands, apply patches,
> or **preserve workspace state across longer tasks**.

它的 `default_manifest` 可以声明要检出的仓库：

```python
agent = SandboxAgent(
    name="Workspace Assistant",
    default_manifest=Manifest(
        entries={"repo": GitRepo(repo="openai/openai-agents-python", ref="main")}
    ),
)
```

⚠ **平台差异是选型时必须知道的**：

| 客户端 | 支持平台 | 说明 |
|---|---|---|
| `UnixLocalSandboxClient` | macOS / Linux | README 示例用的就是它 |
| `DockerSandboxClient` | Windows 等 | 需 `openai-agents[docker]` extra |
| hosted sandbox client | 依赖 OpenAI 侧服务 | 官方提到可用 |

**Windows 用户不能直接走本地 Unix 沙箱路径。**

## 权限面：目前本站见到的最完整内建方案

| 官方提供 | 章节 |
|---|---|
| **Guardrails**（input + output 双向校验） | 「Configurable safety checks for input and output validation」 |
| **Human in the loop**（跨多次运行引入人工） | 「Built-in mechanisms for involving humans across agent runs」 |

**对比 Deep Agents 的官方声明**（原文）：
> Deep Agents follows a "trust the LLM" model... Enforce boundaries at the tool/sandbox level,
> not by expecting the model to self-police.

**这两句话就是本站「权限归属」这个问题的两种答案**，也是一个真实的选择依据：
> **你要内建的输入输出校验，还是你要自己划沙箱边界？**

⚠ 未核验：guardrail 对「文件/网络访问类越权」的拦截能力（README 未展开，需读官方 guardrails 专章）。

## 「状态 ≠ 上下文」在这两个 SDK 里的不同答案

| | OpenAI Agents SDK | Deep Agents |
|---|---|---|
| 会话历史 | Sessions（Redis / SQLAlchemy 后端） | persistent memory（pluggable state and store） |
| 长上下文 | **无官方 context management 层** | summarize long threads |
| 大输出落盘 | **无官方宣称**（SandboxAgent 的工作区可承担） | **offload tool outputs to disk** |

本站主张「持久化 ≠ 压缩」时，**Deep Agents 是有官方落盘手段的那一方**。
但要注意 SandboxAgent 的工作区保留（preserve workspace state）实际上也是一种持久化——
只是官方没把它归类成 context management。**这是本站的判断，不是官方表述，已标注为推断。**

## MCP 是一等能力，不是可选插件

`pyproject.toml` 里 `mcp>=1.19.0,<3` 在 **`dependencies`** 而非 `optional-dependencies`。
配合官方 README 把MCP 与 functions、hosted tools 并列为工具类型 ——
**在这套 SDK 里接MCP server 不需要额外装东西**。

## 附：JS/TS 版是独立仓，本站不单独收录

README 里明确指向 `openai/openai-agents-js`（核验 2026-09-30：MIT，3,882★，活跃）。

> ⚠ **本站不把它作为独立对象收录**：同一产品的第二语言实现，
> 与本站「一个对象 = 一套决策依据」的粒度不符（同 Deep Agents Code 的处理法）。
> 记录在此是因为选型时需要知道「Python 版之外还有 JS/TS 版」。

## 适合与不适合

**适合**：要薄 harness + 要内建 guardrails/human-in-the-loop + 要 MCP 一等支持 + Python 栈。
**不适合**：要开箱即用的长任务工作区（用 Deep Agents 或走 SandboxAgent 路线）；TypeScript 生态（用 openai-agents-js）。

## 核验说明

`confidence: partial` 的依据（2026-10-03 由 verified 降级）：

> **为什么降级**：下方 ❌ 项的主语是**本站的取证缺口**，不是「官方未提供」。
> 按 v3 铁律「未知就说未知」，这些条目存在时标 verified 属于虚高，故降为 partial。
> 主要缺口：100+ provider 的实际能力对齐度、guardrail 对文件/网络越权的拦截强度。
- ✅ 已核验：仓库存在与星数（29,792）、许可（MIT，经 license API）、最近推送（2026-10-01，仍活跃）、
  最新版本 **0.22.3**（releases @ 2026-09-17）、`pyproject.toml` 全文关键项（`requires-python >=3.10`、
  `mcp>=1.19.0,<3` 是核心依赖、litellm/any-llm/sqlalchemy 均为可选 extra）、README 全文十项核心概念、
  四种运行方式代码示例、SandboxAgent 段落与平台差异、JS 版仓元数据
- ❌ 未核验：100+ provider 的实际能力对齐度、guardrail 对文件/网络越权的拦截强度、
  hosted sandbox client 的定价与可用性、Sessions 的具体后端语义、Realtime/Voice 路径的成本

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按 harness 赛道五维度定制到这个 SDK 的重点）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | 最小 hello agent 要几个文件、多少行 | 官方称 lightweight，要验证「薄」到什么程度 |
| 2 | Guardrails 能不能拦住「读文件」类越权 | 官方定位是 input/output 校验，与文件访问权限不是一回事 |
| 3 | SandboxAgent 在 **Windows** 上的最小可用路径 | 官方示例是 Unix，Windows 要另走 Docker |
| 4 | 换成 litellm / any-llm 接本地模型要改多少 | 官方说 provider-agnostic，验证真实改动量 |
| 5 | Sessions 断掉进程后恢复状态是否完整 | 这是本站最关心的「可靠长期运行」 |

## 未知项清单

- 100+ provider 各自的能力对齐度矩阵
- guardrail 与沙箱边界的职责划分边界
- hosted sandbox client 的定价、可用区域、配额
- Sessions 后端在多进程/多机下的并发写语义
- litellm / any-llm extra 的实际依赖体积与升级冲突

## 相关条目

- [Deep Agents](./deepagents.md) — **本站最值得对照的一对**：Deep Agents 是 batteries-included（含 filesystem + 子代理 + 上下文管理），本 SDK 是 primitives-only。同一决策树的两个分支。
- [Claude Agent SDK](./claude-agent-sdk.md) — 同为「编程底座」档，且同样出自模型厂商。OpenAI 侧走 primitives-only + guardrails 内建，Anthropic 侧的主场是 Claude Code。
- [LangGraph](./langgraph.md) — LangGraph 是 graph runtime，OpenAI Agents SDK 是 agent harness —— 可组合（把图当工具/子代理），但层级不同。
