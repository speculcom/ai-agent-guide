---
id: cline
track: ide
name: Cline
vendor: Cline Bot
homepage: https://github.com/cline/cline
mark: C
accent: "#3EA3FF"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 开源免费，模型费用另计
  annual_usd: null
  annual_label: 开源免费，模型费用另计
  note: >-
    Apache-2.0 开源，无授权费。
    **模型调用费用由用户自付**——
    多形态（CLI / Desktop / VS Code 扩展）共享同一开源核心。
    若使用云端模型，需自备 provider 凭据。
pricing_pitfalls:
  - 以为开源就零成本，模型费用要自己承担
  - 以为只有一个形态，实际有 CLI / Desktop / 扩展三套

axes:
  model_access: >-
    **由用户自选 provider**——
    Desktop App 形态的 README 明确写「manage models, plugins, and MCP servers」，
    说明模型是可配置的而非绑定单一厂商。
    官方自述为「open source coding agent in your IDE, terminal, & desktop」，
    模型层可自选。**具体支持的 provider 清单本次未核验。**
  runtime: >-
    **本赛道唯一三形态全覆盖的对象**：
    一是 CLI（`npm i -g cline`，支持交互式与完全 headless 两种模式，
    headless 用于 CI/CD 与脚本，可用 `--workspace /path/to/repo` 指定目录）；
    二是 Desktop App（macOS 与 Windows 原生应用，
    可在任意文件夹运行 agent session、支持定时任务）；
    三是 VS Code 扩展（另有 JetBrains 插件，README 提到 `.clinerules`
    会被 CLI / VS Code 扩展 / JetBrains 插件三方共同读取）。
    三套形态共享同一开源核心。
  local_files: >-
    **跨项目协调改动 + 检查点可回滚**（README「Edits Code Across Your Project」原文）：
    读取项目结构、理解文件间关系，在代码库里做协调改动；
    **在改动过程中监控 linter 与编译器错误**，
    主动修复缺失 import、类型不匹配、语法错误，用户看不到就会出问题的那些。
    在 VS Code 与 JetBrains 中**每次编辑都以 diff 形式呈现**，可审查、修改或回滚；
    所有改动都有 checkpoint 记录，可整体撤销。
    **索引算法与大仓库的耗时表现本次未核验。**
  background: >-
    **长进程与定时任务都支持**（README 原文）：
    命令在终端直接执行并实时观察输出——装包、跑构建、跑测试、部署、管数据库；
    对 dev server 这类长进程，**Cline 在后台继续工作并对新输出做出反应**，
    编译错误、测试失败、服务崩溃都在发生时捕捉。
    Desktop App 形态另有**定时任务（schedule routines）**：
    可用 cron 调度做周期性自动化（如每日 PR 摘要、每周依赖检查、代码库健康报告），
    **且 schedule 在重启后仍保留、独立于任何终端会话运行**。
    CLI 的 headless 模式面向 CI/CD。
  tools: >-
    VS Code 扩展形态明确支持：
    创建文件、执行命令、浏览网页、使用工具。
    Desktop 形态可管理 models、plugins 与 **MCP servers**；
    仓库 `docs/` 下有独立的 `mcp/` 目录，说明 MCP 是被系统化支持的。
    **具体工具清单与 MCP 接入细节本次未核验。**
  context: >-
    **项目级规则文件 `.clinerules`**（README 原文）：
    用于定义项目专属规则——编码标准、架构约定、部署流程、测试要求；
    **规则会被 CLI、VS Code 扩展与 JetBrains 插件自动读取**。
    另可用 skills 让模型按需加载特定规则。
    Desktop 形态提到「run agent sessions in any folder」，存在跨文件夹的会话管理。
    **上下文窗口大小与跨会话记忆机制本次未核验。**
  permissions: >-
    **两级审批设计，本赛道最细**（README 原文）：
    一是 **Plan / Act 双模式**——Plan 模式下 Cline 探索代码库、提出澄清问题、
    列出策略；对齐后切到 Act 模式执行计划。
    二是 **「每次文件编辑与终端命令都需要批准」**，
    也可切换 auto-approve 让它自主运行。
    VS Code 扩展形态另有明确表述："use tools with human-in-the-loop approval"。
    **CLI headless 模式下的审批行为本次未核验**——
    这是关键缺口：无人值守时如何处理审批。
  fit: >-
    需要同一工具覆盖编辑器、终端、桌面三种工作形态的用户。
    需要模型自选（不绑定单一厂商）的人。
    需要 CI/CD 集成（CLI headless）的人。
    需要「改动可审查、可回滚」保证的用户——diff 呈现 + checkpoint 整体撤销。

pitfalls:
  - 以为是单一形态的 VS Code 插件，实际有 CLI / Desktop / 扩展三套
  - 忽略 headless 模式，CLI 形态本身就支持 CI/CD 集成
  - 以为审批机制一致，扩展形态明确有 human-in-the-loop，但 CLI headless 下的行为未核验
  - 以为自动提交是设计意图，实际默认每次编辑都要批准，可开 auto-approve 自主运行

tags: [编程, 终端, 本地, 开源]

sources:
  - label: Cline · 仓库 README（三形态说明）
    url: https://github.com/cline/cline
    kind: repo
  - label: Cline · Releases（v4.1.21 / desktop-v0.0.37）
    url: https://github.com/cline/cline/releases
    kind: changelog
  - label: Cline · 官方文档
    url: https://docs.cline.bot
    kind: docs
  - label: Cline · CLI 子项目 README
    url: https://github.com/cline/cline/blob/main/apps/cli/README.md
    kind: docs

link:
  url: https://docs.cline.bot
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**本赛道唯一三形态全覆盖的对象**——CLI、Desktop App、VS Code 扩展共享同一开源核心，且模型自选。

## 三种形态（README 明确列出）

| 形态 | 关键能力 |
|---|---|
| **CLI** | `npm i -g cline`；交互式对话或**完全 headless**，用于 CI/CD 与脚本 |
| **Desktop App** | macOS 与 Windows 原生应用；**在任意文件夹运行 agent session**；**定时任务**；管理 models / plugins / **MCP servers** |
| **VS Code 扩展** | 创建文件、执行命令、浏览网页、使用工具，**human-in-the-loop approval** |

**这个三形态覆盖在本赛道里是独一份**——
其他对象要么是 IDE + 扩展（Copilot），要么是编辑器单一形态（Zed），要么是 CLI 为主（Aider）。

**对用户意味着**：可以在编辑器里用、可以在终端里跑、可以在桌面端定时跑，
同一套核心，同一份配置习惯。

## 变更记录：两条 release 线

| 版本 | 日期 |
|---|---|
| `desktop-v0.0.37` | 2026-09-26 |
| `desktop-v0.0.36` | 2026-09-25 |
| `v4.1.21` | 2026-09-24 |

**注意版本号是分开的两条线**：
- `v4.x` 是主版本（扩展与 CLI）
- `desktop-v0.0.x` 是桌面端，**还在 0.0.x**

**这意味着桌面端仍早期**，稳定性预期要与主版本分开。

## 权限设计：明确的人工审批

VS Code 扩展形态的 README 原文：

```
use tools with human-in-the-loop approval
```

**这是本赛道里少见的明确表述**——
多数工具不会在 README 首屏就说明工具执行需要人工批准。

**但有一个关键缺口**：
CLI 的 headless 模式是给 CI/CD 用的，
**无人值守时审批如何处理，本次未核验**。
如果默认拒绝，CI 场景就用不了；如果默认放行，那审批机制在 CI 里等于不存在。

**这是本条目最需要补全的一项。**

## 适合与不适合

需要同一工具覆盖编辑器、终端、桌面三种工作形态的用户。
需要模型自选（不绑定单一厂商）的人。
需要 CI/CD 集成（CLI headless）的人。
需要「改动可审查、可回滚」保证的人——每次编辑以 diff 呈现 + checkpoint 整体撤销。
需要周期性自动化的人（cron 调度，重启后仍生效）。

**不适合**要求「明确审批在所有形态下一致生效」的场景——
扩展形态确认有 human-in-the-loop，但 CLI headless 下的行为未核验。

## 值得单独记的两处设计

### ① Plan / Act 双模式

Plan 模式下它只探索代码库、提问、列策略，**不执行**；
对齐后切到 Act 才动手。这是「先想清楚再改」的机制化实现。

### ② 监控 linter 与编译器错误

README 原文：

> It monitors linter and compiler errors as it works, fixing issues like
> missing imports, type mismatches, and syntax errors before you even see them.

**它会主动修「类型不匹配」「缺失 import」这类问题** ——
这恰好是本仓库实测任务集里最难判定的部分，值得单独验证。

## 权限定级说明

`confidence: partial`：

- ✅ 已核验：仓库、许可（Apache-2.0）、star 数（69,514）、三形态能力与各自的运行特征、两条 release 线及日期、Plan/Act 双模式、每次编辑需批准 + auto-approve、diff 呈现与 checkpoint 回滚、linter/编译器错误监控、`.clinerules` 项目规则、Desktop 的 cron 定时任务（重启后仍生效）、MCP 管理
- ❌ 未核验：provider 清单、工具清单细节、索引算法与大仓库耗时、上下文窗口、CLI headless 的审批行为

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应是**跨形态的一致性**——
同一个任务在三套形态下表现是否一致，审批行为是否一致。

## 未知项清单

- 支持的 provider 清单
- 完整工具清单与 MCP 接入细节
- 索引策略与大仓库表现
- 上下文窗口与跨会话记忆
- **CLI headless 模式下的审批行为**（最关键）
- 定时任务在客户端关闭后的行为
- Desktop 形态 0.0.x 的稳定性预期

## 相关条目

- [Zed](./zed.md) — 同赛道另一端：以编辑器性能为主，AI 能力未核验
- [Aider](./aider.md) — 同为开源，Git 集成是其核心设计
