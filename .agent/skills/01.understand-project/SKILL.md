---
name: understand-project
description: 理解项目结构并执行开发任务
---

# 项目理解工作流

执行任何分析或开发任务前，必须按以下顺序阅读文档：

1. 阅读 `/AGENTS.md` 了解顶层架构和文档规范
2. 根据任务目标，阅读相关目录的 `folder.md`（如 `Sources/folder.md`、`Plugins/folder.md`）
3. 阅读目标文件的头部注释 `[INPUT]/[OUTPUT]/[POS]`
4. 精准定位相关文件后按需阅读相关的代码
5. 执行用户任务

## 代码变更后的同步要求

修改代码后，必须遵循原子更新原则：

1. 更新当前文件的头部注释（如 `[INPUT]`/`[OUTPUT]` 变化）
2. 检查上层 `folder.md` 是否需要同步（如新增/删除文件）
3. 如涉及架构变更，检查 `AGENTS.md` 是否需要更新
