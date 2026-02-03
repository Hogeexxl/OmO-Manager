# Oh-My-OpenCode: Agents 与 Categories 定义汇总

> **数据来源**: 官方 GitHub 仓库源码 [src/shared/model-requirements.ts](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/src/shared/model-requirements.ts)
> **注意**: 以下 "opencode" 指的是官方定义的内置 Provider，而非你本地的配置。

## 1. Agents 定义 (11 个)

Agents 是系统中的执行实体，拥有特定人格和职责。以下是基于源码 `AGENT_MODEL_REQUIREMENTS` 提取的精确回退链。

**符号说明**: `Model` (Variant) `[Providers...]` → `Next Fallback`

| Agent | 职责 (Responsibility) | 首选模型 (Model ID) | 完整回退顺位 |
| :--- | :--- | :--- | :--- |
| **Sisyphus** | **主要编排者** (Primary Orchestrator)。负责整体任务分解和调度。 | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `glm-4.7` [zai-coding-plan] → `glm-4.7-free` [opencode] |
| **Atlas** | **总控编排者** (Master Orchestrator)。持有 Todo List，管理长任务。 | `k2p5` / `claude-sonnet-4-5` | `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **Prometheus** | **战略规划** (Strategic Planning)。负责顶层设计和方案规划。 | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **Hephaestus** | **深度工匠** (Deep Worker)。专用于复杂编码。 | `gpt-5.2-codex` | 无fallback |
| **Oracle** | **顾问/调试** (Consultation)。用于咨询、Code Review 和调试。 | `gpt-5.2` | `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] |
| **Librarian** | **知识库/搜索** (Librarian)。负责文档检索和 GitHub 搜索。 | `glm-4.7` | `glm-4.7` [zai-coding-plan] → `glm-4.7-free` [opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] |
| **Explore** | **极速探索** (Fast Contextual Grep)。快速代码库搜索。 | `grok-code-fast-1` | `grok-code-fast-1` [github-copilot] → `claude-haiku-4-5` [anthropic, opencode] → `gpt-5-nano` [opencode] |
| **Multimodal-Looker** | **多模态分析** (Media Analyzer)。处理 PDF、图像。 | `gemini-3-flash` | `gemini-3-flash` [google, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] → `glm-4.6v` [zai-coding-plan] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `claude-haiku-4-5` [anthropic, github-copilot, opencode] → `gpt-5-nano` [opencode] |
| **Metis** | **规划前分析** (Pre-planning Analysis)。 | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] |
| **Momus** | **方案审查** (Plan Reviewer)。 | `gpt-5.2` | `gpt-5.2` (medium) [openai, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] |
| **Sisyphus-Junior** | **委托执行者**。 | (N/A) | 通常由 Category 决定，本身无独立固定回退链。 |

---

## 2. Categories (任务分类) 定义 (8 个)

Categories 是任务的**特定领域预设**。配置特定 Category 可以让系统选择最适合的模型和 Provider。基于源码 `CATEGORY_MODEL_REQUIREMENTS`。

| Category | 适用场景 | 首选模型 (Model ID) | 完整回退顺位 |
| :--- | :--- | :--- | :--- |
| **visual-engineering** | **前端/视觉**。UI/UX、CSS、动画。 | `gemini-3-pro` | `gemini-3-pro` [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `glm-4.7` [zai-coding-plan] |
| **ultrabrain** | **深度逻辑**。复杂架构、算法。 | `gpt-5.2-codex` | `gpt-5.2-codex` (xhigh) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] |
| **deep** | **深度开发**。深层代码实现。 | `gpt-5.2-codex` | `gpt-5.2-codex` (medium) [openai, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] **(Requires `gpt-5.2-codex`)** |
| **artistry** | **创意/艺术**。高创造性任务。 | `gemini-3-pro` | `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] **(Requires `gemini-3-pro`)** |
| **quick** | **快速/琐事**。单文件修改、改错。 | `claude-haiku-4-5` | `claude-haiku-4-5` [anthropic, github-copilot, opencode] → `gemini-3-flash` [google, github-copilot, opencode] → `gpt-5-nano` [opencode] |
| **unspecified-low** | **低难杂项**。 | `claude-sonnet-4-5` | `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `gpt-5.2-codex` (medium) [openai, github-copilot, opencode] → `gemini-3-flash` [google, github-copilot, opencode] |
| **unspecified-high** | **高难杂项**。 | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **writing** | **写作/文案**。 | `gemini-3-flash` | `gemini-3-flash` [google, github-copilot, opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `glm-4.7` [zai-coding-plan] → `gpt-5.2` [openai, github-copilot, opencode] |
