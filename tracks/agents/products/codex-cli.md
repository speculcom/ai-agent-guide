---
id: codex-cli
track: cli
name: Codex CLI
vendor: OpenAI
homepage: https://github.com/openai/codex
mark: C
accent: "#10A37F"

pricing:
  model: freemium
  monthly_usd: 20
  monthly_label: 随 ChatGPT 套餐（Free 有限 / Plus $20 扩量 / Pro $100 起 最大任务量）
  annual_usd: null
  annual_label: 官方定价页只列月付；年付价未列出，记为未知
  note: >-
    README 确认「Using Codex with your ChatGPT plan」—— 授权随 ChatGPT 订阅。
    **2026-10-01 按 OpenAI 官方定价页逐档核实（美元口径）**：
    Free $0（**Codex access limited**）、
    Go $8、**Plus $20**（**Expanded Codex usage**）、
    **Pro 起 $100**（**Maximum Codex tasks**，另标5x 或 20x 更多用量）。
    Business / Enterprise 另计。
    **关键结论：Codex 额度是随套餐分档的，不是「买了就有」**——
    免费层只有有限额度，Plus 是「扩量」，Pro 才是「最大任务量」。
    **API 计费与订阅授权不是同一额度**（原 pitfall 仍成立）：
    API 走独立的按量计费，不消耗订阅内的 Codex 额度。
pricing_pitfalls:
  - 以为买了 ChatGPT 订阅就能用 API，API 单独计费
  - 以为 CLI 和 IDE 扩展共享额度，实际配额跟随账户与套餐
  - 以为免费层也能畅用 Codex —— 官方定价页 Free 档写的是 Codex access limited

axes:
  model_access: >-
    **默认走 OpenAI 自家模型，但架构上可换 provider。**
    官方 config-basic 的「Default model」示例为 `model = "gpt-5.5"`，
    CLI 有 `--model` / `-m` 覆盖（示例 `gpt-5.4`），
    另有 `model_context_window`、`model_reasoning_effort`、
    `model_catalog_json` 与 `codex debug models` 可查看模型目录。
    **自定义 provider 官方明确支持**（config-advanced「Custom model providers」）：
    顶层 `model` + `model_provider` 配合 `[model_providers.<id>]`
    （`base_url` / `env_key` / `wire_api` / `http_headers` / `auth.command`）；
    保留内置 ID 为 `openai`、`ollama`、`lmstudio`，另内置 `amazon-bedrock`，
    示例直接给 `[model_providers.mistral] base_url="https://api.mistral.ai/v1"`；
    并支持 **OSS 模式** `--oss` + `oss_provider = "ollama" | "lmstudio"`，
    `openai_base_url` 可改内置 OpenAI provider 的 base URL。
    **换第三方模型后 tool calling 质量官方未给量化结论。**
  runtime: >-
    **本地 Rust 实现的终端进程**（releases 标签为 rust-v*）。
    生命周期绑定终端会话，退出即结束。
  local_files: >-
    **在用户工作目录内操作，默认写入限工作区，且要求是 Git 仓库。**
    官方 agent-approvals-security 原文：默认 "no network access and write
    permissions limited to the active workspace"，工作区含当前目录与 `/tmp`
    （`/status` 可查看工作区目录）。
    沙箱默认档位：**版本控制目录默认 `workspace-write`，非版本控制目录默认
    `read-only`**；`workspace-write` 下 `.git` / `.agents` / `.codex` 递归只读。
    可用 `--add-dir` 追加可写目录、`-C/--cd` 指定工作目录、
    `project_root_markers` 自定义项目根识别（默认含 `.git`）。
    **硬约束**：非交互 `codex exec` 要求工作目录是 Git 仓库，官方原文
    "Codex requires commands to run inside a Git repository"，
    可用 `--skip-git-repo-check` 跳过。
  background: >-
    **终端进程随会话结束，但官方有云端任务形态已核到。**
    官方 Codex cloud 页原文：Codex cloud 让 Codex
    "work on tasks in the background (including in parallel) using its own
    cloud environment"，跑在 "isolated OpenAI-managed containers"，
    不访问你的宿主机或无关数据。
    CLI 侧有 `codex cloud` 子命令（实验性，别名 `codex cloud-tasks`）
    与 `codex apply`（把云任务 diff 应用到本地工作树）；
    云端按 ChatGPT 套餐提供（Plus / Pro / Business / Edu / Enterprise）。
    **云端任务的并发与时长额度官方未给具体数值，只写随套餐。**
  tools: >-
    **内置工具面与 MCP 均已核到。**
    官方能力分散在 config 的能力开关里：`shell`（执行命令，
    `features.shell_tool`）、`unified_exec`（PTY 执行）、web search
    （`web_search = cached | live | disabled`）、undo、git commit、
    **multi-agent 协作**（`spawn_agent` / `send_input` / `resume_agent` /
    `wait_agent` / `close_agent`，`features.multi_agent`）与 memories；
    `codex exec --json` 的事件类型含 command executions、file changes、
    MCP tool calls、web searches、plan updates。
    扩展机制：**Hooks**（PreToolUse / PostToolUse / PreCompact 等）、
    **Skills**（`SKILL.md`，可打包为 plugins）与 **plugin marketplace**。
    **MCP 官方支持完整**（官方 MCP 页原文 "Codex supports MCP servers in
    both the CLI and the IDE extension"）：支持 STDIO 与 Streamable HTTP
    （Bearer / OAuth，`codex mcp login`），`codex mcp` CLI 与
    `[mcp_servers.<name>]` 均可配，有 `enabled_tools` / `disabled_tools`
    与 per-tool `approval_mode`；`codex mcp-server` 还能把 Codex 本身
    作为 MCP server 暴露给别的 agent。
  context: >-
    **会话续接 + 自动压缩 + 可选 memories，三轮机制都已核到。**
    **续接**：`codex resume`（交互）与 `codex exec resume`（非交互，
    `--last` 或 `<SESSION_ID>`），`codex fork` 可把会话分叉成新线程；
    app server 架构让线程可启动、续接与恢复。
    **压缩**：官方配置键 `compact_prompt`（内联覆盖压缩提示词）与
    `experimental_compact_prompt_file`，并有 `PreCompact` / `PostCompact`
    hook 事件；上下文窗口可由 `model_context_window` 显式设置（示例 128000）。
    **记忆**：`[features] memories = true` 开启后，Codex 把既往会话提炼为
    本地记忆文件（默认 `~/.codex/memories/`），TUI 用 `/memories` 按线程控制，
    由 `memories.*` 调参；官方称 memories 会 "redacts secrets"。
    **注意 memories 默认关闭。**
  permissions: >-
    沙箱与审批边界跟随运行环境。
    **API key 计费与订阅不是同一额度**（此点已在定价说明中确认）。
    **审批与沙箱模式已核验完成**，官方口径（agent-approvals-security /
    config-advanced / config-reference）与 SDK 源码一致：
    顶层 `approval_policy` = `untrusted` / `on-request` / `never` /
    `granular`（`on-failure` 已弃用），`approvals_reviewer` = `user` /
    `auto_review`；`sandbox_mode` = `read-only` / `workspace-write` /
    `danger-full-access`（另有命名 profile `:read-only` / `:workspace` /
    `:danger-full-access`）。
    **本地默认 `workspace-write` + 网络关闭**，非版本控制目录默认 `read-only`；
    `workspace-write` 下 `.git` / `.agents` / `.codex` 递归只读；
    网络另有 `features.network_proxy` 域名 allowlist + DNS 重绑定防护。
    TUI 里用 `/permissions` 切 read-only，`--ask-for-approval never` 关审批，
    `--dangerously-bypass-approvals-and-sandbox`（别名 `--yolo`）全放开。
    **Windows 另有专属档位** `[windows] sandbox = "elevated" | "unelevated"`，
    `codex sandbox` 子命令可在 macOS / Linux / Windows 提供沙箱；
    但**逐平台的实现细节官方未按平台分别展开**（已查 config-basic 与
    agent-approvals-security 两页）。详见
    [Codex SDK 档案](../../harness/products/codex-sdk.md)。
  fit: >-
    在终端里做工程任务，需要接入 CI 或自建客户端的场景。
    **非交互模式有官方文档支持**（`docs/exec.md`标题即 Non-interactive mode，正文为外链），
    这使它是本站 CLI 站里除 Gemini CLI 外唯一有非交互证据的对象。
    已有仓库的续接与恢复是其架构重点。

pitfalls:
  - 把 API 额度当成订阅额度的一部分，两者独立计费
  - 以为 CLI 本身就是全部，实际还有 app server 供自建客户端接入
  - 以为文档站能直接 curl 抓取，可能被 CDN 拦截

tags: [编程, 终端, 本地]
related: [codex-sdk, filesystem]

sources:
  - label: OpenAI · Codex CLI 仓库
    url: https://github.com/openai/codex
    kind: repo
  - label: OpenAI · Codex CLI Releases（rust-v0.158.0 @ 2026-09-28）
    url: https://github.com/openai/codex/releases
    kind: changelog
  - label: OpenAI · Codex CLI Commits
    url: https://github.com/openai/codex/commits/main
    kind: changelog
  - label: OpenAI · Codex 文档
    url: https://developers.openai.com/codex/cli
    kind: docs
  - label: OpenAI · Config basics（默认模型 gpt-5.5、sandbox_mode、Windows sandbox）
    url: https://developers.openai.com/codex/config-basic
    kind: docs
  - label: OpenAI · Advanced Configuration（自定义 provider / OSS / hooks）
    url: https://developers.openai.com/codex/config-advanced
    kind: docs
  - label: OpenAI · Configuration Reference（approval_policy 等配置键）
    url: https://developers.openai.com/codex/config-reference
    kind: docs
  - label: OpenAI · Agent approvals & security（沙箱 / 审批默认 / 网络）
    url: https://developers.openai.com/codex/agent-approvals-security
    kind: docs
  - label: OpenAI · Non-interactive mode（codex exec / Git 仓库要求）
    url: https://developers.openai.com/codex/noninteractive
    kind: docs
  - label: OpenAI · MCP（STDIO / Streamable HTTP、per-tool approval_mode）
    url: https://developers.openai.com/codex/mcp
    kind: docs
  - label: OpenAI · CLI 参考（--model / --sandbox / codex cloud / exec）
    url: https://developers.openai.com/codex/cli/reference
    kind: docs
  - label: OpenAI · Codex cloud / web（云任务跑在 OpenAI 托管容器）
    url: https://developers.openai.com/codex/cloud
    kind: docs
  - label: OpenAI · Memories（跨会话记忆，默认关闭）
    url: https://developers.openai.com/codex/memories
    kind: docs
  - label: OpenAI · Customization（AGENTS.md / Skills / MCP / Subagents）
    url: https://developers.openai.com/codex/concepts/customization
    kind: docs

link:
  url: https://github.com/openai/codex
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

OpenAI 官方的终端编码 agent，**Rust 实现**，架构上强调 app server 与线程续接。

## 变更记录说明

本对象有独立 releases：

| 版本 | 日期 |
|---|---|
| `rust-v0.158.0` | 2026-09-28 |

**注意版本号前缀是 `rust-v`**，说明仓库同时包含其他语言的实现，
引用版本号时要完整写前缀。

## 安装方式

README 提供两种：
```
# Install using npm
# Install using Homebrew（--cask）
```

授权方式明确：README 有独立章节 **"Using Codex with your ChatGPT plan"**——
即授权随 ChatGPT 订阅。

## 架构关键：app server

Codex 的设计重点不是 CLI 本身，而是**它背后的 app server**：

- 自定义客户端通过 app server 接入
- 线程可启动、续接与恢复
- Python SDK 基于 app-server JSON-RPC

**这意味着它可以脱离终端单独使用**——
如果你要自建集成，CLI 只是其中一个客户端。

## 核验限制（A6.2 已解除）

**初版采集时**这条目多个维度标为未知，原因是官方文档站
`developers.openai.com` 当时对 curl 返回 **403**（CDN 拦截），
仓库 README 又极简，拿不到「沙箱档位、工具清单、模型映射、审批模式」。

**A6.2（2026-10-08）改用浏览器直取官方文档后已全部补齐**：
`config-basic` / `config-advanced` / `config-reference` /
`agent-approvals-security` / `noninteractive` / `mcp` / `cli/reference` /
`cloud` / `memories` 等页正文均已取到，见上方 axes 的逐条结论。

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库存在、许可（Apache-2.0）、最新版本、发布日期、
  star 数（126,978）、安装方式、ChatGPT 订阅授权、
  **默认模型与 provider 配置面、沙箱档位与默认值、审批策略枚举、
  工具清单与 MCP、上下文压缩与 memories、云端任务形态**
- ❌ 未核验：三档沙箱的**逐平台**实现细节（官方只说 OS 级强制 +
  Windows `elevated`/`unelevated` 档位）、换 provider 后 tool calling 质量、
  云端任务的并发与时长具体数值

**引用本条目时请只使用已核验部分。**

## 适合与不适合

在终端做工程任务，需要接入 CI 或自建客户端的场景。
已有仓库的续接与恢复是它的架构重点。

**不适合**需要「沙箱逐平台实现逐条明确」的场景——
官方只说明 OS 级强制与 Windows 的 `elevated` / `unelevated` 档位，
未按 macOS / Linux / Windows 分别列出实现细节，采购前仍建议实测。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

## 未知项清单

- 三档沙箱在 macOS / Linux / Windows 的**逐平台**实现细节
  （官方只说 OS 级强制 + Windows `elevated` / `unelevated`，未分平台展开）
- 换第三方 provider 后 tool calling 的质量对齐
- 云端任务的并发数与时长具体数值（官方只说随套餐）

> 原「默认模型 / 沙箱档位 / 工具清单 / 上下文策略 / 审批模式 / 云端任务入口」
> 六项已由官方 developers.openai.com/codex（config-basic、config-advanced、
> agent-approvals-security、noninteractive、mcp、cli/reference、cloud）核到，
> 见上方 axes。

## 相关条目

- [Claude Code CLI](./claude-code-cli.md) — 同为终端编码 agent
- [Gemini CLI](./gemini-cli.md) — Google 官方同类
