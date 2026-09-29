---
id: copilot
track: ide
name: GitHub Copilot
vendor: GitHub / Microsoft
homepage: https://github.com/features/copilot
mark: GH
accent: "#24292F"

pricing:
  model: paid
  monthly_usd: 10
  monthly_label: Copilot Free（有限额度）/ Pro $10 每月
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    **本次采集中价格数字最完整的一个**。官方 plans 页显示的数字序列为
    Free / $15 / $70 / $200 与 Business 档的 $100（每年）/ $5 / $31 / $100。
    **各档位的具体对应关系需以官网为准**——
    页面同时存在月付与年付口径，本次未能逐档确认，标记为未知。
    另有机制：Flex allotment（可变的额外用量，
    官方明确标注「Flex allotments may change over time」）、
    可额外购买 GitHub AI Credits、
    Business/Enterprise 有 Pooled usage（组织内共享额度 + 管理员支出控制）。
pricing_pitfalls:
  - 把 Flex allotment 当成固定额度，官方明确说它会随时间变化
  - 以为买 AI Credits 能打折，它是独立的加购机制
  - 以为个人档能共享额度，Pooled usage 仅 Business / Enterprise 有

axes:
  model_access: >-
    由 GitHub / Microsoft 提供，绑定 GitHub 账号体系。
    **「Delegate tasks to third-party coding agents like Claude by
    Anthropic and OpenAI Codex（Preview）」——
    官方明确标注可把任务委派给第三方 agent（Claude、Codex），
    且标注为 Preview。**
    **具体模型清单与选择方式本次未核验。**
  runtime: >-
    **形态最广的一个**：
    GitHub 网站本身（含 github.com 与 GitHub Mobile）、
    Copilot app、Copilot CLI、
    以及 VS Code / Visual Studio / JetBrains / Eclipse / Xcode 等编辑器。
    另有 Codespaces 提供的即时开发环境。
  local_files: >-
    通过编辑器扩展或 GitHub 平台访问代码。
    **索引策略本次未核验。**
  background: >-
    **有明确的 cloud agent 形态**：
    「Assign work to Copilot to research, plan, and write code —
    with or without a pull request」，
    即云端智能体可以研究、规划、写代码并（可选）创建 PR。
    **客户端关闭后的行为本次未核验。**
  tools: >-
    **MCP 是官方平台级能力**——
    导航栏即有独立的「MCP Registry / Integrate external tools」条目。
    支持自定义指令与自定义 agent。
    **File diff reviews in code editors** 在更高档位提供。
  context: >-
    有 App modernization for Java and .NET（把工作分配给 Copilot，
    由它创建 pull request）。
    **上下文窗口与跨会话记忆本次未核验。**
  permissions: >-
    **依赖 GitHub 的权限体系**——
    天然与仓库、PR、组织策略集成。
    **具体的审批机制与沙箱设计本次未核验。**
    Enterprise 相关能力受组织策略控制。
  fit: >-
    已在 GitHub 生态内（用 PR / Issue / Actions 工作）的人；
    需要最广编辑器覆盖的人（VS Code / JetBrains / Eclipse / Xcode 都能用）；
    企业采购需要额度池治理与管理员支出控制的人。
    只想试 AI 补全的人可用 Copilot Free（有限额度）。

pitfalls:
  - 把 Flex allotment 当固定额度，官方明确说它会变
  - 忽略 Preview 状态的第三方 agent 委派（Claude / Codex）
  - 以为个人档也有额度池共享，Pooled usage 仅 Business / Enterprise

tags: [编程, IDE, 混合, 云端, 协作]

sources:
  - label: GitHub · Copilot 定价与 plans 页（功能逐项对照）
    url: https://github.com/features/copilot/plans
    kind: pricing
  - label: GitHub · Copilot 官方文档
    url: https://docs.github.com/en/copilot
    kind: docs
  - label: GitHub · Changelog（Copilot 标签）
    url: https://github.blog/changelog/label/copilot/
    kind: changelog

link:
  url: https://github.com/features/copilot
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**形态最广、生态最依附 GitHub** 的一个——从网站到 CLI 到主流编辑器全覆盖，且能把任务委派给 Claude / Codex（Preview）。

## 本赛道的形态覆盖之最

| 形态 | Copilot 是否覆盖 |
|---|---|
| GitHub 网站 / Mobile | ✅ |
| Copilot app | ✅ |
| Copilot CLI | ✅ |
| VS Code / Visual Studio / JetBrains / Eclipse / Xcode | ✅ |
| Codespaces 云端环境 | ✅ |
| 云端 agent | ✅ |

**没有任何其他对象能覆盖这么多形态。**

## 三个值得单独记录的能力

### ① 可委派任务给第三方 agent（Preview）

官方 plans 页原文：

```
Delegate tasks to third-party coding agents like Claude by Anthropic
and OpenAI Codex (Preview)
```

**这是本赛道里唯一明确写出「能把任务交给竞品 agent」的对象。**

含义：**Copilot 正在从「自己干活」转向「调度别人干活」**。
它把自己定位成任务分发层，而非模型的唯一提供方。

**注意标注是 Preview。**

### ② 额度机制有三层

从 plans 页可见的机制：

| 机制 | 说明 |
|---|---|
| **Base credits** | 各档位的基础额度 |
| **Flex allotment** | 变量额外用量，**官方明确标注「Flex allotments may change over time」** |
| **Purchase additional GitHub AI Credits** | 可额外购买额度 |
| **Pooled usage** | **组织内共享额度 + 管理员支出控制**（Business / Enterprise 专有） |

**Flex allotment 那句话值得单独记**：
官方主动声明它会变——这意味着它**不能被当作可依赖的固定额度**。

### ③ 企业侧的额度治理

```
Pooled usage
Included AI credits are shared org-wide with admin controls for spending.
```

**组织内共享 + 管理员支出控制**——
这在个人档完全不可用，是企业采购时的关键能力。

## 功能逐项对照（官方 plans 页结构）

从采集到的对照表可见，档位差异主要在这些项：

| 功能 | 覆盖情况 |
|---|---|
| Editors and IDEs | 多编辑器支持 |
| GitHub（github.com + Mobile） | 覆盖 |
| Agent mode | 多档位提供（VS Code / Visual Studio / JetBrains / Eclipse / Xcode） |
| Integrates with MCP servers | 覆盖 |
| Custom instructions and agents | 覆盖 |
| App modernization for Java and .NET | 部分档位 |
| Assign work and create a pull request | 部分档位 |
| Code review（PR 审查） | 覆盖 |
| **File diff reviews in code editors** | **仅更高档** |
| **Custom instructions with instructions.md** | **仅更高档** |
| **Cloud agent** | **部分档位** |
| 第三方 agent 委派（Claude / Codex） | **标注 Preview** |

## 价格数字（本次采集中最完整，但需注意口径）

官方 plans 页呈现的数字序列：

| 序列 | 数字 |
|---|---|
| 个人档相关 | **$15 / $70 / $200** |
| Business 档相关 | **$100 per month**、**$5 / $31 / $100** |

**必须说明的局限**：
页面同时存在月付与年付口径，
本次采集**未能逐档确认每个数字对应哪个档位的哪种周期**。

**按本站方法论，这里应该标为未知而不是猜测。**
具体价格请以官网为准。

## 官方生态位：MCP Registry 是平台级能力

值得注意的是，GitHub 把「MCP Registry / Integrate external tools」
放在**平台导航的显眼位置**，与 Copilot app 并列。

**这说明 MCP 在 GitHub 的战略里不只是「一个插件」，而是平台级基础设施。**

对本仓库的意义：
MCP 赛道的条目（9 个 server）如果哪天要选一个上游，
**GitHub 的 MCP Registry 是一个候选分发渠道**。

## 适合与不适合

已在 GitHub 生态内（用 PR / Issue / Actions 工作）的人。
需要最广编辑器覆盖的人（VS Code / JetBrains / Eclipse / Xcode 都能用）。
企业采购需要额度池治理与管理员支出控制的人。

**不适合**要求定价一次讲清的人——
本次未能逐档确认价格数字，必须自行到官网核对。
也不适合依赖第三方 agent 委派的场景（官方标注为 Preview）。

## 采集限制

| 页面 | 状态 |
|---|---|
| plans 页 | ✅ 取到 71K 字符，功能逐项对照完整，⚠️ 价格数字未能逐档对应 |
| docs.github.com | ❌ 本次采集返回 0 字符 |
| Changelog | ✅ 取到 5838 字符 |

**因此目标 confidence: partial。**

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**第三方 agent 委派（Preview）**的实际可用性——
这是本赛道唯一有这个能力的对象，值得先验证。

## 未知项清单

- 各档位的完整价格对照（本次未能逐档确认）
- 具体模型清单与选择方式
- 索引策略
- 上下文窗口与跨会话记忆
- 审批机制与沙箱设计
- 第三方 agent 委派的实际可用范围
- 企业策略如何影响可用能力

## 相关条目

- [Cursor](./cursor.md) — 同赛道，架构更激进（自托管 + 子智能体编排）
- [Windsurf](./windsurf.md) — 同赛道，已改称 Devin Desktop
