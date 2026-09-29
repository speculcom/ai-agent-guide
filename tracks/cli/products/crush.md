---
id: crush
track: cli
name: Crush
vendor: Charm
homepage: https://github.com/charmbracelet/crush
mark: CR
accent: "#F26D9D"

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 开源免费，模型费用另计
  annual_usd: null
  annual_label: 开源免费，模型费用另计
  note: >-
    许可证为 GitHub 未识别类型（NOASSERTION），
    **具体条款本次未核验，商用前须自行确认**。
    模型费用由用户自付。
pricing_pitfalls:
  - 以为开源可商用，许可证为 NOASSERTION，条款未核验

axes:
  model_access: >-
    多 provider 接入。
    **README 明确 Hyper（来自 Charm）是 Crush 的官方 provider，采用订阅制**；
    同时说明也可以用 Anthropic、OpenAI 等其他 provider，
    自选 provider 并粘贴 API key，也可用环境变量配置首选 provider。
    **完整的 provider 清单本次未核验。**
  runtime: >-
    本地进程，在终端运行（由 Charm 的终端库构建 TUI）。
    提供 Homebrew / NPM / Arch Linux 等安装方式。
    **支持多客户端共享同一 workspace**——
    指向同一工作目录的第二个客户端会附着到已存在的 workspace，
    共享会话列表、消息历史、权限队列、LSP 与 MCP 状态。
    **但每次新调用都会启动新进程**，所以 first-wins 规则会影响共享 workspace 的配置。
  local_files: >-
    **LSP 增强上下文**（README 原文「LSP-Enhanced: Crush uses LSPs for
    additional context, just like you do」）——
    与人一样靠 LSP 拿额外上下文。
    **按项目维护多个工作会话与上下文**
    （README「Session-Based: maintain multiple work sessions and contexts per project」）。
    **可在会话中途切换模型且保留上下文**
    （README「Flexible: switch LLMs mid-session while preserving context」）。
    **索引算法与大仓库耗时本次未核验。**
  background: >-
    不支持终端形态的后台长任务。
    **是否有其他运行形态本次未核验。**
  tools: >-
    **明确支持 MCP，且传输方式标注最完整**：
    README 写明支持 `http`、`stdio` 和 `sse` 三种。
    这是本赛道里把 MCP 传输方式写清楚的少数几个之一。
    另支持自定义配置文件 `~/.config/crush/crushrc`
    （Windows 为 `%USERPROFILE%\.config\crush\crushrc`），
    且**可按机器条件覆盖配置**（示例里用 `$HOSTNAME` 判断）。
    模型可通过 `model add ollama/llama3.3 --name "Llama 3.3" --context-window 128000`
    手动添加——**支持本地模型且可显式声明其上下文窗口**。
  context: >-
    **LSP 提供额外上下文**（见 local_files）。
    **按项目维护多个工作会话与上下文**（per-project sessions）。
    **切换模型时保留上下文**——这是本赛道少见的明确承诺，
    因为换模型通常也意味着换上下文策略。
    **上下文压缩策略本次未核验。**
  permissions: >-
    **默认每次工具调用都询问**（README「By default, Crush will ask you for
    permission before running tool calls」），
    可在配置里 `permissions allow view edit` 免确认特定工具。
    官方原文对免确认模式的措辞是
    "Use this with care"（谨慎使用）。
    另有 `--yolo` 开关可整体放宽审批；
    **该 flag 遵循「first-wins」规则**——
    同一 cwd 下首个客户端的设置会锁定后续客户端的行为，
    不一致时会打一行 debug 日志记录这种不匹配。
    **多客户端同时接入同一目录时需注意这个规则。**
    凭据配置也支持按机器分叉（可用 `$HOSTNAME` 条件覆盖）。
  fit: >-
    喜欢 Charm 生态的终端体验（TUI 审美与交互）。
    需要在多个 provider 间切换，或想用官方订阅方案 Hyper 的用户。
    **想中途换模型且不丢上下文的人**（README 明确承诺）。
    想用本地模型并显式声明其上下文窗口的人。
    需要 MCP 三种传输都支持的人。

pitfalls:
  - 以为许可证明确可商用，GitHub 识别为 NOASSERTION，条款未核验
  - 以为只能用自己的模型，实际上可以接 Anthropic / OpenAI 等
  - 以为每个终端窗口独立配置，其实同 workspace 下 first-wins 会锁定设置

tags: [编程, 终端, 本地]

sources:
  - label: Charm · Crush 仓库 README
    url: https://github.com/charmbracelet/crush
    kind: repo
  - label: Charm · Crush Releases
    url: https://github.com/charmbracelet/crush/releases
    kind: changelog
  - label: Charm · Crush Commits
    url: https://github.com/charmbracelet/crush/commits/main
    kind: changelog
  - label: Charm · Crush 官网
    url: https://charm.land/crush/
    kind: docs

link:
  url: https://github.com/charmbracelet/crush
  kind: official

last_verified: 2026-09-29
last_updated: 2026-09-29
lifecycle: active
confidence: partial
---

## 一句话定位

Charm 生态的 TUI 编码 agent，**MCP 三种传输方式标注最完整**，并提供官方订阅方案 Hyper。

## 变更记录说明

| 版本 | 日期 |
|---|---|
| `nightly` | 2026-09-29 |

**同样采用 nightly 滚动发布**，与 Gemini CLI 类似。
引用版本号时需注意 nightly 内容每天变化。

## 官方 provider：Hyper

```
[Hyper], from Charm, is the official Crush provider.
It's subscription-based
```

**这是本赛道唯一有厂商自营订阅方案的条目**——
其他工具要么只给自家模型，要么纯 BYOK。

**这意味着两种成本模型并存**：
| 方式 | 说明 |
|---|---|
| Hyper 订阅 | Charm 官方运营，按订阅计费 |
| 自带 key | 接 Anthropic / OpenAI 等，费用自付 |

**Hyper 的价格与额度本次未核验，记为未知。**

## MCP：三种传输方式写清楚了

```
Extensible: add capabilities via MCPs (http, stdio, and sse)
```

**这是值得单独记录的点**——多数工具只写「支持 MCP」，
Crush 直接列出了三种传输方式。

对照 MCP 赛道自己的观察：不少 reference server
**只支持 stdio，不支持远程传输**。所以一个明确支持 http 的 CLI 工具，
实际上扩展兼容面比想象中大。

## 许可状态需要提醒

GitHub API 返回的许可证字段是 **`NOASSERTION`**
（无法识别），不是 MIT 也不是 Apache-2.0。

**这意味着**：
- 不能假设可以商用
- 不能假设可以闭源分发
- 引用前须自行查看仓库内的 LICENSE 文件确认

**这属于「未知」，按本站方法论必须标注。**

## 权限定级说明

`confidence: partial` 的原因：

- ✅ 已核验：仓库、star 数（28,350）、最新 release（nightly）与日期、MCP 三种传输、Hyper 官方 provider、自定义 provider 方式、安装方式
- ❌ 未核验：**许可证具体条款**、完整 provider 清单、索引策略、上下文策略、权限确认机制、Hyper 价格与额度

## 适合与不适合

喜欢 Charm 生态终端体验（TUI 审美与交互）的用户。
需要明确 MCP 传输方式（http / stdio / sse 三种都支持）的人。
想在官方订阅方案 Hyper 与自带 key 之间切换的人。

**不适合**需要明确开源许可做二次分发的场景——
GitHub 识别为 NOASSERTION，条款未核验。

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**：重点测**非 TTY 环境下的表现**——
这类 TUI 形态的终端工具在 CI 里常有问题。

## 未知项清单

- **许可证具体条款**（GitHub 识别为 NOASSERTION）
- Hyper 订阅的价格与额度
- 完整 provider 清单
- 索引策略与大仓库表现
- 上下文窗口与压缩策略
- 工具执行的确认机制

## 相关条目

- [OpenCode](./opencode.md) — 同类多 provider 工具，MCP 支持
- [Gemini CLI](./gemini-cli.md) — 同类工具，工程化更完整
