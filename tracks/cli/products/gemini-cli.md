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
    Google 自家 **Gemini 系列模型**，README 标注 **1M token context window**
    （1M 上下文窗口），是本赛道少数明确写出上下文上限的。
    **2026-10-01 官方产品页补充**：当前 IDE 侧主力是 **Gemini 2.5**，
    **Gemini 3 标注「coming soon」，走 Preview release channel**。
    另有**代码库感知窗口 1M token**、**代码自定义库上限 20,000 个仓库**
    （Gemini Code Assist 官方quota 数值）。
    **未核验**：CLI 侧具体可切换的模型清单与版本映射（官方 README 未列全，站点未取到正文），
    此处保持未知，不做推断。
  runtime: >-
    本地进程，在终端运行。
    **README 强调「Using npx (no installation required)」——
    npx 免安装形态降低了上手门槛。**
  local_files: >-
    内置文件操作工具（README 标注「🔧 Built-in tools: Google Search grounding,
    file operations, shell」）。
    **检查点机制明确且实现方式值得记录**（`docs/cli/checkpointing.md`）：
    每当你批准一个会修改文件系统的工具（`write_file`、`replace` 等），
    CLI **自动在 home 目录下的一个专用 shadow Git 仓库
    （`~/.gemini/history/<project_hash>`）里做一次提交**，
    快照项目的完整状态；
    **关键点：这个 shadow 仓库不干扰你自己的项目 Git 仓库。**
    同时保存完整对话历史与即将执行的工具调用，
    可用 `/restore` 回退。
    **索引算法与大仓库表现本次未核验。**
  background: >-
    不支持终端形态的后台长任务。
    **是否有其他运行形态本次未核验。**
  tools: >-
    **明确支持 MCP**（README 标注「🔌 Extensible: MCP support for custom」），
    并给出独立文档页 `/docs/tools/mcp-server`。
    README 举例说明可用 MCP 接入图像生成能力（Imagen / Veo / Lyria）。
    内置工具还包括 **Google Search grounding**（搜索接地）与 **shell**。
    **另明确支持非交互模式用于脚本自动化**
    （README 有独立的「Non-interactive mode for scripts」章节）。
  context: >-
    **1M token 上下文窗口**（README：Gemini 3 models with 1M token context window），
    是本赛道明确写出上限的少数。
    **自定义上下文文件 `GEMINI.md`** 用于定制项目行为
    （README 标注「Custom context files (GEMINI.md) to tailor behavior for your projects」，
    文档路径 `/docs/cli/gemini-md`）——
    相当于项目级的长期指令。
    **上下文压缩策略本次未核验。**
  permissions: >-
    **两个明确的官方机制**（README 均有独立文档入口）：
    一是 **Sandboxing & Security**（文档路径 `/docs/cli/sandbox`），
    提供安全的执行环境；
    二是 **Trusted Folders**（文档路径 `/docs/cli/trusted-folders`），
    按文件夹控制执行策略。
    另有面向企业的部署与管理文档（`/docs/cli/enterprise`）。
    仓库 `docs/` 下有独立的 `hooks/` 目录，说明支持钩子机制。
    **具体的沙箱档位、默认信任范围与审批粒度本次未核验，记为未知。**
    但「按文件夹控制执行策略」这个设计本身值得注意——
    它把权限边界绑定到目录而非全局开关。
    **检查点的 shadow Git 机制**也算一层安全网：
    修改文件系统前自动快照，可 `/restore` 回退。
  fit: >-
    需要无安装快速试用、需要 MCP 扩展、需要脚本化非交互运行的场景。
    尤其适合想把 Gemini 的多模态生成能力接进 Agent 工作流的场景。

pitfalls:
  - 以为开源就无限用，额度政策未核验
  - 以为 npx 形态会污染本地环境，实际是免安装的临时运行
  - 忽略 MCP 能力，README 明确把它列为可扩展特性

tags: [编程, 终端, 本地, 开源]

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

- ✅ 已核验：仓库、许可（Apache-2.0）、版本形态与日期、star 数（107,180）、MCP 支持及文档页、非交互模式、npx 安装方式、MCP 接入多模态生成的官方举例
- ❌ 未核验：额度政策、可用模型清单、索引策略、上下文策略、权限确认机制

**star 数 107,180 但未核验商业授权条款**——
README 未说明是否需要 Google 账号、是否免费、额度多少。

## 适合与不适合

需要 npx 免安装快速试用、需要 MCP 扩展、需要脚本化非交互运行（CI）的场景。
尤其适合想把 Gemini 多模态生成（Imagen / Veo / Lyria）接进工作流的用户。
需要大上下文窗口的人（1M token，本赛道明确写出上限的少数）。
需要「改动可回退」保证的人（shadow Git 检查点 + `/restore`）。
需要项目级长期指令文件的人（GEMINI.md）。

**不适合**需要明确额度边界的场景——
额度政策本次未核验，记为未知。

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

- 模型额度政策与免费额度边界
- 具体可用模型清单
- 索引策略与大仓库表现
- 上下文压缩策略
- 沙箱档位与默认信任范围
- Trusted Folders 的默认行为

## 相关条目

- [Codex CLI](./codex-cli.md) — 同类 OpenAI 官方工具
- [Crush](./crush.md) — 同类工具，MCP 传输方式标注更细
