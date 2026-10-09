---
id: llamaindex
track: harness
family: orchestration
name: LlamaIndex Framework
vendor: LlamaIndex（run-llama）
homepage: https://developers.llamaindex.ai/
mark: LI
accent: "#7C3AED"
stars: 52377
license: MIT
latest_version: 0.14.25
language: Python（主）/ TypeScript（llamaindex TS 独立仓）

# 支持哪些模型 provider（本站第一决策点）
providers:
  - 官方称 300+ 集成包覆盖各类 LLM / embedding / vector store（README 明示数量）
  - 命名空间规则：带 .core 的是核心，不带的是集成包
  - 具体 provider 清单未核验（分散在 300+ 集成包里）

pricing:
  model: open-source
  monthly_usd: 0
  monthly_label: OSS 框架免费（MIT）；LlamaParse 平台 Free $0 / Starter $50 / Pro $500 每月
  note: >-
    **这一条必须写在最前面，因为它决定了这个对象现在是什么。**
    核验依据：仓库 MIT（经license API）+ README 首屏NOTE 段落原文。
    **README 首屏原文（核验 2026-10-01）**：
    "The **current focus** of LlamaIndex is to build the best AI-powered engine for
    **document parsing and extraction**. **LlamaParse** is our **enterprise platform** for
    agentic OCR, parsing, extraction, indexing and more."
    并明确说（原文）：
    "While we still have the OSS framework available as an open toolkit that you're welcome
    to use, **our primary focus has shifted towards LlamaParse**, along with liteparse and
    our benchmarking efforts."
    **换句话说：公司的主战场已从「编排框架」移到「文档解析 / agentic OCR」——
    但注意：编排（Workflows）的代码仍在 OSS core（`llama_index.core.workflow`，
    2026-10-08 核验），商业平台 LlamaAgents 提供的是托管形态与 Agent Builder。**
    **LlamaParse 定价（2026-10-01 官方 pricing 页核实，以 credits 计费）**：
    Free $0/月含 **10K credits**；Starter **$50/月含 40K credits**（可加购至 400K）；
    Pro **$500/月含 400K credits**（另有一次性 800K credits 赠额，官方折算价值 $1,000，
    可加购至 $5,000/月）；Enterprise 定制。**三档均含 100 个用户席位**，
    超出按 **1,000 credits = $1.25** 加购。
    ⚠ **关键：官方只给 credits 单价，没给「一页文档消耗多少 credits」的口径**
    —— 所以「$50 能解析多少页 PDF」**在公开信息里换算不出来**，
    选型前必须自己拿真实文档试跑。这一点是本站明确的信息缺口，不做推测。
    另外官方另推**LiteParse**（VLM-free、可本地跑的 OSS 解析器）—— **它不吃 credits、免费**，
    官方自己形容为 "VLM-free fast and local OSS parsing"，这是零成本路线的存在。
pricing_pitfalls:
  - 以为 LlamaIndex 仍是以「编排框架」为核心的项目 —— **官方首屏已声明 primary focus 已转向文档解析**
  - 以为编排（Workflows）已随战略转移离开 OSS —— 仍在开源核心
    （`llama_index.core.workflow`，官方框架文档明示）；转移的是公司投入重心，不是代码归属
  - 把 LlamaParse 当成免费开源组件 —— 它是商业平台，需注册取 key；
    **且计费单位是 credits 不是「页数」**，1,000 credits = $1.25，
    而官方**没公布每页消耗多少 credits**，所以「$50 能解析多少页」换算不出来
  - 以为 LlamaParse 是唯一解析路线 —— 官方另有**LiteParse**，VLM-free + 本地可跑 + OSS，
    **不吃 credits**；预算敏感或有本地化要求时应先看它
  - 以为「300+ 集成包」是 LlamaIndex 自己维护的 —— 多数是社区集成，能力对齐度需逐个确认

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站收录对象里唯一一个「公司战略已明显转移」的对象 —— 这一点必须放在最前面说，
  否则读者会被 52,377★ 误导成「一个活跃的编排框架」。**
  官方 README 首屏自己写明了这家公司在 2023 年框架上线后「undergone an evolution」，
  并把 primary focus 转向 LlamaParse（文档解析 / agentic OCR）与基准测试（ParseBench / ExtractBench）。
  **对本条的直接影响**：README 把"Build end-to-end document agents with
  **Workflows** and Agent Builder"写在商业平台一节（链接指向 cloud/llamaagents），
  但**那是托管与 Agent Builder，不是 Workflows 的代码归属** —— 官方框架文档明示
  llama-index-core 仍含稳定版 Workflows（`llama_index.core.workflow`，2026-10-08 核验）。
  **OSS 框架现在实质提供的是：数据接入 + 索引/图结构 + 检索查询接口 + 300+ 集成 + Workflows 编排。**
  README 的 Proposed Solution 四条原文（本条对其身份的准确描述）：
  "data connectors to ingest your existing data sources"、"ways to structure your data
  (indices, graphs)"、"an advanced retrieval/query interface over your data"、
  "easy integrations with your outer application framework"。
  ⚠ **本站的收录判断**：按 v3 铁律「近 30 天有实质更新」它合格（推送 2026-09-29），
  但按「读者要不要用它做编排」这一实际问题，**它的答案已不是本站收录它的理由**。
  这条档案的价值在于**如实记录这个转折**，让读者知道 52k★ 背后的公司正在往哪走。

axes:
  model_access: >-
    **形态是「300+ 分散的集成包」，不是统一网关；官方称其为社区集成。**
    README 原文："There are **over 300 LlamaIndex integration packages** that work seamlessly
    with core, allowing you to build with your **preferred LLM, embedding, and vector store
    providers**."
    命名空间约定：`from llama_index.core.xxx` 是核心，
    `from llama_index.xxx.yyy` 是集成包（带 `.core` 用核心，不带用集成）。
    官方 integrations 页把这些包归为 "community integrations"（社区集成），
    README 说新集成需经维护者审核（"some integrations may be declined"）。
    **官方未公布集成包的质量分层与维护活跃度分级（已查 README 与 integrations 页）。**
  runtime: >-
    **OSS 形态是纯库，且有两个安装档位；托管运行在商业平台侧。**
    **① Starter**：`llama-index`（PyPI）—— 核心 + 一批常用集成的合集；
    **② Customized**：`llama-index-core` —— 只装核心，再按需从集成页挑包。
    框架本身是被 import 的库，集成方式是与外部应用框架对接
    （README Proposed Solution 第四条 "integrations with your outer application framework"）。
    官方另有一套托管/部署路径：LlamaAgents 的 `llamactl` CLI 可 "serve locally,
    and deploy to LlamaCloud or export for self-hosting"，LlamaCloud 另有托管 Index。
    **即托管是 LlamaCloud / LlamaAgents 那一层（商业），不是 OSS 自带的运行形态。**
  local_files: >-
    **它不是「agent 工作区」文件系统，而是「数据源接入 + 索引」层的本地文件读取。**
    官方 `SimpleDirectoryReader` 文档原文："the simplest way to load data from local
    files into LlamaIndex"，可传 `input_dir`、`recursive=True`、`exclude`、
    `required_exts`、`num_files_limit`，并支持 `fsspec` 远程文件系统（S3、GDrive 等）。
    索引默认存内存，官方示例可 `index.storage_context.persist()` 落到 `./storage`
    再 `load_index_from_storage` 重载。
    **本站按「索引层视角」记这一轴**：它读盘是为了把文档变成可检索的索引，
    与 Deep Agents 那种「agent 在工作区里改文件」不是一回事。
  background: >-
    **OSS 是库，没有「关机后继续跑」的托管执行；但编排（Workflows）仍留在 OSS。**
    **先纠正一个易被 README 误导的点**：README 把 Workflows 列在 LlamaParse 平台的
    Agents 节，但官方框架文档明示 Workflows 仍在开源核心里 ——
    "llama-index-core comes with a stable version of Workflows included"，
    import 路径为 `llama_index.core.workflow`，也可独立 `pip install llama-index-workflows`。
    **即编排并未被移出 OSS。** 至于后台执行：官方框架文档未提供「关机续跑」的托管运行时，
    进程要你自己跑；需要托管时走 LlamaAgents / `llamactl` 部署到 LlamaCloud 或自托管
    （原文 "deploy them to LlamaCloud or your own infrastructure"），那是平台侧。
  tools: >-
    **工具层两件事：社区 ToolSpec + 官方 MCP 接入包。**
    官方 tools 文档给出 `FunctionTool` / `QueryEngineTool` 与
    "Community contributed ToolSpecs"，并有 Utility Tools 处理「工具返回超大输出」
    （`OnDemandLoaderTool` / `LoadAndSearchToolSpec`）。
    **MCP：官方支持，且是独立包** —— 文档原文 "LlamaIndex provides robust support for
    consuming MCP servers through the `llama-index-tools-mcp` package"，
    支持 SSE / Streamable HTTP / stdio 三种传输，还能把 Workflow 反发布为 MCP server；
    官方另托管 `mcp.llamaindex.ai`（文档检索 / LlamaParse 的 MCP 服务）。
  context: >-
    **这一维度官方有具体机制，不是空白。**
    README 对框架的定位是 "data framework"，核心能力是 structure your data
    （indices, graphs）+ retrieval/query interface —— 即处理「把外部数据变成可检索的上下文」。
    **检索后如何塞进上下文窗口，官方用 Response Synthesizer 回答**（原文）：
    `compact`（默认）"stuff as many text ... that can fit within the context window"、
    `refine`（逐块精炼）、`tree_summarize`（递归摘要）、`simple_summarize`（截断到单 prompt）。
    **这就是它的上下文裁剪与摘要机制**：先按窗口装箱，装不下再切块，摘要类模式做压缩。
  permissions: >-
    **⚠ 本站明确的重大信息缺口，选型前必须自己确认。**
    README 全文**没有任何沙箱、文件权限模型、网络访问控制或人工确认机制的表述**。
    与本站收录的其它编排框架对照：
    Google ADK 有 Tool Confirmation（HITL）、CrewAI 有 guardrails（机制未说明）、
    LangGraph 有 interrupts（可检查并修改状态）——
    **LlamaIndex 在这一维度上 README 里连一个名词都没有。**
    ⚠ 需特别注意：由于它的主战场是文档解析与 RAG，
    **它处理的通常是用户上传的数据，这本身是一个与「agent 动你本地文件」性质不同的风险面**，
    但 README 未讨论数据权限与隔离。
  fit: >-
    **适合**：核心任务是把外部数据源（API / PDF / 文档 / SQL）接进来做检索与问答，
    需要 300+ 现成集成里的某一个；团队 Python 栈；
    或明确要用 LlamaParse 的解析能力（那走商业平台）。
    **不太适合**：需要 agent 在自己项目目录里读写文件并跑命令
    （那是 Deep Agents 那一类「工作区文件系统」）；需要明确的沙箱与权限边界
    （官方框架文档无此类机制）；需要「关机后托管续跑」（走 LlamaAgents 平台侧）。

pitfalls:
  - 看到 52k★ 就以为是「一个活跃的编排框架」—— **官方首屏已声明 primary focus 转向文档解析**
  - 以为 workflow / agent 编排在 OSS 里 —— README 把 Workflows 写在商业平台 LlamaAgents 那一节
  - 把 LlamaIndex 的「data connectors」与 Deep Agents 的「filesystem」混为一谈 ——
  前者是数据源接入与解析，后者是 agent 的工作区文件操作
  - 把 LlamaParse 当免费开源件—— 它是商业平台，需注册取 key
  - 以为 300+ 集成等于都同等可靠 —— 官方原话 work seamlessly，本站未实测对齐度
  - 没注意 README 自己写的 NOTE —— 原文"This README is not updated as frequently as the documentation"

tags: [Python, 开源, MIT, 编排框架, RAG, 数据接入, 文档解析, 检索, 集成生态, 战略转移, 商业平台]
related: [memory]

sources:
  - label: run-llama/llama_index · 仓库（52,377★，MIT，核验 2026-10-01）
    url: https://github.com/run-llama/llama_index
    kind: repo
  - label: 主 README（首屏 NOTE 战略声明、两个安装档位与命名空间规则、LlamaParse 商业段、Proposed Solution 四条）
    url: https://github.com/run-llama/llama_index/blob/main/README.md
    kind: docs
  - label: 官方文档 · LlamaIndex Framework（README 指向）
    url: https://developers.llamaindex.ai/python/framework/
    kind: docs
  - label: 官方文档 · LlamaAgents（Workflows / Agent Builder，**商业平台侧**）
    url: https://developers.llamaindex.ai/python/llamaagents/overview/
    kind: docs
  - label: LlamaParse 商业平台（README 称其为 enterprise platform）
    url: https://cloud.llamaindex.ai
    kind: docs
  - label: LlamaParse 官方定价页（Free/Starter/Pro 三档credits 额度、加购上限、1,000 credits = $1.25、LiteParse 免费 OSS，核验 2026-10-01）
    url: https://www.llamaindex.ai/pricing
    kind: pricing
  - label: run-llama/liteparse · 免费快速文本解析器（官方另立项目）
    url: https://github.com/run-llama/liteparse
    kind: repo
  - label: Releases（v0.14.25 @ 2026-09-21）
    url: https://github.com/run-llama/llama_index/releases
    kind: changelog
  - label: 官方文档 · Workflows（`llama_index.core.workflow` 仍在 OSS core，核验 2026-10-08）
    url: https://developers.llamaindex.ai/python/framework/module_guides/workflow/
    kind: docs
  - label: 官方文档 · MCP（`llama-index-tools-mcp` 消费 MCP、Workflow 转 MCP server）
    url: https://developers.llamaindex.ai/python/framework/module_guides/mcp/llamaindex_mcp/
    kind: docs
  - label: 官方文档 · Response Synthesizers（compact/refine/tree_summarize 的窗口装箱与摘要）
    url: https://developers.llamaindex.ai/python/framework/module_guides/querying/response_synthesizers/
    kind: docs
  - label: 官方文档 · SimpleDirectoryReader（本地目录读取、fsspec 远程文件系统）
    url: https://developers.llamaindex.ai/python/framework/module_guides/loading/simpledirectoryreader/
    kind: docs
  - label: 官方文档 · 社区集成（300+ 集成包被归为 community integrations）
    url: https://developers.llamaindex.ai/python/framework/community/integrations/
    kind: docs

link:
  url: https://developers.llamaindex.ai/
  kind: official

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**⚠ 但先得说清一件事：官方已明确把公司重心从「编排框架」移走了。**

README 首屏 NOTE 段落原文（核验 2026-10-01）：

> The **current focus** of LlamaIndex is to build the best AI-powered engine for
> **document parsing and extraction**. **LlamaParse** is our **enterprise platform** for
> agentic OCR, parsing, extraction, indexing and more.
>
> ...the company itself has undergone an **evolution** since when this OSS framework
> first launched 3 years ago in 2023.
>
> While we still have the OSS framework available as an open toolkit that you're welcome
> to use, **our primary focus has shifted towards LlamaParse**...

**这句话的选型含义很直接**：
公司的资源向文档解析倾斜是真的，**但编排能力没有离开 OSS** ——
README 只是把 Workflows 写在商业平台那一节（链接指向 `cloud/llamaagents`），
官方框架文档则明示 `llama-index-core` 仍含稳定版 Workflows（2026-10-08 核验）。

**OSS 框架现在实质提供的是**：数据接入 + 索引/图结构 + 检索查询接口 + 300+ 集成 + Workflows 编排。
README 自己的 Proposed Solution 四条说得很准：

> - **data connectors** to ingest your existing data sources and data formats (APIs, PDFs, docs, SQL, etc.)
> - ways to **structure your data** (indices, graphs)
> - an **advanced retrieval/query interface** over your data
> - easy **integrations with your outer application framework**

**本站的收录判断**：它符合 v3 铁律的收录标准（推送 2026-09-29，仍活跃），
但这条档案的**真正价值是如实记录这个转折** ——
让读者知道 52,377★ 背后的公司正在往文档解析 / agentic OCR 走，
而那是 LlamaParse 与 ParseBench 的战场，不是这个开源框架的。

## 两个安装档位：它少见的清晰之处

README 给的两种起步方式（这比很多框架写得更清楚）：

| 档位 | 包 | 适合 |
|---|---|---|
| **Starter** | `llama-index` | 核心 + 一批常用集成，想省事 |
| **Customized** | `llama-index-core` | 只装核心，按需从集成页挑 |

**命名空间规则值得记**（README 代码示例）：

```python
from llama_index.core.xxx import ClassABC      # 带 .core = 核心
from llama_index.xxx.yyy import SubclassABC    # 不带 = 集成包
```

⚠ **一个定位缺口**：README 里**没有 CLI 启动命令、没有 Web UI、没有容器部署示例**。
对比本站收录的 Google ADK（有 `adk deploy docker` / `cloud_run`）、
OpenHands（四种部署形态）—— **LlamaIndex 是库，不是平台。**

## 300+ 集成：优势也是维护负担

README 原文："There are **over 300 LlamaIndex integration packages** that work seamlessly
with core, allowing you to build with your **preferred LLM, embedding, and vector store providers**."

⚠ **官方原话是 "work seamlessly"，本站未实测任何跨 provider 的能力对齐度。**
选型时不能只看包名存在，得看具体那个集成包的维护状态与 issue。

## 最需要区分的一处：数据接入 ≠ agent 文件操作

这是本站认为最容易被误读的地方：

| 对象 |能力 | 性质 |
|---|---|---|
| **LlamaIndex** | data connectors 接入 API / PDF / docs / SQL，解析、索引、检索 | **数据源层** |
| **Deep Agents** | filesystem，agent 在工作区里读写文件 | **工作区层** |

**两者都叫「文件相关」，但完全不是一回事。** 选型时先问自己：
我要的是「把一堆文档变成可检索的知识库」，还是「让 agent 在我的项目目录里干活」？

## 上下文维度：它处理的是「获取」，不是「压缩」

README 对框架的定位原句是 "data framework"，核心能力是
structure your data + retrieval/query interface。

**本站的判断（推断）**：它解决的是「**把外部数据变成可检索的上下文**」——
在本站的坐标系里属于**上下文获取层**。

⚠ **未核验**：检索结果如何裁剪以适配上下文窗口、
README 里**没有任何压缩 / 摘要机制的表述**。

## 权限维度：README 里连一个名词都没有

这是本站明确的重大信息缺口。对照同家族的其它三个：

| 对象 | 权限机制 | 来自 |
|---|---|---|
| Google ADK | Tool Confirmation（HITL） | README 明文 |
| LangGraph | interrupts（可检查并修改状态） | README 明文 |
| CrewAI | guardrails（只有名字） | 配置项清单 |
| **LlamaIndex** | **无** | **README 全文无相关表述** |

⚠ **一个补充判断**：由于它的主战场是文档解析与 RAG，
它处理的是**用户上传的数据** —— 这本身是一个与「agent 动你本地文件」
性质不同的风险面（数据泄露面 vs 主机操作面），但 README 未讨论数据权限与隔离。

## 适合与不适合

**适合**：核心任务是把外部数据源接进来做检索与问答；需要 300+ 集成里的某一个。
**不适合**：主要目的是多 Agent 编排 / 工作流（**那部分在商业平台 LlamaAgents**）；
需要 agent 在工作区读写文件（那是 Deep Agents 那一类）；需要明确沙箱与权限边界。

## 核验说明

`confidence: partial` 的依据（2026-10-08 A6.2 更新）：

原三项「为什么不是 verified」已全部核实并写进维度：
① OSS 侧编排仍在（`llama_index.core.workflow`，官方框架文档）；
② 权限维度（官方未给沙箱/权限收敛机制，结论见 permissions 维度）；
③ MCP 支持（官方 `llama-index-tools-mcp`，含 SSE / HTTP / stdio）。
`confidence` 是否升级由上层批次统一裁定，本轮只更新维度与说明。

已核验：仓库存在与星数（52,377）、许可（MIT，经license API）、
最近推送（2026-09-29，仍活跃）、最新版 **v0.14.25**（releases @ 2026-09-21）、
README 全文 223 行（首屏 NOTE 战略声明全文、两个安装档位与命名空间规则、
LlamaParse 商业段七条、Proposed Solution 四条、Overview 段、
以及 README 自己声明的"not updated as frequently as the documentation"）

未核验：300+ 集成包的质量与维护分层、本地模型经 LiteParse 的集成方式、
检索结果的端到端上下文裁剪行为、LlamaParse 的 credits 换算口径（每页消耗未公开）

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按「战略是否真的转移」这个问题定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | 装 llama-index-core 后核对 `llama_index.core.workflow` 的 API 形态与版本 | 官方文档已明示仍在 core；实测确认可用的编排面 |
| 2 | 用 Starter 档跑一个「文档→ 检索问答」最小闭环 | 判断它现在的核心体验是否顺畅 |
| 3 | 数据接入的实际覆盖面（本次挑 PDF + SQL 各一种） | 「300+ 集成」与「API/PDF/docs/SQL」是两回事，要测具体那几个 |
| 4 | 换非OpenAI provider 后的检索质量与结构化输出 | 官方说 work seamlessly，需验证 |
| 5 | 检索结果在长文档下的上下文裁剪行为（合成模式已官方文档化） | 实际行为待实测 |
| 6 | 对比 LlamaIndex OSS 与 LlamaParse 的实际差距 | 官方自己说 focus 已转移，差距有多大要亲自看 |

## 未知项清单

- 300+ 集成包的官方 vs 社区比例与维护活跃度分层
- 检索结果的端到端上下文裁剪行为（合成模式已有官方文档，实际行为待实测）
- LlamaParse 的 credits 换算口径（官方只给单价，不给每页消耗）
- LiteParse 与框架的集成方式
- TypeScript 版的能力对齐度
- README 自己声明更新频率低于文档 —— 细节需查文档站而非 GitHub

## 相关条目

- [LangGraph](./langgraph.md) — **编排家族对照，且最能说明转向问题**：LangGraph 把状态持久化做在核心（每 superstep checkpoint）且完全 OSS；LlamaIndex 的 Workflows 同样仍在 OSS core，但公司的投入重心已转向文档解析 —— 对照点是「重心」而不是「归属」。
- [Google ADK](./google-adk.md) — 同为编排家族但重心不同：ADK 给的是 agent 工作流的图执行引擎 + 三种部署命令；LlamaIndex 给的是数据接入与检索。两者都不是「谁能接 300+ 集成」这一格。
- [CrewAI](./crewai.md) — 同为编排框架，抽象中心不同（Crew 角色协作 / Flow 事件驱动 vs 数据管线与检索）。
- [Deep Agents](./deepagents.md) — **最需要区分的一对**：Deep Agents 的 filesystem 是 agent 工作区文件操作，LlamaIndex 的 data connectors 是数据源接入与解析 —— 常被混为一谈。
