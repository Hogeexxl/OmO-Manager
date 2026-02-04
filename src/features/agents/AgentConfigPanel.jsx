/**
 * [INPUT]: 接收 agentId, agentMeta, config, allModels, onUpdate, comment, onCommentChange
 * [OUTPUT]: Agent 配置表单面板，包含 Model/Temperature/Mode/Description/Comment
 * [POS]: AgentEditor 的核心配置区域，被 AgentEditor 直接渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import modelsData from '@/data/models.json';
import ModelSelector from './ModelSelector';
import { useTranslation } from 'react-i18next';

const AgentConfigPanel = ({ agentId, agentMeta, config, allModels, onUpdate, comment, onCommentChange }) => {
  const { t } = useTranslation();
  const currentConfig = config.agents?.[agentId] || {};

  const model = currentConfig.model !== undefined ? currentConfig.model : (agentMeta?.defaultModel || "");
  const temperature = currentConfig.temperature !== undefined ? currentConfig.temperature : (agentMeta?.temperature || 0.1);
  const mode = currentConfig.mode !== undefined ? currentConfig.mode : (agentMeta?.mode || "subagent");
  const description = currentConfig.description !== undefined ? currentConfig.description : (agentMeta?.description || "");

  
  const responsibility = t(`agentsInfo.${agentId}.responsibility`, { defaultValue: agentMeta?.description || "" });
  const fallbackChain = t(`agentsInfo.${agentId}.fallbackChain`, { defaultValue: "" });

  const [commentEnabled, setCommentEnabled] = useState(false);
  const [localComment, setLocalComment] = useState("");

  useEffect(() => {
    setCommentEnabled(!!comment);
    setLocalComment(comment || "");
  }, [agentId, comment]);

  const handleChange = (field, value) => {
     onUpdate(agentId, field, value);
  };

  const handleCommentToggle = (enabled) => {
    setCommentEnabled(enabled);
    if (!enabled) {
      onCommentChange(agentId, null);
      setLocalComment("");
    } else if (responsibility && !localComment) {
      setLocalComment(responsibility);
      onCommentChange(agentId, responsibility);
    }
  };

  const handleCommentChange = (value) => {
    setLocalComment(value);
    onCommentChange(agentId, value);
  };

  return (
    <div className="flex h-full flex-col">
        <div className="p-6 border-b bg-card space-y-2">
            <h2 className="text-lg font-semibold">{agentMeta?.name || agentId}</h2>
            <p className="text-muted-foreground text-sm line-clamp-2">
               {responsibility}
            </p>
        </div>

        <ScrollArea className="flex-1">
           <div className="p-6 space-y-6 max-w-3xl">
              <div className="space-y-3">
                 <Label>Model</Label>
                 <ModelSelector 
                    models={allModels}
                    value={model}
                    onChange={(val) => handleChange('model', val)}
                 />
                  <p className="text-xs tracking-wide text-muted-foreground">
                    {t('agents.config.fallback')} {fallbackChain}
                  </p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm font-medium bg-secondary px-2 py-1 rounded text-secondary-foreground">{temperature}</span>
                 </div>
                 <Slider 
                    value={[temperature]} 
                    min={0} 
                    max={1} 
                    step={0.1} 
                    onValueChange={(val) => handleChange('temperature', val[0])}
                    className="[\u0026_.range-thumb]:border-primary"
                 />
                  <p className="text-xs tracking-wide text-muted-foreground">{t('agents.config.temperatureDesc')}</p>
              </div>

              <div className="space-y-3">
                 <Label>Mode</Label>
                 <Select value={mode} onValueChange={(val) => handleChange('mode', val)}>
                   <SelectTrigger className="bg-card border-border">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="subagent">Subagent</SelectItem>
                   </SelectContent>
                 </Select>
              </div>

              <div className="space-y-3">
                 <Label>Description / Prompt</Label>
                 <Textarea 
                    value={description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[150px] font-mono text-sm bg-card border-border resize-none p-4"
                    placeholder="Enter agent description or prompt..."
                 />
                  <p className="text-xs text-muted-foreground">
                     {t('agents.config.descriptionHelp')}
                  </p>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <Label>Comment</Label>
                     <Switch
                        checked={commentEnabled}
                        onCheckedChange={handleCommentToggle}
                     />
                 </div>
                  {commentEnabled && (
                     <Textarea 
                        value={localComment}
                        onChange={(e) => handleCommentChange(e.target.value)}
                        className="min-h-[100px] font-mono text-sm bg-card border-border resize-none p-4"
                        placeholder="Enter comment..."
                     />
                  )}
              </div>
           </div>
        </ScrollArea>
    </div>
  );
};

export default AgentConfigPanel;
