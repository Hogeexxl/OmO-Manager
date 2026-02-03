/**
 * [INPUT]: 依赖 App 组件, index.css
 * [OUTPUT]: 渲染 React 应用挂载到 DOM
 * [POS]: src/ 模块的入口文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
