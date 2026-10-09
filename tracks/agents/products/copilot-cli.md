---
id: copilot-cli
track: cli
name: GitHub Copilot CLI
vendor: GitHub
homepage: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli
mark: CP
accent: "#24292F"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 随 Copilot 订阅（档位价格见 ./copilot.md）；CLI 无独立定价
  annual_usd: null
  annual_label: 官方未单列 CLI 年付（额度随 Copilot 订阅，未核验年付口径）
  note: >-
    **CLI 没有独立定价，额度与 Copilot 订阅同源。** 官方文档两处口径需注意：
    about-copilot-cli 页写「available with the GitHub Copilot Pro, GitHub Copilot
    Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans」，
    而 cli-quickstart 页写「available with all Copilot plans」，
    2026-02-25 官方 changelog 又写 GA 后「available to all Copilot subscribers」——
    **两页是否含 Free 档的说法不一致**（见「未知项清单」）。
    **计费单位是 premium requests**：官方原文「Each time you submit a prompt to
    Copilot CLI, your monthly quota of Copilot premium requests is reduced by
    one」，且计费文档表单写明「Each prompt to Copilot CLI uses one premium request
    with the default model. For other models, this is multiplied by the model's
    rate」。Free 档官方写「up to 50 premium requests per month」；付费档的内置模型
    （GPT-5 mini、GPT-4.1、GPT-4o）「do not consume any premium requests」。
    另：官方宣布「Starting June 1, 2026, GitHub is moving Copilot from
    request-based billing to usage-based billing」。
pricing_pitfalls:
  - 以为 Copilot CLI 能单独购买——它随 Copilot 订阅，无独立定价
  - 以为 CLI 不耗额度——每次提示词各扣 1 次 premium request，高级模型按倍率
  - 把 about 页的档位清单（Pro/Pro+/Business/Enterprise）当唯一口径，quickstart 页写的是 all plans

axes:
  model_access: >-
    **多厂商模型，可在 CLI 内切换。** 官方 README 原文「By default, `copilot`
    utilizes Claude Sonnet 4.5. Run the `/model` slash command to choose from other
    available models, including Claude Sonnet 4 and GPT-5」；官方 changelog
    进一步写 GA 时「Choose from the latest models from Anthropic, OpenAI, and Google」。
    **注意官方两页对默认模型的表述不同**：README 写 Claude Sonnet 4.5，about 页写
    「The default model used by GitHub Copilot CLI is Claude Sonnet 4. GitHub
    reserves the right to change this model」。**具体可用模型清单随套餐变化**，
    完整清单见 Copilot 模型页（与 [IDE 条目](./copilot.md) 同一套账号体系）。
    第三方 agent 委派沿用 Copilot 平台能力（Preview）。
  runtime: >-
    **本地终端进程**，生命周期绑定终端会话。官方支持「Linux / macOS /
    Windows from within Powershell and Windows Subsystem for Linux (WSL)」；
    about 页另注「Native Windows support in Powershell is available, but
    experimental」。**另有一条云端运行面**：`copilot --cloud` 可在隔离的云托管环境
    里起会话（official 文档写 Cloud sandboxes「in public preview」，
    其策略「inherit from Copilot cloud agent policies」，可跨机器续会话、并行跑任务）——
    **这与本地终端会话是两个运行面，不要混为一谈。**
  local_files: >-
    **以「信任目录」为界。** 官方原文：启动会话时会「confirm that you trust the
    files in, and below, the directory from which you launched the CLI」，
    受托目录控制「where Copilot CLI can read, modify, and execute files」。
    **关键限定**：官方明写「Scoping of permissions is heuristic and GitHub does
    not guarantee that all files outside trusted directories will be protected」——
    **别把信任目录当成强沙箱。** 想要更硬的边界，可开本地沙箱：
    「run `/sandbox enable` inside a session」以限制文件系统、网络与系统能力；
    或用 `copilot --cloud` 把整个会话放进云隔离环境。
  background: >-
    **有明确的后台委派与云端会话。** 官方 changelog 原文「Prefix any prompt with
    `&` to delegate work to the Copilot coding agent in the cloud, freeing your
    terminal for other tasks. Use `/resume` to switch between local and remote
    coding agent sessions seamlessly」——**即在终端里把任务甩给云端 coding agent，
    终端继续干别的。** 云沙箱（public preview）另支持「keep a session's state between
    uses, continue a session from a different machine, or run multiple tasks in
    parallel」。**本地会话本身仍是随终端结束的**——它是客户端常驻型，
    真后台来自上面这条云端通道。
  tools: >-
    **MCP 是默认带的能力。** 官方 README 原文「the coding agent ships with GitHub's
    MCP server by default and supports custom MCP servers」，并支持 `/mcp add`
    交互式添加、`/mcp search` 浏览 GitHub MCP Registry 直接安装（2026-06-23 changelog）。
    另有官方文档列的扩展面：**Custom instructions、Custom agents（含内置 Explore /
    Task / Code Review / Plan 等专职 agent，可并行）、Hooks、Skills、Plugins**、
    以及 **LSP**（需自行装 language server，配 `~/.copilot/lsp-config.json` 或
    `.github/lsp.json`）。**支持 ACP 接入**（官方概念页有「Use Copilot CLI via ACP」小节，
    changelog 提到 ACP 的 closeSession）。local 会话在 macOS / Windows 还可开
    **computer use** 操作桌面应用。
  context: >-
    **自动压缩 + 会话管理 + 仓库记忆三件套。** 官方原文：会话接近 **95%**
    token 上限时「Copilot automatically compresses your history in the background」，
    以实现「virtually infinite sessions」；也可用 `/compact` 手动压缩、`/context`
    查看 token 占用。回滚方面有 `/rewind`——changelog 写它「no longer requires git
    and restores only the files Copilot changed, skipping any file whose contents
    no longer match what Copilot last wrote」，并可选「conversation-only 或
    conversation + files」。跨会话记忆沿用 **Copilot Memory**（与本分区
    [IDE 条目](./copilot.md) 同一功能，存仓库级约定与偏好）。
  permissions: >-
    **审批是本条目最值得记的一维，颗粒度比 IDE 形态更细。** 首次使用可写/可执行工具时
    给三个选项：官方原文「1. Yes / 2. Yes, and approve TOOL for the rest of the
    running session / 3. No, and tell Copilot what to do differently (Esc)」，
    并明确选项 2 的含义是**本会话内该类命令全部放行**（例：批准 `rm ./this-file.txt`
    后，本会话可跑任意 `rm`）。程序化/无人值守模式有三个开关注：
    `--allow-all-tools`、`--allow-tool`、`--deny-tool`，取值支持
    「`shell(COMMAND)`、`write`、`MCP_SERVER_NAME`」，且 **`--deny-tool` 优先于
    `--allow-tool` / `--allow-all-tools`**。官方对自动批准的警告值得原样记住：
    用了 `--allow-all-tools`「Copilot has the same access as you do to files on your
    computer, and can run any shell commands that you can run, without getting your
    prior approval」，并建议在 VM / 容器 / 无网环境里用自动批准以限制影响面。
    内容排除方面：Business / Enterprise 用户的 CLI「respects content exclusion
    policies configured at the enterprise, organization, and repository levels」。
    企业与组织策略可整体禁用 CLI。
  fit: >-
    已在 GitHub 生态、想在终端把「读仓库 / 改代码 / 跑测试 / 开 PR / 管 Issue」
    一条链走完的人——官方用例直接给了「create a pull request on GitHub.com」这类任务。
    需要**脚本化 / headless**（`copilot -p` 配合审批选项，可进 CI）的人；
    需要 MCP / 插件 / 自定义 agent 生态的人。
    **不适合**：不想付 Copilot 订阅的人（CLI 随订阅，不能单独买）；
    想要「全自动又零风险」的人（自动批准要与隔离环境配套，官方明确提示风险）。

pitfalls:
  - 以为 Copilot CLI 只做补全问答——官方是完整 coding agent（计划/编辑/测试/开 PR）
  - 以为 -p 非交互默认能改文件——需显式加审批选项（如 --allow-tool）
  - 以为信任目录能强隔离——官方说该边界是启发式、不保证

tags: [编程, 终端, 本地, 多模型, 全流程]
related: [github-mcp]

sources:
  - label: GitHub · 关于 GitHub Copilot CLI（模式、审批选项、信任目录、模型与 premium requests）
    url: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli
    kind: docs
  - label: GitHub · Copilot CLI 概念页（沙箱、上下文管理、自定义、内容排除、ACP）
    url: https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli
    kind: docs
  - label: GitHub · GitHub Copilot CLI 快速开始（npm / WinGet / Homebrew 安装、-p 非交互）
    url: https://docs.github.com/en/copilot/get-started/cli-quickstart
    kind: docs
  - label: GitHub · 安装 GitHub Copilot CLI（各平台命令与前置条件）
    url: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli
    kind: docs
  - label: GitHub · Requests in GitHub Copilot（premium requests 与模型倍率）
    url: https://docs.github.com/en/copilot/concepts/billing/copilot-requests
    kind: docs
  - label: GitHub · Copilot CLI 离线 changelog（1.0.93 @ 2026-10-07）
    url: https://github.com/github/copilot-cli/blob/main/changelog.md
    kind: changelog
  - label: GitHub · copilot-cli 官方仓库（README：默认模型、MCP、LSP、PAT 认证）
    url: https://github.com/github/copilot-cli
    kind: repo
  - label: GitHub · Copilot CLI 正式可用（2026-02-25 GA，plan / autopilot / background delegation）
    url: https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/
    kind: changelog
  - label: GitHub · Changelog（Copilot 标签页）
    url: https://github.blog/changelog/label/copilot/
    kind: changelog

link:
  url: https://github.com/github/copilot-cli
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**终端里的 Copilot agent，与 GitHub 订阅同源**——官方 README 说它「Powered by the same agentic harness as GitHub's Copilot coding agent」。它与既有 [GitHub Copilot](./copilot.md)（IDE 形态）是**同一产品的两种装法**，本条目只写 CLI 的差异点：程序化入口、终端级审批、以及按提示词扣 premium requests 的计费方式。

## 与 IDE 形态的差别（只说差异）

| 维度 | IDE 形态（见 ./copilot.md） | CLI 形态（本条目） |
|---|---|---|
| 入口 | 编辑器 / 网站 | 终端 `copilot` |
| 非交互 | 一般无 | **`copilot -p` / `--prompt`**，可进脚本与 CI |
| 审批 | 编辑器模式 | **终端三选项 + `--allow/--deny-tool` 开关** |
| 云端运行面 | 网站 / coding agent | `copilot --cloud` 云沙箱（public preview） |
| 后台委派 | 派 issue / 评论触发 | **前缀 `&` 把任务交给云端 coding agent** |

**共用的部分不重复写**：模型清单、Copilot Memory、Copilot 档案价格、组织策略，均以 [IDE 条目](./copilot.md) 为准。

## 程序化与安装（官方原文）

安装以 npm 包为主，官方前置条件是 `Node.js 22 or later`：

```
npm install -g @github/copilot
```

另有 WinGet（`winget install GitHub.Copilot`）、Homebrew（`brew install --cask copilot-cli`）与安装脚本。认证除 `/login` 外，支持**细粒度 PAT + 「Copilot Requests」权限**，放进 `GH_TOKEN` 或 `GITHUB_TOKEN`。

非交互调用的官方示例：

```
copilot -p "Show me this week's commits and summarize them" --allow-tool='shell(git)'
```

加 `-s` 只输出回答、省去用量信息。

## 权限与审批（本条目最值得记的一维）

三选项审批（官方原文）：

```
1. Yes
2. Yes, and approve TOOL for the rest of the running session
3. No, and tell Copilot what to do differently (Esc)
```

**选项 2 的含义比字面更大**：官方举例，批准 `rm ./this-file.txt` 后，本会话可跑任意 `rm`（如 `rm -rf ./*`）——这是「按工具类别放行」，不是「按这条命令放行」。

无人值守用三个开关，且 **deny 优先**：

| 开关 | 作用 |
|---|---|
| `--allow-all-tools` | 任何工具都不问 |
| `--allow-tool` | 放行指定工具 |
| `--deny-tool` | **禁止指定工具，优先级最高** |

取值支持 `shell(COMMAND)`（可到 `shell(git push)` 这一级）、`write`、`MCP_SERVER_NAME`。官方警告：用 `--allow-all-tools` 时 Copilot 拥有与你相同的本机文件访问与命令执行权、且不再逐条确认；建议在 VM / 容器 / 无网环境里使用以限制影响面。

**信任目录不是强沙箱**：官方明写其边界「is heuristic and GitHub does not guarantee that all files outside trusted directories will be protected」。

## 计费：按提示词扣 premium requests

官方原文：

> Each time you submit a prompt to Copilot CLI, your monthly quota of Copilot
> premium requests is reduced by one.

即**每次提示词各扣 1 次 premium request**，用非默认模型时按模型倍率放大（如 Claude Opus 4.5 为 3x）。Free 档官方写每月最多 50 次 premium requests；付费档的内置模型（GPT-5 mini / GPT-4.1 / GPT-4o）不扣额度。官方并宣布自 2026-06-01 起把 Copilot 从 request-based billing 转为 usage-based billing。档位本身的价格见 [IDE 条目](./copilot.md)。

## 核验说明

`confidence: partial` 的依据：CLI 的运行模式、审批选项、MCP/扩展面、上下文管理、计费单位都已从官方 docs 与官方仓库取到。**剩余缺口主要是「CLI 与各档位的对应边界」**——官方 about 页列 Pro/Pro+/Business/Enterprise，quickstart 页写 all Copilot plans，两处口径不一致，按本站铁律记为「官方未说明」并列出所查页面，不替官方择一。

## 适合与不适合

已在 GitHub 生态、想在终端把「读仓库 → 改代码 → 跑测试 → 开 PR / 管 Issue」一条链走完的人；需要**脚本化 / headless**（`copilot -p` 配审批选项，可进 CI）的人；需要 MCP / 插件 / 自定义 agent 生态的人。

**不适合**不想付 Copilot 订阅的人（CLI 随订阅、不能单独买）；也不适合想「全自动又零风险」的人——自动批准必须与隔离环境配套，官方对此有明确风险提示。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**三选项审批中「本会话放行」的实际影响面**（官方举例说明它会放大到整类命令）与**`copilot -p` 在 CI（无 TTY）下的退出码与输出**；再验证**前缀 `&` 的后台委派**是否真能把任务交给云端并 `/resume` 拉回。

## 未知项清单

- CLI 与各 Copilot 档位的准确对应（Free 是否含 CLI）——官方未说明（已查 about-copilot-cli 与 cli-quickstart 两页，两页口径不一致）
- 云沙箱（`copilot --cloud`）的并发、时长与存储上限（public preview）
- 交互式与 programmatic 两种模式下 premium request 扣减的细化差异
- ACP 接入的完整能力面（官方概念页列有该小节，细则未展开）

## 相关条目

- [GitHub Copilot](./copilot.md) — 同一产品的 IDE 形态；价格档位、模型清单与云端 coding agent 见该条
- [Claude Code CLI](./claude-code-cli.md) — 同为终端编码 agent，权限审批的颗粒度可逐项对照
- [Codex CLI](./codex-cli.md) — 同为终端编码 agent，非交互与沙箱模型不同（Codex 默认工作区沙箱，CLI 默认逐工具审批）