---
id: junie
track: ide
name: Junie
vendor: JetBrains
homepage: https://www.jetbrains.com/junie/
mark: J

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: AI Free（3 AI Credits/30 天）/ AI Pro（10）/ AI Ultimate（35）/ AI Enterprise；官方页按核验者所在地显示人民币年付
  annual_usd: null
  annual_label: 官方定价页按核验者所在地显示人民币年付价，未取得美元口径，故 annual_usd 记 null
  note: >-
    官方 AI 定价页（jetbrains.com/ai-ides/buy/）与 Junie 许可页核验（2026-10-08）。
    **配额口径**：AI Free 3 AI Credits / 30 天、AI Pro 10、AI Ultimate 35；
    官方原文「1 AI Credit is worth USD 1.00」，加购 credits 自购买日起 12 个月有效。
    **Junie 消耗的是 JetBrains AI 订阅配额**；All Products Pack 与 dotUltimate 自带 AI Pro 档，
    新用户有 30 天 AI Pro 试用。**官方许可页明确两点：Junie 目前不含在 AI Enterprise 档，
    且因地区限制对中国大陆用户不可用。** 定价页数字按核验者所在地区以人民币年付口径呈现
    （AI Pro 825、AI Ultimate 2,500、AI Enterprise 5,940 CNY）；本站不跨币种折算。
pricing_pitfalls:
  - 以为 Junie 已包含在 AI Enterprise 档，官方写明该档暂不含 Junie
  - 把 AI Free 的 3 credits 当够日常使用，Junie 按 AI Credits 计费、复杂任务消耗更多
  - 以为包年即可无限用，配额按 30 天周期重置，用尽需等下一周期或加购 / 升级

axes:
  model_access: >-
    **官方主打 LLM-agnostic（不锁定单一模型）**：Junie CLI 发布博客原文称
    「Junie supports all the top-performing models from OpenAI, Anthropic, Google, and Grok」，
    并把 BYOK（自带 API Key）作为定价模型的一部分。官网与定价页另列可接本地模型
    （via OpenAI-compatible APIs，含 Ollama 与 LM Studio）与第三方云模型（OpenAI / Anthropic / Google / xAI）。
    **IDE 侧默认模型有过变动**：帮助页 Models（2025-10-14 修订）写 Default 为 OpenAI 的 GPT-5，
    2026-08-17 官方博客又称默认改为 Gemini 3.7 Flash；本地推理方面，
    帮助页当时写「暂不能在离线模式用本地模型」，2026-08 的 Junie Local 又支持在本机跑 Qwen3.6-27B。
    **具体模型清单与各档可得性，官方未在一页内给全（已查 help Models 页与 AI 定价页）。**
  runtime: >-
    **IDE 形态是插件，不是独立编辑器**：官方 Install 页写明
    「The Junie plugin is not bundled and not enabled in JetBrains IDEs by default」，
    支持宿主为 CLion、GoLand、IntelliJ IDEA、PhpStorm、PyCharm Pro、Rider、RubyMine、
    RustRover、WebStorm 与 Android Studio，并给出各 IDE 的最低版本
    （如 IDEA Ultimate / PyCharm Pro / WebStorm / GoLand 需 2024.3.2+）。
    **另有独立形态 Junie CLI**（2026-03 进入 Beta）：终端、任意 IDE、CI/CD 与 GitHub / GitLab 都能跑；
    ReSharper 2026.2 还把 Junie 带进 Visual Studio（Preview），2026-08 起另有本机推理的 Junie Local。
  local_files: >-
    在 IDE 内读写当前项目文件；Junie 报告新增 / 修改的文件并提供 diff 查看链接，
    完成后在 Done 面板可**逐文件选择性回滚**，再接受或拒绝整次执行。
    **「项目外」是显式边界**：Action Allowlist 里有独立的「Read outside project」与
    「Write outside project」规则，默认需批准。用 `.aiignore`（gitignore 同款语法）
    限制 agent 处理指定文件 / 目录的内容——官方提醒**只保护内容，文件名与目录名仍可见**。
    可在 Junie 的终端里查看它执行的命令输出。
    **IDE 语义索引的实现细节官方未单列（已查 aiignore 与 diffs-and-review 两页）。**
  background: >-
    **IDE 形态依赖 IDE 进程常驻**，本形态下官方未描述「厂商托管、关机续跑」的后台环境。
    Junie 能自主执行多步任务与跑测试 / 构建（Code mode），但都在你打开的 IDE 与本机上进行。
    **Junie CLI 把运行面扩展到终端、CI/CD 与 GitHub / GitLab**，那里是「你自己的运行环境」而非厂商沙箱。
    官方博客另称 Junie 可「run long tasks while you focus on other things」，
    但未给出后台并发或时长额度。**厂商托管的后台执行环境官方未说明（已查 modes、licensing 与 CLI 发布博客三处）。**
  tools: >-
    **模式即能力分层**：Code mode（拆多步计划并自主执行：跑命令、建文件、改代码、跑测试）、
    Ask mode（只读探索与分析）、Auto（自选）与 Plan mode（先产出可编辑的结构化计划再实现）。
    **招牌是「用真调试器」**：GA 版起 Junie 可启动 / 接管调试会话，
    在项目码、库码乃至反编译 `.class` 文件里下断点，查看栈帧与线程状态、求值表达式
    （官方原话「uses the debugger, not println」）。还有 PR 审查、git 工作流，
    以及 `/demo`（跑一遍功能并产出视频 / 截图 / HTML 报告）。
    **MCP 官方支持但只有 stdio**：`mcp.json` 分全局（`~/.junie/mcp.json`）与项目（`.junie/mcp`）两级，
    可自动推荐相关 server，官方写明「Only MCP servers that use the Standard Input/Output (stdio) transport type are currently supported」。
  context: >-
    **Plan mode 把「计划」变成一等工件**：计划文档存在 `.junie/plans`、可提交进版本库，
    含产品需求、技术设计、交付阶段（可选测试策略）分页；需求含糊时 Junie 会反问再落笔，确认后才实现。
    **Guidelines 是持久项目上下文**：`.junie/guidelines.md` 会被加进每个任务，可版本控制与复用
    （官方另有 junie-guidelines 目录）。
    官方另称 Junie「context-aware by default」并能做 next-task prediction；与 JetBrains IDE 连接后有语义重构与智能搜索。
    **上下文窗口与压缩策略官方未给数字（已查 customize-guidelines 与 out-of-beta 博客两处）。**
  permissions: >-
    **默认逐动作审批**：官方把动作分为 safe 与 sensitive，并写明
    「Most terminal commands, code execution, and execution of MCP tools are considered to be sensitive
    actions, and Junie by default requires explicit approval from the user」。
    **Brave Mode** 可一次性放开所有敏感动作，但官方明确「using brave mode is not recommended」。
    **Action Allowlist** 按类型加白：Terminal（支持正则）、RunTest、Build、Preview、MCP、
    Read outside project、Write outside project、Edit build scripts；`ls` / `cd` / `pwd` 默认免确认。
    `.aiignore` 保护文件内容，但官方提示 Brave Mode 或命中白名单的命令可绕过。
    编辑 build 脚本因可能触发代码执行而单独设闸。
  fit: >-
    已在使用 JetBrains IDE（IntelliJ IDEA / PyCharm / WebStorm / GoLand 等）
    并希望在同一环境里用 agent 的人；看重「先出计划再写代码」与多模型 / BYOK 的团队；
    需要在终端或 CI/CD 里复用同一 agent 的人（Junie CLI）。

    **不适合**中国大陆用户——官方许可页写明「Junie coding agent is not available to users in Mainland China
    due to regional restrictions」；也不适合 AI Enterprise 档用户（官方写明该档暂不含 Junie），
    以及需要厂商托管云后台的人（本形态无「关机续跑」的官方说法）。
pitfalls:
  - 以为 Junie 是独立 IDE，它其实是 JetBrains IDE 的插件（另有 CLI 形态）
  - 以为 Junie 可用在 AI Enterprise 档，官方明确写该档暂不含 Junie
  - 以为 MCP 支持远程服务器，官方写明目前只支持 stdio 传输

tags: [编程, IDE, 多模型, 本地]
related: [filesystem]

sources:
  - label: JetBrains · Junie 官方产品页（「smart coding agent」定位与支持的 IDE 列表）
    url: https://www.jetbrains.com/junie/
    kind: docs
  - label: JetBrains · Junie 帮助文档（Modes / Guidelines / Action Allowlist / .aiignore / MCP / Models）
    url: https://www.jetbrains.com/help/junie/get-started-with-junie.html
    kind: docs
  - label: JetBrains · AI in IDEs 定价页（AI Free / Pro / Ultimate 与 credits 配额，2026-10-08 核）
    url: https://www.jetbrains.com/ai-ides/buy/
    kind: pricing
  - label: JetBrains · 许可与订阅（配额周期、地区限制、AI Enterprise 档不含 Junie）
    url: https://www.jetbrains.com/help/junie/licensing-and-subscriptions.html
    kind: docs
  - label: JetBrains · MCP 文档（仅 stdio，全局与项目级 mcp.json）
    url: https://www.jetbrains.com/help/junie/model-context-protocol-mcp.html
    kind: docs
  - label: JetBrains · Action Allowlist 与 Brave Mode（敏感动作审批）
    url: https://www.jetbrains.com/help/junie/user-approval.html
    kind: docs
  - label: JetBrains · 官方博客：Junie 离开 Beta（2026-06-17，Plan mode / 真调试器）
    url: https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/
    kind: changelog
  - label: JetBrains · 官方博客：Junie CLI 进入 Beta（2026-03-09，LLM-agnostic / BYOK）
    url: https://blog.jetbrains.com/junie/2026/03/junie-cli-the-llm-agnostic-coding-agent-is-now-in-beta/
    kind: changelog
  - label: JetBrains · Junie 官方博客列表（变更源）
    url: https://blog.jetbrains.com/junie/
    kind: changelog

link:
  url: https://www.jetbrains.com/junie/
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**JetBrains 官方的「AI coding agent」**：以插件形态嵌进 JetBrains IDE（另有独立 CLI 形态），主打先出计划再实现、用真调试器排障，且不锁定单一模型（支持 BYOK 与本地模型）。

## 形态：插件 + CLI 两条腿

官方 Install 页有一句最关键的话：

> The Junie plugin is **not bundled and not enabled** in JetBrains IDEs by default.

**这说明它首先是插件，不是独立编辑器**。支持宿主覆盖 JetBrains 全家桶与 Android Studio：
CLion、GoLand、IntelliJ IDEA、PhpStorm、PyCharm Pro、Rider、RubyMine、RustRover、WebStorm。

**2026-03 起多了 Junie CLI 这条腿**：官方博客称 Junie 由此从「IDE 原生 AI」走向
「ecosystem-level AI」——终端、任意 IDE、CI/CD 与 GitHub / GitLab 都能用。
ReSharper 2026.2 又把 Junie 带进 Visual Studio（Preview）。

## 关键设计：Plan mode 与真调试器

**Plan mode 把「计划」做成一等工件**（GA 版新增）：产出含产品需求、技术设计、交付阶段
（可选测试策略）的结构化文档，存在 `.junie/plans`、可提交；需求含糊时先反问，确认后才实现。
官方给的用法建议很具体——**计划用强模型，实现用便宜模型**。

**Agentic debugging**：官方原话是 Junie「opens the debugger」而不是加 `println`。
它能启动 / 接管调试会话，在项目码、库码乃至反编译的 `.class` 文件里下断点，
查看栈帧、线程状态并求值表达式。

## 适合与不适合

在用 JetBrains IDE、希望在同一环境里用 agent 的人。
看重「先出计划再写代码」与多模型 / BYOK 的团队。
需要在终端或 CI/CD 里复用同一 agent 的人（Junie CLI）。

**不适合**中国大陆用户——官方许可页写明 Junie「not available to users in Mainland China
due to regional restrictions」；也不适合 AI Enterprise 档用户（官方写明该档暂不含 Junie），
以及需要厂商托管云后台的人。

## 核验说明

本条目 `confidence: partial` 的原因：

- ✅ 已核验：支持的 IDE 宿主与最低版本、Plan mode / 调试器 / `/demo` 等能力、
  Action Allowlist 与 Brave Mode 的权限机制、MCP 仅 stdio、`.aiignore` 边界、
  AI Free / Pro / Ultimate 的 credits 配额与「AI Enterprise 档不含 Junie」
- ❌ 未取到：美元口径价格（官方页按核验者所在地显示人民币年付）、
  上下文窗口与压缩参数、Junie Local 的完整适用范围

本轮核到的官方页：jetbrains.com/junie/、/help/junie/（get-started、install、modes、
customize-guidelines、user-approval、aiignore、model-context-protocol-mcp、models、
licensing-and-subscriptions、diffs-and-review）、/ai-ides/buy/、blog.jetbrains.com/junie/。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测两件事——Plan mode 的计划文档是否真能作为可提交工件复用；
以及 agentic debugging 在真实失败用例上，能否比「加日志」更快定位问题。

## 未知项清单

- 美元口径的订阅价（官方页本次以人民币年付呈现，本站不折算）
- 上下文窗口大小与压缩策略的具体参数（官方未给数字）
- Junie Local 支持的机型与模型范围
- 各 JetBrains AI 档位对 Junie 的可用性勾选细节（官方未说明，本轮只取到许可页对 Enterprise 档的排除）

## 相关条目

- [GitHub Copilot](./copilot.md) — 同为可装进多家 IDE 的插件，可对照权限与 MCP（Copilot 支持远程 MCP，Junie 仅 stdio）
- [Claude Code](./claude-code.md) — 同为「IDE 扩展 + CLI」双形态，可对照两者的权限与上下文设计
- [Cursor](./cursor.md) — 对照点：Cursor 是 VS Code 衍生的独立 IDE，Junie 是 JetBrains IDE 的插件