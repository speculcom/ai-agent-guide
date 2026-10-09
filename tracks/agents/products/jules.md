---
id: jules
track: cloud
name: Jules
vendor: Google
homepage: https://jules.google
mark: JL

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 免费「Introductory access」；更高额度随 Google AI Pro / Ultra 订阅，无独立 Jules 定价
  annual_usd: null
  annual_label: 无独立 Jules 年付报价（额度随 Google One 订阅，官方未单列）
  note: >-
    **2026-10-08 核验**：官方 GA 发布页（blog.google，2025-08-06）写「Introductory access
    to Jules」为免费入口、「Jules in Google AI Pro: 5x higher limits」、
    「Jules in Google AI Ultra: 20x higher limits」，并注明「Specific usage limits
    are listed at jules.google」。Google One 官方套餐页（2026-10-08 取）在 Pro 的
    「Code faster」下列「Expanded limits in AI Studio, Google Antigravity, and Jules」，
    Ultra 档列 Jules 的「Expanded task and concurrency limits, and access to latest
    models」。**但 jules.google 定价页为 JS 渲染，逐档每日任务数与并发数（免费层与
    Pro / Ultra 的具体数字）在可读官方页里没有列出——官方未说明（已查 jules.google
    定价页、Google One AI 套餐页与 GA 发布页），故不写具体数字。**
    另注：官方旧文档站（jules-documentation.web.app）仍写 beta 期「2 concurrent /
    5 total tasks per day」，与 GA 后的分档口径不一致，**勿把 beta 数字当现行额度**。
pricing_pitfalls:
  - 把 beta 旧文档的「2 并发 / 每天 5 次」当成现行免费额度
  - 以为 Jules 能单独订阅——付的是 Google AI Pro / Ultra，额度随订阅
  - 把「免费 Introductory access」当成无限制使用

axes:
  model_access: >-
    **模型由厂商指定，没有模型选择入口。** 官方 GA 发布页原文
    「Jules now uses the advanced thinking capabilities of Gemini 2.5 Pro」——
    这是官方可读页唯一点名到具体模型的表述；Google One 官方套餐页在 Ultra 档写
    Jules「access to latest models」，即更高档位可用更新的模型。
    **当前默认模型与各档位的模型映射，官方可读页未单列**——官方未说明
    （已查 developers.google.com/jules/api 与 Google One AI 套餐页）。
    这与本分区 IDE / CLI 形态形成对照：那两类常有 `/model` 之类的选择面，
    **厂商云形态把「选模型」这件事整体交给了厂商。**
  runtime: >-
    **形态的答案就是本产品：任务跑在 Google 云虚拟机上，本机不装任何东西。**
    官方 FAQ 原文「Each task runs in a fresh virtual machine where Jules clones
    your repo, installs dependencies, and makes changes based on your prompt」——
    即**每个任务一台全新的云 VM**，并在其中 clone 仓库、装依赖。
    官方 GA 发布页把这条列为卖点「Tasks run inside a cloud VM, enabling concurrent
    execution」。除网页（jules.google）外，还有两个客户端入口：Jules REST API
    （`jules.googleapis.com/v1alpha`）与 Jules Tools CLI；**执行面始终在厂商云，
    客户端只负责下达与查看。**
  local_files: >-
    **默认与本机完全隔离**：Jules 只在云 VM 里克隆仓库工作，不读写你本机的文件。
    官方 FAQ 明确该 VM「executed in a secure, cloud-based virtual machine (VM)
    with internet access」，并要用户「treat the environment with the same security
    precautions you would for any public or shared compute surface」——**云 VM 有
    联网能力，这是能力也是风险面**。官方同时警告不要把密钥、token 之类提交进仓库。
    **哪些仓库对 Jules 可见，由 Jules GitHub app 的授权范围决定**（FAQ 指引到
    GitHub 的 applications 设置里逐项调整）。
  background: >-
    **这是本形态最强的一维，官方全程按「异步」定义它。**
    官方原文「Jules operates asynchronously, allowing you to focus on other tasks
    while it works in the background」；FAQ 进一步写「You can leave the app after
    submitting a task」，只需打开通知。**任务失败会自动重试**
    （官方 FAQ「Jules will retry automatically」）。
    2025-12-10 官方更新再补两项主动能力：**Suggested Tasks**（在最多五个仓库上主动
    扫描代码、提出改进，先支持 `#todos`）与 **Scheduled Tasks**（按你设定的节奏
    自动执行，如依赖检查、每周例行）——官方原文「Scheduled Tasks ... you can now
    define the cadence and Jules will perform the task at that time」。
    **并发任务数随订阅档位变化**（具体数字见 pricing.note）。
  tools: >-
    **工具面集中在云 VM 内的执行能力 + GitHub 集成。**
    官方 FAQ 与 GA 页确认：在 VM 里装依赖、跑测试、按 setup 脚本构建；
    支持语言为 JavaScript/TypeScript、Python、Go、Java、Rust（官方称
    「language agnostic but works best with」，取决于 VM 里装了什么）。
    **不支持长驻进程**——官方 FAQ 原文「Long-running processes like dev servers
    or watch scripts aren't currently supported in setup scripts」，`npm run dev`
    之类跑不起来。另有前端验证能力（在 VM 内跑脚本、回传截图，见官方发布页的
    web-app 测试说明）。**Jules 是否支持接入 MCP server：官方未说明
    （已查 developers.google.com/jules/api 与官方 FAQ 页）。**
  context: >-
    **以 Session / Activity 为上下文单位。** 官方 REST 文档原文：
    「Session — A continuous unit of work within a specific context, similar to a
    chat session. A session is initiated with a prompt and a source」，
    「Activity — A single unit of work within a Session」，且一个 Session 含用户与
    agent 双方的多条 activity（生成计划、发消息、更新进度）。
    也就是说**面向程序化调用时，上下文是「会话 + 活动」这条可轮询的状态流**，
    而不是一次性的对话。跨任务层面，官方提供**环境快照**复用（GA 页写
    「reusing previous setups so new tasks run faster」）。
    **上下文窗口大小与长期记忆的具体实现，官方可读页未给数字**——官方未说明
    （已查 Jules API 页与官方 FAQ 页）。
  permissions: >-
    **审批的核心是「计划审批」，且 API 与网页默认值不同。**
    官方 REST 文档原文「By default, sessions created through the API will have
    their plans automatically approved. If you want to create a session that
    requires explicit plan approval, set the `requirePlanApproval` field to
    `true`」；网页端则默认「Prompt a task and approve Jules' plan」——
    **即程序化入口默认跳过人工审批，需显式打开。**
    代码落地方式由创建 session 时的 `automationMode` 决定：
    「The `automationMode` field is optional. By default, no PR will be
    automatically created」，设 `AUTO_CREATE_PR` 才会自动开 PR。
    仓库访问走 Jules GitHub app 的授权范围。**隐私口径：官方 FAQ 明确
    「Jules does not train on private repository content」。**
    **额度与计费边界**：免费层与 Pro / Ultra 的具体任务数官方可读页未列（见 pricing.note），
    但**「额度按任务计、不按 token 计」**这一点从官方 API 概念（session 即任务单位）可读出。
  fit: >-
    官方给自己划的活是具体的：把任务描述交进 GitHub 仓库后，它「fix bugs, update
    dependencies, migrate code, and add new features」，并以「test verified patches」
    「Open PRs with runnable code and test results」的方式交付。
    因此**适合自包含、可验证的活**：修一个明确的 bug、升依赖版本、补测试、
    迁移代码片段、小范围新功能。
    **不适合**：需要实时 shell、边跑边改的高频交互（本分区 CLI / IDE 形态更合适）；
    需求模糊、需要大量澄清的架构级任务——官方 FAQ 自己把「vague prompts」列为
    任务失败的常见原因之一。

pitfalls:
  - 把 beta 旧文档的「2 并发 / 每天 5 次」当成现行免费额度
  - 以为 API 建的任务都会等你批准计划，官方默认自动批准
  - 把 Jules 当成本地 / IDE 里的实时 agent——它是异步云 agent

tags: [编程, 编码agent, 云端, 厂商云, 常驻, 审批, 订阅制, 免费档, 并行]
related: [github-mcp]

sources:
  - label: Google · Jules 官方变更记录（2026-10-08 核验，官方 changelog 入口）
    url: https://jules.google/docs/changelog/
    kind: changelog
  - label: Google · Jules API（alpha，Sources / Sessions / Activities、X-Goog-Api-Key、计划审批与 AUTO_CREATE_PR）
    url: https://developers.google.com/jules/api
    kind: docs
  - label: Google · Jules REST 参考（approvePlan / create / list / sendMessage 等方法）
    url: https://developers.google.com/jules/api/reference/rest
    kind: docs
  - label: Google · Jules 官方文档 FAQ / 用量限制（云 VM、联网、失败重试、不训练私有仓库）
    url: https://jules-documentation.web.app/faq
    kind: docs
  - label: Google · Google AI 套餐页（Pro 列 Jules 扩展额度、Ultra 列任务与并发扩展，2026-10-08 取）
    url: https://one.google.com/intl/en_us/about/google-ai-plans/
    kind: pricing
  - label: Google · Jules 正式可用（2025-08-06 GA：免费入口与 Pro 5x / Ultra 20x 额度）
    url: https://blog.google/technology/google-labs/jules-now-available/
    kind: engineering
  - label: Google · Jules 主动能力更新（Suggested Tasks / Scheduled Tasks / Render 集成，2025-12-10）
    url: https://blog.google/technology/developers/jules-proactive-updates/
    kind: engineering

link:
  url: https://jules.google
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**本机什么都不装，任务跑在 Google 的云 VM 里、以 PR 的形式异步交付**——官方 GA 发布页原文写它「clones your codebase into a secure Google Cloud virtual machine (VM)」并「operates asynchronously」。与本分区 IDE / CLI 形态的根本差别不是功能多少，而是**交互不是实时的**：你提交任务、批准计划，然后走开，回头收 PR。

## 适合与不适合

**适合**自包含、可验证的活：修一个明确 bug、升级依赖、补测试、迁移代码片段、小范围新功能。官方对交付形态的描述是「test verified patches」与「Open PRs with runnable code and test results」——**它的产出是 PR，不是给你一个可交互的会话。**

**不适合**需要实时 shell、边跑边改的高频交互（那是 CLI / IDE 形态的强项）；也不适合需求模糊、需要大量澄清的架构级任务——官方 FAQ 自己把「vague prompts」列进任务失败的常见原因。

## 异步流程与计划审批（本次核验重点）

官方 REST 文档把流程写得很清楚，其中有一处最容易被误读：

> By default, sessions created through the API will have their plans
> automatically approved. If you want to create a session that requires
> explicit plan approval, set the `requirePlanApproval` field to `true`.

**即：API 建的任务默认自动批准计划，要人工把关必须显式打开。** 网页端默认则是「Prompt a task and approve Jules' plan」。

PR 的生成同样要显式开关：

> The `automationMode` field is optional. By default, no PR will be
> automatically created.

设成 `AUTO_CREATE_PR` 才会自动开 PR。相关方法在官方参考里是 `sessions/{id}:approvePlan`、`sessions`、`sessions/{id}:sendMessage`；进度以 activity 流返回，含 `planGenerated` / `progressUpdated` / `sessionCompleted` 等事件，以及 `bashOutput`、`changeSet`（gitPatch）等产物。

## 核验说明

`confidence: partial` 的依据：本轮核到了官方 GA 发布页、Google One 套餐页、Jules API 与其 REST 参考、官方 FAQ 页、两份官方博客更新。**缺口集中在「数字」与「模型映射」两类**，且这两类在可读官方页里确实没有：逐档每日任务数与并发数（jules.google 定价页为 JS 渲染）、当前默认模型与各档模型映射、是否支持 MCP。这些按本站铁律记为「官方未说明」并列出所查页面，不猜测。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**计划审批开关的实际行为**（API 默认自动批准 vs 网页端需批准，两处默认值不同），以及**关掉浏览器后任务是否继续并在完成后真的开出 PR**；再补一条「免费层与 Pro 档的实际任务数差异」——这是官方可读页没给、只能实测确认的数字。

## 未知项清单

- Jules 当前默认模型与各档位的模型映射——官方未说明（已查 developers.google.com/jules/api 与 Google One AI 套餐页）
- 逐档每日任务数与并发数——官方未说明（已查 jules.google 定价页、Google One AI 套餐页与 GA 发布页）
- Jules 是否支持接入 MCP server——官方未说明（已查 Jules API 页与官方 FAQ 页）
- 上下文窗口大小与长期记忆的实现
- 云 VM 的单任务时长与并发上限
- 是否支持 GitHub 之外的代码托管

## 相关条目

- [OpenAI Dot](./openai-dot.md) — 同为厂商云形态，「关机后继续跑」与权限层可逐条对照
- [Meta Muse](./meta-muse.md) — 同为后台常驻 agent，审批与记忆机制是主要差异点
- [xAI Grok Bot](./grok-bot.md) — 同为异步云 agent，差别在按次付费与逐动作审批
- [Codex CLI](./codex-cli.md) — 跨形态对照：Codex 另有云任务入口，但主形态在终端