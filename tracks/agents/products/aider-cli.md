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
    另有 watch 常驻形态（见 [IDE 形态条目](../../agents/products/aider.md)）。
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
    **文件访问范围**：能编辑的是你 `/add` 进 chat 的文件，
    但 repo map 扫描整个 git 仓库；范围受 `.gitignore` / `.aiderignore`
    约束（`--aiderignore` 指定忽略文件，默认 git 根目录 `.aiderignore`；
    `--subtree-only` 只考虑当前子树）。
    仓库须是 git 仓库——官方 `docs/git.html`：无 git 时会先问你是否新建。
    **map 的 token 预算由 `--map-tokens` 控制、刷新频率由 `--map-refresh`
    （auto/always/files/manual）控制；大仓库的实际耗时与 token 开销
    官方未给数字，本站未实测。**
  background: >-
    不支持终端形态的后台长任务。
    另有 watch 模式（见 [IDE 形态条目](../../agents/products/aider.md)）：
    常驻监听文件变化并响应编辑器里的 AI 注释，
    **但那是本地进程常驻，不是云端后台**。
  tools: >-
    文件编辑 + **Git 操作**。**README 强调 Git 集成本身就是核心功能**：
    自动用合理的 commit message 提交，
    可用熟悉的 git 工具 diff、管理与撤销 AI 改动。
    官方文档另有 `docs/languages.md`（语言支持）与 `docs/git.md`。
    **可配置 lint / 测试命令自动运行**（`docs/usage/lint-test.html`）：
    `--lint-cmd` / `--auto-lint`（默认对编辑过的文件跑 lint）、
    `--test-cmd` / `--auto-test`；`/run` 跑 shell 命令并可选加输出进 chat、
    `/web` 抓网页转 markdown、`/paste` 贴图。
    **无内置 MCP 支持**——官方选项表与文档站导航都没有任何 MCP 条目
    （已查 `config/options.html` 与 docs 目录），故不能接 MCP server。
  context: >-
    **Repo Map 提供全库结构视图**，每次请求随附（见 local_files）。
    **上下文超限用「摘要压缩」而非简单截断**：官方选项
    `--max-chat-history-tokens` 描述为
    "Soft limit on tokens for chat history, after which summarization begins"
    （超过软上限即开始摘要，摘要由 `--weak-model` 生成）；
    每个模型的上下文窗口与费用由 `--model-metadata-file` 提供。
    会话内可用 `/tokens` 查看用量、`/drop`、`/clear`、`/reset` 腾空间；
    **默认不跨启动恢复**（`--restore-chat-history` 默认 False），
    chat 历史默认写 `.aider.chat.history.md`。
  permissions: >-
    **默认自动提交**（`--auto-commits` 默认 True），
    这是它的一体化设计而非附加功能；
    `--dirty-commits`（默认 True）会先把已有的未提交改动也提交。
    撤销路径是 **git 本身**（不是工具提供的回滚功能）——
    README 明确说「用熟悉的 git 工具 diff、管理与撤销 AI 的改动」，
    会话内用 `/undo`。
    **存在确认环节**：官方提供 `--yes-always`（别名 `--yes`），
    描述为 "Always say yes to every confirmation"——
    即默认会对某些操作询问，加此开关才全自动；
    `--dry-run` 可不改文件地预演。
    **无沙箱机制**——官方选项表没有任何沙箱项；
    除你配置的 lint / 测试命令（`--auto-lint` / `--auto-test`）外，
    它不会自主执行任意 shell 命令（`--suggest-shell-commands` 只是建议）。
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
related: [git]

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
  - label: Aider · 选项参考（--aiderignore/--auto-commits/--yes-always/--map-tokens/--max-chat-history-tokens）
    url: https://aider.chat/docs/config/options.html
    kind: docs
  - label: Aider · Git 集成（自动提交、dirty 提交、/undo、默认跳过 pre-commit hook）
    url: https://aider.chat/docs/git.html
    kind: docs
  - label: Aider · Linting and testing（--lint-cmd/--test-cmd/--auto-lint/--auto-test）
    url: https://aider.chat/docs/usage/lint-test.html
    kind: docs
  - label: Aider · Scripting（--yes/--auto-commits/--dry-run 官方帮助文本）
    url: https://aider.chat/docs/scripting.html
    kind: docs

link:
  url: https://github.com/Aider-AI/aider
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
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

**注意**：A6.2 已核到 —— **token 预算由 `--map-tokens` 控制**
（设为 0 即关闭），刷新频率由 `--map-refresh`（auto/always/files/manual）控制；
**如何选文件进 map 的具体排序算法**官方 `docs/repomap.md` 有说明，
本站未逐行核验，大仓库实际开销官方也未给数字。

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
- ✅ A6.2 本轮新核：文件范围与忽略规则、自动提交/确认机制（`--auto-commits`/`--yes-always`）、
  lint/测试命令、上下文摘要压缩（`--max-chat-history-tokens`）、**官方无 MCP 支持**
- ⚠️ 官方未给数字：大仓库 Repo Map 的实际耗时与 token 开销

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

- 大仓库 Repo Map 的实际耗时与 token 开销（官方未给数字，待实测）
- `--yes-always` 默认会就哪些具体操作询问（官方未逐项列举）

## 相关条目

- [Codex CLI](./codex-cli.md) — 同类工具，维护活跃
- [OpenCode](./opencode.md) — 同类工具，更新频繁
