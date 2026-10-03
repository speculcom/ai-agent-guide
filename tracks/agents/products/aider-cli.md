---
id: aider-cli
track: cli
name: Aider
vendor: Aider-AI
homepage: https://github.com/Aider-AI/aider
mark: A
accent: "#D4A27F"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 开源免费，模型费用另计
  annual_usd: null
  annual_label: 开源免费，模型费用另计
  note: >-
    Apache-2.0 开源，PyPI 包为 aider-chat（官方徽章显示 680 万次安装）。
    **模型调用费用完全由用户自付**——
    支持云端与本地 LLM，包括 OpenRouter 等平台与本地模型。
pricing_pitfalls:
  - 以为开源就等于零成本，模型调用费用要自己承担
  - 以为还在积极维护，最新 release 停在 2025-08

axes:
  model_access: >-
    **支持云端与本地 LLM，可连接几乎任何模型**，
    明确包含本地模型选项。
    README 当前推荐的模型是 Claude 3.7 Sonnet、DeepSeek R1 & Chat V3、
    OpenAI o1 / o3-mini / GPT-4o。
    **注意：这份推荐列表停留在上一代模型，
    与该项目 13 个月未发 release 的状态一致，参考时需自行核对当前可用模型。**
  runtime: >-
    本地 **Python** 进程，在终端内运行（PyPI 包 aider-chat，官方徽章显示 680 万次安装）。
    生命周期绑定终端会话，退出即结束。
    另有 watch 常驻形态（见 [IDE 形态条目](../../ide/products/aider.md)）。
  local_files: >-
    **Repo Map 是本工具的核心机制**（官方文档 `docs/repomap.md` 原文）：
    Aider 使用「一份简洁的整个 git 仓库的地图」，
    包含**最重要的类与函数及其类型与调用签名**。
    **每次用户提出改动请求时，repo map 都随请求一起发给模型**，
    map 包含仓库文件列表 + 每个文件的关键符号。
    **两个作用**（文档明确列出）：
    一是帮助它理解正在编辑的代码及其与代码库其他部分的关系；
    二是帮助它写新代码时**复用代码库里已有的库、模块与抽象**。
    支持 100+ 编程语言。
    **大仓库的 repo map 耗时与 token 开销本次未实测，记为未知。**
  background: >-
    不支持终端形态的后台长任务。
    另有 watch 模式（见 [IDE 形态条目](../../ide/products/aider.md)）：
    常驻监听文件变化并响应编辑器里的 AI 注释，
    **但那是本地进程常驻，不是云端后台**。
  tools: >-
    文件编辑 + **Git 操作**。**README 强调 Git 集成本身就是核心功能**：
    自动用合理的 commit message 提交，
    可用熟悉的 git 工具 diff、管理与撤销 AI 改动。
    官方文档另有 `docs/languages.md`（语言支持）与 `docs/git.md`。
    **MCP 接入方式本次未核验，记为未知。**
  context: >-
    **Repo Map 提供全库结构视图**，每次请求随附（见 local_files）。
    **上下文窗口大小与压缩策略本次未核验，记为未知。**
  permissions: >-
    **具备自动提交能力**（auto-commit），这是它的一体化设计而非附加功能。
    撤销路径是 **git 本身**（不是工具提供的回滚功能）——
    README 明确说「用熟悉的 git 工具 diff、管理与撤销 AI 的改动」。
    **沙箱机制与「执行命令前是否询问」本次未核验，记为未知。**
  fit: >-
    希望 AI 改动始终留在 git 版本控制里、可 diff 可撤销的场景。
    需要连接本地模型或多家云端模型的用户。
    需要「写新代码时复用已有抽象」的人（Repo Map 的第二个作用）。
    **不适合需要活跃维护与新模型支持的场景**（见下方维护状态）。

pitfalls:
  - 以为还在积极维护，最新 release 停在 2025-08-09，距采集日 13 个月
  - 以为 README 推荐的模型是最新的，推列表仍停留在上一代
  - 以为自动提交是副作用，实际这是它的核心设计，需要先熟悉 git 撤销流程

tags: [编程, 终端, 本地, 开源]

sources:
  - label: Aider · 仓库 README
    url: https://github.com/Aider-AI/aider
    kind: repo
  - label: Aider · Releases（v0.86.0 @ 2025-08-09 为最新）
    url: https://github.com/Aider-AI/aider/releases
    kind: changelog
  - label: Aider · 官方文档站
    url: https://aider.chat/docs/
    kind: docs
  - label: Aider · 变更历史
    url: https://aider.chat/HISTORY.html
    kind: changelog

link:
  url: https://github.com/Aider-AI/aider
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: maintenance
confidence: partial
---

## 一句话定位

Git 集成是**核心设计而非附加功能**的终端 pair programming 工具——AI 改动始终在版本控制里，可 diff 可撤销。

## ⚠ 维护状态（本条目最重要的信息）

| 指标 | 值 | 距采集日 |
|---|---|---|
| 最新 release | `v0.86.0` | **2025-08-09（13 个月前）** |
| 上一个 release | `v0.85.0` | 2025-06-27 |
| 最后 commit | 扩充 ANTHROPIC_MODELS 名单 | 2026-05-22 |
| star 数 | 49,249 | — |
| PyPI 安装量 | 680 万 | — |

**判断：lifecycle = `maintenance`**

理由：
- release 已 13 个月未更新
- 最后几次 commit 都是**维护性改动**（扩充模型名单），不是功能开发
- README 的模型推荐仍停留在上一代（Claude 3.7 Sonnet 时代）

**这不是"坏了"，但意味着**：
- 新模型支持可能滞后
- 新语言 / 新框架适配可能滞后
- 遇到 bug 不一定能靠上游修复

**引用本条目做选型时必须考虑这一点。**

## 核心能力（README 官方描述）

| 能力 | 官方原文要点 |
|---|---|
| **云端与本地 LLM** | 可连接几乎任何 LLM，包括本地模型 |
| **Repo Map** | 为整个代码库生成结构图，帮助它在较大项目中工作 |
| **100+ 语言** | python / javascript / rust / ruby / go / cpp / php / html / css 等 |
| **Git 集成** | 自动用合理 commit message 提交，可用 git 工具 diff、管理与撤销 |
| **IDE 内使用** | 在 IDE 里加注释提问，aider 去做 |

## Repo Map 是它的差异化能力

```
Aider makes a map of your entire codebase,
which helps it work well in larger projects.
```

这与其他工具的"按需检索文件"是不同思路——**先建全库结构图，再据此工作**。

**注意**：具体算法（如何选文件进 map、如何控制 token 预算）
文档站有说明但**本次未核验**，记为未知。

## Git 集成是设计的一部分，不是副作用

```
Aider automatically commits changes with sensible commit messages.
Use familiar git tools to easily diff, manage and undo AI changes.
```

**这一点值得单独强调**：很多工具需要用户自己管理 git，
Aider 把「自动提交 + 用 git 撤销」当作核心工作流。

**这带来一个必须知道的前提**：
如果你不熟悉 git 的撤销流程（`git reset` / `git revert`），
建议先在小仓库试用——因为 AI 的改动会**直接进入提交历史**。

## 官方自我评价的一个有趣指标

README 徽章里有：
```
🔄 Singularity — 88%
Percentage of the new code in Aider's last release written by Aider itself
```

即「上个版本的新代码里 88% 由 Aider 自己写」。
这是官方自述的自举程度，可作为参考但不必过度解读。

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库、许可（Apache-2.0）、最新版本与日期、维护状态、star、PyPI 安装量、README 全部能力描述
- ⚠️ 部分未知：Repo Map 算法、上下文策略、MCP 支持、沙箱与确认机制

**维护状态的不确定性来自"未来会不会更新"**——这本身就是选型风险。

## 适合与不适合

需要 AI 改动始终留在 git 版本控制里、可 diff 可撤销的场景。
需要连接本地模型或多家云端模型的用户。

**不适合**需要新模型支持或依赖上游修复的场景——
最新 release 停在 2025-08，维护状态为 maintenance。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应放在
**「自动提交 + 撤销」这条链路是否顺畅**——
因为这是它与其他工具最大的工作流差异。

## 未知项清单

- Repo Map 的具体算法与 token 预算控制
- 上下文窗口与压缩策略
- 是否支持 MCP
- 执行命令前是否有确认机制
- watch 模式的具体行为

## 相关条目

- [Codex CLI](./codex-cli.md) — 同类工具，维护活跃
- [OpenCode](./opencode.md) — 同类工具，更新频繁
