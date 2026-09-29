# IDE 赛道定义

**主题**：AI 编程 IDE / 编码工具

---

## 收录标准

一个对象要进这个赛道，必须满足全部三条：

| # | 标准 |
|:--:|---|
| 1 | **AI 参与编码**，不只是补全（AI 能改多文件、能跑命令、能自主完成任务） |
| 2 | **面向代码库工作**，不是纯问答或纯代码生成片段 |
| 3 | **有可访问的官方文档或 changelog** |

**边界情况**：

| 情况 | 处理 |
|---|---|
| 纯补全插件（无 Agent 能力） | 不收，已超出赛道定义 |
| 纯终端工具 | 收在 `cli` 赛道 |
| VS Code 插件形态但能力等同独立 IDE | 收，但在 `runtime` 里注明形态 |
| 同一个工具的 IDE 版和 CLI 版 | 分别收在各自赛道 |

---

## 收录对象

| id | 名称 | 厂商 | 形态 |
|---|---|---|---|
| `cursor` | Cursor | Anysphere | 独立 IDE（VS Code 衍生） |
| `claude-code` | Claude Code | Anthropic | 扩展 + 独立形态 |
| `copilot` | GitHub Copilot | GitHub / Microsoft | VS Code / JetBrains 扩展 |
| `windsurf` | Windsurf | Codeium | 独立 IDE（VS Code 衍生） |
| `zed` | Zed | Zed Industries | 独立编辑器（原生 Agent） |
| `cline` | Cline | Cline Bot | VS Code 扩展 |
| `aider` | Aider | Aider-AI | CLI 起家，IDE 插件形态 |
| `codex-ide` | Codex CLI | OpenAI | CLI 起家，IDE 扩展形态 |

---

## 这个赛道的坐标系细化

通用 8 维度在 IDE 语境下的具体问法：

| # | 维度 | IDE 语境的具体问题 |
|:--:|---|---|
| 1 | 模型与开放条件 | 能接哪些厂商？能不能 BYOK？多模型路由怎么做？ |
| 2 | 运行位置 | 索引在本地还是云？有没有云端任务？ |
| 3 | 本地文件 | 索引策略是什么？大仓库首次打开要多久？符号级能力？ |
| 4 | 关机后的任务 | 关掉 IDE 后还有任务在跑吗？云端任务能做到什么程度？ |
| 5 | 工具与扩展 | MCP · LSP · 插件 · 自定义指令 · Hooks |
| 6 | 上下文与记忆 | 索引范围（当前项目/全部项目）？会话可恢复/可分叉？压缩策略？ |
| 7 | 权限与限制 | 沙箱默认档位？审批机制？代码是否上云？多额度池关系？ |
| 8 | 适合什么任务 | 大仓库重构？跨模块调试？新手引导？ |

---

## 这个赛道的常见误解来源

按 [axes/fit.md](../../axes/fit.md) 的方法，从这几个角度找：

| 角度 | 本赛道例子 |
|---|---|
| 同品牌多入口 | IDE 版 vs CLI 版能力不同 |
| 有限额或活动 | 赠送额度当永久 |
| 新功能预告 | Beta 当已上线 |
| 价格结构复杂 | API 额度 ≠ 订阅额度 |
| 形态相似但内核不同 | VS Code 衍生 vs 原生编辑器 |

---

## 实测任务集

见 [`tasks/`](./tasks/)。协议见 [`tasks/_protocol.md`](./tasks/_protocol.md)。

**设计原则**：任务基于真实仓库，能验证「跨文件改动是否正确」，而不是「能不能写出一个函数」。

---

## 与其他赛道的关系

```
ide.specul.com ──┐
                 ├── 同产品交叉引用（claude-code ↔ claude-code-cli）
cli.specul.com ──┘

mcp.specul.com ── 独立赛道：对象是「工具实现」不是「编码工具」
```

**共享数据不许复制**：同一厂商在两个赛道出现时，`vendor` 和 `homepage` 必须一致，构建时会校验。
