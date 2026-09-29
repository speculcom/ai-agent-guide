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
    **具体支持的 provider 清单本次未核验。**
  runtime: >-
    **本赛道唯一三形态全覆盖的对象**：
    一是 CLI（`npm i -g cline`，支持交互式与完全 headless 两种模式，
    headless 用于 CI/CD 与脚本）；
    二是 Desktop App（macOS 与 Windows 原生应用，
    可在任意文件夹运行 agent session、支持定时任务）；
    三是 VS Code 扩展。
    三套形态共享同一开源核心。
  local_files: >-
    VS Code 扩展形态的 README 明确列出可「create files、run commands、
    browse the web、use tools」。
    Desktop 形态可在任意文件夹运行 session。
    **索引策略与大仓库表现本次未核验。**
  background: >-
    **Desktop App 形态支持定时任务（schedule routines）**，
    这是本赛道少见的后台能力。
    CLI 的 headless 模式面向 CI/CD。
    **定时任务在客户端关闭后的行为本次未核验。**
  tools: >-
    VS Code 扩展形态明确支持：
    创建文件、执行命令、浏览网页、使用工具。
    Desktop 形态可管理 models、plugins 与 **MCP servers**。
    **具体工具清单与 MCP 接入细节本次未核验。**
  context: >-
    Desktop 形态提到「run agent sessions in any folder」，
    暗示存在跨文件夹的会话管理。
    **上下文窗口与跨会话记忆机制本次未核验。**
  permissions: >-
    **VS Code 扩展形态明确声明 human-in-the-loop approval**
    （README 原文："use tools with human-in-the-loop approval"）——
    工具执行需人工批准，这是本赛道少见的明确表述。
    **CLI headless 模式下的审批行为本次未核验**，
    这是个关键缺口：无人值守时如何处理审批。
  fit: >-
    需要同一工具覆盖编辑器、终端、桌面三种工作形态的用户。
    需要模型自选（不绑定单一厂商）的人。
    需要 CI/CD 集成（CLI headless）的人。

pitfalls:
  - 以为是单一形态的 VS Code 插件，实际有 CLI / Desktop / 扩展三套
  - 忽略 headless 模式，CLI 形态本身就支持 CI/CD 集成
  - 以为审批机制一致，扩展形态明确有 human-in-the-loop，但 CLI headless 下的行为未核验

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

**不适合**要求「明确审批在所有形态下一致生效」的场景——
扩展形态确认有 human-in-the-loop，但 CLI headless 下的行为未核验。

## 权限定级说明

`confidence: partial`：

- ✅ 已核验：仓库、许可（Apache-2.0）、star 数（69,514）、三形态能力、两条 release 线及日期、扩展形态的 human-in-the-loop、Desktop 的定时任务与 MCP 管理、CLI 的 headless 能力
- ❌ 未核验：provider 清单、工具清单细节、索引策略、上下文机制、CLI headless 的审批行为、定时任务在客户端关闭后的行为

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
