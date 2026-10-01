---
id: claude-agent-sdk
track: harness
family: coding-base
name: Claude Agent SDK
vendor: Anthropic
homepage: https://platform.claude.com/docs/en/agent-sdk/python
mark: CA
accent: "#D97757"
stars: 8197
license: MIT
latest_version: 0.2.163
language: Python 3.10+

# 支持哪些模型 provider（本站第一决策点）
providers:
  - 仅 Claude（Anthropic 官方 API）

pricing:
  model: paid
  monthly_usd: null
  monthly_label: 库免费（MIT）· 模型按 Claude API 计费（无法预置月费）
  note: >-
    **这是本站十对象里唯一不支持换provider 的编程底座。**
    SDK 只包装 Claude Code CLI，agent 的推理全部走 Anthropic API，**没有 litellm / any-llm 这类旁路**。
    换模型 = 换方案，不是换配置。
pricing_pitfalls:
  - 以为它是「Claude 模型的通用 harness」—— 它绑定的是 Claude Code CLI 这一具体产品，换 provider 无路可走
  - 以为 MIT 就等于「随便商用」 —— 见下方正文「许可条款的真相」，还受 Anthropic 商业条款约束

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **不是独立 agent 实现，而是 Claude Code CLI 的编程接口。**
  README 首行原文：「Python SDK for Claude Agent」，
  且明确「The Claude Code CLI is **automatically bundled with the package** -
  no separate installation required!」。
  **这决定了一切**：它的 agent 能力（工具集、hooks、权限、会话）全部来自 Claude Code，
  SDK 负责的是「让Python 代码能驱动这个 CLI」——`query()` 单向提问、
  `ClaudeSDKClient` 双向会话。
  **与 OpenAI Agents SDK 的根本差别**：后者是自建agent loop 的框架，本 SDK 是既有 CLI 的 SDK 化。

axes:
  model_access: >-
    **只支持 Claude。** README 全文没有 provider-agnostic 的表述，
    `pyproject.toml` 层面也没有 litellm / any-llm 之类的可选依赖。
    ⚠ **这是它与其他九个对象最本质的差别**：本站其他 harness 都能接自托管模型（Ollama / vLLM / llama.cpp），
    本 SDK 不能。模型层（models.specul.com）推荐的本地量化路线在这里走不通。
  runtime: >-
    **它是「你运营 Python 进程 + 它驱动一个 CLI 子进程」的双层结构。**
    README 明说CLI 随 wheel 捆绑（核验：`_cli_version.py` 里 `__cli_version__ = "2.1.286"`），
    默认用捆绑版；也可指向系统安装（`ClaudeAgentOptions(cli_path="/path/to/claude")`）。
    **实际形态**：pip 包 → 内含 Claude Code CLI → CLI 连 Anthropic API。
    换句话说这不是「库」，是「带 CLI 的库」。
  local_files: >-
    **默认就是全套文件工具，且是全权限起步。** README 原文：
    「By default, Claude has access to the **full Claude Code toolset**
    (Read, Write, Edit, Bash, and others)」。
    工作目录用 `ClaudeAgentOptions(cwd="/path/to/project")` 指定。
    **这是与本站其他对象最大的风险差异 —— 默认就能读文件、改文件、跑 Bash。**
  background: >-
    **进程关了就停，但会话可续。** 错误类型里 `CLIConnectionError` / `CLINotFoundError` /
    `ProcessError` / `ResultError` 揭示了进程依赖结构。
    **会话持久化有官方支撑**：README 提到「records it, and reuses it on every later request,
    **including after you resume the session**」，以及 CHANGELOG 的
    「session forking features」—— 即 resume + fork 是一等能力。
    具体存储位置本次未核验。
  tools: >-
    **两个入口，能力不同**（这是很关键的设计细节）：
    `query()` 是单向提问，只能用 CLI 自带工具集；
    `ClaudeSDKClient` 是双向会话，**额外解锁 custom tools 与 hooks**。
    **custom tools 是「进程内 MCP server」**：README 说它们是
    「in-process MCP servers that run directly within your Python application」，
    官方列的收益是 no subprocess management / no IPC overhead / 单进程部署 / 更好调试 / 类型安全。
    **外部 MCP server 也支持，且两者可混用**（`mcp_servers` 可同时放 SDK server 与 stdio 外部 server）。
  context: >-
    **有一个本站很关注、但容易被忽略的机制：system prompt 的 snapshot 语义。**
    README 原文：Claude Code 会在会话首次请求时构建并记录 system prompt，
    之后每次请求（含**恢复会话后**）都复用它；
    改了自定义 prompt 或 `claude_code` preset 的 `append` 文本，
    **要等到会话被compact 或开了新会话才生效**——
    除非把 `snapshot` 设为 `False`（需要 CLI 2.1.257+）。
    **这实质上是「上下文快照不可变」的设计**，与本站「状态 ≠ 上下文」的讨论直接相关：
    它保证了 prompt 的确定性，代价是改动生效有延迟。
  permissions: >-
    **官方给了完整的权限求值链，这是本站目前见到的最详细的一份。** README 原文：
    「`allowed_tools` is a permission allowlist: listed tools are auto-approved,
    and unlisted tools fall through to `permission_mode` and `can_use_tool` for a decision.
    **It does not remove tools from Claude's toolset.** To block specific tools, use `disallowed_tools`.」
    翻译：`allowed_tools` 是**准入白名单**（列进去=自动批准），
    未列的走 `permission_mode` 与 `can_use_tool` 判定；
    **它不会把工具从工具集里移除** —— 要真正禁用得用 `disallowed_tools`。
    **hooks 提供确定性拦截**：README 说 hooks 是「Python 函数，由 Claude Code *应用*（不是 Claude）调用」，
    可在 `PreToolUse` 返回 `permissionDecision: "deny"` + 理由，**示例就是拦 Bash 命令**。
    ⚠ **默认起步是全工具 + 无沙箱**，想收紧必须主动配置。
  fit: >-
    **适合**：想要一个**已经被打磨过的 coding agent**（工具集、权限链、hooks、session fork 都在）
    并且团队用 Python；愿意把推理完全交给 Claude。
    **不适合**：需要换模型 / 接自托管权重（**直接排除**）；
    需要框架级的自定义 agent loop（它是 CLI 的接口，loop 形状由 Claude Code 决定）；
    需要多agent 编排（它没有 agents-as-tools 那种一等委派机制）。

pitfalls:
  - 以为它是「Anthropic 版的 OpenAI Agents SDK」—— **不是**。它是 Claude Code CLI 的 SDK，能力来自那个 CLI，不是框架自带
  - 以为 `allowed_tools` 能限制工具集 —— 官方明确「It does not remove tools from Claude's toolset」，禁用要用 `disallowed_tools`
  - 以为默认是安全的 —— 默认是 **full toolset（Read/Write/Edit/Bash）**，且没有沙箱层
  - 以为改了 system prompt 立刻生效 —— 会被 snapshot 冻结，要compact 或新会话才生效（除非 snapshot=False）
  - 以为 MIT = 无附加条款 —— 受 Anthropic 商业条款约束（见正文）
  - 以为 TS 版授权与 Python 版一致 —— **核验发现 TS 版无 LICENSE 文件、license API 返回 null，授权状态不明**（核验 2026-09-30）

tags: [Python, 开源, MIT, 编程底座, CLI包装, hooks, 权限链, 仅Claude]

sources:
  - label: Claude Agent SDK for Python · 仓库
    url: https://github.com/anthropics/claude-agent-sdk-python
    kind: repo
  - label: 官方文档（Python）
    url: https://platform.claude.com/docs/en/agent-sdk/python
    kind: docs
  - label: 权限指南（求值顺序的权威说明）
    url: https://platform.claude.com/docs/en/agent-sdk/permissions
    kind: docs
  - label: Hooks（官方专章）
    url: https://platform.claude.com/docs/en/agent-sdk/hooks
    kind: docs
  - label: Claude Code 工具集清单（tools available to Claude）
    url: https://code.claude.com/docs/en/settings#tools-available-to-claude
    kind: docs
  - label: 修改 system prompts（snapshot 语义的权威说明）
    url: https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts
    kind: docs
  - label: Anthropic 商业条款（README 末节指向，授权关键）
    url: https://www.anthropic.com/legal/commercial-terms
    kind: docs
  - label: Releases（0.2.163 @ 2026-09-30）
    url: https://github.com/anthropics/claude-agent-sdk-python/releases
    kind: changelog
  - label: CHANGELOG（Claude Code SDK <0.1.0 的破坏性变更）
    url: https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md
    kind: changelog

link:
  url: https://platform.claude.com/docs/en/agent-sdk/python
  kind: official

related:
  - id: openai-agents-sdk
    note: **本站最该对照的一对**：同样是模型厂商出品、同为「编程底座」档。OpenAI 侧是自建 loop 的框架 + provider-agnostic；Anthropic 侧是 CLI 的 SDK + 仅 Claude。
  - id: codex-sdk
    note: 第三家厂商的同档选择。**三家是同一个问题的三种答案**：自建框架 / 包装 CLI / 包装 CLI。
  - id: hermes-agent
    note: 同为 Nous Research 出品但路线相反 —— 那个是自托管优先的通用 harness。

last_verified: 2026-09-30
last_updated: 2026-09-30
lifecycle: active
confidence: verified
---

## 一句话定位

**「Claude Code 的编程接口」** —— 不是自建 agent 框架，是把一个成熟的 coding CLI 变成 Python 可驱动的对象。

## ⚠ 先讲清最容易误解的一点：它是 CLI 的包装，不是框架

README 首行就把这事说了：

> Python SDK for Claude Agent.
> **The Claude Code CLI is automatically bundled with the package** —
> no separate installation required!

核验 `_cli_version.py`：`__cli_version__ = "2.1.286"`（捆绑的确切 CLI 版本）。

**这意味着**：

| 你以为 | 实际 |
|---|---|
| 引入一个 agent 框架 | 引入一个**内含 CLI 的 wheel**，CLI 再去连 API |
| agent loop 由SDK 定义 | **agent loop 由 Claude Code CLI 定义** |
| 可以改 agent 的形状 | 只能通过 options 配置它暴露出来的开关 |

**与OpenAI Agents SDK 的根本差别**：后者是自建 agent loop 的框架（primitives-only），
本 SDK 是既有 CLI 的 SDK 化。**这是本站最需要讲清的一组对照。**

## 十个对象里唯一不能换模型的编程底座

| | OpenAI Agents SDK | Claude Agent SDK |
|---|---|---|
| provider | provider-agnostic，100+ | **仅 Claude** |
| 换自托管权重 | 可（litellm / any-llm extra） | **不可** |
| agent loop | SDK 给出原语 | CLI 决定形状 |

⚠ **这直接关掉了本站的一条推荐路线**：模型层（`models.specul.com`）主推的本地量化模型 + Ollama/vLLM 自托管，
**在这套 SDK 上走不通**。想用本地权重就得换方案。

## 权限：官方给了完整求值链，但默认是全开的

README 这段是本站目前见到的最详细的权限说明：

> `allowed_tools` is a permission allowlist: listed tools are **auto-approved**,
> and unlisted tools fall through to `permission_mode` and `can_use_tool` for a decision.
> **It does not remove tools from Claude's toolset.**
> To block specific tools, use `disallowed_tools`.

翻译成一张表：

| 机制 | 作用 | 常被误解之处 |
|---|---|---|
| `allowed_tools` | **准入白名单**，列进去=自动批准 | ⚠ **不会把工具从工具集移除** |
| `permission_mode` | 未列入的工具走这里判定 | 例：`acceptEdits` 自动接受文件编辑 |
| `can_use_tool` | 自定义回调函数 | 官方给了完整求值顺序文档 |
| `disallowed_tools` | **真正禁用**某些工具 | 想真正拦就得用这个 |
| **hooks** | `PreToolUse` 返回 `deny` + 理由 | **确定性拦截，由应用层而非模型层执行** |

**⚠ 默认起步状态需要明确知道**：

> By default, Claude has access to the **full Claude Code toolset**
> (Read, Write, Edit, Bash, and others).

**默认就有Read / Write / Edit / Bash，没有沙箱层。**
想收紧必须主动配 `disallowed_tools` / hooks / permission_mode。

hooks 的定位也很值得注意——README 说它是
「Python 函数，由 Claude Code *应用*（**not** Claude）调用」：
**拦截发生在确定性代码里，不是靠模型自我约束。** 这与Deep Agents 的
「trust the LLM，不要指望模型自我约束」形成对照——**Anthropic 的答案是把拦截放在应用层**。

## custom tools = 进程内 MCP server（一个省心的设计）

这是 README 里信息量很大的一段。custom tool不是普通函数调用，而是
「**in-process MCP servers** that run directly within your Python application」。

官方列的收益：

| 收益 | 说明 |
|---|---|
| No subprocess management | 与应用同进程，无需管理子进程 |
| Better performance | 工具调用无 IPC 开销 |
| Simpler deployment | 单进程而非多进程 |
| Easier debugging | 全部代码同进程 |
| Type safety | 带类型提示的直接 Python 函数调用 |

**外部 MCP server 照样支持，两者可混用** —— `mcp_servers` 字典里可以同时放
`create_sdk_mcp_server(...)` 产物与 `{"type":"stdio", ...}` 外部 server。

⚠ 注意能力边界：**custom tools 与 hooks 只在 `ClaudeSDKClient` 下可用**，
`query()` 用不了。

## 「状态 ≠ 上下文」：这里有个反直觉的snapshot 设计

README 里这段与本站主张直接相关：

> Claude Code builds the system prompt on a session's **first** request, **records it**,
> and reuses it on every later request, **including after you resume the session**.
> A changed custom prompt, or changed `append` text... then has no effect
> **until the session is compacted or you start a new session**.
> To rebuild the prompt on every request instead... set `snapshot` to `False`.

**这实质是「上下文快照不可变」**：保证了 prompt 的确定性，代价是修改有延迟。
想每次重建要显式设 `snapshot: False`（需要 CLI 2.1.257+；
README 还记了一个历史 bug：「Before 2.1.265, a session with an `append` or custom prompt
recorded it only when `snapshot` was True」）。

**与本站主张的关系**：其他 harness 讲的是「如何压缩/持久化上下文」，
这里讲的是「**如何冻结上下文**」——
**保证同一会话内 prompt 恒定**，避免 prompt 漂移导致行为不可预测。
这是一个**第三种思路，本站首次记录**（标注为本站观察，非官方表述）。

## 许可条款的真相：MIT 但不是「无附加条件」

README 末节原文：

> Use of this SDK is governed by Anthropic's
> **Commercial Terms of Service**, including when you use it to power products and services
> that you make available to your own customers and end users,
> **except to the extent a specific component or dependency is covered by a different license**.

翻译：仓库许可证标记是 MIT（license API 确认 `spdx_id: MIT`），
**但使用受Anthropic 商业条款约束** —— 尤其「用它给你自己的客户提供产品/服务」这一条。

⚠ **本站标注**：这不是「非开源」，也不是「不能商用」，
但**做产品前必须读那份商业条款**，MIT 标记本身不构成完整授权判断。

**附一处核验发现**：TypeScript 版（`anthropics/claude-agent-sdk-typescript`，1,780★，活跃）
**没有 LICENSE 文件、license API 返回 `null`** —— 授权状态与 Python 版是否一致**未核实**。
Python 版是 MIT + 商业条款；TS 版**无文件可查**。选型时若要用 TS 版，**授权需另行确认**。

## 附：仓库描述字段为空

核验发现 `description` 为 `null`（GitHub API），`homepage` 也为 null，
文档入口在 README 首行的 `platform.claude.com/docs/en/agent-sdk/python`。
如实记录，避免读者以为信息缺失是我们没查。

## 适合与不适合

**适合**：要一个已被打磨的 coding agent（工具集 + 权限链 + hooks + session fork 都在），团队用 Python，愿意把推理全权交给 Claude。
**不适合**：需要换模型或接自托管权重（**直接排除**）；要自定义 agent loop 形状（用 OpenAI Agents SDK 或 LangGraph）；要多 agent 编排。

## 核验说明

`confidence: verified` 的依据：
- ✅ 已核验：仓库存在与星数（8,197）、**许可（license API 返回 MIT）**、最近推送（2026-09-30 22:29）、
  最新版本 **0.2.163**（**2026-09-30 19:47 发布**）、捆绑 CLI 版本 **2.1.286**（`_cli_version.py` 原文）、
  README 全文（权限求值链、custom tools 为进程内 MCP server、hooks 定位、system prompt snapshot 语义、
  错误类型清单、default full toolset 表述）、许可条款末节原文、
  **v3 计划记录的 0.2.162 已被超越**（今天发布 0.2.163）
- ⚠ **异常发现**：仓库 `description` 与 `homepage` 均为 `null`；**TS 版无 LICENSE 文件、license API 返回 null**
- ❌ 未核验：Anthropic 商业条款的具体条款内容（未读原文，属法务范畴）、
  会话的存储位置与并发语义、session forking 的具体形态、
  `can_use_tool` 与 `permission_mode` 的完整优先级链（README 只给了概述，细节在 permissions 专章）

**一处计划数据修正**：v3 计划 §2.2 记 Claude Agent SDK 为 v0.2.162，
实际核验时已发布 **v0.2.163**（晚于计划编写）。**这再次印证「快照会过期、必须现场核验」**。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | pip 装完到底拉了多少东西（含捆绑 CLI 的体积） | CLI 随包捆绑，部署体积影响未知 |
| 2 | 默认配置下agent 实际能碰到哪些目录 | 默认 full toolset 且无沙箱，边界要实测 |
| 3 | `disallowed_tools` 与 hooks 哪条先生效 | README 只说求值顺序概述，实测才知道 |
| 4 | resume 会话后状态恢复到什么粒度 | 本站最关心的「可靠长期运行」 |
| 5 | 改system prompt 后多久生效（测compact 触发条件） | snapshot 语义的边界 |

## 未知项清单

- Anthropic 商业条款的具体约束（尤其面向客户的场景）
- TypeScript 版的授权状态
- 会话持久化的存储位置与多进程并发语义
- session forking 的具体形态与限制
- `permission_mode` 全部取值与 `can_use_tool` 的优先级细节
- 捆绑 CLI 版本与系统安装版本的兼容差异

## 相关条目

- [OpenAI Agents SDK](./openai-agents-sdk.md) — **本站最该对照的一对**：框架 vs CLI 包装，通用 vs 仅 Claude
- [Codex SDK](./codex-sdk.md) — 第三家厂商的同档答案
- [Deep Agents](./deepagents.md) — 权限哲学的对照：「信任 LLM」vs「应用层确定性拦截」