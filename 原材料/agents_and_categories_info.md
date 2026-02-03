# Oh-My-OpenCode: Agents & Categories Official Definitions

> **Source**:
> - Fallback Chains: [src/shared/model-requirements.ts](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/src/shared/model-requirements.ts)
> - Category Descriptions: [src/tools/delegate-task/constants.ts](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/src/tools/delegate-task/constants.ts)
> - Agent Purposes: [src/agents/AGENTS.md](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/src/agents/AGENTS.md)

## 1. Agents (11)

**Fallback Chain**: `Model ID` (Variant) `[Providers...]` → `Next Fallback`

| Agent | Purpose (Source: src/agents/AGENTS.md) | Primary Model (ID) | Fallback Chain (Source: src/shared/model-requirements.ts) |
| :--- | :--- | :--- | :--- |
| **Sisyphus** | Primary orchestrator (fallback: kimi-k2.5 → glm-4.7 → gpt-5.2-codex → gemini-3-pro) | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `glm-4.7` [zai-coding-plan] → `glm-4.7-free` [opencode] |
| **Atlas** | Master orchestrator (fallback: kimi-k2.5 → gpt-5.2) | `k2p5` / `claude-sonnet-4-5` | `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **Prometheus** | Strategic planning (fallback: kimi-k2.5 → gpt-5.2) | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **Hephaestus** | Autonomous deep worker, "The Legitimate Craftsman" (requires gpt-5.2-codex, no fallback) | `gpt-5.2-codex` | `gpt-5.2-codex` (medium) [openai, github-copilot, opencode] **(Requires `gpt-5.2-codex`)** |
| **Oracle** | Consultation, debugging | `gpt-5.2` | `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] |
| **Librarian** | Docs, GitHub search (fallback: glm-4.7-free) | `glm-4.7` | `glm-4.7` [zai-coding-plan] → `glm-4.7-free` [opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] |
| **Explore** | Fast contextual grep (fallback: claude-haiku-4-5 → gpt-5-mini → gpt-5-nano) | `grok-code-fast-1` | `grok-code-fast-1` [github-copilot] → `claude-haiku-4-5` [anthropic, opencode] → `gpt-5-nano` [opencode] |
| **Multimodal-Looker** | PDF/image analysis | `gemini-3-flash` | `gemini-3-flash` [google, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] → `glm-4.6v` [zai-coding-plan] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `claude-haiku-4-5` [anthropic, github-copilot, opencode] → `gpt-5-nano` [opencode] |
| **Metis** | Pre-planning analysis (fallback: kimi-k2.5 → gpt-5.2) | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `k2p5` [kimi-for-coding] → `kimi-k2.5-free` [opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] |
| **Momus** | Plan validation (fallback: claude-opus-4-5) | `gpt-5.2` | `gpt-5.2` (medium) [openai, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] |
| **Sisyphus-Junior** | Category-spawned executor | (Inherits Category) | (See Category Fallback) |

---

## 2. Categories (8)

**Fallback Chain**: `Model ID` (Variant) `[Providers...]` → `Next Fallback`

| Category | Description (Source: src/tools/delegate-task/constants.ts) | Primary Model (ID) | Fallback Chain (Source: src/shared/model-requirements.ts) |
| :--- | :--- | :--- | :--- |
| **visual-engineering** | Frontend, UI/UX, design, styling, animation | `gemini-3-pro` | `gemini-3-pro` [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `glm-4.7` [zai-coding-plan] |
| **ultrabrain** | Use ONLY for genuinely hard, logic-heavy tasks. Give clear goals only, not step-by-step instructions. | `gpt-5.2-codex` | `gpt-5.2-codex` (xhigh) [openai, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] |
| **deep** | Goal-oriented autonomous problem-solving. Thorough research before action. For hairy problems requiring deep understanding. | `gpt-5.2-codex` | `gpt-5.2-codex` (medium) [openai, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gemini-3-pro` (max) [google, github-copilot, opencode] **(Requires `gpt-5.2-codex`)** |
| **artistry** | Complex problem-solving with unconventional, creative approaches - beyond standard patterns | `gemini-3-pro` | `gemini-3-pro` (max) [google, github-copilot, opencode] → `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gpt-5.2` [openai, github-copilot, opencode] **(Requires `gemini-3-pro`)** |
| **quick** | Trivial tasks - single file changes, typo fixes, simple modifications | `claude-haiku-4-5` | `claude-haiku-4-5` [anthropic, github-copilot, opencode] → `gemini-3-flash` [google, github-copilot, opencode] → `gpt-5-nano` [opencode] |
| **unspecified-low** | Tasks that don't fit other categories, low effort required | `claude-sonnet-4-5` | `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `gpt-5.2-codex` (medium) [openai, github-copilot, opencode] → `gemini-3-flash` [google, github-copilot, opencode] |
| **unspecified-high** | Tasks that don't fit other categories, high effort required | `claude-opus-4-5` | `claude-opus-4-5` (max) [anthropic, github-copilot, opencode] → `gpt-5.2` (high) [openai, github-copilot, opencode] → `gemini-3-pro` [google, github-copilot, opencode] |
| **writing** | Documentation, prose, technical writing | `gemini-3-flash` | `gemini-3-flash` [google, github-copilot, opencode] → `claude-sonnet-4-5` [anthropic, github-copilot, opencode] → `glm-4.7` [zai-coding-plan] → `gpt-5.2` [openai, github-copilot, opencode] |
