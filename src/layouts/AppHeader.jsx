/**
 * [INPUT]: 无外部依赖输入
 * [OUTPUT]: 对外提供 AppHeader 顶部标题栏
 * [POS]: layouts 的全局页头
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React from 'react';
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

const AppHeader = () => {
  return (
    <header className="flex h-16 items-center pl-6 pr-4 bg-background">
      <div className="font-bold text-[22px] leading-none tracking-tight">
        OmO Manager
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open('https://github.com/Hogeexxl/OmO-Manager', '_blank')}
        >
          <FaGithub className="!h-[20px] !w-[20px]" />
          <span className="sr-only">GitHub</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
