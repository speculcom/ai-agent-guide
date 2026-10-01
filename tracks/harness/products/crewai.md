---
id: crewai
track: harness
family: orchestration
name: CrewAI
vendor: CrewAI Inc
homepage: https://crewai.com
mark: CA
accent: "#EB6658"
stars: 59246
license: MIT
latest_version: 1.15.23
language: Python

# 支持哪些模型 provider（本站第一决策点）
providers:
  - 默认走 OpenAI API（README 明示）
  - 可接本地模型：官方点名Ollama 工具（README 明示），LM Studio 亦可（README FAQ）
  - 完整 provider 清单见官方 llm-connections 文档（本次未取到正文）

pricing:
  model: open-source
  monthly_usd: null
  monthly_label: 框架免费（MIT）；企业线为 CrewAI AMP（商业控制面，报价未核验）
  note: >-
    **开源部分与商业部分要分清。**
    核验依据：仓库 MIT（经 license API）、README 的 pip 安装路径。
    商业线是 README 单列一节的 **Crew Control Plane**（对外称 CrewAI AMP），
    官方描述里含"Advanced Security: Built-in robust security and compliance measures"、
    "24/7 Support"、"On-premise and Cloud Deployment Options" —— 这三项都是商业产品特征。
    **AMP 的定价、是否可自托管、是否必须联网授权，本站均未核验。**
pricing_pitfalls:
  - 把 Crew Control Plane 的能力当成开源版自带 —— tracing/可观测/集中管控/企业安全/24×7 支持是 AMP 的卖点
  - 以为「框架 MIT 免费」等于零成本 —— 默认接OpenAI API，推理费用自理
  - 以为本地模型要走改代码 —— 官方点名Ollama 与 LM Studio 工具，属配置项

# 三层定位（v3 计划 §5.4：同生态易混淆，本字段强制）
layer_position: >-
  **本站三个编排框架里抽象层次最「业务化」的一个** —— 另两个（Google ADK、LangGraph）
  都用图/节点/状态这类系统词汇，CrewAI 用的是 **Crew（角色/目标/任务）与 Flow（事件驱动流程）** 这套业务比喻。
  官方自述："Framework for orchestrating **role-playing**, autonomous AI agents."
  **它最独特的设计是双抽象并存**（README Key Features 前两条原文）：
  "**Crews for autonomy**: Model teams of specialized AI agents with **roles, goals, tools, and tasks**."
  "**Flows for control**: Build event-driven workflows with **state, branching, routing**, and production logic."
  官方对两者分工的说明很直白（README FAQ 原句）：
  "Crews provide **autonomous agent collaboration**, ideal for tasks requiring flexible decision-making and dynamic interaction.
  Flows offer **precise, event-driven control**, ideal for managing detailed execution paths and **secure state management**.
  You can **seamlessly combine both**."
  **这构成本站编排家族里最好用的一张对照轴**：
  | | Crew（自治） | Flow（控制） |
  |---|---|---|
  | 抽象 | 角色/目标/任务 | 事件、状态、分支、路由 |
  | 适合 | 需要灵活决策的协作 | 需要精确执行路径 |
  | 官方类比 | 团队协作 | 业务流程|
  **与本站「状态≠ 上下文」主张的关系**：Flow 明确管state management，
  且 checklist 里把 **checkpointing** 与 memory 并列为「as your system grows」才需要加的能力 ——
  即**官方自己把它们定位成进阶项，不是默认机制**。这点与其他对象不同，值得单独记。

axes:
  model_access: >-
    **官方给了明确的默认与本地路径，是本站编排框架里对模型接入说得最具体的。**
    README「Connecting Your Crew to a Model」原文：
    "CrewAI supports using various LLMs through a variety of connection options.
    By default your agents will use the **OpenAI API** when querying the model.
    However, there are several other ways to allow your agents to connect to models.
    For example, you can configure your agents to use a **local model via the Ollama tool**."
    README FAQ 补充：**LM Studio** 也能接（"Tools like Ollama and LM Studio allow seamless integration"）。
    **这一条对本站读者特别有价值**：本地量化模型在这三个编排框架里，
    只有 CrewAI 在 README 首屏级别点名了具体工具。
    ⚠ **未核验**：完整 provider 清单（官方文档 `learn/llm-connections` 本次未取到正文）、
    换 provider 后工具调用与 structured output 的可靠性。
  runtime: >-
    **纯库，官方口径是「从原型到生产不用换框架」。**
    安装是 pip 包（README Getting Started 走 pip install + crewai CLI），
    无托管服务。README「When to Use CrewAI」里的一句值得引用作为定位依据：
    "Move from experiment to production **without changing frameworks**."
    **它对状态持久化是「随系统成长再加」的定位**（README 两处原文）：
    "Add tools, memory, **checkpointing**, and async execution **as your system grows**"、
    "Add deterministic steps, human input, structured outputs, and **checkpointing as your system grows**"。
    ⚠ **未核验**：checkpointing 的落盘粒度与后端（对比 LangGraph 的
    "save graph state at every superstep" 有明确说明，本条 README 未给）。
  local_files: >-
    **⚠ 不在它职责范围内。**
    README 里文件系统不是一项能力，没有给默认的文件访问边界或沙箱机制。
    ⚠ **未核验**：容器部署时的默认权限（README 未涉及部署形态）、
    本地运行时 agent 对文件系统的访问范围。
  background: >-
    **Flow 的 state management 是官方明文，checkpointing 的定位是「按需添加」。**
    README 里 Flow 的描述包含 "event-driven workflows with **state, branching, routing**"，
    FAQ 进一步说 Flow 适合 "detailed execution paths and **secure state management**"。
    示例代码（README「Using Crews and Flows Together」段）显示状态是**结构化 Pydantic 模型**：
    `class MarketState(BaseModel)`，Flow[MarketState] 里直接读写 `self.state.sentiment` 等字段，
    并按 `self.state.confidence` 的数值阈值分支。
    **这就是本站要找的「状态」** —— 显式、结构化、可分支判断。
    ⚠ **但落盘与跨进程恢复本站未核验**：README 说 checkpointing 是
    "as your system grows" 才加的进阶项，没说默认有没有。
  tools: >-
    **官方明确列了 MCP 与 A2A 两项，这是它的一个强项。**
    README Key Features 原文："Use tools, **memory, knowledge, checkpointing**, async execution,
    and **MCP/A2A support** for more capable production agents."
    另外 README 里CrewAI 自己托管了一个文档 MCP server（`docs.crewai.com/mcp`），
    可供 AI 编程助手查询它的 API 细节（README「Build with AI」段提到的 `ask-docs`）。
    ⚠ **未核验**：MCP 是核心依赖还是可选 extra（README 未说明；
    对比 OpenAI Agents SDK 把 `mcp>=1.19.0` 放在 `dependencies` 里）。
    **A2A（Agent-to-Agent）** 是本站首次出现的协议名，其规范与实践本站未研究。
  context: >-
    **⚠ memory 与 knowledge 出现了，但压缩/摘要策略未核验。**
    README 出现的与记忆相关的表述有两处，均无机制细节：
    Key Features 里的 "memory, **knowledge**, checkpointing"、
    以及「Build with AI」段展示的 agent 配置项清单
    "Configuring agents — role, goal, backstory, tools, LLMs, **memory**, guardrails"。
    **官方没有区分「工作记忆」与「长期记忆」**（这一点与
    [LangGraph](langgraph.md) 明确区分 working memory / persistent memory across sessions 形成对照）。
    ⚠ **未核验**：memory 的作用域（单 agent / 单 crew / 全局）、
    存储后端、裁剪或摘要策略、知识（knowledge）与记忆的关系。
  permissions: >-
    **⚠ 本维度是本站最明显的缺口：只有 guardrails 一项，且机制未核验。**
    README 出现 guardrails 的唯一位置是 agent 配置项清单
    （"role, goal, backstory, tools, LLMs, memory, **guardrails**"），
    **没有任何机制说明** —— 是输出校验、是权限边界、还是人工确认，均未说明。
    对照本站其它对象：OpenAI Agents SDK 的 guardrails 明确分 input/output 双向校验 +
    human-in-the-loop；Google ADK 的 Tool Confirmation 明确是「执行前确认」；
    LangGraph 的 interrupts 明确是「改状态」。**CrewAI 这一项三样都不是。**
    ⚠ **未核验**：guardrails 的类型与强度、沙箱机制、文件与网络访问控制。
  fit: >-
    **适合**：任务能被表述成「一支有角色分工的团队」（Crews）；
    需要业务逻辑留在普通 Python 里并显式控制执行路径（Flows）；
    想在本地模型上跑（官方点名 Ollama / LM Studio）；
    需要 MCP 与 A2A 接入；Python 栈。
    **不适合**：需要官方明确的沙箱或文件/网络权限边界（本站未核验其机制）；
    需要把「工作记忆」与「跨会话长期记忆」分开管理（LangGraph 有明确表述）；
    需要 checkpointing 开箱即用（官方把它定位为「随系统成长再加」的进阶项）。

pitfalls:
  - 以为是「角色扮演玩具」—— 官方定位是 production-grade，README 明写 Move from experiment to production without changing frameworks
  - 把 Crew Control Plane 的能力当成开源版自带 —— tracing / 集中管控 / 企业安全 / 24×7 支持 /本地与云部署都是 CrewAI AMP 的卖点
  - 以为 memory 和 knowledge 是两套持久化 —— README 只并列了名词，没有任何机制说明
  - 把 guardrails 当权限护栏 —— README 只在配置项清单里列了这个名字，机制未说明
  - 以为 checkpointing 默认就有 —— 官方两处都写成 as your system grows，是进阶项
  - 以为开了 Flow 就有状态持久化 —— Flow 给的是 state management，落盘与跨进程恢复未核验

tags: [Python, 开源, MIT, 编排框架, 多Agent, Crew, Flow, 事件驱动, 状态管理, MCP, A2A, Ollama, 本地模型, 角色分工]

sources:
  - label: crewAIInc/crewAI · 仓库（59,246★，MIT，核验 2026-10-01）
    url: https://github.com/crewAIInc/crewAI
    kind: repo
  - label: 主 README（Crews/Flows 双抽象、七项 Key Features、Crew Control Plane 商业段、模型接入、FAQ）
    url: https://github.com/crewAIInc/crewAI/blob/main/README.md
    kind: docs
  - label: 官方文档 · Connect CrewAI to LLMs（README 指向，完整 provider 清单）
    url: https://docs.crewai.com/en/learn/llm-connections
    kind: docs
  - label: CrewAI AMP（商业控制面，本次未取到页面）
    url: https://crewai.com
    kind: docs
  - label: Releases（1.15.23 @ 2026-09-28）
    url: https://github.com/crewAIInc/crewAI/releases
    kind: changelog
  - label: crewAI-examples · 官方示例集
    url: https://github.com/crewAIInc/crewAI-examples
    kind: repo
  - label: CrewAI 文档 MCP server（README「Build with AI」段提到）
    url: https://docs.crewai.com/mcp
    kind: docs

link:
  url: https://crewai.com
  kind: official

related:
  - id: google-adk
    note: **编排家族对照**：同为图/流程编排，ADK 用 Workflow Runtime 的节点与路由，CrewAI 用 Crew（角色协作）+ Flow（事件驱动）两套抽象。CrewAI 另给了 MCP/A2A 支持。
  - id: langgraph
    note: **状态持久化路线的差别最大的一条**：LangGraph 明确给出「每 superstep 落盘 checkpoint」，CrewAI 把 checkpointing 定位成「随系统成长再加」的进阶项，粒度与后端均未核验。
  - id: deepagents
    note: 同属「快速起步」一侧，但抽象不同：Deep Agents 是 batteries-included harness，CrewAI 是 Crew/Flow 双抽象的编排框架。
  - id: openai-agents-sdk
    note: 反面对照：那个是单 agent 原语 + 明确的 guardrail 机制；CrewAI 的权限维度目前只有 guardrails 一个未说明机制的名词。

last_verified: 2026-10-01
last_updated: 2026-10-01
lifecycle: active
confidence: partial
---

## 一句话定位

**「用角色分工和业务流程来组织多 agent 协作」** —— 官方自述：

> Framework for orchestrating **role-playing**, autonomous AI agents.

**「role-playing」这个词容易让人低估它**—— 同一份 README 里也写着
production-grade，并明确承诺 "Move from experiment to production **without changing frameworks**"。

## 双抽象是它最好用的一张对照轴

README 的 Key Features 前两条就是这个：

| 官方原句 | 抽象 | 适合 |
|---|---|---|
| **Crews for autonomy**: Model teams of specialized AI agents with **roles, goals, tools, and tasks** | 角色/目标/任务 | 需要灵活决策的协作 |
| **Flows for control**: Build event-driven workflows with **state, branching, routing** | 事件/状态/分支/路由 | 需要精确控制执行路径 |

FAQ 里官方把分工讲得更直白：

> Crews provide **autonomous agent collaboration**, ideal for tasks requiring flexible
> decision-making and dynamic interaction. Flows offer **precise, event-driven control**,
> ideal for managing detailed execution paths and **secure state management**.
> You can seamlessly combine both.

**这一段是本站编排家族里最好用的一句话** ——
「需要弹性用 Crew，需要精确用 Flow，可以混用」，
比「它是什么框架」的回答更能帮人做决定。

## 状态：Flow 的 state management 是显式且结构化的

README 示例代码（`Using Crews and Flows Together` 段）把状态做成了 Pydantic 模型：

```python
class MarketState(BaseModel):
    ...

class AdvancedAnalysisFlow(Flow[MarketState]):
    def run(self):
        self.state.sentiment = "analyzing"
        if self.state.confidence > 0.8:
            ...
        elif self.state.confidence > 0.5:
            ...
```

**这就是本站要找的「状态」** —— 显式、结构化、可按数值阈值分支。

⚠ **但落盘与跨进程恢复本站未核验。** 关键线索是官方把 checkpointing 写成**按需添加**，
README 两处原话都加了限定语：

- "Add tools, memory, **checkpointing**, and async execution **as your system grows**"
- "Add deterministic steps, human input, structured outputs, and **checkpointing as your system grows**"

**这与 [LangGraph](./langgraph.md) 形成本站编排家族里最值得看的一组对照**：

| | LangGraph | CrewAI |
|---|---|---|
| 状态落盘 | ✅ **每 superstep 落盘**（官方明文：save graph state at every superstep） | ⚠ checkpointing 定位为「随系统成长再加」 |
| 落盘粒度 | superstep（图的一个步进） | 未核验 |
| 持久化后端 | 有独立子包（SQLite / Postgres） | 未核验 |
| 跨进程恢复 | 官方承诺 "resuming from exactly where they left off" | 未核验 |

## 模型接入：三个编排框架里对本地模型最友好的一个

README「Connecting Your Crew to a Model」原文：

> By default your agents will use the **OpenAI API** when querying the model. However,
> there are several other ways... For example, you can configure your agents to use a
> **local model via the Ollama tool**.

FAQ 补充 **LM Studio** 也能接。

**这一点对本站读者有实际价值**：要拿本地量化模型跑编排框架，
CrewAI 是三个编排对象里唯一在 README 首屏级别点名具体工具的。

⚠ 未核验：完整 provider 清单（官方文档 `learn/llm-connections` 未取到正文）、换 provider 后的能力对齐度。

## 工具：MCP 与 A2A 都写了

Key Features 一条原文：

> Use tools, **memory, knowledge, checkpointing**, async execution, and **MCP/A2A support**
> for more capable production agents.

⚠ 未核验：MCP 是核心依赖还是可选 extra（README 未说明）。
⚠ **A2A（Agent-to-Agent）是本站首次出现的协议名**，其规范与实践本站尚未研究。

另外有个有意思的细节：CrewAI 自己托管了一个文档 MCP server
（`docs.crewai.com/mcp`），README「Build with AI」段提到有个 `ask-docs` 配置
可以「查询 CrewAI 的实时文档 MCP server 获取最新 API 细节」——
**它用自己的 MCP server 来喂 AI 编程助手，属于 MCP 的一个真实自用案例。**

## 权限维度：只有 guardrails 一个名字，机制未说明

这是本站最想标出来的缺口。README 里 guardrails 出现的地方只有一处 ——
agent 配置项清单：

> Configuring agents — role, goal, backstory, tools, LLMs, memory, **guardrails**

**没有任何机制说明。** 对照本站其它对象：

| 对象 | 机制 | 层次 |
|---|---|---|
| OpenAI Agents SDK | guardrails（input + output 双向校验） | 校验**内容** |
| Google ADK | Tool Confirmation | 拦**执行** |
| LangGraph | interrupts | 改**状态** |
| **CrewAI** | **guardrails（只有名字）** | **不明** |

**这三样 CrewAI 都不是** —— 它也没提沙箱、文件权限模型、网络访问控制。
⚠ 这一项**要自己验证**，别默认它有边界保护。

## 记忆：有名词，无机制

README 出现 memory / knowledge 两处，均无细节：

- Key Features："memory, **knowledge**, checkpointing"
- 配置项清单："role, goal, backstory, tools, LLMs, **memory**, guardrails"

**官方没有区分「工作记忆」与「跨会话长期记忆」** ——
这与 [LangGraph](./langgraph.md) 明确区分
*short-term working memory* 与 *long-term persistent memory across sessions* 是鲜明对照。

⚠ 未核验：memory 的作用域（单 agent / 单 crew / 全局）、存储后端、裁剪或摘要策略、
knowledge 与 memory 的关系。

## 商业线：Crew Control Plane（AMP）要分清

README 单列一节 Crew Control Plane Key Features，七项全是商业产品特征：

- Tracing & Observability（实时指标、日志、trace）
- Unified Control Plane（集中管控与扩缩）
- Seamless Integrations（企业系统集成）
- **Advanced Security**（官方原文："Built-in robust security and compliance measures"）
- 24/7 Support（专属企业支持）
- **On-premise and Cloud Deployment Options**（CrewAI AMP 两种部署形态）

⚠ 未核验：AMP 的定价、是否可完全自托管、是否必须联网授权。

**注意其中「Advanced Security」这一条** ——
如果你用 CrewAI 的理由之一是权限边界，**开源版并没有这一项**。

## 适合与不适合

**适合**：任务能被表述成「一支有角色分工的团队」；需要业务逻辑留在普通 Python 里
并显式控制执行路径；想在本地模型上跑；需要 MCP 与 A2A。
**不适合**：需要官方明确的沙箱或文件/网络权限边界；需要把工作记忆与长期记忆分开管理；
需要 checkpointing 开箱即用。

## 核验说明

`confidence: partial` 的依据：

**为什么不是 verified**：`permissions` 维度只拿到一个没有任何机制说明的
guardrails 名词；`local_files`、`context` 两维也只有名词没有机制。
**这四维拿不到 verified，是因为官方 README 本身就没给，不是本站没查到。**

已核验：仓库存在与星数（59,246）、许可（MIT，经 license API）、
最近推送（2026-10-01，仍活跃）、最新版 **1.15.23**（releases @ 2026-09-28）、
README 全文 741 行的关键段落（Why CrewAI 七条、Crew Control Plane 七条、
七项 Key Features、模型接入段与 Ollama/LM Studio、Crews/Flows 对照的 FAQ、
When to Use CrewAI 五条、MarketState 结构化状态示例、Telemetry 与 License 段）

未核验：guardrails 的类型与强度、沙箱与文件/网络访问控制、
memory 的作用域与存储后端、knowledge 与 memory 的关系、
checkpointing 的落盘粒度与后端、完整 provider 清单、MCP 是否为核心依赖、
A2A 规范、CrewAI AMP 的定价与部署形态

## 实测记录

本站尚未完成实测。测试协议见 [tasks/_protocol.md](../tasks/_protocol.md)。

**实测建议**（按编排框架 + 角色抽象维度定制）：

| # | 测什么 | 为什么值得测 |
|:--:|---|---|
| 1 | 同一需求用 Crew 实现 vs 用 Flow 实现，代码量与可读性差多少 | 验证双抽象是否真的各有用处 |
| 2 | 用 Ollama 接本地量化模型跑完一个 Crew | 官方点名支持，值得验证真实可行性 |
| 3 | **guardrails 到底拦什么**（输出校验？工具调用？文件访问？） | 本站最大的缺口，选型前必须清 |
| 4 | checkpointing 开箱状态：默认有没有、开箱在哪 | 官方写「随系统成长再加」，要确认默认行为 |
| 5 | Crew 之间传递信息的开销（角色扮演的 token 成本） | 角色协作通常吃 token，要量 |
| 6 | Flow 的 state 在崩溃后能否恢复 | 与 LangGraph 的 superstep 落盘对比 |

## 未知项清单

- guardrails 的类型、强度与拦截范围
- 沙箱机制、文件与网络访问控制的默认值
- memory 的作用域、存储后端、裁剪与摘要策略
- knowledge 与 memory 的关系
- checkpointing 的落盘粒度、后端与跨进程恢复语义
- 完整 provider 清单与换provider 的能力对齐度
- MCP 是核心依赖还是可选 extra
- A2A（Agent-to-Agent）规范与生态现状
- CrewAI AMP 的定价、部署形态与授权方式
- MCP/A2A 接入的实际使用门槛

## 相关条目

- [Google ADK](./google-adk.md) — 编排家族对照：Workflow Runtime 节点路由 vs Crew/Flow 双抽象
- [LangGraph](./langgraph.md) — **状态持久化路线差别最大的一条**：每 superstep checkpoint vs 按需添加
- [Deep Agents](./deepagents.md) — 同属快速起步一侧，但它是 batteries-included harness
- [OpenAI Agents SDK](./openai-agents-sdk.md) — 反面对照：那个的权限机制是明确写出来的