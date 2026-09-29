---
id: aider
track: ide
name: Aider Watch 模式
vendor: Aider-AI
homepage: https://aider.chat/docs/usage/watch.html
mark: A
accent: "#D4A27F"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 开源免费，模型费用另计
  annual_usd: null
  annual_label: 开源免费，模型费用另计
  note: >-
    Apache-2.0 开源。与 [CLI 形态](../../cli/products/aider-cli.md) 同一项目，
    **无额外授权费用**。模型调用费用由用户自付。
pricing_pitfalls:
  - 以为 IDE 形态是插件，它其实是 watch 模式 + 浏览器 UI
  - 以为形态独立，其实与 CLI 形态共享同一项目与同一维护状态

axes:
  model_access: >-
    与 CLI 形态相同：支持云端与本地 LLM，可连接几乎任何模型。
    **README 当前推荐列表停留在上一代模型
    （Claude 3.7 Sonnet / DeepSeek R1 / OpenAI o1 等），
    与该项目 13 个月未发 release 的状态一致，参考时需自行核对。**
  runtime: >-
    **不是编辑器插件，而是一种使用模式**：
    Aider 在后台 watch 你的文件，
    你在任意 IDE 或文本编辑器里加 AI 注释，它就响应。
    官方文档标题即为「Aider in your IDE」，
    但实现上跑的是 **Aider 自己的浏览器 UI**。
    **这与 Cline / Codex 的「编辑器扩展」是不同的形态。**
  local_files: >-
    watch 文件变化并响应 AI 注释。
    核心的 Repo Map 能力（为整个代码库生成结构图）
    与 CLI 形态相同。**大仓库表现本次未核验。**
  background: >-
    **需要 Aider 进程常驻**才能响应注释——
    这与「后台云端任务」不是一回事。
    **进程关闭后 watch 即失效**，
    也不存在客户端关闭后继续运行的云端形态。
  tools: >-
    文件编辑 + Git 自动提交（与 CLI 形态相同的核心设计）。
    **MCP 支持本次未核验。**
  context: >-
    Repo Map 提供全库结构视图。
    **上下文窗口与压缩策略本次未核验。**
  permissions: >-
    **具备自动提交能力**（与 CLI 形态一致）——
    AI 的改动会直接进入 git 历史。
    **watch 模式下是否每次询问本次未核验。**
    这是本条目最需要补全的一项：
    常驻进程 + 自动提交 + 无确认，风险叠加。
  fit: >-
    习惯在任意编辑器里工作，不愿切换到专门的 Agent 界面的人。
    需要「加注释 → 自动响应」这种轻量交互的人。

pitfalls:
  - 以为它是编辑器插件，实际是 Aider 常驻进程 + 浏览器 UI
  - 把 watch 模式当成云端后台任务，它需要本机进程一直运行
  - 没意识到自动提交在 watch 模式下同样生效，常驻进程下风险更高

tags: [编程, IDE, 本地, 开源]
related: [aider-cli]

sources:
  - label: Aider · Watch 模式官方文档（Aider in your IDE）
    url: https://aider.chat/docs/usage/watch.html
    kind: docs
  - label: Aider · 仓库
    url: https://github.com/Aider-AI/aider
    kind: repo
  - label: Aider · Releases（最新 v0.86.0 @ 2025-08-09）
    url: https://github.com/Aider-AI/aider/releases
    kind: changelog

link:
  url: https://aider.chat
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: maintenance
confidence: partial
---

## 一句话定位

**不是编辑器插件，是一种使用模式**——Aider 常驻 watch 你的文件，你在任意编辑器里加 AI 注释，它就响应。

## 形态澄清（本赛道第四种形态）

IDE 赛道到目前为止有四种形态，本条目是第四种：

| 形态 | 代表 | 实质 |
|---|---|---|
| 独立编辑器 | Zed | 自带完整编辑器 |
| 原生桌面应用 | Cline Desktop | 不依附编辑器 |
| 编辑器扩展 | Codex IDE、Copilot、Cline 扩展 | 装进已有编辑器 |
| **常驻 watch 模式** | **Aider** | **在编辑器外运行，监听文件变化** |

**Aider 的特殊之处**：它不进入编辑器，而是监听你在任意编辑器里的改动。

### 官方文档的措辞

文档标题是「Aider in your IDE」，
描述是：

```
Aider can watch your files and respond to AI comments
you add in your favorite IDE or text editor.
```

**注意最后半句**：`or text editor`——
连纯文本编辑器都行，因为它监听的是文件变化，不是编辑器 API。

**但界面仍是 Aider 自己的浏览器 UI**，不是在编辑器内联显示。

## 与 CLI 形态的关系

| | [CLI](../../cli/products/aider-cli.md) | Watch 模式（本条目） |
|---|---|---|
| 交互 | 终端对话 | 加 AI 注释 |
| 界面 | 终端 | Aider 的浏览器 UI |
| 进程 | 随会话结束 | **需常驻** |
| Repo Map | 有 | 有（同一能力） |
| 自动提交 | 有 | 有（同一机制） |
| 维护状态 | maintenance | maintenance（同一项目） |

**同一个项目，两种用法。** 不是两套实现。

## 关键风险：常驻 + 自动提交

这是本条目需要特别注意的组合：

| 因素 | 状态 |
|---|---|
| 进程常驻 | 需要一直运行才能响应 |
| 自动提交 | AI 改动直接进 git 历史 |
| 每次询问 | **本次未核验** |

**常驻进程 + 自动提交 + 未确认是否每次询问**——
这三个叠加起来，风险高于手动启动的 CLI 用法。

**建议**：第一次用 watch 模式时，在小仓库里试，并先确认 git 状态干净。

## 适合与不适合

习惯在任意编辑器里工作，不愿切换到专门的 Agent 界面的人。
需要「加注释 → 自动响应」这种轻量交互的人。

**不适合**要求严格审批的场景——
watch 模式的确认机制本次未核验，
且常驻进程下更容易产生未经确认的改动。
也不适合需要云端后台运行的场景，它依赖本机进程。

## 采集限制

Aider 的文档站在本次采集环境 curl 可达，
已确认 watch 模式的官方描述。

**未核验**：
- watch 模式下是否每次询问
- MCP 支持情况
- 上下文窗口与压缩策略
- 大仓库的 Repo Map 表现

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应是
**「常驻进程 + 自动提交」的风险是否可控**——
建议在一个测试仓库里跑，观察产生了多少次未经确认的提交。

## 未知项清单

- watch 模式下是否每次询问
- MCP 支持情况
- 上下文窗口与压缩策略
- 大仓库 Repo Map 表现

## 相关条目

- [Aider CLI](../../cli/products/aider-cli.md) — 同一项目的终端形态
- [Cline](./cline.md) — 三形态覆盖，但形态相互独立
