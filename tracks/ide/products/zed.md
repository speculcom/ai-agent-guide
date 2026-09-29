---
id: zed
track: ide
name: Zed
vendor: Zed Industries
homepage: https://github.com/zed-industries/zed
mark: Z
accent: "#3AB7FF"

pricing:
  model: freemium
  monthly_usd: null
  monthly_label: 有免费层，具体档位本次未核验
  annual_usd: null
  annual_label: 未核验年付报价
  note: >-
    **许可证为 GitHub 未识别类型（NOASSERTION）**，
    具体条款与是否可商用本次未核验。
    编辑器本体有免费与付费分层，
    **付费档位与模型额度关系本次未核验，记为未知**。
pricing_pitfalls:
  - 以为开源可自由商用，许可证为 NOASSERTION，条款未核验
  - 以为编辑器的付费档位含模型额度，两者关系未核验

axes:
  model_access: >-
    文档站设有独立的 `ai` 章节（`docs/src/ai`）。
    **具体支持的模型清单与是否支持自带 provider，本次未核验**，
    需查文档站该章节，记为未知。
  runtime: >-
    **本地桌面应用**（非 CLI、非浏览器）。
    源码仓库活跃（2026-09-29 有推送）。
    官方描述为「高性能多人协作代码编辑器」，来自 Atom 与 Tree-sitter 的创造者。
    文档站含 `dev-containers.md` 与 `toolchains.md`，
    说明支持开发容器与工具链管理。
  local_files: >-
    本地编辑器，直接读写工作区文件。
    **基于 Tree-sitter 做语法解析**（其核心优势之一），
    这为符号级编辑提供了基础。
    **大仓库索引与 AI 上下文构建的具体策略本次未核验。**
  background: >-
    本地桌面应用，关闭即停止。
    **是否有云端 Agent 形态本次未核验。**
  tools: >-
    编辑器原生工具链（多光标、代码导航、语言服务器）。
    文档站含 `toolchains.md`。
    **AI Agent 能力与 MCP 支持情况本次未核验**，记为未知。
  context: >-
    **多人协作是官方明确强调的能力**——
    「multiplayer code editor」是项目自述的一部分。
    **AI 侧的上下文与记忆机制本次未核验。**
  permissions: >-
    本地编辑器，权限边界等于本机用户权限。
    **AI Agent 执行命令时的确认机制与沙箱设计本次未核验**，
    这是本条目最需要补全的部分。
  fit: >-
    重视编辑器性能（Rust 实现）、语法解析准确度（Tree-sitter）、
    以及多人协作的场景。
    偏好可定制工具链与开发容器的工作方式。

pitfalls:
  - 把「高性能编辑器」等同于「AI 能力强」，本条目未核验其 AI 侧能力
  - 以为许可证可自由商用，NOASSERTION 需自行确认

tags: [编程, 本地, 协作]

sources:
  - label: Zed · 仓库
    url: https://github.com/zed-industries/zed
    kind: repo
  - label: Zed · Releases（v1.21.0 @ 2026-09-23）
    url: https://github.com/zed-industries/zed/releases
    kind: changelog
  - label: Zed · 官方站 Releases 页
    url: https://zed.dev/releases
    kind: changelog
  - label: Zed · 官方文档
    url: https://zed.dev/docs
    kind: docs

link:
  url: https://zed.dev
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

来自 Atom 与 Tree-sitter 创造者的**高性能本地编辑器**，官方自述核心是「多人协作」——AI Agent 能力本次未核验。

## 为什么收录它

在这个赛道里，Zed 是个**特殊样本**：

| 其他 IDE | Zed |
|---|---|
| 以 AI 能力为主卖点 | **以编辑器性能与协作为主卖点** |
| 模型是核心变量 | 模型不是核心变量 |
| 闭源为主 | **开源**（但许可待确认） |

**收录它是为了提供对比的另一个端点**：
如果一个工具的价值主要不在 AI 而在编辑器本身，那"AI 编程工具"这个分类是否成立？

## 变更记录说明

| 版本 | 日期 |
|---|---|
| `v1.21.0` | 2026-09-23 |
| `v1.20.2` | 2026-09-17 |

**版本号已到 v1.22**，采用标准语义化版本。
仓库 2026-09-29 仍有推送，lifecycle = `active`。

## 已核验的编辑器侧能力

从仓库结构与文档目录能确认的：

| 能力 | 证据 |
|---|---|
| **Tree-sitter 语法解析** | 官方自述来自 Tree-sitter 创造者 |
| **高性能** | Rust 实现，官方自述 |
| **多人协作** | 官方描述含 "multiplayer code editor" |
| **开发容器** | 文档站有 `dev-containers.md` |
| **工具链管理** | 文档站有 `toolchains.md` |
| **AI 章节存在** | 文档站 `docs/src/ai` |

## 采集限制（必须说明）

**本条目是 8 个 IDE 条目里采集深度最浅的一个。**

原因：Zed 的 AI 能力说明在 `docs/src/ai` 目录下，
而该目录的具体内容需要访问 `zed.dev/docs`——
本次 curl 可达但未逐页读取。

**因此以下内容标为未知**：
- 支持哪些模型、能否自带 provider
- AI Agent 的工具集与 MCP 支持
- AI 侧的上下文构建策略
- 执行命令时的确认机制与沙箱

**引用本条目时请只使用已核验部分。**

## 适合与不适合

重视编辑器性能（Rust 实现）、语法解析准确度（Tree-sitter）、
以及多人协作的场景。偏好可定制工具链与开发容器的工作方式。

**不适合**以 AI 能力为首要选型依据的场景——
本条目未核验其 AI 侧能力，不能作为「AI 编程 IDE」的推荐对象。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

## 未知项清单

- 支持的模型清单与 provider 可配置性
- AI Agent 工具集与 MCP 支持
- AI 上下文构建策略
- 命令执行的确认机制与沙箱设计
- 许可证具体条款
- 付费档位与模型额度的关系

## 相关条目

- [Cline](./cline.md) — 同为开源，以 AI 能力为核心
- [Aider](./aider.md) — 跨赛道关联，Git 集成是其核心设计
