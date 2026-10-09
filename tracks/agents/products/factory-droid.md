---
id: factory-droid
track: cli
name: Droid
vendor: Factory AI
homepage: https://factory.ai
mark: D

pricing:
  model: paid
  monthly_usd: 20
  monthly_label: Pro $20 / Plus $100 / Max $200 每月；Business / Enterprise 定制报价
  annual_usd: null
  annual_label: 官方定价页只列月付；年付价未列出，记为官方未说明
  note: >-
    **2026-10-08 按 factory.ai/pricing 与 docs.factory.ai/pricing 逐档核实（美元口径）**：
    Pro $20/月、Plus $100/月（约 5× Pro 用量，并解锁 Droid Computers——Factory 托管的云电脑）、
    Max $200/月（约 10× Pro 用量 + 新功能抢先体验）；
    Business 最多 150 席、Enterprise 不限席位，两者均需联系销售，**公开页未给数字**。
    **额度机制官方写明是「滚动 Rate Limits」**：5 小时 / 7 天 / 30 天三窗口独立计算、
    都需有余量才能发请求，Standard Usage 先扣；撞限后可切 **Droid Core**
    （一批开放权重模型，独立额度、免费）或 **Extra Usage**（预付额度，最低 $10、永不过期）。
    **BYOK 也有额度**：官方原文「All Individual plans include an allowance of free
    BYOK usage」，超出后按套餐计费。**没有任何免费档**——最低就是 Pro $20/月。
pricing_pitfalls:
  - 以为有免费档，官方最低档就是 Pro $20/月，无免费层
  - 把 Droid Core 当成免费套餐，它是撞限后的开放权重兜底模型池
  - 把三窗口 Rate Limit 当成一个总额度，5 小时 / 7 天 / 30 天彼此独立

axes:
  model_access: >-
    **模型无关是其卖点：官方托管模型 + BYOK + 本地模型三路并存。**
    官方 models 页列出 Factory 原生托管模型，覆盖 Anthropic（Claude Opus / Sonnet /
    Fable / Haiku）、OpenAI（GPT-6 / GPT-5.5 / GPT-5.3-Codex）、Google（Gemini）、
    xAI（Grok），以及 **Droid Core 开放权重模型**（GLM、Kimi、Qwen、DeepSeek、
    MiniMax、Nemotron 等），每个模型都标了消耗倍率（如 `gpt-5.5` 2×、
    `claude-sonnet-5` 0.8×）与支持的 `reasoningEffort`。
    **BYOK**：官方 BYOK 页原文「Use your own OpenAI or Anthropic keys,
    connect to any open source model providers, or run models locally」——
    在 `~/.factory/settings.json` 的 `customModels` 里配 `baseUrl` / `apiKey` /
    `provider`（三选一：`anthropic`、`openai`、`generic-chat-completion-api`），
    可用 `${VAR}` 引用环境变量；能接 OpenRouter / Fireworks / Together / Ollama /
    vLLM 等任意 OpenAI 兼容端点。**API key 留在本地不上传**——官方原文
    「Your API keys remain local and are not uploaded to Factory servers」。
    换模型用 `/model`；**自定义模型只在 CLI 可用，不出现在 Web / 移动端**。
    另有官方 **Factory Router** 自动跨 provider 路由。
  runtime: >-
    **CLI 优先，但官方是「一种 agent、多平台」形态。**
    主力是终端进程 `droid`（交互式 REPL）——安装三选一：官方脚本
    `curl -fsSL https://app.factory.ai/cli | sh`（macOS / Linux）、
    Windows 的 `irm https://app.factory.ai/cli/windows | iex`、
    或 `npm install -g droid`。生命周期绑定终端会话。
    **同一 agent 另有两个入口**：**Factory App**（桌面客户端）与
    **Droid SDK**（TypeScript `@factory/droid-sdk` / Python `droid-sdk`）——
    官方定价页把三者并列为 Pro 档内容「Factory App / Droid CLI / Droid SDK」。
    企业侧还有 **Droid Computers**（Factory 托管的远端云环境，Plus 起）。
    **本条目只记录 CLI 形态**，桌面与 SDK 形态的差异以官方页面为准。
  local_files: >-
    **在用户工作目录内读写，官方提供 git worktree 与工作目录参数做隔离。**
    官方 CLI 参考给 `--cwd <path>` 指定工作目录；`-w, --worktree [name]`
    可在独立 git worktree 上跑，官方说明其用途是「fanning out parallel
    `droid exec` jobs against the same repo without file conflicts」——
    clean worktree 退出自动删除、dirty 的保留待评审。
    非交互 `droid exec` **默认只读**：DEFAULT 档明确列出可跑的读命令
    （`cat` / `ls` / `find`（不带 `-delete` / `-exec`）/ `git status` / `git log` 等），
    并写明「No modifications to files or system」；要改文件须显式 `--auto low` 以上。
    **是否对代码库做向量索引、大仓库首次建索引耗时官方未说明**
    （已查 CLI Reference 与 Quickstart 两页）。
  background: >-
    **CLI 本体绑定会话，但云端后台形态官方明确。**
    终端进程退出即结束。官方定价页 Pro 档写有「Cloud & local background agents」，
    Plus 档解锁 **Droid Computers**——官方原文「Factory-managed Droid Computers
    (remote cloud environments)」；企业页亦称 Droid 可跑在「CI runners、VMs、
    Kubernetes clusters」上。**Missions** 是多 agent 编排形态
    （orchestrator 协调 worker 与 validator），可用 `/missions` 或
    `droid exec --mission` 发起，官方要求 High 自主级别或
    `--skip-permissions-unsafe`。**云端并发的具体数值与配额官方未给**
    （已查 Plans & Pricing 与 Missions 概览两页）。
  tools: >-
    **内置工具面丰富，MCP 支持完整且带交互式管理器。**
    内置能力含命令执行、文件读写、git 操作、代码评审（`/review`）、
    图像生成、PDF 读取等；官方另有 **Skills**（`/skills`、`/create-skill`）、
    **Hooks**（PreToolUse / PostToolUse / PreCompact 等九类事件）、
    **Custom Droids 子代理**（`/droids`）、**Plugins**（`/plugins`，经 marketplace
    分发）、自定义斜杠命令与 **AGENTS.md**。
    **MCP**：官方原文「Droid supports two types of servers: http (remote
    endpoints) and stdio (local processes)」——`droid mcp add <name> <url>
    --type http` 或 `droid mcp add <name> "<command>"` 添加，`/mcp` 打开
    交互式管理器（浏览 / 查看工具 / 启停 / OAuth 认证 / 从注册表添加 40+ server）；
    配置分用户级 `~/.factory/mcp.json` 与项目级 `.factory/mcp.json`，
    支持 `disabledTools` 按工具禁用，OAuth token 存系统 keyring。
    **非交互模式官方支持**：`droid exec` 输出 `text` / `json`，
    并有 `--input-format stream-jsonrpc` 的长期 JSON-RPC 控制面。
  context: >-
    **会话可按 id 续接与分叉，并有压缩与公开的控制面。**
    非交互侧 `droid exec --session-id <id>` 续接、`--fork <id>` 分叉；
    交互侧退出会提示 resume，CLI 参考有 `-r, --resume`。
    stream-jsonrpc 控制面暴露 `droid.load_session`、fork 会话与 compact history
    等能力，官方原文列举其客户端可「interrupt work, update settings,
    manage MCP servers/tools, inspect context, fork sessions, or compact
    history」；**压缩**另有 `PreCompact` hook 事件，changelog 也有
    「in-place compression」条目。**记忆**：官方企业形态提到跨仓库的
    「organizational knowledge」与 issue 跟踪上下文，Enterprise 档另有
    「Cross-harness agent memory」——但**CLI 侧记忆的持久化边界与保留策略
    官方未在 CLI 页说明**（已查 CLI Overview 与 Droid Exec 两页）。
  permissions: >-
    **分级自主（Autonomy Level）× 命令黑白名单，企业可设上限。**
    官方 Autonomy 页把执行风险分为 `low` / `medium` / `high`，共四档：
    **Off**（只读工具 + 白名单命令）、**Low**（文件编辑 + 低风险命令 / MCP）、
    **Medium**（+ 可逆工作区改动，如 `npm install`、`git commit`）、
    **High**（高风险，如 `git push`、迁移）。`Ctrl+L` 循环切换，`Shift+Tab` 切 Auto / Spec。
    命令策略三张表：`commandAllowlist`（视为低风险）、`commandDenylist`
    （即使放宽也需批准）、`commandBlocklist`（**任何级别都拒绝、无审批提示**，
    官方称「the strongest control available」，能识破 `bash -c` 包裹绕过）。
    非交互 `droid exec` 默认只读，`--auto low|medium|high` 逐级放开，
    `--skip-permissions-unsafe` 全放开（官方标注 DANGEROUS，仅限隔离环境），
    并 **fail-fast**：越级即停、返回非零码、不做部分改动。
    企业可设 Default / Maximum Autonomy Level 封顶。
  fit: >-
    在终端里完成端到端软件工程任务、且需要企业级治理的团队。
    **特别适合**：已有仓库的规划—实现—测试闭环（`/missions` 多 agent 编排）、
    CI/CD 自动化（`droid exec` 单次执行 + JSON 输出 + 失败非零码）、
    需要 BYOK / 本地模型 / 气隙部署以摆脱单一厂商锁定的组织。
    **不适合**：只想找一个免费轻量终端助手的个人——官方最低档即 Pro $20/月。

pitfalls:
  - 以为 BYOK 就完全不受额度限制，官方写明 Individual 档 BYOK 也有免费额度上限
  - 把 Droid 当成纯 CLI，其实官方主推 CLI + 桌面 App + SDK 三入口
  - 以为 droid exec 会直接改文件，它默认是只读模式

tags: [编程, 终端, 多模型, 本地]
related: [filesystem]

sources:
  - label: Factory AI · 官方定价页（Pro $20 / Plus $100 / Max $200；2026-10-08 核验）
    url: https://factory.ai/pricing
    kind: pricing
  - label: Factory AI · 官方文档 · Plans & Pricing（滚动 Rate Limits、Droid Core、Extra Usage、BYOK）
    url: https://docs.factory.ai/pricing
    kind: pricing
  - label: Factory AI · 官方文档 · Full Changelog（CLI / App / API / Web / Enterprise 分面维护）
    url: https://docs.factory.ai/changelog/release-notes
    kind: changelog
  - label: Factory AI · 官方文档 · CLI Updates
    url: https://docs.factory.ai/changelog/cli-updates
    kind: changelog
  - label: Factory AI · 官方文档 · CLI Overview（安装三选一、Key capabilities）
    url: https://docs.factory.ai/cli/getting-started/overview
    kind: docs
  - label: Factory AI · 官方文档 · Quickstart（安装脚本、审批流程）
    url: https://docs.factory.ai/cli/getting-started/quickstart
    kind: docs
  - label: Factory AI · 官方文档 · Droid Exec（headless、自主级别、输出格式）
    url: https://docs.factory.ai/cli/droid-exec/overview
    kind: docs
  - label: Factory AI · 官方文档 · Autonomy Level（四档、命令名单、企业上限）
    url: https://docs.factory.ai/cli/user-guides/auto-run
    kind: docs
  - label: Factory AI · 官方文档 · Model Context Protocol (MCP)（http / stdio、注册表、分层配置）
    url: https://docs.factory.ai/cli/configuration/mcp
    kind: docs
  - label: Factory AI · 官方文档 · Bring Your Own Key (BYOK)（三 provider 类型、本地模型、key 不外传）
    url: https://docs.factory.ai/cli/byok/overview
    kind: docs
  - label: Factory AI · 官方文档 · Available Models（托管模型清单与倍率、Droid Core）
    url: https://docs.factory.ai/models
    kind: docs
  - label: Factory AI · 官方文档 · Enterprise Overview（云 / 混合 / 气隙部署、SOC 2 / ISO）
    url: https://docs.factory.ai/enterprise
    kind: docs
  - label: Factory AI · 官方文档 · Droid CLI Reference（--cwd / --worktree / 安装与更新）
    url: https://docs.factory.ai/reference/cli-reference
    kind: docs
  - label: Factory AI · 官方仓库 · Droid TypeScript SDK
    url: https://github.com/Factory-AI/droid-sdk-typescript
    kind: repo

link:
  url: https://app.factory.ai
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

Factory AI 的终端编码 agent，**模型无关（官方托管 + BYOK + 本地模型三路并存）**，
并以「滚动 Rate Limits + 分级自主」面向企业治理。

## 变更记录说明

Droid 的变更记录在官方文档站，不是 GitHub releases 页：

| 面 | 代表版本 | 日期 |
|---|---|---|
| CLI | `v0.229.0` | 2026-09-29 |
| Desktop | `v0.186.0` | 2026-09-29 |

官方 Full Changelog 是**分面累积列表**，按 CLI / App / API / Web / Enterprise
多个面维护，并自称累计上百个 releases，另有单独的「CLI Updates」页。
**引用版本号时要注明是哪个面**——CLI 与 Desktop 是两套号，
且官方 changelog 页头的「latest」摘要与下方条目列表在核验当日不同步
（页头写 `v0.228.0`、条目已出现 `v0.229.0`），引用前以页面实时为准。

## 安装与三种入口

都可以装：

```
curl -fsSL https://app.factory.ai/cli | sh      # macOS / Linux
irm https://app.factory.ai/cli/windows | iex    # Windows
npm install -g droid
```

**注意这不是「一个 CLI 工具」，而是「一个 agent 的三个入口」**：
定价页把 Pro 档内容写成「Factory App / Droid CLI / Droid SDK」，
官方文档另有「IDE Integrations」与 JetBrains / Zed 集成。
采购时要看清你要的是哪个入口——三者的运行面与额度口径不完全相同。

## 额度结构值得单独记录

官方额度不是「每月一个总量」，而是**三窗口滚动 Rate Limit**：

```
5-hour / 7-day / 30-day 三个窗口独立，都需有余额才能发请求
```

**这解释了「为什么刚充值还是被限」**——你可能撞的是 5 小时窗口。
撞限后可切 **Droid Core**（开放权重模型，独立免费额度池）继续干，
或用 **Extra Usage**（预付、$10 起、不过期）。这是本站见到的最细的额度口径之一。

## 企业形态

官方 Enterprise 页把部署面写成「cloud, hybrid, and fully airgapped environments」，
Droid 可跑在「developer laptops、CI runners、VMs、Kubernetes clusters、
airgapped networks」。合规程序表列 **SOC 2 Type II / ISO 27001 / ISO 42001**，
并提供 Droid Shield、命令策略、hooks、沙箱与 OpenTelemetry 遥测。
**这是本赛道里企业治理表述最完整的一份**，但均为官方自述。

## 核验说明

`confidence: partial` 的原因：

- ✅ 已核验：定价五档与三窗口 Rate Limit 机制、Droid Core / Extra Usage / BYOK、
  安装三选一、CLI + Desktop + SDK 三入口、四档 Autonomy 与命令名单、
  MCP 两种传输与分层配置、headless `droid exec` 与自主级别、企业部署与合规自述
- ❌ 官方未说明：代码库索引策略与大仓库耗时、云端并发与配额数值、
  CLI 侧记忆的持久化边界（见「未知项清单」）

**引用本条目时请只使用已核验部分。**

## 适合与不适合

在终端里完成端到端软件工程任务，且需要企业级治理的团队。
已有仓库的规划—实现—测试闭环（`/missions`）、CI/CD 自动化
（`droid exec` 单次执行 + JSON 输出 + 失败非零码）是它的重点场景。

**不适合**只想找一个免费轻量终端助手的个人——
官方最低档就是 Pro $20/月，没有免费层；
`droid exec` 默认只读，想让它自动改文件要显式提级。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**三窗口 Rate Limit 的实际打断频率**——
这是它与「按月给一个总量」类工具最不同的工作流摩擦点。

## 未知项清单

- 代码库向量索引是否存在、大仓库首次建索引耗时（官方未说明，已查 CLI Reference 与 Quickstart）
- 云端背景 agent 与 Droid Computers 的并发数值与配额（官方只说随套餐，未给数字）
- CLI 侧跨会话记忆的持久化边界与保留策略（官方未在 CLI 页说明，已查 CLI Overview 与 Droid Exec）
- Business / Enterprise 的具体价格（官方页只写「联系销售」）

## 相关条目

- [Codex CLI](./codex-cli.md) — 同为多 provider 终端 agent，架构侧重 app server
- [OpenCode](./opencode.md) — 同为 BYOK 多 provider，可对照开放许可一侧
- [Claude Code CLI](./claude-code-cli.md) — 同为终端编码 agent，权限模型与生态不同