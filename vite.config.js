/**
 * [INPUT]: 依赖 @tailwindcss/vite 插件
 * [OUTPUT]: 导出 Vite 配置
 * [POS]: 项目构建配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
