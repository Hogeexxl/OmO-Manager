/**
 * [INPUT]: 依赖 `@/components/ui/button` 的 Button，依赖 `@/lib/utils` 的 cn，接收 Steps 状态与文件列表
 * [OUTPUT]: 对外提供 StepsSidebar 组件与内部 StepCard 展示结构
 * [POS]: layouts 的侧边栏步骤导航，驱动文件列表选择与上传入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const StepCard = ({
  title,
  titleClassName,
  children
}) => {
  return (
    <div className="mb-3 border-none">
      {/* 1. 步骤标题 */}
        <div className={cn("mb-2 pl-2", titleClassName)}>
          <span className="text-base font-semibold tracking-tight text-foreground">{title}</span>
        </div>

      {/* 2. Content Area */}
      <div className="p-0">
        <div className="p-4 rounded-2xl bg-card border border-sidebar-border ml-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const StepsSidebar = ({
  opencodeFiles,
  agentFiles,
  selectedOpencodeId,
  selectedAgentId,
  onSelectOpencode,
  onSelectAgents,
  onUploadOpencode,
  onUploadAgents,
  onRemoveOpencode,
  onRemoveAgents,
  onAddOpencodeTemplate,
  onAddAgentTemplate
}) => {
  
  // Helper for hidden file input
  const handleUploadClick = (inputId) => {
    document.getElementById(inputId)?.click();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-0">
       {/* Instruction Card */}
       <div className="mb-8 p-6 rounded-2xl bg-card border border-sidebar-border shadow text-sm tracking-normal font-medium text-card-foreground space-y-4">
          <p>1.上传你的opencode.json文件，配置提供商和模型</p>
          <p>2.上传你的oh-my-opencode.json，设置agents和categories使用的模型</p>
           <p>3.保存opencode.json和oh-my-opencode.json到你的opencode目录</p>
       </div>

       <div className="space-y-1">
          
           {/* Step 1: Opencode Editor */}
            <StepCard
               title="step1：编辑 opencode.json"
            >
                <div className="flex items-center justify-between mb-3">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={onAddOpencodeTemplate}>添加模板</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleUploadClick('upload-opencode')}>上传文件</Button>
                    <input
                      id="upload-opencode"
                      type="file"
                      className="hidden"
                      accept=".json,.jsonc"
                      multiple
                      onChange={onUploadOpencode}
                    />
                  </div>
                </div>

                {opencodeFiles.length > 0 ? (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {opencodeFiles.map((file) => (
                      <div
                        key={file.id}
                        className={cn(
                          "flex items-center justify-between gap-2 w-full px-2 py-1 rounded-md",
                          file.id === selectedOpencodeId && "bg-secondary"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectOpencode?.(file.id)}
                          className={cn(
                            "group min-w-0 flex-1 text-left text-sm font-medium text-muted-foreground",
                            file.id === selectedOpencodeId && "text-secondary-foreground"
                          )}
                        >
                          <div className="truncate group-hover:underline underline-offset-4">{file.name}</div>
                          <div className={cn(
                            "text-xs text-muted-foreground",
                            file.id === selectedOpencodeId && "text-secondary-foreground/80"
                          )}>
                            {formatTime(file.createdAt)}
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-7 w-7 rounded-full shrink-0",
                            file.id === selectedOpencodeId
                              ? "text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/10"
                              : "text-secondary hover:text-secondary/80 hover:bg-secondary/10"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveOpencode?.(file.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground px-1 text-center">暂无文件</div>
               )}
            </StepCard>

           {/* Step 2: Agent Editor */}
            <StepCard
               title="step2：编辑 oh-my-opencode.json"
               titleClassName="pt-3"
            >
                <div className="flex items-center justify-between mb-3">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={onAddAgentTemplate}>添加模板</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleUploadClick('upload-agents')}>上传文件</Button>
                    <input
                      id="upload-agents"
                      type="file"
                      className="hidden"
                      accept=".json,.jsonc"
                      multiple
                      onChange={onUploadAgents}
                    />
                  </div>
                </div>

                {agentFiles.length > 0 ? (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {agentFiles.map((file) => (
                      <div
                        key={file.id}
                        className={cn(
                          "flex items-center justify-between gap-2 w-full px-2 py-1 rounded-md",
                          file.id === selectedAgentId && "bg-secondary"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectAgents?.(file.id)}
                          className={cn(
                            "group min-w-0 flex-1 text-left text-sm font-medium text-muted-foreground",
                            file.id === selectedAgentId && "text-secondary-foreground"
                          )}
                        >
                          <div className="truncate group-hover:underline underline-offset-4">{file.name}</div>
                          <div className={cn(
                            "text-xs text-muted-foreground",
                            file.id === selectedAgentId && "text-secondary-foreground/80"
                          )}>
                            {formatTime(file.createdAt)}
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-7 w-7 rounded-full shrink-0",
                            file.id === selectedAgentId
                              ? "text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/10"
                              : "text-secondary hover:text-secondary/80 hover:bg-secondary/10"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAgents?.(file.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground px-1 text-center">暂无文件</div>
               )}
            </StepCard>

       </div>
    </div>
  );
};

export default StepsSidebar;
