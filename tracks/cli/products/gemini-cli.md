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
  monthly_usd: null
  monthly_label: 有免费额度，具体档位未核验
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    Apache-2.0 开源，支持 npx 直接运行无需安装。
    **模型额度政策本次未核验**，README 未说明免费额度边界，
    记为未知。
pricing_pitfalls:
  - 以为开源就无限用，模型额度政策本次未核验

axes:
  model_access: >-
    Google 自家 Gemini 系列模型。
    **具体可用模型清单与版本映射本次未核验，记为未知。**
  runtime: >-
    本地进程，在终端运行。
    **README 强调「Using npx (no installation required)」——
    npx 免安装形态降低了上手门槛。**
  local_files: >-
    面向代码库工作。**索引策略与大仓库表现本次未核验。**
  background: >-
    不支持终端形态的后台长任务。
    **是否有其他运行形态本次未核验。**
  tools: >-
    **明确支持 MCP**（README 标注「🔌 Extensible: MCP support for custom」），
    并给出独立文档页 `/docs/tools/mcp-server`。
    README 举例说明可用 MCP 接入图像生成能力（Imagen / Veo / Lyria）。
    **另明确支持非交互模式用于脚本自动化**
    （README 有独立的「Non-interactive mode for scripts」章节）。
  context: >-
    **具体上下文窗口与压缩策略本次未核验，记为未知。**
  permissions: >-
    **两个明确的官方机制**（README 均有独立文档入口）：
    一是 Sandboxing 与 Security（文档路径 `/docs/cli/sandbox`），
    提供安全的执行环境；
    二是 Trusted Folders（文档路径 `/docs/cli/trusted-folders`），
    按文件夹控制执行策略。
    另有面向企业的部署与管理文档（`/docs/cli/enterprise`）。
    **具体的沙箱档位、默认信任范围与审批粒度本次未核验，记为未知。**
    但「按文件夹控制执行策略」这个设计本身值得注意——
    它把权限边界绑定到目录而非全局开关。
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

**不适合**需要明确额度边界的场景——
额度政策本次未核验，记为未知。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应放在两处
（README 明确宣传但需要验证的）：
1. **npx 免安装的实际启动速度**
2. **非交互模式在 CI（无 TTY）环境下是否真的可用**

## 未知项清单

- 模型额度政策与免费额度边界
- 具体可用模型清单
- 索引策略与大仓库表现
- 上下文窗口与压缩策略
- 工具执行的确认机制

## 相关条目

- [Codex CLI](./codex-cli.md) — 同类 OpenAI 官方工具
- [Crush](./crush.md) — 同类工具，MCP 传输方式标注更细
