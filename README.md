# OmO Manager

一款简单的 oh-my-opencode.json 快速配置工具

🌐 **在线使用**: [https://hogeexxl.github.io/OmO-Manager](https://hogeexxl.github.io/OmO-Manager)

---

## 这是什么？

OmO Manager 是一个浏览器工具，帮你快速可视化地配置 oh-my-opencode.json 文件。不再需要手动编辑复杂的 JSON，通过界面点选就能完成 Agents 和 Models 配置。

oh-my-opencode 发展迅速、更新太快，你可能不清楚：
- 现在它分了多少个 agents / categories
- 它们分别在什么时候被使用
- 该给它们配什么模型最合适

我从官方配置指南和源代码里理清这些信息，做了这个快速配置工具。

## 功能

- **opencode.jsonc 配置**：为你的 opencode.jsonc 快速配置常用 provider 和对应模型
- **oh-my-opencode.jsonc 配置**：为你的 oh-my-opencode.jsonc 快速设置 agent、categories 以及你使用的模型
- **一键导出**：生成 .jsonc 格式的完整配置文件

## 信息参考

配置信息完全参考 [oh-my-opencode](https://github.com/opencode-ai/oh-my-opencode) 的官方指南和源代码。

感谢 [@code-yeongyu](https://github.com/code-yeongyu) 打造这么出色的工具。

## 快速开始

1. 打开 [OmO Manager](https://hogeexxl.github.io/OmO-Manager)
2. 上传你的 `opencode.jsonc`（支持 .json），启用常用 provider 和模型，自动添加配置代码
3. 上传你的 `oh-my-opencode.jsonc`（支持 .json），按需设置每个 agent 或 category 使用的模型
4. 下载更新后的配置文件，替换本地文件即可

## 隐私说明

- 纯浏览器工具，所有操作在本地完成
- 配置文件不会上传到任何服务器
- 关闭页面后数据保留在浏览器本地存储中

## 适用场景

- 快速了解 oh-my-opencode 的 agents 和 categories 结构
- 根据官方指南对oh-my-opencode的agents做基础的模型设置
- 想更精细或者更高阶的配置，可自行在基础版本手动编辑

---

有问题或建议？欢迎提交 Issue
