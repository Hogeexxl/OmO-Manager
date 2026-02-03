/**
 * [INPUT]: 无外部依赖输入
 * [OUTPUT]: 对外提供 AppHeader 顶部标题栏
 * [POS]: layouts 的全局页头
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React from 'react';

const AppHeader = () => {
  return (
    <header className="flex h-16 items-center px-4 bg-background">
      <div className="font-bold text-[22px] leading-none tracking-tight">
        OmO Manager
      </div>
    </header>
  );
};

export default AppHeader;
