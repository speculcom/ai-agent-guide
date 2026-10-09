---
id: kiro
track: ide
name: Kiro
vendor: AWS
homepage: https://kiro.dev
mark: K

pricing:
  model: freemium
  monthly_usd: 20
  monthly_label: Free $0 / Pro $20 / Pro+ $40 / Pro Max $100 / Power $200（每用户每月），Enterprise 洽谈
  annual_usd: null
  annual_label: 官方定价页只列月付（每月 1 日扣费），未列年付报价
  note: >-
    官方定价页（kiro.dev/pricing）**2026-10-08 逐档核实**（美元，不含税）：
    Free $0（50 credits，限开放权重模型与 Claude Sonnet 4.5）、
    Pro $20（1,000 credits）、Pro+ $40（2,000）、Pro Max $100（5,000）、Power $200（10,000），
    付费档均可加购 credits（$0.04/credit，可买 $5 起）。Enterprise 集中计费 / SSO / 用量分析，
    经 AWS 结算。「credit 是对一次 prompt 的工作量计量」（复杂 prompt 常 >1 credit，
    不同模型按倍数消耗）。**首次升级付费档经社交登录或 AWS Builder ID 可获 $20 抵扣。**
    未用月额度**不结转**下月；加购 credits 可结转，自购买日起 12 个月过期。
    AWS GovCloud（US）定价约高 20% 且不提供 Free 档。价格均不含税。
pricing_pitfalls:
  - 以为 Kiro Free 是长期免费档，它每月仅 50 credits 且限开放权重模型与 Claude Sonnet 4.5
  - 以为月度 credits 会累积，官方写明未用月额度不结转下月
  - 以为加购 credits 永久有效，官方写自购买日起 12 个月过期

axes:
  model_access: >-
    **由 Amazon Bedrock 承载多厂商模型**：官方 models 页列出 Auto（自动路由）、
    OpenAI GPT-5.6（Sol / Terra / Luna）、Anthropic Claude（Opus 5.5 / 5 / 4.8 / 4.7 / 4.6 / 4.5、
    Sonnet 5.5 / 5 / 4.6 / 4.5 / 4.0、Haiku 4.5）与开放权重模型（DeepSeek 3.2、MiniMax M2.5 / M2.1、
    GLM-5、Qwen3 Coder Next）。**档位与可得性绑定**：官方 pricing 页写明 Free 档可用开放权重模型与
    Claude Sonnet 4.5，付费档才含 premium models（含 Auto、Sonnet 5、Opus 5）。
    模型按 credit 倍数计费（Auto = 1.0x 基准，GPT-5.6 Sol 最高 4.4x）。
    GPT-5.6 一律从美国区域服务，其余跟随 profile 区域（US / EU），Claude Fable 5.1 为 Enterprise 预览。
    **自有 API Key（BYOK）官方未说明（已查 models 与 pricing 两页）。**
  runtime: >-
    **独立桌面 IDE，官方原文明说「a desktop development environment built on a VS Code foundation」**，
    不是装进别人编辑器的扩展。但官方把它定位为「one agent, every surface」：
    IDE / CLI / Web / Mobile 都是同一个 unified agent harness 的前端，本地客户端经 stdio 走
    **Agent Client Protocol（ACP）**，Web / Mobile 经 WebSocket 连云端沙箱。
    **IDE 与 CLI 默认在本机运行 harness**（工具操作本地文件与 shell）；两者也可创建并接入云端 sandbox 里的
    Cloud Session。因为边界是标准 ACP，官方称兼容编辑器如 JetBrains IDE 与 Zed 也能把 Kiro 当 agent 用。
  local_files: >-
    通过 IDE 访问工作区文件。**代码理解分两层（官方 Code intelligence 页）**：
    内置 Tree-sitter 覆盖 18 种语言，提供符号模糊搜索、文档大纲、AST 结构搜索与改写、代码库概览，
    跨 surface 可用；**LSP 为可选增强**（查引用、跳定义、重命名、诊断、悬停文档），仅 IDE 与 CLI，
    需装语言服务器。**索引策略有专页**：打开项目即自动索引源码、文档、配置与依赖，
    文件变更与外部改动会增量重索引，可手动 Force Re-Index / Rebuild。
    用 `.kiroignore`（gitignore 风格）把文件排除出 agent 访问。
    **索引是否上传云端官方未说明（已查 codebase indexing 与 how-kiro-works 两页）。**
  background: >-
    **这是本站少见的「真后台」**：官方 Cloud sessions 页写明会话在厂商托管的云端 sandbox 里跑，
    原文「The agent keeps working in the sandbox whether or not you're connected」，
    可关掉笔记本后从手机、终端或 IDE 回来继续。IDE / CLI / Web / Mobile 都能创建与接入同一个
    Cloud Session（属于账户而非某个 app）。**官方给出了硬数字**：最多 10 个并发 Cloud Session，
    不额外收云算力费（包含在现有 plan 内）；从 IDE 创建需 IDE v1.0.293+、从 CLI 需 CLI v2.17+。
    本地 harness 则依赖你自己的机器，退出即停。
  tools: >-
    内置文件、shell、web、code 四类工具。**扩展机制成体系**：MCP（本地 stdio 与远程 HTTP/SSE、
    JSON 配置、支持 server 提供的 prompts / resources 与 elicitation、`kiro://` 一键安装链接）；
    Powers（打包了知识的 MCP server，按需加载）；Skills（开放标准的可移植指令包）；
    Custom agents 与 sub-agents；Specs；Hooks。**Hook 触发点官方列全**：
    Prompt Submit、Agent Stop、Session Start、Session End（CLI V3）、Agent Spawn、
    Pre / Post Tool Use、File Create / Save / Delete、Pre / Post Task Execution、Manual。
    CLI 另有 headless 模式（`--no-interactive`，配 API key）用于 CI/CD。
    **Mobile 不支持 MCP 与本地文件工具。**
  context: >-
    **Specs 是它的招牌**：每个 spec 生成 `requirements.md`（或 `bugfix.md`）/ `design.md` / `tasks.md` 三份，
    走「需求 → 设计 → 任务」三段式；tasks.md 支持按依赖图分波并行执行。
    **Steering 提供持久项目上下文**（官方 steering 页）：`.kiro/steering/`（工作区）与
    `~/.kiro/steering/`（全局），内置 product / tech / structure 三份基础文件，
    支持 always / fileMatch / manual / auto 四种 inclusion 模式，并兼容 AGENTS.md。
    另有 subagents（各自独立上下文窗口）、compaction（自动摘要旧历史，单向不可回滚）、
    checkpoints / rewind、`/sessions` 会话管理与 CLI 实验性的 knowledge 库（语义检索）。
    **上下文窗口具体数值官方未在 docs 单列（已查 compaction 与 models 两页）。**
  permissions: >-
    **能力制权限，非二元信任**（官方 permissions 页原文：capability-based，
    "replacing older binary trust models"）。规则写 YAML，按 capability
    （`fs_read` / `fs_write` / `shell` / `web_fetch` / `web_search` / `mcp` / `subagent` /
    `skill` / `power` / `context` / `diagnostics` / `sandbox_network`）配 match / exclude，
    effect 取 `deny` / `ask` / `allow`，**deny > ask > allow**。共六个作用域
    （Kiro 硬编码、administration、user、workspace、agent、session）。IDE 另有 Agent Autonomy 的
    Autopilot / Supervised 两档；工作区默认不被信任，未信任前不加载仓库内的 agents / steering / MCP / Skills。
    **headless 下每个 `ask` 都被当作 deny。**
  fit: >-
    在 AWS 生态里做正式工程交付、需要「先出 spec 再实现」的团队；
    **需要云端会话在关机后继续跑的人**（Cloud sessions，最多 10 并发）；
    需要把 steering 与权限规则随仓库分发的团队（`.kiro/` 可提交，配置跨 surface 一致）。
    Free 档适合低量试用（50 credits/月，限开放权重模型与 Sonnet 4.5）。

    **不适合**想接自有 API Key 或跑本地模型的人——官方 models 与 pricing 两页未提供 BYOK；
    也不适合要求额度口径透明的重度用户，credit 按模型倍数消耗，官方未给「固定请求数」换算。
pitfalls:
  - 把 Kiro 当成纯 IDE 工具，它另有 CLI / Web / Mobile 与 Crew，Cloud Session 还能关机后续跑
  - 以为 credits 按模型「包干」，官方是统一 credit、各模型按倍数（最高 4.4x）消耗
  - 把 Kiro Free 当长期可用的免费档，它每月仅 50 credits 且限特定模型

tags: [编程, IDE, 多模型, 混合]
related: [context7]

sources:
  - label: Kiro · Changelog（IDE 1.2 / CLI 2.27 / Workflows / Opus 5.5，2026-10-08 取到正文）
    url: https://kiro.dev/changelog/
    kind: changelog
  - label: Kiro · 官方定价页（Free / Pro / Pro+ / Pro Max / Power 五档 + credit 说明，2026-10-08 核）
    url: https://kiro.dev/pricing/
    kind: pricing
  - label: Kiro · 官方文档首页
    url: https://kiro.dev/docs/
    kind: docs
  - label: Kiro · How Kiro works（unified harness、ACP、各 surface 运行位置）
    url: https://kiro.dev/docs/how-kiro-works/
    kind: docs
  - label: Kiro · Specs（requirements / design / tasks 三段式与并行任务）
    url: https://kiro.dev/docs/specs/
    kind: docs
  - label: Kiro · Steering（工作区 / 全局 steering、四种 inclusion 模式、AGENTS.md）
    url: https://kiro.dev/docs/steering/
    kind: docs
  - label: Kiro · Hook triggers（Prompt Submit / Pre Tool Use / File Save 等完整触发点）
    url: https://kiro.dev/docs/hooks/types/
    kind: docs
  - label: Kiro · MCP（stdio / HTTP / SSE、`kiro://` 安装链接）
    url: https://kiro.dev/docs/mcp/
    kind: docs
  - label: Kiro · Models（多厂商模型清单与 credit 倍数）
    url: https://kiro.dev/docs/models/
    kind: docs
  - label: Kiro · Permissions（capability-based 规则与六作用域）
    url: https://kiro.dev/docs/permissions/
    kind: docs
  - label: Kiro · Cloud sessions（云端 sandbox、10 并发、跨 surface）
    url: https://kiro.dev/docs/cloud-sessions/
    kind: docs
  - label: Kiro · Code intelligence（Tree-sitter / LSP 两层）
    url: https://kiro.dev/docs/tools/code-intelligence/
    kind: docs

link:
  url: https://kiro.dev/downloads/
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**AWS 的 agentic 工程环境**：用一个 unified harness 撑起 IDE / CLI / Web / Mobile 四个 surface，招牌是 spec-driven 的 requirements / design / tasks 三段式，外加关机后仍在跑的 Cloud Session。

## 四个 surface，一个 harness

官方把形态讲得很明确——「one agent, available everywhere you work」：

| surface | 官方定位 |
|---|---|
| **IDE** | 基于 VS Code 的独立桌面 IDE（built on a VS Code foundation） |
| **CLI** | 终端 TUI，另有 headless 模式进 CI/CD |
| **Web** | 浏览器里的云端 agent，跑在托管 sandbox |
| **Mobile** | 手机上启动与 steer 会话 |

**关键设计：IDE / CLI 默认在本机跑 harness，Web / Mobile 在云端 sandbox 跑**，但四者是同一个 harness 的前端，靠开放协议 **ACP** 连接。因此官方称 JetBrains IDE 与 Zed 也能把 Kiro 当 agent 用。

## 招牌：spec-driven development

官方首页原话：把 prompt 变成「requirements, architectural designs, and sequenced tasks」。每个 spec 落地为三份文件：

- `requirements.md`（或 `bugfix.md`）——用户故事与验收标准
- `design.md`——技术架构、时序图与实现考量
- `tasks.md`——离散可追踪任务，支持按依赖图分波并行执行

配套还有 **steering 文件**（`.kiro/steering/` 的持久项目上下文，四种 inclusion 模式）与 **agent hooks**（十余个触发点，从 File Save 到 Pre Task Execution）。

## 适合与不适合

在 AWS 生态里做正式工程交付、习惯「先出 spec 再实现」的团队。
需要云端会话在关机后继续跑的人（Cloud sessions，最多 10 并发）。
想把 steering 与权限规则随仓库分发的团队（`.kiro/` 可提交）。

**不适合**想接自有 API Key 或跑本地模型的人——官方 models 与 pricing 两页都没有 BYOK 说明；
也不适合要求额度口径透明的重度用户，credit 按模型倍数消耗，官方未给固定请求数换算。

## 核验说明

本条目 `confidence: partial` 的原因：

- ✅ 已核验：定价五档与 credit 规则、模型清单与倍数、specs / steering / hooks 结构、
  MCP 传输方式、capability-based 权限、Cloud sessions 并发数字、
  「built on a VS Code foundation」的形态表述
- ❌ 未取到：BYOK / 自有 Key 是否支持、IDE 索引是否上云、压缩触发阈值、Crew 的完整能力面

本轮核到的官方页：kiro.dev/pricing、/changelog、/docs、/docs/how-kiro-works、
/docs/specs、/docs/steering、/docs/hooks/types、/docs/mcp、/docs/models、
/docs/permissions、/docs/cloud-sessions、/docs/tools/code-intelligence。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测 spec 三段式的实际产出质量，以及 Cloud Session 从 IDE 创建后关掉本机、再从手机接回时的状态完整性——这两点是官方最强的承诺。

## 未知项清单

- 是否支持自有 API Key（BYOK）与本地模型——官方未说明（已查 /docs/models 与 /pricing 两页）
- IDE 代码索引是否上传云端——官网未公开索引位置（已查 codebase indexing 与 how-kiro-works 两页）
- 各模型上下文自动压缩的触发阈值（官方未给数字）
- Crew 的完整能力边界（本轮只核到首页入口与 changelog 条目）

## 相关条目

- [Cursor](./cursor.md) — 同为 VS Code 衍生的独立 IDE，可对照「云端 Agent 关机续跑」与 Kiro 的 Cloud Session
- [Codex IDE 扩展](./codex-ide.md) — 对照点：Codex 是装进已有编辑器的扩展，Kiro 是自带 harness 的独立 IDE
- [Windsurf](./windsurf.md) — 同为独立 IDE 形态，可对照各自的云端与权限设计