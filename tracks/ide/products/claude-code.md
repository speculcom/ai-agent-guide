---
id: claude-code
track: ide
name: Claude Code IDE 扩展
vendor: Anthropic
homepage: https://code.claude.com/docs/en/overview
mark: CC
accent: "#D97757"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 随 Claude 订阅，档位见定价页
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    与 [CLI 形态](../../cli/products/claude-code-cli.md) 共享同一授权：
    随 Claude 订阅。
    **仓库 LICENSE.md 明确：© Anthropic PBC. All rights reserved，
    使用受 Anthropic 商业条款约束**——源码公开不等于开源。
pricing_pitfalls:
  - 以为 IDE 形态要单独付费，它与 CLI 共享授权
  - 以为有 GitHub 仓库就能自由使用，许可明确是 proprietary

axes:
  model_access: >-
    与 CLI 形态相同：Anthropic 自家 Claude 系列。
    **v2.1.284（2026-09-28）新增 Claude Sonnet 5.5（`claude-sonnet-5-5`），
    1M 上下文、$2/$10 per Mtok、缓存读 $0.20/Mtok。**
    这条定价来自 CHANGELOG，是本次采集中唯一拿到具体数字的对象。
  runtime: >-
    **一个进程、三种用法**（README 原文）：
    "Use it in your terminal, **IDE**, or tag @claude on Github."
    即终端、IDE、以及在 GitHub 上用 `@claude` 提及触发。
    **这三种是同一个工具的不同入口，不是三套实现**——
    这点与 [Cline 的三形态](../../ide/products/cline.md)（三套独立形态）不同。
  local_files: >-
    **权限模型与工作目录强绑定**——
    auto 模式在「读取工作目录之外的文件前」会询问，
    且提供「允许这一次但保持询问」的第三态选项。
    1M 上下文。
    **IDE 形态下的具体文件访问边界本次未核验**。
  background: >-
    依赖 IDE 或客户端进程。
    **IDE 形态是否有后台任务本次未核验。**
  tools: >-
    **MCP 支持在持续加强**——
    v2.1.284 新增 `/mcp reconnect all`
    （一次性重试所有连接失败或待认证的 server）；
    同期修复了恢复会话时 MCP 工具报 "No such tool available" 的竞态问题，
    现在会等待最多 10 秒。
    **IDE 形态下的 MCP 配置方式本次未核验。**
  context: >-
    **上下文压缩有明确的边界处理**——
    v2.1.284 修复了「压缩后仍超长导致 Prompt is too long 持久报错」：
    现在会再压缩一次并保留更少的近期对话。
    **IDE 形态与 CLI 形态是否共享同一压缩策略，本次未核验。**
  permissions: >-
    **本赛道里权限设计最细的一个**，且多态共用：
    按路径询问（工作目录外读取需确认）；
    提供「允许这一次」的第三态；
    托管策略支持 `availableModels` 与 `enforceAvailableModels`，
    不匹配时启动即警告；
    `/usage` 显示具体金额而非百分比。
    **IDE 形态是否行为一致，本次未核验。**
  fit: >-
    已在用 IDE 且希望不切换工具就能用 Claude 的人。
    需要在终端、IDE、GitHub 三处用同一工具的人。
    重视权限可控性与 MCP 生态的人。

pitfalls:
  - 以为 IDE 形态是独立产品，它与 CLI 是同一个进程的三种入口
  - 套用 CLI 的权限设计到 IDE 形态，本次未核验两者是否一致
  - 以为开源可自由使用，许可是 proprietary

tags: [编程, IDE, 本地]
related: [claude-code-cli, cursor, copilot]

sources:
  - label: Anthropic · Claude Code 官方文档
    url: https://code.claude.com/docs/en/overview
    kind: docs
  - label: Anthropic · Claude Code 仓库 README（三种用法原文）
    url: https://github.com/anthropics/claude-code
    kind: repo
  - label: Anthropic · Claude Code CHANGELOG
    url: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
    kind: changelog
  - label: Anthropic · Claude Code Atom feed
    url: https://github.com/anthropics/claude-code/blob/main/feed.xml
    kind: changelog
  - label: Anthropic · Commercial Terms of Service
    url: https://www.anthropic.com/legal/commercial-terms
    kind: docs

link:
  url: https://code.claude.com/docs/en/overview
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

**一个进程、三种入口**——终端、IDE、GitHub `@claude` 提及共用同一套权限与上下文机制。

## 形态澄清（与 Cline 的关键区别）

README 原文：

```
Use it in your terminal, IDE, or tag @claude on Github.
```

**注意这里的措辞**：是「use it in」（在……里使用它），
**不是「install」（安装）**。

### 与 Cline 三形态的本质区别

| | Claude Code | Cline |
|---|---|---|
| 三种用法 | 终端 / IDE / GitHub | CLI / Desktop / VS Code 扩展 |
| 实现 | **同一个进程** | **三套独立形态** |
| release 线 | 一条（v2.1.x） | 两条（v4.x + desktop-v0.0.x） |
| 权限机制 | 多态共用 | 各形态独立 |

**这个区别对用户很重要**：
Claude Code 的权限与会话在三种入口之间是一致的，
Cline 的三个形态则可能各自演进。

## 权限设计（本赛道最细，且多态共用）

这是 Claude Code 最有价值的部分，**且因为多态共用，一处理解处处适用**：

### ① 按路径询问 + 第三态选项

v2.1.284 新增：

```
Added a "Yes, but ask again next time" answer to auto mode's prompt
before a read outside the working directories
```

多数工具的审批只有「允许 / 拒绝」两态，
这里提供了第三态：**允许这一次，但保持询问**。

### ② 托管策略控制可用模型

企业场景下 `availableModels` 控制可用模型，
`enforceAvailableModels` 决定是否强制，
**不匹配时启动即警告**，不静默降级。

### ③ 额度显示具体金额

```
"$271.40 / $500.00 spent this month"
```

`/usage` 与状态栏显示金额而非抽象百分比。

## 上下文压缩的边界处理

```
Fixed "Prompt is too long" errors that persisted after compacting:
now compacts once more, keeping less of the recent conversation
```

**压缩后仍可能超长**，此时会再压缩一次并保留更少近期对话。
这是诚实的边界处理，不假装一次压缩就能解决。

## MCP 支持与一个值得注意的修复

v2.1.284 两处改动：

| 类型 | 内容 |
|---|---|
| 新增 | `/mcp reconnect all` |
| 修复 | 恢复会话时 MCP 工具报 "No such tool available"（server 仍在连接），现在**等待最多 10 秒** |

**第二条揭示了一个真实场景**：会话恢复与 MCP 连接之间存在竞态。
这类问题只有大量用户才会遇到。

## 适合与不适合

已在用 IDE 且希望不切换工具就能用 Claude 的人。
需要在终端、IDE、GitHub 三处用同一工具的人。
重视权限可控性与 MCP 生态的人。

**不适合**需要开源许可或自托管的场景——
许可明确为 proprietary。
也不适合要求「权限行为在 IDE 与 CLI 严格一致」的场景，本次未核验两者是否完全一致。

## 权限定级说明

`confidence: partial`：

- ✅ 已核验：许可状态原文、三种用法的官方表述、模型定价原文、权限设计三个机制、上下文压缩策略、MCP 两处改动、release 频率（5 天 5 版）、Atom feed 存在
- ❌ 未核验：IDE 形态的索引策略、工具集细节、审批在 IDE 下的具体行为、上下文策略是否跨形态一致

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**跨形态的会话连续性**——
在 IDE 开会话、切到终端继续，看权限状态和上下文是否完整保留。
因为官方声称多态共用，这一条必须验证。

## 未知项清单

- IDE 形态的索引策略与工具集细节
- 审批在 IDE 下的具体行为
- 上下文压缩策略是否跨形态一致
- GitHub `@claude` 提及的具体触发条件
- 商业条款的具体限制内容

## 相关条目

- [Claude Code CLI](../../cli/products/claude-code-cli.md) — 同一工具的终端形态
- [Codex IDE 扩展](./codex-ide.md) — 同为「扩展 + CLI」架构
- [Cline](./cline.md) — 三形态的另一实现，但形态独立
