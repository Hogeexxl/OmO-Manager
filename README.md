# OmO Manager

OpenCode 配置可视化编辑器 - 在浏览器中管理你的 AI 模型配置

🌐 **在线使用**: [https://hogeexxl.github.io/OmO-Manager](https://hogeexxl.github.io/OmO-Manager)

## 功能

- **可视化编辑**: 无需手动编辑 JSON，通过界面管理 opencode.json 和 agents.json
- **Provider 管理**: 启用/禁用 AI 服务商，查看支持的模型列表
- **Model 配置**: 一键开启模型，自动补全 limit、modalities 等参数
- **Agent 管理**: 编辑 Agent 配置，设置默认模型和工具权限
- **实时预览**: 编辑时实时预览生成的 JSONC 配置
- **本地存储**: 所有数据保存在浏览器中，不上传服务器

## 技术栈

- React 19
- Vite 7
- TailwindCSS v4
- shadcn/ui
- Prism.js (语法高亮)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 使用说明

1. 打开网站后，上传你的 `opencode.json` 或 `agents.json` 文件
2. 在 Provider 面板中选择要启用的服务商
3. 在 Model 面板中选择需要的模型
4. 编辑完成后下载配置，替换本地文件

## 隐私说明

- 纯前端工具，所有处理在浏览器本地完成
- 配置数据不上传到任何服务器
- 使用 localStorage 保存临时数据

## License

MIT
