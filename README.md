# ai-coding-agent-atlas

**AI coding agent 地图集** · 纯 Markdown · 开源

记录 **AI coding agent / IDE / CLI / MCP server** 的能力边界、运行位置、真实价格与官方证据，
用一套固定坐标系组织，让选型变成可回溯的判断而不是感觉。

这个仓库**只存数据，不出结论页面**。结论层由三个分站消费：

| 分站 | 主题 | 收录对象 |
|---|---|---|
| `ide.specul.com` | AI 编程 IDE / 编码工具 | Cursor · Claude Code · Copilot · Windsurf · Zed · Cline · Aider · Codex CLI |
| `cli.specul.com` | 终端 AI 编码工具 | Claude Code CLI · Codex CLI · Gemini CLI · OpenCode · Aider · Crush |
| `mcp.specul.com` | MCP 服务器 / 工具生态 | filesystem · git · memory · sequential-thinking · fetch · time · playwright · context7 · everything |

**为什么叫 atlas**：不是给你一堆工具名，是给你一张能给 23 个对象定位的地图。

---

## 这不是又一份 awesome list

同类项目通常是一串链接。本仓库走的是另一条路：

| 常见做法 | 本仓库 |
|---|---|
| 按 star / 流行度排序 | **不给总分排名** |
| 抄官网宣传语 | 只记官方源可核验的能力边界 |
| 没查到就留空 | **「未知」是合法答案**，并说明为什么 |
| 一份名单 | **固定 8 维度 × 23 个对象**，可横向对比 |
| 链接失效无人知 | 每条判断挂官方源，附核验日期 |

**核验快照，不冒充实时实测。**

---

## 这个仓库的方法论

一句话：**不让没有实测的东西看起来像有结论。**

四条核心规则：

| 规则 | 做法 |
|---|---|
| **放弃总分** | 没有统一输入、预算、环境下的复现实测，就不给总分排名 |
| **固定坐标系** | 所有对象在同一组 8 个维度下被描述，不允许自定义维度 |
| **未知是合法答案** | 查不到就写「未知」+ 原因，绝不推测填充 |
| **每条判断挂证据** | 判断能回到官方一手源，区分发布 / 核验 / 生效三种时间语义 |

完整方法论见 [METHODOLOGY.md](./METHODOLOGY.md)。

---

## 快速上手

### 我想查一个工具的能力边界

1. 在 [axes/](./axes/) 看 8 个维度分别问什么
2. 在对应赛道的 `products/` 找条目
3. 点条目里的 `sources` 回官方原文

### 我想新增一个工具

1. 读 [SCHEMA.md](./SCHEMA.md) 了解字段格式
2. 复制同赛道任意条目作为模板
3. 按 [axes/](./axes/) 的判定标准填 8 个维度
4. 提 PR，附上你读过的官方源链接

### 我想修正一条数据

直接开 Issue，标明条目 id + 字段名 + 你的依据链接。
不接受无来源的修正。

### 我想跑一轮实测

读对应赛道的 `tasks/_protocol.md`，按协议跑，结果写进 `runs/`。

---

## 目录结构

```
ai-coding-agent-atlas/
├── METHODOLOGY.md              方法论总纲
├── SCHEMA.md                   数据格式规范
├── CONTRIBUTING.md             贡献指引
├── SOURCES.md                  来源索引
├── axes/                       8 个维度的定义与判定标准
│   ├── model-access.md         模型与开放条件
│   ├── runtime.md              运行位置
│   ├── local-files.md          本地文件
│   ├── background.md           关机后的任务
│   ├── tools.md                工具与扩展
│   ├── context.md              上下文与记忆
│   ├── permissions.md          权限与限制
│   └── fit.md                  适合什么任务
├── tracks/
│   ├── ide/                    IDE / 编码工具赛道
│   │   ├── _track.md           赛道定义与收录标准
│   │   ├── products/           8 个对象
│   │   ├── tasks/              实测任务集
│   │   └── runs/               实测记录
│   ├── cli/                    终端工具赛道
│   └── mcp/                    MCP 生态赛道（多 3 个特有维度）
├── scripts/                    校验脚本（validate / audit / quality）
├── CHANGELOG.md                数据层更新记录
└── raw/                        采集的原始素材（网页快照等）
```

---

## 数据可信度分级

每个条目有两个独立标记：

### `confidence` — 本站数据的可靠程度

| 值 | 含义 |
|---|---|
| `verified` | 8 维度均有官方来源支撑，且核验日在 90 天内 |
| `partial` | 部分维度标为未知，或核验日超过 90 天 |
| `stale` | 官方已发布重大变化，本站尚未核验 |

### `lifecycle` — 对象本身的状态

这一条比 `last_verified` 更决定「你的数据明天还有没有用」。

| 值 | 含义 |
|---|---|
| `active` | 上游近 30 天有提交或版本发布 |
| `maintenance` | 上游近 90 天有更新，但节奏明显放缓 |
| `archived` | 上游已归档、停止更新或转移维护方 |
| `unknown` | 无 changelog / 无仓库可判断 |

**组合约束**：`lifecycle` 为 `archived` 或 `unknown` 时，`confidence` 不得为 `verified`。

**为什么要单列**：一个对象即使今天刚核验过，
若上游已半年无更新，这条数据**明天就会失效**。

实例：某个开源 CLI 工具的仓库最后推送在 4 个月前——
这种信息必须显式记录，不能靠「核验日是新的」掩盖。

**引用本仓库数据时请同时带上 `confidence`、`lifecycle` 和 `last_verified`。**

---

## 已知边界

诚实地说明这个仓库**做不到**什么：

| 不做 | 原因 |
|---|---|
| 不给单一总分排名 | 缺少跨工具的统一实测，排名会误导 |
| 不推测未核验信息 | 「未知」比编造的数字有用 |
| 不做跨币种折算 | 汇率、区域、账户差异会被折算掩盖 |
| 不收录无官方文档的对象 | 无法核验的对象不进仓库 |
| 不做付费实测（当前） | 实测协议已就绪，未跑完前不发布结论 |
| 不保证覆盖完整 | 记录密度随各对象上游活跃度变化 |
| 数据可能过期 | 每条都带 `lifecycle` 与 `last_verified`，请一并核对 |

---

## 许可

内容采用 [CC BY 4.0](./LICENSE) 授权。

**使用要求**：署名「ai-coding-agent-atlas contributors」并链接回本仓库。
数据中的第三方商标与产品名归各自所有者，本仓库仅作索引与比较用途。

---

## 原始素材未入库

采集过程中抓取的网页正文快照（Cursor / Windsurf / Copilot 官网定价页与 changelog，
约 480KB）**未包含在本仓库**，原因是第三方网站内容的版权归属。

**这不影响可核验性**：每个条目都标注了对应的官方源 URL 与核验日期，
任何人都可以自行访问原文复核。

如需原始快照用于研究，请通过 Issue 联系。

---

## 关联项目

| 项目 | 说明 |
|---|---|
| **specul.com** | 品牌站（投机 · 推演） |
| **ide.specul.com** | 结论层：AI 编程 IDE / 编码工具 |
| **cli.specul.com** | 结论层：终端 AI 编码工具 |
| **mcp.specul.com** | 结论层：MCP 服务器 / 工具生态 |

**方法论原型**：本仓库的「放弃总分 / 未知合法化 / 每条挂证据」三条规则
借鉴自 [AgentClash](https://aiagentclash.com/)，但坐标系与赛道定义是本仓库独立设计。

