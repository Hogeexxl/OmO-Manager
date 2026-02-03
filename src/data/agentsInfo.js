// Agents 信息映射：职责和回退链
// 数据来源: 原材料/agents_and_categories_info.md
export const agentsInfo = {
  "sisyphus": {
    "responsibility": "主要编排者 (Primary Orchestrator)。负责整体任务分解和调度。",
    "fallbackChain": "claude-opus-4-5 (max) → k2p5 → kimi-k2.5-free → glm-4.7 → glm-4.7-free"
  },
  "atlas": {
    "responsibility": "总控编排者 (Master Orchestrator)。持有 Todo List，管理长任务。",
    "fallbackChain": "k2p5 → kimi-k2.5-free → claude-sonnet-4-5 → gpt-5.2 → gemini-3-pro"
  },
  "prometheus": {
    "responsibility": "战略规划 (Strategic Planning)。负责顶层设计和方案规划。",
    "fallbackChain": "claude-opus-4-5 (max) → k2p5 → kimi-k2.5-free → gpt-5.2 (high) → gemini-3-pro"
  },
  "hephaestus": {
    "responsibility": "深度工匠 (Deep Worker)。专用于复杂编码。",
    "fallbackChain": "无fallback"
  },
  "oracle": {
    "responsibility": "顾问/调试 (Consultation)。用于咨询、Code Review 和调试。",
    "fallbackChain": "gpt-5.2 (high) → gemini-3-pro (max) → claude-opus-4-5 (max)"
  },
  "librarian": {
    "responsibility": "知识库/搜索 (Librarian)。负责文档检索和 GitHub 搜索。",
    "fallbackChain": "glm-4.7 → glm-4.7-free → claude-sonnet-4-5"
  },
  "explore": {
    "responsibility": "极速探索 (Fast Contextual Grep)。快速代码库搜索。",
    "fallbackChain": "grok-code-fast-1 → claude-haiku-4-5 → gpt-5-nano"
  },
  "multimodal-looker": {
    "responsibility": "多模态分析 (Media Analyzer)。处理 PDF、图像。",
    "fallbackChain": "gemini-3-flash → gpt-5.2 → glm-4.6v → k2p5 → kimi-k2.5-free → claude-haiku-4-5 → gpt-5-nano"
  },
  "metis": {
    "responsibility": "规划前分析 (Pre-planning Analysis)。",
    "fallbackChain": "claude-opus-4-5 (max) → k2p5 → kimi-k2.5-free → gpt-5.2 (high) → gemini-3-pro"
  },
  "momus": {
    "responsibility": "方案审查 (Plan Reviewer)。",
    "fallbackChain": "gpt-5.2 (medium) → claude-opus-4-5 (max) → gemini-3-pro (max)"
  },
  "sisyphus-junior": {
    "responsibility": "委托执行者。通常由 Category 决定，本身无独立固定回退链。",
    "fallbackChain": "通常由 Category 决定"
  }
};

// Categories 信息映射：职责和回退链
// 数据来源: 原材料/agents_and_categories_info.md
export const categoriesInfo = {
  "visual-engineering": {
    "responsibility": "前端/视觉。UI/UX、CSS、动画。",
    "fallbackChain": "gemini-3-pro → claude-opus-4-5 (max) → glm-4.7"
  },
  "ultrabrain": {
    "responsibility": "深度逻辑。复杂架构、算法。",
    "fallbackChain": "gpt-5.2-codex (xhigh) → gemini-3-pro (max) → claude-opus-4-5 (max)"
  },
  "deep": {
    "responsibility": "深度开发。深层代码实现。",
    "fallbackChain": "gpt-5.2-codex (medium) → claude-opus-4-5 (max) → gemini-3-pro (max)"
  },
  "artistry": {
    "responsibility": "创意/艺术。高创造性任务。",
    "fallbackChain": "gemini-3-pro (max) → claude-opus-4-5 (max) → gpt-5.2"
  },
  "quick": {
    "responsibility": "快速/琐事。单文件修改、改错。",
    "fallbackChain": "claude-haiku-4-5 → gemini-3-flash → gpt-5-nano"
  },
  "unspecified-low": {
    "responsibility": "低难杂项。",
    "fallbackChain": "claude-sonnet-4-5 → gpt-5.2-codex (medium) → gemini-3-flash"
  },
  "unspecified-high": {
    "responsibility": "高难杂项。",
    "fallbackChain": "claude-opus-4-5 (max) → gpt-5.2 (high) → gemini-3-pro"
  },
  "writing": {
    "responsibility": "写作/文案。",
    "fallbackChain": "gemini-3-flash → claude-sonnet-4-5 → glm-4.7 → gpt-5.2"
  }
};
