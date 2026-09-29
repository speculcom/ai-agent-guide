# CLI 赛道定义

**主题**：终端 AI 编码工具

---

## 收录标准

| # | 标准 |
|:--:|---|
| 1 | 主要交互形态是**终端**，能脚本化 / 进 CI |
| 2 | AI 参与编码（改文件、跑命令、自主完成任务） |
| 3 | 有可访问的官方文档或 changelog |

**边界情况**：

| 情况 | 处理 |
|---|---|
| 有 IDE 但主要形态是终端 | 收在 `cli`，在 IDE 赛道用 `related` 引用 |
| 纯 shell 补全（如 fig） | 不收，无编码能力 |
| 终端 UI 库（如 Crush 用 Bubble Tea） | 收，只要 AI 参与编码 |

---

## 收录对象

| id | 名称 | 厂商 |
|---|---|---|
| `claude-code-cli` | Claude Code CLI | Anthropic |
| `codex-cli` | Codex CLI | OpenAI |
| `gemini-cli` | Gemini CLI | Google |
| `opencode` | OpenCode | OpenCode |
| `aider-cli` | Aider | Aider-AI |
| `crush` | Crush | Charm |

---

## 这个赛道的坐标系细化

CLI 赛道的最大差异是**「运行环境责任」**——很多工具明确区分四种运行责任：

| 形态 | 谁运行 | 谁付费 |
|---|---|---|
| CLI | 用户终端 | 订阅 |
| Client SDK | 你的客户端 | 你的进程 + API |
| Agent SDK | 你的应用 | 你的进程 + API |
| Managed Agents | 厂商托管 | 开发者方案 |

```
官方现在清楚区分 CLI、Client SDK、Agent SDK 与 Managed Agents 四种运行责任。
```

**这个区分必须写进 `runtime` 维度。**

| # | 维度 | CLI 语境的具体问题 |
|:--:|---|---|
| 1 | 模型与开放条件 | 默认模型？能不能接任意 API（含本地模型）？多 provider 支持？ |
| 2 | 运行位置 | 本地进程还是托管？有 SDK 模式吗？ |
| 3 | 本地文件 | Git 友好度？diff 输出质量？能否非交互运行？ |
| 4 | 关机后的任务 | **基本不支持**（本来就是本地的），要写清是否有云端选项 |
| 5 | 工具与扩展 | MCP · 自定义指令 · Hooks · 非交互模式（`-p` 之类） |
| 6 | 上下文与记忆 | 会话恢复方式？压缩策略？是否有 `--continue` 类功能？ |
| 7 | 权限与限制 | 沙箱默认值？非交互模式下的审批怎么处理？ |
| 8 | 适合什么任务 | CI 集成？批量脚本？人机协作强度？ |

---

## CLI 赛道的关键区分点

### 非交互模式

能不能一条命令跑完并返回结果？这决定它能不能进 CI。

判定要看有没有：
- 单次执行模式（`--print` / `-p` / `run` 之类）
- 输出格式控制（JSON / 纯文本）
- 退出码语义（成功/失败如何表达）

### Git 集成深度

| 级别 | 说明 |
|---|---|
| 无 | 纯文件操作 |
| 只读 | 能看 diff，不能提交 |
| 完整 | 自动 commit / 分支 / PR |

**完整 Git 集成是 Aider 和 OpenCode 的重要差异点。**

### Provider 兼容性

能接多少家模型 API？这直接影响「会不会被单一厂商锁定」。

```
MCP 与多 provider 接入；与单个模型能力不是一回事。
```

---

## 这个赛道的常见误解来源

| 角度 | 本赛道例子 |
|---|---|
| 同一产品两种形态 | CLI 版和 IDE 版能力不同 |
| provider 兼容性 | 支持列表 ≠ 有额度 |
| 安装方式 | 看似装上了，实际要单独装 provider |
| 沙箱默认值 | 非交互模式下审批怎么处理 |

---

## 实测任务集

见 [`tasks/`](./tasks/)。

**CLI 赛道特有的测试维度**：
- 非交互模式能否完成完整任务
- 在 CI 环境（无 TTY）下是否正常
- 退出码与输出格式是否可用于脚本编排

---

## 与其他赛道的关系

```
ide.specul.com ──┐
                 ├── claude-code ↔ claude-code-cli
                 ├── codex-cli ↔ codex-cli
cli.specul.com ──┘

mcp.specul.com ── 独立赛道
```
