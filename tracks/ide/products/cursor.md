---
id: cursor
track: ide
name: Cursor
vendor: Anysphere
homepage: https://cursor.com
mark: C
accent: "#111111"

pricing:
  model: freemium
  monthly_usd: 20
  monthly_label: Pro $20 / Pro+ $60 / Ultra $200（个人三档），Hobby 免费
  annual_usd: null
  annual_label: 官方帮助页说明年付通过 dashboard 的 Upgrade 切换，未取到统一折算价
  note: >-
    官方定价页（cursor.com/pricing）与帮助页（cursor.com/help/account-and-billing/pricing）
    列出个人 4 档 + 团队 3 档，**价格已按2026-10-01 官方页核实**：
    Hobby 免费（无需信用卡，有限智能体请求 + Composer 访问）、
    Pro $20/mo、Pro+ $60/mo、Ultra $200/mo；
    Teams Standard $40/用户/mo、Teams Premium $120/用户/mo；Enterprise 定制。
    **Pro+ / Ultra 不是「前沿模型专属」而是额度倍数**：
    官方原文 Pro+ =「3x Pro limits on Agent」，Ultra =「20x Pro limits on Agent」，
    三档都写「Access to frontier models」。Hobby 另有印度专属付费层₹649/mo（含税）。
    所有价格**不含税**；超额用量按各模型标价后付费（on-demand billed in arrears）。
pricing_pitfalls:
  - 以为只有个人档，实际有 Teams / Enterprise 两档团队形态
  - 把「有限制的 Hobby 层」当成完全不可用，它有 Composer 访问权限
  - 以为 Pro+ / Ultra 才能用前沿模型 —— 官方三档都写了 frontier models 访问权，差别在**额度倍数**

axes:
  model_access: >-
    **三档个人付费都标「Access to frontier models」，Pro / Pro+ / Ultra 的差别是额度倍数
    而非模型可得性**（官方原文分别为 extended / 3x / 20x Pro limits on Agent）——
    这一条与常见误解相反，值得单独记。
    官方首页列出可选模型范围为**OpenAI / Anthropic / Gemini / SpaceXAI / Cursor 自研**，
    Auto 模式的具体候选（2026-10-01 官网示例）：Grok 4.7、GPT-5.6 Sol、
    Fable 5.1、Max Opus 5.5、Gemini 3.1 Pro、Composer 2.5。
    **Cursor Router** 按 cost / balance / intelligence 三档在多模型间路由，
    官方说明按被路由到的模型标价计费；Router 先在 Teams / Enterprise 推出，
    个人档「数月后」跟进。Hobby 档仅可用 Auto 模型。
    供应方已明确不止一家：导航含 Grok / Grok Bot，各档另列「Grok 使用额度」。
  runtime: >-
    **支持云端与自托管两种形态，这是本赛道最独特的架构**。
    2026-09-02 官方推出自托管支持：
    代码库、构建产物与密钥保留在你自己基础设施内运行的机器上，
    由智能体在本地处理工具调用。
    另有 My Machines 形态——把单台笔记本或 VM 连到账户用于个人工作流。
    官方文档同时说明 Cursor Router 可在**编辑器 / CLI / Cursor SDK / iOS 应用**中使用。
  local_files: >-
    通过 VS Code 衍生的编辑器形态访问工作区文件。
    自托管形态下代码与产物不离开你的基础设施。
    **索引策略与大仓库表现本次未核验。**
  background: >-
    **云端 Agent 能力很强且有官方明确表述**：
    「项目」在云端独立计算机上运行，
    **合上笔记本电脑也不会中断**；
    需要本机测试时，协调智能体会启动本地智能体。
    官方另称可让协调智能体监听 Slack 频道、按计划运行、
    跟踪所有 PR，**主动行动而无需等待提示**。
  tools: >-
    Pro+ 及以上档官方列出 **MCP、技能（Skills）和钩子（Hooks）**，
    以及云端智能体与按用量计费的 Bugbot（智能体驱动的代码审查）。
    Teams 档另有面向内部规则、技能与插件的团队应用市场。
    **具体工具清单与 MCP 接入细节本次未核验。**
  context: >-
    **「项目」的核心设计是长期上下文维持**——
    官方原文：能在长达数月的工作中持续保持上下文，
    将任务委派给成千上万个子智能体，
    还可无需提示自动执行周期性工作。
    共享上下文会在多个云端与本地机器间同步：
    一个智能体摸清如何测试某服务后，后续智能体可直接复用。
  permissions: >-
    **安全审查以 bot 形式提供，且分两个职责**：
    Security Review 结合全库上下文读每个 PR，报告可被利用的缺陷
    （注入、认证绕过、密钥提交、SSRF、不安全反序列化、
    引入已知漏洞的依赖变更等），每项标明严重级别、攻击路径与修复建议；
    **代码风格与质量问题仍由 Bugbot 负责**。
    支持为仓库添加规则（如外部调用必须走哪个客户端、
    哪些表不能在请求处理程序里查），Security Review 会在每个 PR 强制执行。
    **草稿 PR 会被跳过。**
  fit: >-
    需要云端 Agent 且希望合上笔记本任务继续跑的人；
    需要长周期（数月级）上下文维持与大规模子智能体编排的人；
    **代码不能离开自有基础设施的企业**（自托管形态）。
    Free 档适合想低成本试智能体的人（有限额度 + Composer 访问）。

pitfalls:
  - 把 Cursor 当成纯本地编辑器，2026-09-02 起已有自托管形态，代码可以不离开你的基础设施
  - 把云端能力当成「有入口就行」，官方明确说合上笔记本不会中断
  - 混淆 Security Review 与 Bugbot，一个管可利用缺陷，一个管风格与质量问题

tags: [编程, IDE, 混合, 云端]

sources:
  - label: Cursor · Changelog（Projects / 自托管 / Rollouts + Security Review）
    url: https://cursor.com/changelog
    kind: changelog
  - label: Cursor · 官方定价页（5 档结构）
    url: https://cursor.com/pricing
    kind: pricing
  - label: Cursor · 官方文档
    url: https://cursor.com/docs
    kind: docs

link:
  url: https://cursor.com
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**本赛道架构最激进的三个之一**：云端 Agent 合上笔记本不中断、自托管代码不出网、代码审查拆成两个 bot 分工。

## 三个近期的架构级变化

### ① 自托管（2026-09-02）

官方原文：

> 支持 [自托管]，让工具执行完全留在你自己的网络内。
> 你的代码库、构建产物和密钥都保留在你基础设施中运行的内部机器上，
> 由智能体在本地处理工具调用。

**这一条改变了这个工具的根本定位**：
在此之前，AI 编程工具默认要把代码交出去；
Cursor 现在提供了不交的路径。

配套还有 **My Machines** 形态：
把单台笔记本或 VM 连到账户，用于个人工作流。

### ② 项目（2026-09-10）

官方原文（能力描述）：

> 「项目」让你能够承接更大规模的工作，比如一项功能、一次迁移，
> 或是一个完整的应用。它能在**长达数月**的工作中持续保持上下文，
> 将任务委派给**成千上万个**子智能体，
> 还能**无需提示**自动执行周期性工作。

**三个关键设计**：

| 设计 | 含义 |
|---|---|
| **协调智能体不写代码** | 它只规划工作、委派给实现智能体、把成果交回给你检查 |
| **云端独立计算机运行** | **合上笔记本电脑也不会中断**；需本机测试时才启动本地智能体 |
| **上下文跨机器同步** | 一个智能体摸清某服务的测试方法，后续智能体直接复用 |

**「共享上下文会随项目一同积累，让协调智能体越用越高效」**——
这是本赛道里对长期上下文最明确的设计承诺。

配套的订阅机制：
让协调智能体监听 Slack 频道、按计划运行、跟踪所有 PR，
**主动行动而无需等待提示**。

**注意官方标注：「项目目前处于 beta 阶段」。**

### ③ Rollouts + Security Review（2026-09-23）

**两个 bot，仅团队版与企业版可用**。

**Rollouts** —— 部署变更监控：
- 为每个 PR 附加监控项，读取 diff 与涉及的系统
- **在 PR 里写一份监控规划**（列出风险、预期效果、要检查的信号、埋点缺口）
- **规划可人工编辑**，Rollouts 会采用修改后的版本
- 部署触发时被唤醒，按日志、指标、链路追踪数据执行
- **分别跟踪每个环境**——同一变更可能在预发布验证通过却在生产被标记
- 检测到回归时指出疑似变更并通知作者
- 可创建回滚 PR 供审查，或交给云端智能体修复
- **目前不会自行合并或回滚**

**Security Review** —— 可利用缺陷审查：
- 结合全库上下文读每个 PR，发布一条审查评论
- 检查项包括：SQL/命令/模板注入、认证与授权绕过、
  **因重构而不再执行的检查**、提交到源码的密钥与凭证、
  SSRF 与未经验证的重定向、不安全反序列化、
  引入已知漏洞的依赖变更
- **追踪用户输入从哪进入、流经哪些环节**（taint 追踪）
- 每项标明严重级别、攻击路径、修复建议
- 支持为仓库添加规则并在每个 PR 强制执行
- **草稿 PR 会被跳过**

**职责边界很清楚**：
> 代码风格和质量问题仍由 Bugbot 负责。

## 定价结构（6 档，2026-10-01 已取到价格数字）

官方定价页 + 帮助页逐档核实（美元，月付）：

| 档位 | 价格 | 关键能力 |
|---|---|---|
| **Hobby** | $0 | 无需信用卡、有限的智能体请求、Composer 访问权限。**仅可用 Auto 模型** |
| **Pro** | $20/mo | 扩展的 Agent 额度、Generous limits for Grok、前沿模型访问、Grok Bot 访问、**MCP + 技能 + 钩子**、云端智能体、按用量计费的 Bugbot |
| **Pro+** | $60/mo | **3x Pro limits on Agent**，其余同 Pro，**Grok Bot 用量更高** |
| **Ultra** | $200/mo | **20x Pro limits on Agent**，Grok Bot 用量最高，**新功能优先访问** |
| **Teams** | $40/用户/mo | 集中计费、**团队应用市场**（内部规则/技能/插件）、**共享团队上下文的云端智能体与自动化**、Bugbot 代码审查、**用量分析**、团队级隐私模式、SAML/OIDC 单点登录 |
| **Enterprise** | 洽谈 | 汇总用量、发票/采购订单结算、SCIM 管理席位 |

**三个值得注意的设计**：
- **Teams 档的「用量分析」**——「帮助您了解团队行为」，这类需求通常只有企业级工具才有
- **Teams 档的「团队级隐私模式」**——与自托管能力呼应
- **Pro / Pro+ / Ultra 的差别是额度倍数，不是模型可得性** —— 三档都写「Access to frontier models」

## 一个值得留意的商业信号

2026-09-22 起 Cursor 官网出现 **Grok / Grok Bot** 品牌元素，各档另列「Grok 使用额度」。

**这说明模型供应方已不止一家**。官方列出的可选范围是
**OpenAI / Anthropic / Gemini / SpaceXAI / Cursor 自研**，
Auto 模式候选含 Grok 4.7、GPT-5.6 Sol、Fable 5.1、Max Opus 5.5、Gemini 3.1 Pro、Composer 2.5。
Cursor Router 按 cost / balance / intelligence 三档路由，**按被路由到的模型标价计费**。

## 适合与不适合

需要云端 Agent 且希望合上笔记本任务继续跑的人。
需要长周期（数月级）上下文维持与大规模子智能体编排的人。
**代码不能离开自有基础设施的企业**（自托管形态）。

**不适合**要求定价透明到可直接比较的人——
各档额度倍数（1x / 3x / 20x）官方未给出具体请求数或 token 量，只有倍数表述。

## 采集状态（2026-10-01 更新）

**初次采集时价格数字因 JS 动态渲染未取到；本轮已通过官方帮助页补齐月付全档。**

| 页面 | 状态 |
|---|---|
| 定价页 | ✅ 6 档结构与能力清单、✅ 月付价格已从帮助页补齐 |
| 帮助页（account-and-billing/pricing） | ✅ 全档价格 + 年付切换说明 + 印度专属层 |
| 文档页 | ✅ 取到文本 |
| Changelog | ✅ 取到三条完整条目（09-23 / 09-10 / 09-02） |

**因此本条目标 `confidence: partial`**——
能力侧证据充分，价格侧缺失。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应是
**「项目」的上下文维持是否真的能撑数月**——
这是官方最强的承诺，也是最难验证的一点。

## 未知项清单

- 各档位的具体价格数字
- 完整模型清单与切换机制
- 自托管形态的具体部署方式与前置条件
- 索引策略与大仓库表现
- 「项目」beta 的功能边界
- MCP 接入的具体方式

## 相关条目

- [Codex IDE 扩展](./codex-ide.md) — 同为多形态但自托管未确认
- [Claude Code IDE 扩展](./claude-code.md) — 同赛道，权限设计更细
