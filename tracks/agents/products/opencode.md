---
id: opencode
track: cli
name: OpenCode
vendor: OpenCode
homepage: https://github.com/sst/opencode
mark: OC
accent: "#E5705A"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 开源免费，模型费用另计
  annual_usd: null
  annual_label: 开源免费，模型费用另计
  note: >-
    MIT 开源，无授权费。
    模型调用费用由用户自付——支持多 provider 接入，
    也支持连接本地模型。
pricing_pitfalls:
  - 以为开源就是零成本，provider 的模型费用要自己承担
  - 把「支持某个 provider」等同于「有该 provider 的额度」

axes:
  model_access: >-
    多 provider 接入的编程 harness。
    **README 提到 provider 支持列表较长**，
    但**具体可接入的 provider 清单本次未核验**，记为未知。
    是否支持本地模型本次未核验。
  runtime: >-
    本地进程，在终端运行。提供多平台安装方式（macOS Homebrew / Windows Scoop 等）。
    生命周期绑定终端会话。
  local_files: >-
    面向真实代码仓库的编程能力。
    **索引策略与大仓库表现本次未核验，记为未知。**
  background: >-
    不支持终端形态的后台长任务。
    **是否有其他形态（本地服务 / 远程）本次未核验。**
  tools: >-
    工具链包含 bash 命令执行、子代理能力。
    **README 明确提到内置一个「通用子代理」用于复杂搜索与多步任务**。
    MCP 接入方式本次未核验。
  context: >-
    **ACP（Agent Client Protocol）载入能力是其差异化设计**——
    在恢复与分叉时保留模型、effort 与模式边界。
    具体上下文窗口与压缩策略本次未核验。
  permissions: >-
    **README 记录了「YOLO」模式相关内容，并提到运行 bash 命令前会询问权限**。
    这是与多数工具默认自动执行不同的设计。
    **具体审批粒度与是否可配置本次未核验，记为未知。**
  fit: >-
    需要多 provider 可切换、且重视命令执行前确认的用户。
    ACP 生态参与者。

pitfalls:
  - 把 provider 支持列表当成有额度，连接器可用不等于有模型订阅权限
  - 以为默认全权执行命令，README 提到 bash 命令前会询问
  - 以为可以用某个 provider 就免费，模型费用仍需自付

tags: [编程, 终端, 本地, 开源]

sources:
  - label: OpenCode · 仓库 README
    url: https://github.com/sst/opencode
    kind: repo
  - label: OpenCode · Releases（v1.18.33 @ 2026-09-28）
    url: https://github.com/sst/opencode/releases
    kind: changelog
  - label: OpenCode · 官方站 Changelog
    url: https://opencode.ai/changelog
    kind: changelog
  - label: OpenCode · 官方文档
    url: https://opencode.ai/docs
    kind: docs

link:
  url: https://opencode.ai
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

MIT 许可的多 provider 编程 harness，**运行 bash 命令前会询问权限**，并支持 ACP 载入。

## 变更记录说明

| 版本 | 日期 |
|---|---|
| `v1.18.33` | 2026-09-28 |

**更新频率很高**（release 与 changelog 都在 09-28）。

## 权限设计：执行前询问

这是本条目最值得注意的一条，来自 README：

```
Asks permission before running bash commands
```

**多数终端 agent 默认自动执行命令，OpenCode 默认会问。**

这降低了「模型误删文件 / 误跑危险命令」的风险，
代价是打断流程。README 另有 **YOLO** 相关内容，
推测是可选的免询问模式，**但具体开关方式本次未核验，记为未知**。

## 子代理能力

```
Also included is a general subagent for complex searches and multistep tasks.
```

内置一个**通用子代理**，用于复杂搜索与多步任务。
这让它能处理「先调研再动手」这类需要多轮的任务。

**子代理的具体调度方式与 token 开销本次未核验。**

## ACP：Agent Client Protocol

这是它的架构亮点：

```
ACP 载入、恢复、分叉时保留模型、effort 和模式边界
```

**「分叉时保留模型与 effort」这个细节值得注意**——
很多工具分叉后会丢失设置，导致每次都要重设。

## 稳定性修复是重要信号

参考 AgentClash 对 OpenCode v1.18.33 的核验记录（09-28），
该版本包含四项修复：

1. Cloudflare 超时控制
2. MCP 浏览器启动失败反馈
3. **调试凭据脱敏**
4. Gemini 推理参数修正

**四项里两项与权限/可靠性相关**（凭据脱敏、MCP 启动失败反馈）。
这说明项目的可靠性投入在权限与可诊断性上，
但也说明**这些方面曾经出过问题**。

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库、许可（MIT）、最新版本与日期、star 数（210,642，本赛道最高）、权限设计、子代理、ACP、安装方式
- ❌ 未核验：完整 provider 清单、本地模型支持、索引策略、上下文策略、YOLO 开关方式、MCP 接入

## 适合与不适合

需要多 provider 可切换、重视 bash 命令执行前确认的用户。
ACP 生态参与者。

**不适合**需要完全免打扰的自动化场景——
执行命令前询问会打断流程，需确认 YOLO 模式的具体开关方式。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：这个工具的实测重点应放在
**「命令执行前的询问」这个设计在长任务中的实际打断成本**——
这是它与全权执行类工具的核心工作流差异。

## 未知项清单

- 完整 provider 清单与各 provider 的接入方式
- 是否支持本地模型
- 索引策略与大仓库表现
- YOLO 模式的具体开关与风险
- MCP 接入方式

## 相关条目

- [Aider](./aider-cli.md) — 同类工具但已放缓维护
- [Codex CLI](./codex-cli.md) — 同类工具，架构侧重点不同
