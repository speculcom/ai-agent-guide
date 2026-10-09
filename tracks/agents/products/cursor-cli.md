---
id: cursor-cli
track: cli
name: Cursor CLI
vendor: Anysphere
homepage: https://cursor.com/cli
mark: C
accent: "#111111"

pricing:
  model: freemium
  monthly_usd: 20
  monthly_label: 随 Cursor 账户订阅（Hobby 免费 / Pro $20 / Pro Plus $60 / Ultra $200 每月，Teams $40 起）
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    官方 Models & pricing 页（cursor.com/docs/models-and-pricing，2026-10-08 核实）口径：
    所有个人档都含**两个用量池**——**Auto + Composer 池**（额度显著更多）
    与 **API 池**（按模型 API 价扣减）。个人档月付 Pro $20 / Pro Plus $60 /
    Ultra $200，分别含 $20 / $70 / $400 的 API 用量；Teams $40/用户/月，Enterprise 定制。
    **CLI 不单卖**：用 Cursor 账户（`agent login`）或 `CURSOR_API_KEY`
    （Dashboard → Cloud Agents → User API Keys），用量并入账户同一额度池。
    超出包含额度后可开「按需用量」按同费率后付费，或升档。
    **各档额度倍数未给具体请求数或 token 量。**
pricing_pitfalls:
  - 以为 Cursor CLI 可以脱离 Cursor 账户单独免费使用，实际需登录账户或 API key
  - 以为 CLI 有独立价目，用量其实并入 Cursor 账户的 Auto+Composer / API 两个池
  - 把包含的 API 用量（Pro 为 $20）当成固定座席费，超出后仍按同费率后付费

axes:
  model_access: >-
    **与 Cursor 编辑器同源，模型清单与账户绑定。** 官方 CLI 落地页把可选模型示例
    列为 **Auto、Composer 2、Opus 4.6、Codex 5.3 High Fast、Gemini 3 Pro、Grok**，
    并写「Anthropic、OpenAI、Gemini、Cursor 等提供的前沿模型」；
    模型与价格页另列 Claude 4.6 Opus / Sonnet、Gemini 3.1 Pro、GPT-5.3 Codex、
    GPT-5.4、Grok 4.20 与 Composer 2。切换用 `--model <model>`、`--list-models`、
    `agent models`、`/model`。**企业可用管理策略限制可用模型**：官方 CLI changelog
    原文 "Admin Team model restrictions apply in the CLI"，被限制的模型传给 `--model`
    会带限制信息退出。v2026.09.28 修复了「`--model` 可能静默运行较短基础模型」。
    **与 `./cursor.md` 的差异只在入口**，模型目录不因形态而变。
  runtime: >-
    **本地终端进程**：官方安装脚本装到 `~/.local/bin`（Windows 原生用 PowerShell），
    命令名为 `agent`；默认自动更新，`agent update` 手动升级。
    生命周期主要绑定终端会话，但官方另给多条「脱离终端」路径（见 background）。
    **与 `./cursor.md` 的 IDE 形态对照**：同一账户与配置，差异在交互面是终端、
    可脚本化；且 `agent acp` 能把 CLI 当作 ACP server 跑在 stdio 上供自定义客户端接入。
  local_files: >-
    **在仓库/工作区内操作，并可用 Git worktree 隔离改动。** `--workspace <path>`
    指定工作区，`-w/--worktree [name]` 在 `~/.cursor/worktrees/<reponame>/<name>`
    建新 worktree（与编辑器共用保留规则）。**写盘默认收紧**：官方 headless 页原文
    "Without `--force`, changes are only proposed, not applied"，脚本里要落盘需配
    `--force`（或 `--yolo`）；注意 parameters 页另有
    "Has access to all tools, including write and shell" 的表述，两页口径并存。
    规则读取 `.cursor/rules` 与项目根的 `AGENTS.md`、`CLAUDE.md`；
    读写范围由 permissions 的 `Read(...)` / `Write(...)` 精确控制。
  background: >-
    **终端进程随会话结束，但官方提供三条「脱离终端」路径。**
    一是 Cloud Agent handoff——会话里给消息前加 `&`，官方称
    "continue running while you're away"，可在 web 或移动端 cursor.com/agents 取回；
    二是**持久会话**（v2026.08.26 changelog 原文 "Keep agents running after you
    disconnect"）：`agent persist` 启动、`/detach` 脱离、`agent persist attach` 重连，
    `agent persist list` / `stop` 管理；三是 `agent worker`——官方称启动
    "a private cloud worker that runs agents in your environment"。
    **三条路径各自的执行环境归属与额度限制，官方页面未分别写明。**
  tools: >-
    **内置工具面 + MCP + ACP 三层都已核到。** 官方 using 页原文
    "Agent has tools for file operations, searching, running shell commands, and
    web access"；Shell Mode（`/shell`，`/sh`、`/run` 为别名）在登录 shell 跑命令。
    **MCP**：CLI "automatically detect and respect your `mcp.json`"，
    即 `.cursor/mcp.json` 或 `~/.cursor/mcp.json`，与编辑器共用同一批 server；
    另有 `agent mcp`（`login` / `list` / `list-tools` / `enable` / `disable`）
    与 `--approve-mcps`。**ACP**：`agent acp` 以 stdio + JSON-RPC 对外提供 ACP server。
    扩展机制另有 plugins（`--plugin-dir`、`/plugin`）、skills（可粘成 custom mode）
    与 `.cursor/rules`。
  context: >-
    **会话可恢复、可分叉、有压缩。** 继续会话用 `--resume [chatId]`、`--continue`、
    `agent resume`、`agent ls`、`/resume`；`/fork` 把当前会话分叉成新会话；
    `/rewind` 跳回先前消息；上下文压缩用 `/summarize`（`/compress` 为别名）。
    v2026.09.22 修复「摘要后丢掉最新一条请求或整段会话」——现在会逐字保留最近一条
    用户消息，摘要失败或被中止则保留原会话。长期上下文靠 rules 与 skills：
    `.cursor/rules` 与 `AGENTS.md` / `CLAUDE.md` 自动加载；`/goal` 可给长期目标
    （官方标 "Rolling out"）。**跨会话记忆的存储位置官方未在此页说明。**
  permissions: >-
    **权限设计是本形态最细的一块，另有 sudo 凭据保护。** 配置文件为全局
    `~/.cursor/cli-config.json` 与项目级 `<project>/.cursor/cli.json`，权限 token 分五类：
    `Shell(cmd)`、`Read(path)`、`Write(path)`、`WebFetch(domain)`、`Mcp(server:tool)`，
    用 `permissions.allow` / `permissions.deny` 控制，**deny 优先于 allow**。
    默认下**每条终端命令都要批准**——官方 using 页原文
    "Before running terminal commands, CLI will ask you to approve (y) or reject (n)"；
    `--force`（别名 `--yolo`）放行。沙箱由 `/sandbox` 或 `--sandbox enabled|disabled`
    控制，官方写 disable 时「用 allowlist 模式」。需要 `sudo` 时弹掩码密码框，
    官方称密码经安全 IPC 直达 `sudo`，"The AI model never sees it"。
    CI 侧官方推荐「受限自主 + permission-based restrictions」，并把指令写入
    `permissions.json` 配 Auto-review。
  fit: >-
    在终端里做工程任务、写脚本或进 CI/CD 的人（官方 GitHub Actions 文档与 cookbook）。
    已用 Cursor、希望编辑器与终端共用账户 / 模型 / MCP 配置的人。
    需要把会话交给 Cloud Agent 或持久会话继续跑的人。
    **不适合**要求开源许可的场景——Cursor CLI 是闭源商业产品，
    需 Cursor 账户或 API key，且用量并入账户额度池。

pitfalls:
  - 以为 Cursor CLI 是独立免费工具，实际需 Cursor 账户或 API key，用量并入账户额度池
  - 以为 print 模式会自动落盘，headless 页写不加 --force / --yolo 时只提议不写
  - 以为 Shell Mode 能跑长任务，官方限 30 秒超时且不可配置

tags: [编程, 终端, 多模型, CI, 云端]
related: [filesystem]

sources:
  - label: Cursor · CLI 官方落地页（安装、模型示例、headless 入口）
    url: https://cursor.com/cli
    kind: docs
  - label: Cursor · CLI changelog（v2026.09.28 / 09.22 / 08.26 持久会话，2026-10-08 取到）
    url: https://cursor.com/docs/cli/changelog
    kind: changelog
  - label: Cursor Docs · Cursor CLI 总览（模式、非交互、Cloud Agent handoff、沙箱、sudo）
    url: https://cursor.com/docs/cli/overview
    kind: docs
  - label: Cursor Docs · Headless CLI（print 模式、--force、输出格式、CI 脚本）
    url: https://cursor.com/docs/cli/headless
    kind: docs
  - label: Cursor Docs · GitHub Actions 集成（CURSOR_API_KEY、自主级别、权限限制）
    url: https://cursor.com/docs/cli/github-actions
    kind: docs
  - label: Cursor Docs · CLI Permissions（Shell / Read / Write / WebFetch / Mcp）
    url: https://cursor.com/docs/cli/reference/permissions
    kind: docs
  - label: Cursor Docs · CLI Parameters（全局选项与子命令清单）
    url: https://cursor.com/docs/cli/reference/parameters
    kind: docs
  - label: Cursor Docs · Models & pricing（双用量池与各档含额）
    url: https://cursor.com/docs/models-and-pricing
    kind: docs
  - label: Cursor · 官方定价页
    url: https://cursor.com/pricing
    kind: pricing
  - label: Cursor · 产品 changelog（Projects / 自托管 / Rollouts 等）
    url: https://cursor.com/changelog
    kind: changelog

link:
  url: https://cursor.com/cli
  kind: official

last_verified: 2026-10-08
last_updated: 2026-10-08
lifecycle: active
confidence: partial
---

## 一句话定位

**Cursor 的终端形态，与编辑器共用同一账户、模型与 `mcp.json`**——
官方称它支持「print automation for scripts and CI pipelines」，命令名为 `agent`；
相对 IDE 形态多出 headless 与把会话交给 Cloud Agent / 持久会话两条路径。

## 与 IDE 形态的差异（本条目只写差异）

| 维度 | Cursor（IDE 形态） | Cursor CLI（本条目） |
|---|---|---|
| 交互面 | 图形编辑器 | 终端进程，命令 `agent` |
| 脚本化 | 无原生非交互入口 | `-p / --print` + `--output-format text\|json\|stream-json` |
| CI | — | 官方 GitHub Actions 文档与 cookbook |
| 接入编辑器 | 就是编辑器 | `agent acp` 以 ACP server（stdio + JSON-RPC）对外 |
| 共用项 | 账户、模型、`mcp.json`、`.cursor/rules`、额度池 | 同 |

**同一产品的两种装法**：模型目录与额度池不因形态而变，
差别在交互面与可脚本化程度。详见 [Cursor](./cursor.md)（IDE 形态）。

## headless / 非交互（本赛道的关键点）

官方 headless 页给出完整脚本口径：

- 单次执行：`agent -p "..."`，官方原文 "Use print mode (`-p, --print`) for
  non-interactive scripting and automation"
- 落盘：官方写 "Without `--force`, changes are only proposed, not applied"，
  批量改文件需 `--force`（别名 `--yolo`）
- 输出：`--output-format text | json | stream-json`，配 `--stream-partial-output`
  做增量流；示例脚本用 `jq` 解析 `tool_call` 事件
- 鉴权：`export CURSOR_API_KEY=...`（CI 里存为仓库/组织 secret）
- 信任：`--trust` 在 headless 下免交互信任工作区

CI 侧官方区分两种自主级别，并**推荐生产用「受限自主」**：
把提交、推送、评论交给确定性的 CI 步骤，agent 只改文件；
再用 `permissions.allow` / `deny` 在 CLI 层强约束。

## 权限与沙箱

权限 token 五类写在 `~/.cursor/cli-config.json`（全局）或
`<project>/.cursor/cli.json`（项目级），**deny 优先于 allow**：

| token | 例子 |
|---|---|
| `Shell(cmd)` | `Shell(git)` 允许、`Shell(rm)` 拒绝 |
| `Read(path)` | `Read(**/*.md)`，`Read(.env*)` 拒绝 |
| `Write(path)` | `Write(src/**)`，`Write(**/*.key)` 拒绝 |
| `WebFetch(domain)` | 未列入 allow 的每次抓取都要批准 |
| `Mcp(server:tool)` | `Mcp(datadog:*)`、`Mcp(*:*)` |

**交互默认每条终端命令都要批准**；沙箱用 `/sandbox` 或 `--sandbox enabled|disabled`
切换，disable 时退化为 allowlist 模式。需要 `sudo` 时，官方称密码经安全 IPC 直达
`sudo`，**模型看不到明文**。

## 变更记录要点（官方 CLI changelog）

| 版本 | 关键改动 |
|---|---|
| `v2026.09.28` | `--model` / `/model` 现在运行你所选的精确模型（此前可能静默跑较短基础模型） |
| `v2026.09.22` | Auto-review：按 `permissions.json` 里的指令判断 MCP 调用该放行还是拦；修复摘要丢请求 |
| `v2026.08.26` | **持久会话**：`agent persist` 让 agent 在断开后继续跑；团队模型限制在 CLI 生效 |

官方明确有独立的 **Cursor CLI changelog** 页（与 IDE / Agents Window / SDK 分栏），
`agent --version` 查版本、`agent update` 原地升级。

## 核验说明

本条目标 `confidence: partial`：能力与权限面证据充分（官方 CLI 文档 + 独立 changelog 页 +
定价与模型页均已取到正文），但仍有两处结构性缺口，故不标 `verified`。

本轮核到的官方页：CLI 落地页（cursor.com/cli）、CLI changelog、
CLI Overview / Headless / GitHub Actions、CLI Permissions 与 Parameters 参考、
Models & pricing、官方定价页与产品 changelog。

## 适合与不适合

在终端里做工程任务、写脚本、进 CI/CD 的人——官方给了 GitHub Actions 与 cookbook。
已用 Cursor、希望编辑器与终端共用同一份账户、模型与 MCP 配置的人。
需要把会话交给 Cloud Agent 或持久会话继续跑的人。

**不适合**要求开源许可或完全自托管的场景——
Cursor CLI 是闭源商业产品，需 Cursor 账户或 API key，用量并入账户额度池。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**非交互模式下「不落盘 / 落盘」的实际行为**——
官方两页（headless 与 parameters）对 `--print` 写权限的表述并不完全一致，
这是最值得用一条真实 CI 流程验证的地方；其次测**持久会话 `agent persist`
在断开网络后的续跑一致性**。

## 未知项清单

- 三条「脱离终端」路径（`&` Cloud Agent handoff / `agent persist` / `agent worker`）各自执行环境归属与额度限制 —— 官方未说明（已查 CLI Overview、CLI changelog 与 About 页）
- 沙箱在 Windows 原生下的底层实现（容器还是进程级）—— 官方未说明（已查 CLI Overview 与 Permissions 两页）
- CLI 与编辑器是否共用同一额度池 —— 官方页面按账户整体说明额度，未按形态拆分
- 各档额度倍数（1x / 3x / 20x 之类）对应的具体请求数或 token 量

## 相关条目

- [Cursor](./cursor.md) — 同一产品的 IDE 形态；账户、模型目录、`mcp.json` 与规则共用，差异在运行面与审批默认值
- [Claude Code CLI](./claude-code-cli.md) — 同为终端编码 agent，权限颗粒度与云端会话机制值得对照
- [Codex CLI](./codex-cli.md) — 同为厂商官方 CLI，非交互模式与沙箱档位可并排比较