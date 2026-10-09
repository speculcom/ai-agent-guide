---
id: github-mcp
track: mcp
name: GitHub MCP Server
vendor: GitHub
homepage: https://github.com/github/github-mcp-server
mark: GH
accent: "#181717"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 无商业费用（MIT）
  annual_usd: null
  annual_label: 无商业费用（MIT）
  note: >-
    GitHub 官方仓库，MIT 许可（经 GitHub license API 核验 2026-10-08），无授权费。
    本地形态（Docker 镜像 ghcr.io/github/github-mcp-server）与远程托管形态（api.githubcopilot.com/mcp/）
    均不单独收费；实际成本来自使用的 GitHub 账号本身（私有仓库 / Copilot / Actions 等按其各自计费），
    以及你自行部署 HTTP 模式的机器成本。
pricing_pitfalls:
  - 以为远程托管形态要单独付费——远程 server 由 GitHub 托管，成本体现在 GitHub 账号与 Copilot 侧
  - 以为本地 Docker 形态不含 GitHub 账号成本——API 调用仍走你的 token 与账号额度

axes:
  model_access: >-
    本身不调用模型，是被客户端调用的接口实现。它把 GitHub 平台能力（仓库、issue、PR、Actions、
    code scanning 等）以 MCP 工具形式暴露给任意 MCP 客户端；
    工具 schema 在协议版本 `2026-07-28` 及以后返回带类型化 `structuredContent` 的输出，老客户端退回纯文本。
    官方在 README 明说工具描述可用 `github-mcp-server-config.json` 或 `GITHUB_MCP_*` 环境变量覆写，
    便于本地化；这与「接什么模型」无关，模型选择在客户端侧。
  runtime: >-
    **两种运行形态。** 远程托管形态由 GitHub 运营（`https://api.githubcopilot.com/mcp/`），
    官方称「the easiest method for getting up and running」「no local setup or runtime required」；
    本地形态是本地进程，官方给 Docker（`ghcr.io/github/github-mcp-server`）、`go build` 二进制、
    以及自带 HTTP 模式（`github-mcp-server http`，默认端口 8082）。
    **注意 GitHub Enterprise Server 不支持远程托管**（官方明写），只能用本地形态；ghe.com 走远程但有独立端点。
  local_files: >-
    **不访问本机文件系统**——它操作的是 GitHub 平台（远程仓库、issue、PR 等），
    与本地 git 仓库无直接关系（本地 git 操作见本站 git 条目）。
    唯一贴近「文件」的能力是**操作远端仓库内容**：`get_file_contents` 读文件/目录、
    `create_or_update_file` 与 `push_files` 写文件、`delete_file` 删文件，作用域是 GitHub 上的 repo/branch。
    容器形态下也无需挂载本地仓库。
  background: >-
    **远程托管形态与客户端进程生命周期无关**（服务在 GitHub 侧，关机后仍在线）；
    **本地形态随客户端生死**（stdio 子进程退出即停止）。自托管 HTTP 模式则是你运营的常驻服务，
    可用 `github-mcp-server http` 配合反向代理部署。
    **不提供「后台任务续跑」语义**——它的模式是有状态 HTTP / stdio 会话，没有官方断点续跑机制；
    但有持续可用性的是远程托管形态。可用性依赖 GitHub 侧服务状态。
  tools: >-
    **工具集（toolsets）是本条目的核心机制。** 官方支持用 `--toolsets` / `GITHUB_TOOLSETS`
    （远程用 `X-MCP-Toolsets` 头或 `/x/{toolset}` URL）裁剪可用能力，
    还能用 `--tools` / `GITHUB_TOOLS` 精确到单个工具、用 `--exclude-tools` 排除工具。
    **默认工具集**是 context / repos / issues / pull_requests / users；另有 actions、code_security、
    dependabot、discussions、gists、git、governance、labels、notifications、orgs、projects、
    secret_protection、security_advisories、stargazers、code_quality、copilot 等，共 20+ 组；
    远程形态另有 Copilot Spaces、GitHub Support Docs Search 等专属工具集。
    远程工具集随「每个 toolset 一个 URL」暴露，官方称便于按场景组合。
  context: >-
    **无跨会话记忆**。每一次会话独立，状态体现在 GitHub 平台本身（仓库、issue、PR 的持久状态），
    而不在 server 内。**但有一条官方特有的上下文控制**：Insiders 模式下 `list_*` 工具可返回 CSV
    以压缩列表类响应（`csv_output` 特性标志），目的是「reduce response context for agents」；
    这属于响应格式优化，不是记忆机制。README 未提供任何内建记忆 / 检索层。
  permissions: >-
    **权限由 GitHub token 决定，且官方给了三层收紧手段。**
    ① **read-only 模式**（`--read-only` / `GITHUB_READ_ONLY` / `X-MCP-Readonly`）：官方称它是
    「strict security filter」，优先级最高——即使显式请求写工具也会被禁用。
    ② **lockdown 模式**（`--lockdown-mode` / `X-MCP-Lockdown`）：仅过滤公开仓库中无 push 权限用户产出的内容，
    官方**明确它只是 best-effort 内容过滤器、不是授权边界**，不能限制凭据本身能读写什么。
    ③ **scope filtering**：经典 PAT 启动时按 token scope 隐藏无权限工具；OAuth 走按需 scope challenge。
    **能做写与删除**（create/update/delete file、push_files、merge_pull_request、create_repository、
    delete_repository 等），高危工具需按需授权（如 `delete_repo`）。
  fit: >-
    让任意 MCP 客户端（VS Code / Claude Desktop / Cursor / Windsurf / Codex / Gemini CLI 等）
    用自然语言操作 GitHub：读代码与仓库结构、管 issue 与 PR、监控 Actions、查 code scanning /
    dependabot 安全告警、读通知。**远程托管形态适合「不想自己运维」的用户**；
    **本地 Docker 形态适合 GitHub Enterprise Server、需要自托管 HTTP 或要离线可控的用户**。
    不适合需要本地文件系统操作（那是 filesystem / git server 的活）或需要跨会话记忆的场景。

pitfalls:
  - 误以为它是已归档的旧 MCP 组织参考 server——那是 servers-archived 里的 github server，本 server 是 GitHub 官方活跃产品线
  - 把 lockdown 模式当安全边界——官方明文它只是 best-effort 内容过滤，不改变凭据能读写什么
  - 以为 read-only 只是默认值——它是强制过滤：即使显式 --tools 请求写工具也会被禁用

mcp:
  transport: >-
    **双形态。** 本地形态走 **stdio**（Docker `ghcr.io/github/github-mcp-server` 或 `github-mcp-server stdio` 二进制）；
    远程托管形态走 **Streamable HTTP**，端点为 `https://api.githubcopilot.com/mcp/`
    （官方 README 与 remote-server.md 核验 2026-10-08）。
    另可自托管 HTTP 模式（`github-mcp-server http`，支持 OAuth 元数据端点与 scope challenge）。
    远程形态还支持 URL 路径修饰（`/readonly`、`/insiders`、`/x/{toolset}`）与二者组合。
    多形态权限边界不同，须分别配置。
  auth: >-
    **本地 stdio**：可走浏览器 OAuth（github.com 上官方镜像自带 app 凭据，token 仅存内存），
    或 **PAT**（`GITHUB_PERSONAL_ACCESS_TOKEN`，**优先于 OAuth**）；另有 GitHub App 认证用于非交互式 stdio。
    **远程托管**：OAuth（用 GitHub 凭据，缺 scope 时按需 scope challenge）或 PAT（`Authorization: Bearer`）。
    **细粒度 PAT（github_pat_）不做 scope 过滤**——所有工具都显示，权限由 API 侧强制；
    经典 PAT（ghp_）才在启动时按 scope 隐藏工具。GitHub Enterprise Server / ghe.com 需自带 OAuth App 或 GitHub App。
  scope: >-
    **作用域 = GitHub token 的权限范围，能读也能写和删。**
    可收紧：read-only 模式强制只读（优先级最高）；toolsets 裁剪可减少暴露面；lockdown 模式过滤不可信内容
    （但官方强调它不是授权边界）。**写 / 删除能力齐全**：`create_or_update_file`、`push_files`、`delete_file`、
    `create_repository`、`delete_repository`（需 `delete_repo`）、`merge_pull_request`、
    `create_pull_request`、`label_write`、`projects_write`、`create_repository_ruleset` 等。
    无独立审批机制（`delete_repository` 走多轮确认，属交互式 elicitation 而非审批层）。

tags: [版本控制, API, 读写, 远程, 本地, 多平台]
related: [copilot]

sources:
  - label: github/github-mcp-server · 仓库（33,446★，MIT，核验 2026-10-08）
    url: https://github.com/github/github-mcp-server
    kind: repo
  - label: 主 README（远程/本地两形态、toolsets 全表、read-only / lockdown、i18n 覆写、认证）
    url: https://github.com/github/github-mcp-server/blob/main/README.md
    kind: docs
  - label: Remote Server 文档（远程端点 api.githubcopilot.com/mcp/、URL 路径修饰、X-MCP-* 头）
    url: https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md
    kind: docs
  - label: Server Configuration 指南（toolsets / tools / exclude / read-only / lockdown / insiders / scope filtering 的配置矩阵）
    url: https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md
    kind: docs
  - label: PAT Scope Filtering（经典 PAT 按 scope 隐藏工具、OAuth scope challenge、细粒度 PAT 不过滤）
    url: https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md
    kind: docs
  - label: Streamable HTTP Server（自托管 HTTP 模式、OAuth 元数据端点、scope challenge）
    url: https://github.com/github/github-mcp-server/blob/main/docs/streamable-http.md
    kind: docs
  - label: Insiders Features（CSV 输出压缩列表响应、实验特性标志）
    url: https://github.com/github/github-mcp-server/blob/main/docs/insiders-features.md
    kind: docs
  - label: Releases（最新 v2.0.2 @ 2026-10-08）
    url: https://github.com/github/github-mcp-server/releases
    kind: changelog

link:
  url: https://github.com/github/github-mcp-server
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**GitHub 官方自己的 MCP server**（仓库自述 "GitHub's official MCP Server"），
以**本地 Docker + 远程托管两形态**把 GitHub 平台能力暴露给任意 MCP 客户端。

## ⚠ 先澄清一个最容易搞混的点

它**不是** MCP 组织那个已归档的参考 server。原 `github` reference server 已归档至
[servers-archived](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/github)，
而本条目指的是 **GitHub 官方仓库 `github/github-mcp-server`**——
活跃维护（核验 2026-10-08 当天仍有发布 v2.0.2）、MIT、33k+ 星。

> 修这条的理由很直接：两条目同名，搜「github mcp server」会同时命中「已归档的参考实现」与
> 「GitHub 官方活跃产品」，而它们的能力与维护状态完全不同。

## 两种形态

| | **远程托管** | **本地** |
|---|---|---|
| 端点 / 命令 | `https://api.githubcopilot.com/mcp/` | Docker `ghcr.io/github/github-mcp-server` / `github-mcp-server stdio` |
| 传输 | Streamable HTTP | stdio |
| 谁运维 | GitHub | 你 |
| 认证 | OAuth / PAT | OAuth（浏览器，token 仅内存）/ PAT |
| 前提 | 客户端支持远程 MCP | Docker 或 Go 二进制 |
| GHES | **不支持** | 支持（`--gh-host` / `GITHUB_HOST`） |

官方对远程形态的定位原话：**"the easiest method for getting up and running"**、
**"no local setup or runtime required"**；本地形态是给不支持远程的客户端 / GHES 用的后备。

## Toolsets：本 server 最值得讲的设计

**默认只加载 5 组**（context / repos / issues / pull_requests / users），
其余要显式开启——官方理由是「帮 LLM 做工具选择、减小上下文」。配置四件套：

- `--toolsets` / `GITHUB_TOOLSETS`（远程：`X-MCP-Toolsets` 头 或 `/x/{toolset}` URL）
- `--tools` / `GITHUB_TOOLS`（精确到单个工具）
- `--exclude-tools` / `GITHUB_EXCLUDE_TOOLS`（排除，优先级高于前两者）
- `all` 特殊值开全部工具集

**远程与本地工具集不完全相同**：远程额外有 Copilot Spaces、GitHub Support Docs Search，
以及调用 Copilot coding agent 的 `create_pull_request_with_copilot` 工具。

## read-only 与 lockdown：两个容易高估的开关

| 模式 | 开关 | 官方定性 |
|---|---|---|
| **read-only** | `--read-only` / `X-MCP-Readonly` | **strict security filter**，优先级最高，显式请求写工具也禁用 |
| **lockdown** | `--lockdown-mode` / `X-MCP-Lockdown` | **best-effort 内容过滤，不是授权边界** |

lockdown 的边界官方写得很实：它只减少**公开仓库里无 push 权限用户产出内容**的 prompt injection 风险，
**不改变底层凭据能读写什么**，被过滤响应里隐藏的内容仍可能通过其他工具或直接调 GitHub API 拿到
（`github-actions[bot]` 与 `copilot` 是例外，始终视为可信）。

## 认证与权限：token 决定一切

- **经典 PAT（`ghp_`）**：启动时按 `X-OAuth-Scopes` **隐藏**无权限工具。
- **OAuth（远程）**：不预隐藏，改用 **scope challenge**——用到缺 scope 的工具时按需提示授权。
- **细粒度 PAT（`github_pat_`）/ GitHub App**：**不做工具过滤**，全量显示，权限由 GitHub API 侧强制。

官方给的凭据最佳实践：最小 scope（`repo` / `read:packages` / `read:org`）、按环境分 token、
定期轮换、别硬编码（部分宿主如 Windsurf 只能硬编码，官方也点出了这个例外）。

## 适合与不适合

让 MCP 客户端用自然语言操作 GitHub：读代码与仓库结构、管 issue / PR、盯 Actions、
查 code scanning 与 dependabot 告警、读通知。**不想自己运维就选远程托管形态**；
**GHES / 要自托管 HTTP / 要离线可控就选本地形态**。

**不适合**需要本地文件系统操作（那是 filesystem / git server 的职责），
也需要跨会话记忆或后台续跑的场景。

## 核验说明

`confidence: partial` 的依据（2026-10-08）：

八维与 mcp 三维均给出结论，但有两处**官方文档本身没有内容**，只能落「官方未说明」：
所谓「动态工具发现」在当前官方文档中查不到（见未知项），以及工具级审批机制官方未提供。
这些都非取证缺口，而是官方当前未提供，故不足以升到 verified。

**本轮核到的官方页**：README（两形态、toolsets 全表、认证、read-only / lockdown、i18n 覆写）、
docs/remote-server.md（端点、URL 修饰、X-MCP-* 头）、docs/server-configuration.md、
docs/scope-filtering.md、docs/streamable-http.md、docs/insiders-features.md、docs/feature-flags.md；
仓库元数据经 GitHub API 核验（33,446★、MIT、语言 Go、最近推送 2026-10-08、最新版 v2.0.2）。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个 server 的实测重点是「收得住吗」——

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | 只开 `repos` 工具集 + read-only，写工具是否真被禁 | 官方称 read-only 优先级最高，需验证 |
| 2 | lockdown 下，无权用户 issue 内容是否真被过滤 | 官方已声明它不是安全边界，验证实际强度 |
| 3 | 经典 PAT vs 细粒度 PAT 的工具可见性差异 | 官方说细粒度 PAT 不做 scope 过滤，易被误判为「权限一致」 |
| 4 | 远程托管与本地 Docker 的工具集差异（Copilot 专属工具） | 两形态工具面不同，选型前要确认 |
| 5 | `delete_repository` 多轮确认在 HTTP 模式下的前置条件 | 需配置 `GITHUB_MCP_SERVER_MRTR_STATE_KEY`，否则不暴露 |

## 未知项清单

- 「动态工具发现」能力（`--dynamic-toolsets` 一类）：**官方当前 README 与 docs 未说明**（已查 README、server-configuration.md、remote-server.md、insiders-features.md、feature-flags.md、streamable-http.md、scope-filtering.md 七页）；现有运行时可调机制只有 Feature Flags（`--features` / `X-MCP-Features`）与 Insiders 模式
- 工具级人工审批机制（官方未说明；官方只有 read-only / lockdown / OAuth 挑战三类收紧手段）
- Hosted 形态的 SLA / 限流细则（README 与 remote-server.md 未给数字）
- lockdown 在各工具上的完整过滤矩阵（官方只列了 issue_read / pull_request_read 下几支）
- 自托管 HTTP 模式在反向代理下的配额与运维细节（官方给配置项，未给容量数字）

## 相关条目

- [Git MCP Server](./git.md) — **最该对照的一条**：git server 只做**本地**仓库操作、不含 push/PR，并明确提到原 github 参考 server 已归档；本条目正是那个「远程 GitHub 操作」的官方替代。
- [Filesystem MCP Server](./filesystem.md) — 作用域/权限设计对照：filesystem 是本地目录白名单，github-mcp 是远端 GitHub token 作用域。
- [Context7](./context7.md) — 同赛道对照：Context7 是纯远程托管、无本地权限风险；github-mcp 是「本地 + 远程」双形态且具完整写/删能力。