---
id: codex-sdk
track: harness
family: coding-base
name: Codex SDK
vendor: OpenAI
homepage: https://developers.openai.com/codex/
mark: CX
accent: "#10A37F"
stars: 127448
license: Apache-2.0
latest_version: 0.159.3
language: TypeScript / Python / Rust

# 支持哪些模型 provider（本站第一决策点）
providers:
  - OpenAI 自家模型（官方主线）
  - 自定义 provider 可配（codex-rs 源码有 model_providers 配置项，162 处引用）
  - 第三方模型：官方 config-advanced 页给出自定义 provider 配置（Ollama / LM Studio / Mistral / Bedrock 等，2026-10-08 核验）

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: SDK 本身免费（Apache-2.0），推理按你接的 provider 计费
  note: >-
    **三条计费路径要分清**：
    （1）SDK 与 CLI 都开源免费，跑起来要 OpenAI API key 或 ChatGPT 额度；
    （2）可以配 `baseUrl` 指向自建/第三方网关，此时计费跟着那个网关走；
    （3）OpenAI 另有 Codex Web（chatgpt.com/codex）这条云端产品线，
    那是订阅制，与本地 SDK 不是同一件事。
pricing_pitfalls:
  - 以为 SDK 免费就零成本 —— 推理费用、sandbox 环境的机器成本都要自己算
  - 把 Codex Web 的订阅和本地 SDK 混为一谈 —— 前者在 chatgpt.com 开通，后者跑在你自己的机器上
  - 配了 baseUrl 就以为模型能力对齐 —— 换 provider 后的工具调用与推理质量需自行验证（官方未给量化说明）

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站收录的第一个「CLI 包装型」编程底座** —— 与 Claude Agent SDK 同一形态：
  SDK 不含 agent loop 实现，它 spawn 一个真实的 CLI 进程，用 JSONL over stdin/stdout 通信。
  官方 README 原文：「The TypeScript SDK **wraps** the `codex` CLI from `@openai/codex`.
  It **spawns the CLI** and exchanges JSONL events over stdin/stdout.」
  **它与另外两个 SDK 的根本差别在「谁在跑」**：
  OpenAI Agents SDK 是在你的 Python 进程里跑一个库；Deep Agents 也是；
  而本 SDK 的推理与工具执行都发生在**外部 CLI 子进程**里，
  所以沙箱、审批、工作目录全部由那个 CLI 决定，你只能通过参数影响它。
  **这带来一个实用后果**：SDK 的行为边界 = 该 CLI 版本的行为边界，
  升级 CLI 就等于升级 SDK 的能力与风险面，而 SDK 本身版本号（package.json 里是 0.0.0-dev）不反映这个。
  **注意 v3 计划里记的 `openai/codex-sdk` 独立仓不存在**（gh api 返回 404）——
  SDK 是 `openai/codex` monorepo 下的 `sdk/typescript` 与 `sdk/python` 子目录。

axes:
  model_access: >-
    **两条路径，本站的判断是「默认走OpenAI，但架构上没锁死」**。
    证据一：README 里的配置示例 `baseUrl` 会被翻译成 `--config openai_base_url=...` 传给 CLI，
    即**换 API 端点是一等配置项**（原文：If you set `baseUrl`, the SDK passes it as a
    `--config openai_base_url=...` override）。
    证据二：官方 `config-advanced` 有专节 **Custom model providers**（已核验）：
    顶层 `model = ...` 与 `model_provider = "proxy"` 配合 `[model_providers.<id>]`
    （`base_url` / `env_key` / `wire_api` / `http_headers` / `auth.command`）；
    内置保留 ID 为 `openai`、`ollama`、`lmstudio`，另内置 `amazon-bedrock` 与 `azure`，
    示例直接给 `[model_providers.mistral] base_url = "https://api.mistral.ai/v1"`；
    还支持 **OSS 模式** `--oss` + `oss_provider = "ollama" | "lmstudio"`，
    `openai_base_url` 可改内置 provider 的 base URL。
    证据三：`ThreadOptions` 有独立的 `model?: string` 字段。
    **即：官方明确支持接非 OpenAI 模型**（本地 Ollama/LM Studio、Mistral、Bedrock 等）。
    **但换第三方模型后工具调用与 structured output 的质量，官方未给量化结论，
    本站未实测。**
  runtime: >-
    **进程形态是「你的 Node 进程 + 一个被 spawn 的 CLI 子进程」**。
    README 的 `env` 参数说明值得注意：「By default, the Codex CLI **inherits the Node.js
    process environment**」，你可以整体控制 CLI 看到哪些环境变量，
    官方给的用途是 sandboxed hosts like Electron apps。
    SDK 仍会在这之上注入自己需要的变量（如 `CODEX_API_KEY`）。
    **这条对 Electron / 桌面应用集成是决定性的**，官方明确点了这个场景。
  local_files: >-
    **本地文件是 CLI 的原生能力，SDK 侧只需给工作目录**。
    `workingDirectory` 设置运行目录；`additionalDirectories` 可追加额外目录；
    另有 `local_image` 类型的输入条目可把本地图片传给 CLI（走 `--image`）。
    **一个必须知道的行为**：Codex **要求工作目录是一个 Git 仓库**，
    否则拒绝运行（官方原文：To avoid unrecoverable errors, Codex requires the working
    directory to be a Git repository）——可以用 `skipGitRepoCheck` 跳过。
    **这对选型是硬约束**：非 Git 目录（纯数据目录、临时目录）里开箱即用不了。
  background: >-
    **最值得注意的一点：这是本站收录对象里唯一官方明确支持「非交互执行」的**。
    官方 `noninteractive` 页已核验（`docs/exec.md` 指向它）：`codex exec` 面向
    "scripts and CI"；默认 **read-only sandbox**，可用 `--sandbox workspace-write` /
    `danger-full-access`；`--json` 输出 JSONL、`--output-schema` 结构化、
    `--ephemeral` 不落盘；**可续跑**：`codex exec resume --last` 或 `resume <SESSION_ID>`。
    SDK 侧对应 `resumeThread()`，Threads 持久化在 `~/.codex/sessions`。
    与 CLI 站那份档案里 Gemini CLI 是「唯一明确支持非交互」的对照正好构成一组。
    **注意 ~/.codex/sessions 是文件目录而非数据库** —— 状态与进程同机器；
    跨机迁移与多进程并发写的语义**官方未说明**（已查 noninteractive 页与
    config-reference 两页，两页只讲 `history.persistence` 与 resume，未讲并发写）。
  tools: >-
    **工具面完全由 CLI 决定，SDK 不新增也不裁剪**。README 全文没有出现 MCP。
    SDK 侧你拿到的是**结构化事件流**：`runStreamed()` 返回 async generator，
    事件类型包括 `item.completed`（工具调用、流式响应、文件变更通知）
    与 `turn.completed`（含 usage 统计）。
    **Structured output 是 SDK 明确支持的一等能力**：
    `outputSchema` 可传 JSON Schema，也有官方推荐的 Zod 转换路径
    （`zodToJsonSchema(schema, { target: "openAi" })`）。
    **注意这里有个命名陷阱**：那个target 是 `"openAi"`，
    但它产出的是 JSON Schema 给任意遵守该schema 的模型用，不代表只能 OpenAI。
    本站点MCP 收录的 9 个 server 里没有它的位置 —— **Codex CLI 是否支持 MCP 已核验**：
    官方有独立的 **MCP 文档页**（developers.openai.com/codex/mcp），原文
    "Codex supports MCP servers in both the CLI and the IDE extension"，支持
    **STDIO**（command/args/env/env_vars/cwd）与 **Streamable HTTP**（url/bearer/headers），
    `codex mcp` CLI 与 `config.toml` 的 `[mcp_servers.<name>]` 均可配，还有
    `enabled_tools` / `disabled_tools` 与 **per-server / per-tool `approval_mode`**
    （`auto`/`prompt`/`approve`）与 `codex mcp login` OAuth。
    **SDK 侧**：SDK 的 `config` 透传即写入 CLI 的 `config.toml`，故 MCP 可经此可用；
    但**官方未在 SDK README 明写这条衔接**，本站只把它记作 CLI 能力，
    仍不与 MCP 站的 server 建立关联。
  context: >-
    **本站最关心的维度，本对象提供的是「会话续接」而不是「上下文管理」**。
    证据是 `resumeThread(threadId)`：能恢复对话继续跑，但没有压缩、摘要或落盘机制。
    换句话说：`Thread` 解决的是**可靠续跑**（本站主张的「状态」面），
    不解决**长上下文**（本站主张的「上下文」面）。
    **要压上下文只能靠 CLI 侧的配置或换模型**，SDK 层没有暴露相关选项。
  permissions: >-
    **这是本站核对下来最有价值的一处发现 —— 它把 CLI 站那份档案里遗留的审批枚举缺口补上了**。
    证据来自 SDK 源码 `sdk/typescript/src/threadOptions.ts` 的类型定义（不是文档，是源码）：
    `ApprovalMode = "never" | "on-request" | "on-failure" | "untrusted"` —— **四种审批模式**；
    `SandboxMode = "read-only" | "workspace-write" | "danger-full-access"` —— **三档沙箱**。
    网络单独控制：`networkAccessEnabled?: boolean`、`webSearchMode?: "disabled" | "cached" | "live"`、
    `webSearchEnabled?: boolean`。
    推理强度可调：`ModelReasoningEffort` 有 **8 档**
    （minimal / low / medium / high / xhigh / max / ultra / persistent）。
    **另一层权限机制是配置透传**：SDK 支持 `config`（自动展平成 dotted path转 TOML 传给 `--config`）
    与 `configOverrides`（原始 TOML 逐条透传）。官方示例直接给出了文件系统级规则：
    `permissions.audit.filesystem={":root"="read","/path/to/project/.env"="deny"}`，
    即**可以按路径精确拒绝读.env 这类文件**。官方说明优先级：
    原始 overrides >结构化 config > SDK 托管设置。
    **沙箱 / 审批的官方口径已核验**（`agent-approvals-security` 与 `config-advanced`）：
    本地默认 **workspace-write + 网络关闭**，非版本控制目录默认 **read-only**；
    顶层键 `approval_policy`（`untrusted` / `on-request` / `never` / `granular`，
    含 `approvals_reviewer = "auto_review"`）与 `sandbox_mode`
    （`read-only` / `workspace-write` / `danger-full-access`）成对使用；
    `[sandbox_workspace_write]` 可设 `writable_roots`、`network_access`，
    命名 profile 有 `:read-only` / `:workspace` / `:danger-full-access`；
    `workspace-write` 下 `.git` / `.agents` / `.codex` 仍递归只读；
    网络另有 `features.network_proxy` 域名 allowlist + DNS 重绑定防护。
    **三档沙箱在 Windows / macOS / Linux 的逐平台实现差异，官方没有逐条给出** ——
    官方只说 "OS-level mechanisms enforce sandbox policies"、默认无网络、写入限工作区
    （已查 `agent-approvals-security`、`config-advanced`、`config-reference` 三页）。
  fit: >-
    **适合**：要把 Codex 塞进自己的 Node 应用 / Electron 应用 / CI；
    需要非交互执行；需要精确的文件级权限规则；TypeScript 或 Python 栈；
    已经决定用 OpenAI 模型但想让模型层可换。
    **不适合**：想要一个纯库、不想额外背一个 CLI 子进程（用 OpenAI Agents SDK）；
    目标目录不是 Git 仓库又不愿开`skipGitRepoCheck`；
    需要 SDK 层直接暴露压缩 API（CLI 侧有 `compact_prompt` /
    `experimental_compact_prompt_file` 与 `PreCompact` / `PostCompact` hooks 可配，
    但 SDK 层没有专门的压缩接口，得靠 config 透传）。

pitfalls:
  - 以为 v3 计划里的 openai/codex-sdk 存在 —— 该仓 404，SDK 是 monorepo 子目录
  - 以为 SDK 版本号能反映能力 —— package.json 里是 0.0.0-dev，实际版本跟CLI 走（当前 0.159.3）
  - 在非 Git 目录里开箱即用就跑不了 —— CLI 要求工作目录是 Git 仓库，必须显式跳过
  - 把 `sandbox_workspace_write.network_access` 与 SDK 的 `networkAccessEnabled` 当成两套东西 —— 后者才是 SDK 层入口，前者是 config透传的写法
  - 把 OpenAI Agents SDK（纯 Python 库）当成本 SDK 的同类替代 —— 形态不同，见 layer_position

tags: [TypeScript, Python, Rust, 开源, Apache-2.0, 编程底座, CLI包装, 非交互执行, 沙箱, 审批模式]
related: [codex-cli]

sources:
  - label: openai/codex · 仓库（monorepo，SDK 在 sdk/ 子目录）
    url: https://github.com/openai/codex
    kind: repo
  - label: TypeScript SDK README（包裹 CLI、JSONL 通信、thread/turn、resume、config 透传）
    url: https://github.com/openai/codex/tree/main/sdk/typescript
    kind: docs
  - label: 源码 sdk/typescript/src/threadOptions.ts（ApprovalMode 四档/ SandboxMode 三档 / 网络与推理强度）
    url: https://github.com/openai/codex/blob/main/sdk/typescript/src/threadOptions.ts
    kind: code
  - label: sdk/typescript/package.json（包名 @openai/codex-sdk、Apache-2.0、Node≥18）
    url: https://github.com/openai/codex/blob/main/sdk/typescript/package.json
    kind: code
  - label: docs/exec.md · Non-interactive mode（正文仅外链）
    url: https://github.com/openai/codex/blob/main/docs/exec.md
    kind: docs
  - label: docs/sandbox.md · Sandbox & approvals（正文仅外链）
    url: https://github.com/openai/codex/blob/main/docs/sandbox.md
    kind: docs
  - label: 官方 Agent approvals & security（沙箱三档、审批策略、网络策略、受保护路径）
    url: https://developers.openai.com/codex/agent-approvals-security
    kind: docs
  - label: 官方 Configuration Reference（approval_policy / sandbox_mode / model_provider 等键）
    url: https://developers.openai.com/codex/config-reference
    kind: docs
  - label: 官方 Advanced Configuration（Custom model providers、OSS 模式、压缩、hooks）
    url: https://developers.openai.com/codex/config-advanced
    kind: docs
  - label: 官方 MCP 文档（CLI 与 IDE 支持 STDIO / Streamable HTTP）
    url: https://developers.openai.com/codex/mcp
    kind: docs
  - label: 官方 Non-interactive mode（codex exec、resume、默认 read-only）
    url: https://developers.openai.com/codex/noninteractive
    kind: docs
  - label: Python SDK 目录（本站记录存在，细节未核验）
    url: https://github.com/openai/codex/tree/main/sdk/python
    kind: repo
  - label: Releases（0.159.3 @ 2026-09-30，另有 0.161.0-alpha 预发布）
    url: https://github.com/openai/codex/releases
    kind: changelog
  - label: 官方安全文档（沙箱与审批，JS 渲染，本站点未取到正文）
    url: https://developers.openai.com/codex/security
    kind: docs

link:
  url: https://developers.openai.com/codex/
  kind: official

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**「把 Codex CLI 变成 Node 进程里可驱动的对象」** —— 官方 README 首句就是
「Embed the Codex agent in your workflows and apps」，第二句划清了形态：
> The TypeScript SDK **wraps** the `codex` CLI from `@openai/codex`.
> It **spawns the CLI** and exchanges JSONL events over stdin/stdout.

## 形态澄清：这是本站第一个「CLI 包装型」对象

本站三种编程底座形态里，这个属于第2 类（包装既有 CLI）：

| 形态 | 谁在跑 agent loop | 本站收录对象 |
|---|---|---|
| ① 自建 loop 框架 | 你的进程里一个库 | OpenAI Agents SDK、Deep Agents |
| ② **包装既有 CLI** | **外部 CLI 子进程** | **Codex SDK**、Claude Agent SDK |
| ③ 自带完整运行时 | 厂商托管 | （暂无） |

**这个差别不是措辞问题，它决定了几件实际的事**：

1. **行为边界 = CLI 版本边界**。SDK 本身版本号是 `0.0.0-dev`（package.json 实测），
   真正决定能力的是它 spawn 的那个 CLI —— 当前 `0.159.3`（releases @ 2026-09-30，
   另有 `0.161.0-alpha.7` 预发布）。升级 CLI 就等于升级 SDK 的能力与风险面。
2. **沙箱与审批不由你定**。它们是 CLI 的能力，SDK 只能通过参数影响（见下文 permissions）。
3. **多一个进程就多一份开销和一个失败点**。但换来的是 CLI 侧的全部能力不用你实现。

## 权限面：源码给出了四种审批模式与三档沙箱

⚠ **这一段纠正了本站 CLI 站档案里的一个「未核验」**：
`cli/products/codex-cli.md` 当时写「具体审批模式本次未核验」，原因是在 CLI 文档里没找到枚举（2026-10-08 该档已按官方文档补全审批四档）。
这次从 SDK 源码的类型定义里找到了——**文档外链里没有，源码里有**：

```ts
// sdk/typescript/src/threadOptions.ts（核验 2026-10-01）
export type ApprovalMode = "never" | "on-request" | "on-failure" | "untrusted";
export type SandboxMode = "read-only" | "workspace-write" | "danger-full-access";
```

配套还有：

| 选项 | 取值 | 作用 |
|---|---|---|
| `networkAccessEnabled` | bool | 沙箱内是否放行网络 |
| `webSearchMode` | `disabled` / `cached` / `live` | 联网检索的三档 |
| `webSearchEnabled` | bool | 检索总开关 |
| `modelReasoningEffort` | **8 档**：minimal / low / medium / high / xhigh / max / ultra / persistent | 推理强度 |
| `additionalDirectories` | string[] | 追加可访问目录 |

**更深一层：可以按路径精确拒绝读文件。** SDK 支持 `configOverrides` 逐条透传原始 TOML，
官方示例直接给了文件系统规则：

```ts
configOverrides: ['permissions.audit.filesystem={":root"="read","/path/to/project/.env"="deny"}']
```

这意味着 `.env` 这类文件可以被单独deny，而不是靠「沙箱一刀切不写」这种粗粒度保护。
官方给出的优先级：**原始 overrides > 结构化 config > SDK 托管设置**。

**沙箱 / 审批默认值已核验**（见 axes.permissions）：本地默认 `workspace-write` + 网络关闭，
非版本控制目录默认 `read-only`；`workspace-write` 下 `.git` / `.agents` / `.codex` 递归只读。
**三档沙箱的逐平台实现差异官方未逐条说明**：只说 "OS-level mechanisms enforce
sandbox policies"，未分别列举 Windows / macOS / Linux 的差别（已查
`agent-approvals-security` 与 `config-advanced` 两页）。**Windows 用户尤其要自己确认**。

## 本地文件：有个硬约束，必须知道

> To avoid unrecoverable errors, Codex **requires the working directory to be a Git repository**.

不满足就拒绝运行，可以用 `skipGitRepoCheck: true` 跳过。

**这是一条选型级约束**：在纯数据目录、临时目录、上传目录里直接开箱即用是**不行的**，
而这类场景恰恰是「嵌进自己的产品」时最常遇到的。

## 状态 vs 上下文：它只解决前者

| 本站关心的面 | 本SDK 的官方手段 | 够不够 |
|---|---|---|
| **状态**（可靠续跑） | `resumeThread(id)`，Threads 持久化在 `~/.codex/sessions` | ✅ 有官方支撑 |
| **上下文**（长任务压缩） | 无。SDK 层没有压缩/摘要/落盘选项 | ❌ 只能靠 CLI 侧配置 |

**「状态 ≠ 上下文」这条主张在这里正好得到印证**：它把会话完整保住了，
但没有对内容做任何压缩 —— 线程长了之后成本与延迟是另一回事。

⚠ `~/.codex/sessions` 是**文件目录**而非数据库。跨机迁移、多进程并发写同一会话的语义**官方未说明**。

## 非交互执行：这站里目前唯一有官方证据的候选

`docs/exec.md` 的标题就是 **Non-interactive mode**。

这与 CLI 站那份档案形成一组有意思的对照：
在 CLI 站 6 个对象里，**只有 Gemini CLI 明确支持非交互脚本模式**，其余的这项都标为未核验；
而在这个 harness 站，Codex SDK 是目前唯一有官方非交互文档的对象。

**如果你要的是「无人值守跑完一串任务」，这两个是仅有的两个有证据的落点**——
一个在你的终端，一个在你的 Node 进程里。

## Structured output：支持得很完整

```ts
const turn = await thread.run("Summarize repository status", { outputSchema: schema });
```

- 可直接传 JSON Schema（`as const` 带类型）
- 也可从 Zod 转换：`zodToJsonSchema(schema, { target: "openAi" })`

⚠ 命名陷阱：那个 `target: "openAi"` 只是告诉转换器用哪种目标格式，
产出的是标准 JSON Schema，不代表只能 OpenAI 模型用。

## MCP：Codex CLI 官方支持，SDK 侧经 config 透传

SDK README 全文没有出现 MCP，主仓 `docs/` 目录里也没有 `mcp.md`（核验 2026-10-01）。
但官方开发者文档有独立的 **MCP 页**（核验 2026-10-08）：

> Codex supports MCP servers in both the CLI and the IDE extension.

支持 STDIO 与 Streamable HTTP 两种传输，`codex mcp add ...` 与 `config.toml` 的
`[mcp_servers.<name>]` 均可配，并有 per-server / per-tool `approval_mode`
（`auto` / `prompt` / `approve`）与 `enabled_tools` / `disabled_tools`。
**SDK 侧**：SDK 的 `config` 透传即写入 CLI 的 `config.toml`，因此 MCP server 可经此可用；
不过**官方未在 SDK README 明写这条衔接**，本站只把它记作 CLI 能力，
仍不与本站 MCP 站的 9 个官方 server 建立关联。

## 适合与不适合

**适合**：要把 Codex 塞进 Node / Electron 应用或 CI；需要非交互执行；
需要精确到路径的权限规则；TS 或 Python 栈。
**不适合**：想要一个纯库、不愿多背一个 CLI 子进程（用 OpenAI Agents SDK）；
目标目录不是 Git 仓库又不愿开 `skipGitRepoCheck`；
需要 SDK 层直接暴露压缩 API（CLI 侧可配 `compact_prompt`，见 axes.fit）。

## 核验说明

`confidence: partial` 的依据（2026-10-03 由 verified 降级）：

> **为什么降级**：下方 ❌ 项的主语是**本站的取证缺口**，不是「官方未提供」。
> 按 v3 铁律「未知就说未知」，这些条目存在时标 verified 属于虚高，故降为 partial。
> 主要缺口：三档沙箱的**逐平台**实现差异、第三方 provider 能力对齐、权限审计规则语法。
> （A6.2 已补：MCP 官方支持、model/provider 配置面、沙箱与审批默认值、非交互配置已核验。）

- ✅ 已核验：仓库存在与星数（127,448）、许可（Apache-2.0）、最近推送（2026-10-01，仍活跃）、
  最新稳定版 **0.159.3**（releases @ 2026-09-30）与预发布 0.161.0-alpha.7、
  `sdk/typescript/package.json` 全文（包名 `@openai/codex-sdk`、版本 0.0.0-dev、Node≥18）、
  `sdk/typescript/README.md` 全文六节（quickstart / streaming / structured output / images / resume / 环境与 config）、
  **`sdk/typescript/src/threadOptions.ts` 类型定义全文**（审批四档、沙箱三档、网络与检索、推理八档）、
  `docs/` 目录清单、`sdk/` 下python/typescript/python-runtime 三个子目录存在
- ❌ 未核验：三档沙箱的**逐平台**实现差异（官方只说 OS 级强制，未逐条列举）、
  第三方模型换用后工具调用与 structured output 的质量对齐度、
  Python SDK 的 API 形态与 TS 版是否一致、`~/.codex/sessions` 的并发写语义

⚠ **顺带纠正计划**：v3 计划里写的 `codex-sdk`（标注 127k★）作为**独立仓库不存在**，
gh api 返回 404。127,448★ 是 `openai/codex` monorepo 的星数，
SDK 是它的 `sdk/typescript` 子目录。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按本 SDK 形态定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | CLI 与 SDK 版本组合矩阵（CLI 0.159.3 / 0.161.0-alpha × SDK） | SDK 版本号不反映能力，得知道哪些组合是验过的 |
| 2 | `permissions.audit.filesystem` 的 deny 规则能否真的挡住读 .env | 官方示例给了写法，但拦截强度未核验 |
| 3 | `resumeThread` 在进程崩溃后恢复的完整度 | 本站最关心的「可靠长期运行」 |
| 4 | 8 档 `modelReasoningEffort` 的实际耗时与成本差异 | 官方只给枚举，不给代价 |
| 5 | 非交互模式跑一条真实任务链的失败率与中断行为 | 无人值守场景的核心指标 |
| 6 | 换 `baseUrl` 接第三方 provider 后 structured output 是否仍可靠 | 架构上没锁死，但可靠性未知 |

## 未知项清单

- 三档沙箱在 Windows / macOS / Linux 的逐平台实现差异（尤其 Windows 是否走 WSL）
- 第三方 provider 换用后工具调用与 structured output 的质量对齐度
- Python SDK 的 API 是否与 TS 版对齐（`Thread` / `run` / `resumeThread` 概念是否一致）
- `~/.codex/sessions` 的并发写与跨机迁移语义
- `permissions.audit` 规则的完整语法（官方只给了文件系统一项示例）

## 相关条目

- [Claude Agent SDK](./claude-agent-sdk.md) — **本站最该对照的一对**：同样是 CLI 包装型（捆绑 / spawn CLI + 进程通信），但Claude 侧 README 明说只支持 Claude、没有 provider 旁路，而本 SDK 有 `baseUrl` 与 `model_providers`。
- [OpenAI Agents SDK](./openai-agents-sdk.md) — 同一家厂商的两种形态：那个是纯 Python 库（primitives-only），这个是 Node + CLI 子进程包装。选型第一问就是「要不要多背一个 CLI 进程」。
- [Deep Agents](./deepagents.md) — batteries-included 的对照面：本 SDK 不预置任何东西，工具与沙箱全由 CLI 版本决定。
- [LangGraph](./langgraph.md) — 若要「非交互 + 有图结构 + 多Agent 协作」，编排框架才是对应层；本 SDK 只给单线程执行。
