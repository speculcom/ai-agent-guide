---
id: codex-ide
track: ide
name: Codex IDE 扩展
vendor: OpenAI
homepage: https://developers.openai.com/codex/ide
mark: C
accent: "#10A37F"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 随 ChatGPT 套餐，档位见定价页
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    与 [CLI 形态](../cli/products/codex-cli.md) 共享同一授权：
    随 ChatGPT 订阅。
    **API 计费与订阅不是同一额度。**
    官方 IDE 文档站在本次采集环境对 curl 返回 403，
    定价与额度细节本次未核验，记为未知。
pricing_pitfalls:
  - 把 IDE 扩展当成独立产品付费，它与 CLI 共享同一授权
  - 以为买了订阅就含 API 额度，API 单独计费

axes:
  model_access: >-
    与 CLI 形态相同：OpenAI 自家模型。
    **具体模型清单与 IDE 形态下的映射本次未核验。**
  runtime: >-
    **IDE 形态是扩展，不是独立编辑器。**
    官方 README 原文：
    "If you want Codex in your code editor (VS Code, Cursor, Windsurf),
    install in your IDE."
    即**装进 VS Code / Cursor / Windsurf 这类已有编辑器**。
    这与 Zed（独立编辑器）、Cline Desktop（原生应用）是不同形态。
  local_files: >-
    通过宿主编辑器访问工作区文件。
    **索引与上下文构建策略本次未核验**——
    需查 developers.openai.com/codex/ide，该站在本环境 curl 返回 403。
  background: >-
    依赖宿主编辑器进程，编辑器关闭即停止。
    **是否有云端任务形态本次未核验。**
  tools: >-
    **具体工具集本次未核验。**
    可参考 [CLI 形态](../cli/products/codex-cli.md) 的架构信息：
    app server 架构意味着 IDE 扩展与 CLI 共享同一后端。
  context: >-
    **app server 架构是本工具的关键设计**——
    线程可启动、续接与恢复，
    IDE 扩展与 CLI 通过 app server 共享同一套会话机制。
    **具体上下文窗口与压缩策略本次未核验。**
  permissions: >-
    **审批与沙箱的具体形态本次未核验。**
    CLI 形态已确认「沙箱与审批边界跟随运行环境」，
    但 IDE 扩展形态是否一致，**不能假设，需单独核验**。
  fit: >-
    已在用 VS Code / Cursor / Windsurf 等编辑器，
    希望在同一环境里用 Codex 而不切换工具的人。
    需要 IDE 与 CLI 共享会话的人（app server 架构）。

pitfalls:
  - 把它当成独立 IDE，其实质是装进已有编辑器的扩展
  - 以为 IDE 扩展与 CLI 是两套独立系统，app server 架构让它们共享会话
  - 套用 CLI 的权限行为到 IDE 扩展，本次未核验两者是否一致

tags: [编程, IDE, 本地]
related: [codex-cli, cursor, windsurf]

sources:
  - label: OpenAI · Codex IDE 文档
    url: https://developers.openai.com/codex/ide
    kind: docs
  - label: OpenAI · Codex 仓库 README（含 IDE 安装说明）
    url: https://github.com/openai/codex
    kind: repo
  - label: OpenAI · Codex CLI Releases（rust-v0.158.0 @ 2026-09-28）
    url: https://github.com/openai/codex/releases
    kind: changelog

link:
  url: https://developers.openai.com/codex/ide
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**不是独立 IDE，是装进 VS Code / Cursor / Windsurf 的扩展**——通过 app server 与 CLI 共享同一套会话机制。

## 形态澄清（这一条最容易被误解）

README 原文：

```
If you want Codex in your code editor (VS Code, Cursor, Windsurf),
install in your IDE.
```

**关键信息**：它明确列出支持的三种宿主编辑器。
这说明 **Codex IDE 形态是"扩展"而非"编辑器"**。

### IDE 赛道三种形态对比

| 形态 | 代表 | 含义 |
|---|---|---|
| **独立编辑器** | Zed | 自带完整编辑器，AI 是其中一部分 |
| **原生桌面应用** | Cline Desktop | 不依附于任何编辑器 |
| **编辑器扩展** | **Codex IDE**、Copilot、Cline 扩展 | 装进已有编辑器 |

**这个区分很重要**：
扩展形态的「索引策略」「上下文构建」往往由宿主编辑器决定，
而不是由这个工具自己决定。

**所以本条目与 [Zed](./zed.md) 不完全可比**——
一个是独立编辑器，一个是扩展。

## 与 CLI 形态的关系

**两个条目，不同赛道，但共享后端**：

| | [CLI 形态](../../cli/products/codex-cli.md) | IDE 形态（本条目） |
|---|---|---|
| 形态 | 终端进程 | 编辑器扩展 |
| 授权 | 随 ChatGPT 订阅 | **同一授权** |
| 后端 | app server | **同一个 app server** |

**app server 架构的实际意义**：
线程可启动、续接与恢复，
所以**在 IDE 里开的会话可以在 CLI 里续上，反之亦然**。

**这是本工具最有价值的架构特点**，也是 CLI 与 IDE 两个条目必须交叉引用的原因。

## 适合与不适合

已在用 VS Code / Cursor / Windsurf 等编辑器，
希望在同一环境里用 Codex 而不切换工具的人。
需要 IDE 与 CLI 共享会话的人（app server 架构）。

**不适合**需要独立编辑器的人——
本形态必须依附已有编辑器，无法单独使用。
也不适合要求「权限行为在 IDE 与 CLI 严格一致」的场景，
本次未核验两者是否一致。

## 采集限制

官方 IDE 文档站 `developers.openai.com/codex/ide`
在本次采集环境对 curl 返回 **403（CDN 拦截）**。

**已核验的部分**（来自 GitHub 仓库）：
- IDE 形态是扩展，且支持 VS Code / Cursor / Windsurf
- 与 CLI 共享授权与 app server 后端
- 许可证 Apache-2.0，star 126,988，2026-09-28 有 release

**未核验的部分**：
- 工具集、索引策略、上下文机制、审批形态（均需 IDE 文档站）

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测 **app server 的会话续接**——
在 IDE 开会话、切到 CLI 继续，看状态是否完整保留。
这是它架构上最有价值也最需要验证的点。

## 未知项清单

- IDE 形态的完整工具集
- 索引与上下文构建策略（部分由宿主编辑器决定）
- 审批与沙箱在 IDE 形态下的具体行为
- 上下文窗口与压缩策略
- 是否支持自带 provider

## 相关条目

- [Claude Code](./claude-code.md) — 同为「扩展 + CLI」双形态架构
- [Zed](./zed.md) — 同赛道的另一端：独立编辑器
- [Cline](./cline.md) — 三形态全覆盖的另一实现
