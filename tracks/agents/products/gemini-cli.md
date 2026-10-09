---
id: gemini-cli
track: cli
name: Gemini CLI
vendor: Google
homepage: https://github.com/google-gemini/gemini-cli
mark: G
accent: "#4285F4"

pricing:
  model: freemium
  monthly_usd: 0
  monthly_label: 个人层免费（无需信用卡），Code Assist 个人版 6,000 代码请求/日 + 240 对话/日
  annual_usd: null
  annual_label: 个人层无年付（免费）；Google Developer Program Premium 为 $299/年
  note: >-
    Apache-2.0 开源，支持 npx 直接运行无需安装。
    **2026-10-01 按官方 quotas 文档核实额度（此前记为未知）**：
    免费层「Gemini Code Assist for individuals」**无需信用卡**，额度为
    **每天 6,000 次代码相关请求**（代码生成与补全）+ **每天 240 次对话请求**；
    每用户**每秒 2 次请求**。
    **最关键的一条机制（直接影响选型）：CLI 与代理模式额度合并计算**——
    官方原文「Quotas for requests from Gemini Code Assist agent mode and Gemini CLI are combined」，
    且「一个提示可能产生多个模型请求」，额度按**与任意模型版本或系列（Pro、Flash）的全部互动次数累计**，
    跨模型不分开计算。达到上限后须等配额重置才能继续。
    付费层：Gemini Code Assist Standard **1,500 请求/用户/日**、Enterprise **2,000**；
    云端版另给 960 次/日的 Cloud Assist 面板请求。个体开发者可订阅
    Google AI Pro / AI Ultra / Developer Program premium 以提高上限。
    Gemini CLI on GitHub 的用量**不计入常规额度**（独立配额，PR 审查每天至少 100 次）。
pricing_pitfalls:
  - 以为开源就无限用 —— 免费层有明确日额度（6,000 代码请求 + 240 对话）
  - **以为换更小的模型（Flash）能用得更久 —— 额度跨模型版本/系列累计，不分开计算**
  - 以为 CLI 和 IDE 代理模式各有一份额度 —— 官方明确两者合并计算

axes:
  model_access: >-
    Google 自家 **Gemini 系列**，明确 **1M token 上下文**（README 首屏原文
    "Powerful Gemini 3 models: Access to improved reasoning and 1M token
    context window"）。
    **可换模型**：命令行 `gemini -m gemini-2.5-flash` 指定模型；
    用 Gemini API Key 登录时官方描述为 "Model selection: Choose specific
    Gemini models"。
    **三种接入方式**（README「Authentication Options」）：
    ① Google 账号 OAuth 登录（免费层，60 请求/分、1,000 请求/日，无需管 key）；
    ② Gemini API Key（AI Studio 取 key，按量计费）；
    ③ Vertex AI（企业，需项目与区域）。
    **模型路由**：Plan Mode 可 `general.plan.modelRouting` 在 Pro（规划）与
    Flash（实现）间自动切换；另有实验性 Local Model Routing（Gemma）。
    **CLI 侧可切换模型的具体清单与版本映射，官方 README 未给出完整列表**
    （已查 README 与 reference/configuration 页）。
  runtime: >-
    本地进程，在终端运行。
    **README 强调「Using npx (no installation required)」——
    npx 免安装形态降低了上手门槛。**
  local_files: >-
    **内置文件工具默认以工作区为根，边界明确**（官方「File system tools」页
    原文：All file system tools operate within a `rootDirectory` (the current
    working directory or workspace root) for security）。
    工具集：`list_directory`、`read_file`（支持文本/图片/音频/PDF）、
    `write_file`、`replace`、`glob`、`grep_search`；
    其中 `write_file` 与 `replace` 官方标注 "Requires manual user approval"。
    **扩目录**：启动用 `gemini --include-directories ../lib,../docs`，
    会话内可用 `/directory add <path>`（受限沙箱配置下禁用）。
    **忽略边界**：遵守 `.gitignore`，并支持同语法的 `.geminiignore`。
    **改动可回退**：批准改文件的工具时，在
    `~/.gemini/history/<project_hash>` 的 shadow Git 仓库做一次快照，
    不干扰你自己的项目仓库，可用 `/restore` 回退（详见 checkpointing）。
    **语义索引（Code Customization / RAG）的算法与大仓库耗时，官方未说明**
    （已查 file-system 与 configuration 页，仅有 `general.logRagSnippets`
    这类调试开关）。
  background: >-
    **本地 CLI，不支持关机续跑。**
    **非交互/headless 是脚本化，不是后台**：官方「Headless mode」页原文
    "Headless mode provides a programmatic interface to Gemini CLI... without
    an interactive terminal UI"，由非 TTY 或 `-p/--prompt` 触发，
    可输出 JSON 或 stream-json，供 CI 与自动化调用——**仍跑在你自己的机器上**。
    **执行环境归你**：官方无厂商托管的常驻执行环境；
    README 的 GitHub Action 也是在你仓库的 CI runner 上跑。
    **中断可恢复**：checkpointing（`general.checkpointing.enabled`）与
    `/chat save` / `/resume` 可保存与恢复会话；
    `general.sessionRetention` 默认保留 30 天、超期自动清理。
    **额度**即 pricing 轴里的每日请求上限，无另设的云端额度。
  tools: >-
    **明确支持 MCP**（README 标注「🔌 Extensible: MCP support for custom」），
    并给出独立文档页 `/docs/tools/mcp-server`。
    README 举例说明可用 MCP 接入图像生成能力（Imagen / Veo / Lyria）。
    内置工具还包括 **Google Search grounding**（搜索接地）与 **shell**。
    **另明确支持非交互模式用于脚本自动化**
    （README 有独立的「Non-interactive mode for scripts」章节）。
  context: >-
    **1M token 上下文 + GEMINI.md 分层上下文 + 自动历史压缩，三项都有官页。**
    **上下文窗口**：README 首屏写 Gemini 3 models with 1M token context window。
    **上下文层级**（官方「GEMINI.md」页）：① 全局 `~/.gemini/GEMINI.md`；
    ② 工作区目录及其父目录的 `GEMINI.md`；
    ③ JIT——工具访问某目录时扫描其与祖先目录的 `GEMINI.md`（至 trusted root）；
    文件名可由 `context.fileName` 改（如 AGENTS.md/CONTEXT.md）；
    支持 `@file.md` 导入；`/memory show` 与 `/memory reload` 可查看与重载。
    **压缩策略已核到**（官方 core 页「Chat history compression」）：
    "When a conversation approaches the token limit... the core automatically
    compresses the conversation history"；阈值由 `model.compressionThreshold`
    控制（默认 0.5）；也可 `/compress` 手动把整个上下文替换为摘要。
    **跨会话记忆**：官方 Memory 工具把持久事实写进 `GEMINI.md`（项目/全局两级），
    随分层上下文注入后续会话；token caching 仅 API key / Vertex 用户可用。
  permissions: >-
    **沙箱、审批、信任目录三层官方都有专页，是本赛道权限面写得最细的一条。**
    **沙箱**（「Sandboxing」页）：`-s/--sandbox`、`GEMINI_SANDBOX` 或
    `tools.sandbox` 启用；方式含 macOS Seatbelt（默认档 `permissive-open`：
    默认拒绝、写限项目目录但允许读与网络）、Docker/Podman、Windows 原生、
    gVisor/runsc、LXC/LXD（实验）。工具级另有 `security.toolSandboxing`。
    **沙箱扩张**：命令因权限受限失败时弹 "Sandbox Expansion Request"，
    逐次批准临时放宽；越界目录可用 `SANDBOX_MOUNTS` 挂载。
    **审批模式**（configuration 页）：`general.defaultApprovalMode` 有
    `default`（逐次询问）、`auto_edit`、`plan`（只读）；
    `--yolo`（全部自动批准）只能在命令行开。
    **策略引擎**（「Policy engine」页）：`~/.gemini/policies/*.toml` 用规则定义
    `allow` / `deny` / `ask_user`，可按工具名、参数、审批模式与交互/非交互
    环境匹配；分 Default/Extension/User/Admin 层级，Admin 可强制覆盖。
    **Trusted Folders**（默认关闭，`security.folderTrust.enabled`）：
    未信任时进 safe mode——忽略工作区 `.gemini/settings.json` 与 `.env`、
    禁用工具自动接受、不连 MCP、不加载自定义命令；
    CI 可用 `--skip-trust` 或 `GEMINI_CLI_TRUST_WORKSPACE=true` 绕过。
    configuration 页另有环境变量脱敏一节。
  fit: >-
    需要无安装快速试用、需要 MCP 扩展、需要脚本化非交互运行的场景。
    尤其适合想把 Gemini 的多模态生成能力接进 Agent 工作流的场景。

pitfalls:
  - 以为开源就无限用 —— 免费层有明确日额度（6,000 代码请求 + 240 对话/日）
  - 以为 npx 形态会污染本地环境，实际是免安装的临时运行
  - 忽略 MCP 能力，README 明确把它列为可扩展特性

tags: [编程, 终端, 本地, 开源]
related: [google-adk]

sources:
  - label: Google · Gemini CLI 仓库 README
    url: https://github.com/google-gemini/gemini-cli
    kind: repo
  - label: Google · Gemini CLI Releases
    url: https://github.com/google-gemini/gemini-cli/releases
    kind: changelog
  - label: Google · Gemini CLI 官方文档
    url: https://google-gemini.github.io/gemini-cli/
    kind: docs
  - label: 官方文档 · Sandboxing（-s/GEMINI_SANDBOX、Seatbelt 默认档 permissive-open、
    Docker/Podman/Windows/gVisor/LXC、toolSandboxing、Sandbox Expansion）
    url: https://www.geminicli.com/docs/cli/sandbox
    kind: docs
  - label: 官方文档 · Trusted Folders（默认关闭、safe mode 禁项、--skip-trust、
    GEMINI_CLI_TRUST_WORKSPACE）
    url: https://www.geminicli.com/docs/cli/trusted-folders
    kind: docs
  - label: 官方文档 · Policy Engine（~/.gemini/policies/*.toml、
    allow/deny/ask_user 层级）
    url: https://www.geminicli.com/docs/reference/policy-engine
    kind: docs
  - label: 官方文档 · GEMINI.md（三层上下文层级、@file.md 导入、context.fileName、/memory）
    url: https://www.geminicli.com/docs/cli/gemini-md
    kind: docs
  - label: 官方文档 · Core（Chat history compression：自动压缩、model.compressionThreshold）
    url: https://www.geminicli.com/docs/core
    kind: docs
  - label: 官方文档 · Headless mode（-p/--prompt、JSON / stream-json、退出码）
    url: https://www.geminicli.com/docs/cli/headless
    kind: docs
  - label: 官方文档 · Checkpointing（改文件工具批准时 shadow Git 快照、/restore、默认关闭）
    url: https://www.geminicli.com/docs/cli/checkpointing
    kind: docs
  - label: 官方文档 · File system tools（工具集、rootDirectory 边界、write/replace 需批准）
    url: https://www.geminicli.com/docs/tools/file-system
    kind: docs
  - label: 官方文档 · Memory files（持久事实写入 GEMINI.md 分项目/全局两级）
    url: https://www.geminicli.com/docs/tools/memory
    kind: docs
  - label: 官方文档 · Ignoring files（.geminiignore）
    url: https://www.geminicli.com/docs/cli/gemini-ignore
    kind: docs
  - label: 官方文档 · Token caching（仅 API key / Vertex 用户可用）
    url: https://www.geminicli.com/docs/cli/token-caching
    kind: docs
  - label: 官方文档 · Configuration（approval mode、sandbox、checkpointing、
    sessionRetention、context.fileName、RAG 日志开关）
    url: https://www.geminicli.com/docs/reference/configuration
    kind: docs
  - label: Google · Gemini CLI MCP Server 文档
    url: https://www.geminicli.com/docs/tools/mcp-server
    kind: docs

link:
  url: https://github.com/google-gemini/gemini-cli
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

Google 官方的开源终端 agent，**npx 免安装 + 明确 MCP 支持 + 非交互脚本模式**，是三者里工程化最完整的。

## 变更记录说明

| 版本 | 日期 |
|---|---|
| `v0.63.0-nightly.20260929.gfe6350238` | 2026-09-29 |

**注意版本形态**：发布的是 `nightly` 标签带 commit hash，
说明该项目采用 nightly 滚动发布。**引用版本号时要完整写，不要简写为 v0.63.0**——
nightly 的补丁内容每天不同。

## 三个明确的工程化能力

### ① npx 免安装

```
Using npx (no installation required)
```

**这是降低使用门槛的设计**，适合快速试用或临时使用，
不会在本地留下安装痕迹。

### ② MCP 支持是官方标注的核心特性

README 直接用 🔌 标记：

```
🔌 Extensible: MCP (Model Context Protocol) support for custom capabilities
```

并且举了具体例子：
> Use MCP servers to connect new capabilities, including media generation with Imagen, Veo or Lyria

**这条例子很有价值**——它说明 Gemini CLI 的 MCP 不只是接工具，
还可以用来**接入 Google 的多模态生成能力**（图像 / 视频 / 音频）。
这是其他 CLI 工具没在 README 里强调的用法。

**官方文档有独立页面**：`/docs/tools/mcp-server`

### ③ 非交互模式

README 有独立章节 **"Non-interactive mode for scripts"**，
定位是 **workflow automation**。

**这是三个 CLI 工具里唯一在 README 首屏就明确标出非交互能力的**——
CI 集成友好度的信号。

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库、许可（Apache-2.0）、版本形态与日期、star 数（107,180）、MCP 支持及文档页、
  非交互模式、npx 安装方式、MCP 接入多模态生成的官方举例；**A6.2 本轮补**：
  额度政策（Code Assist individuals 6,000/240 等）、三种接入方式与 `-m` 换模型、
  GEMINI.md 三层上下文与自动历史压缩、沙箱/审批/信任目录/策略引擎权限机制
- ❌ 未核验：CLI 侧可切换模型的完整清单与版本映射（官方 README 未列全）、
  语义索引（RAG）算法与大仓库耗时（官方未说明）

## 适合与不适合

需要 npx 免安装快速试用、需要 MCP 扩展、需要脚本化非交互运行（CI）的场景。
尤其适合想把 Gemini 多模态生成（Imagen / Veo / Lyria）接进工作流的用户。
需要大上下文窗口的人（1M token，本赛道明确写出上限的少数）。
需要「改动可回退」保证的人（shadow Git 检查点 + `/restore`）。
需要项目级长期指令文件的人（GEMINI.md）。

**不适合**把额度当成无限用的场景——
免费层有明确日额度（6,000 代码请求 + 240 对话），且 CLI 与代理模式额度合并计算。

## 值得单独记的两处

### ① 检查点用 shadow Git，不污染你的仓库

`docs/cli/checkpointing.md` 原文说明：
批准一个改文件的工具（`write_file` / `replace`）时，
CLI 会在 `~/.gemini/history/<project_hash>` 这个**独立的 Git 仓库**里提交一次快照，
并明确写了「It does **not** interfere with your own project's Git repository」。

这是本赛道里把「安全网」做进机制的少数——
多数工具靠「自动提交到你的仓库」或「让你自己 undo」。

### ② GEMINI.md 是项目级长期指令

相当于把「这个项目怎么做事」写进一个文件，
多形态（CLI / VS Code / JetBrains）都会读它。
这与 Cline 的 `.clinerules`、Claude Code 的 CLAUDE.md 是同一类机制，
**值得横向对照**。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应放在三处
（README 或官方文档明确宣传但需要验证的）：
1. **npx 免安装的实际启动速度**
2. **非交互模式在 CI（无 TTY）环境下是否真的可用**
3. **shadow Git 检查点在 Windows 上的行为**
   （文档说路径是 `~/.gemini/history/`，Windows 上是否有兼容问题待验）

## 未知项清单

- 具体可用模型清单与版本映射（官方 README 未列全，已查 configuration 页）
- 语义索引（RAG）算法与大仓库表现（官方未说明）

## 相关条目

- [Codex CLI](./codex-cli.md) — 同类 OpenAI 官方工具
- [Crush](./crush.md) — 同类工具，MCP 传输方式标注更细
