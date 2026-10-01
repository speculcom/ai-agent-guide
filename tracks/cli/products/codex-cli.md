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
  monthly_usd: null
  monthly_label: 随 ChatGPT 套餐，档位见定价页
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    README 确认「Using Codex with your ChatGPT plan」——
    授权随 ChatGPT 订阅。
    **API 计费与订阅授权不是同一额度**，
    具体档位与 API 价格本次未核验，记为未知。
pricing_pitfalls:
  - 以为买了 ChatGPT 订阅就能用 API，API 单独计费
  - 以为 CLI 和 IDE 扩展共享额度，实际配额跟随账户与套餐

axes:
  model_access: >-
    OpenAI 自家模型。官方描述为「Lightweight coding agent that runs in your terminal」。
    **本次未核验统一默认模型与具体模型映射**，README 未列出，记为未知。
  runtime: >-
    **本地 Rust 实现的终端进程**（releases 标签为 rust-v*）。
    生命周期绑定终端会话，退出即结束。
  local_files: >-
    在用户工作目录内操作。README 提供 npm 与 Homebrew 两种安装方式。
    **具体的沙箱默认档位与目录边界本次未核验，记为未知。**
  background: >-
    不支持终端形态的长后台任务。
    **是否存在云端任务入口本次未核验，记为未知。**
  tools: >-
    面向工程任务的工具集（读写文件、执行命令等）。
    **官方文档站 developers.openai.com 在本次采集环境对 curl 返回 403，
    具体工具清单与 MCP 接入方式本次未核验，记为未知。**
  context: >-
    **app server 架构是本工具的关键设计**——
    官方文档提及自定义客户端通过 app server 接入，线程可启动、续接与恢复。
    **具体上下文窗口与压缩策略本次未核验。**
  permissions: >-
    沙箱与审批边界跟随运行环境。
    **API key 计费与订阅不是同一额度**（此点已在定价说明中确认）。
    **审批与沙箱模式已于 2026-10-01 核验完成**（此前记为未核验）：
    来自 `@openai/codex-sdk` 源码 `sdk/typescript/src/threadOptions.ts` 的类型定义 ——
    `ApprovalMode = "never" | "on-request" | "on-failure" | "untrusted"`（四档）、
    `SandboxMode = "read-only" | "workspace-write" | "danger-full-access"`（三档），
    网络由 `networkAccessEnabled` / `webSearchMode`（disabled/cached/live）单独控制。
    证据在 SDK 侧而非 CLI 文档侧 —— `docs/sandbox.md` 正文只有外链，所以当初核验不到。
    ⚠ 三档沙箱的**跨平台实现差异仍未核验**（尤其 Windows）。详见 [Codex SDK 档案](../../harness/products/codex-sdk.md)。
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

link:
  url: https://github.com/openai/codex
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
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

## 本次采集的核验限制

**必须说明**：这条目的多个维度标注为未知，原因如下：

| 项目 | 情况 |
|---|---|
| 官方文档站 | `developers.openai.com` 在本次环境对 curl 返回 **403**（CDN 拦截） |
| 仓库 README | 内容极简，是快速开始指引，不是能力说明 |
| 具体能力 | 沙箱档位、工具清单、模型映射、审批模式均未在可访问源中说明 |

**按本站方法论，这些必须标为未知而不是推测。**

若要补全，需要：
- 用浏览器访问 `developers.openai.com/codex/cli`（curl 被拦）
- 或参考 AgentClash 已整理的 Codex 档案（有更完整的文档核验记录）

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库存在、许可（Apache-2.0）、最新版本、发布日期、star 数（126,978）、安装方式、ChatGPT 订阅授权
- ❌ 未核验：默认模型、沙箱档位、工具清单、上下文策略、审批模式、云端任务

**引用本条目时请只使用已核验部分。**

## 适合与不适合

在终端做工程任务，需要接入 CI 或自建客户端的场景。
已有仓库的续接与恢复是它的架构重点。

**不适合**需要沙箱与权限机制完全明确可控的场景——
本次采集环境无法访问官方文档站，这几项标为未知，采购前需自行核对。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

## 未知项清单

- 统一默认模型与模型映射
- 沙箱默认档位与目录边界
- 完整工具清单与 MCP 接入方式
- 上下文窗口与压缩策略
- 审批模式的具体形态
- 是否提供云端任务入口

## 相关条目

- [Claude Code CLI](./claude-code-cli.md) — 同为终端编码 agent
- [Gemini CLI](./gemini-cli.md) — Google 官方同类
