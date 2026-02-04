/**
 * [INPUT]: 依赖 opencodeConfig 与上传/变更回调，接收 initialConfig 与 storageKey
 * [OUTPUT]: 对外提供 AgentEditor 组件（编辑/预览/空状态上传）
 * [POS]: features/agents 的主编辑视图
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AgentListSidebar from './AgentListSidebar';
import AgentConfigPanel from './AgentConfigPanel';
import CategoryConfigPanel from './CategoryConfigPanel';
import JsonPreview from '../opencode/JsonPreview';
import agentsData from '@/data/agents.json';
import categoriesData from '@/data/categories.json';
import modelsInfoData from '@/data/models_info.json';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw, FileJson } from 'lucide-react';

const AgentEditor = ({ initialConfig, opencodeConfig, storageKey, onUpload, onChange, initialComments, onCommentsChange }) => {
  const { t } = useTranslation();
  // State - 所有 useState 必须在 useEffect 之前
  const [localConfig, setLocalConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState("agents");
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [comments, setComments] = useState(initialComments || { agents: {}, categories: {} });
  const fileInputRef = useRef(null);

  // 监听 initialConfig 变化，自动选中第一个 agent 或 category
  useEffect(() => {
    setLocalConfig(initialConfig);

    if (initialComments) {
      setComments(initialComments);
    }

    if (initialConfig) {
      if (!selectedAgentId) {
        const firstConfiguredAgent = Object.keys(initialConfig.agents || {})[0];
        const targetId = firstConfiguredAgent || agentsData[0]?.id;
        if (targetId) {
          setSelectedAgentId(targetId);
        }
      }
      if (!selectedCategoryId) {
        const firstConfiguredCategory = Object.keys(initialConfig.categories || {})[0];
        const targetCatId = firstConfiguredCategory || categoriesData[0];
        if (targetCatId) {
          setSelectedCategoryId(targetCatId);
        }
      }
    }
  }, [initialConfig, initialComments, selectedAgentId, selectedCategoryId]);


  // 从 opencodeConfig 提取所有可用模型，并默认添加 provider 为 opencode 的模型
  const allModels = React.useMemo(() => {
    const models = [];
    
    // 1. 从 opencodeConfig 提取已配置的模型
    if (opencodeConfig?.provider) {
      try {
        Object.entries(opencodeConfig.provider).forEach(([providerKey, provider]) => {
          if (!provider || !provider.models) return;
          
          Object.entries(provider.models).forEach(([modelId, model]) => {
            if (!model) return;
            models.push({
              id: `${providerKey}/${modelId}`,
              name: model.name || modelId,
              provider: provider.name || providerKey
            });
          });
        });
      } catch (err) {
        console.error("Error parsing models from opencodeConfig:", err);
      }
    }
    
    // 2. 默认添加 providerId 为 opencode 的模型（无论 opencode.json 是否配置）
    try {
      const opencodeModels = modelsInfoData.filter(model => model.providerId === 'opencode');
      opencodeModels.forEach(model => {
        // 检查是否已存在（避免重复）
        const modelId = `opencode/${model.id}`;
        const exists = models.some(m => m.id === modelId);
        if (!exists) {
          models.push({
            id: modelId,
            name: model.name || model.id,
            provider: 'opencode'
          });
        }
      });
    } catch (err) {
      console.error("Error adding default opencode models:", err);
    }
    
    return models;
  }, [opencodeConfig]);

  // --- Handlers ---

  // 1. Import
  const handleFileUpload = (e) => {
    if (onUpload) onUpload(e);
    e.target.value = '';
  };

  // Convert config to JSONC format with comments
  const convertToJSONC = (config) => {
    const { _filename, ...cleanConfig } = config;
    let jsonStr = JSON.stringify(cleanConfig, null, 2);
    
    if (comments?.agents) {
      Object.entries(comments.agents).forEach(([agentId, comment]) => {
        if (comment) {
          const agentRegex = new RegExp(`^(\\s+)"${agentId}": \\{`, 'gm');
          jsonStr = jsonStr.replace(agentRegex, `$1// ${comment}\n$1"${agentId}": {`);
        }
      });
    }
    
    if (comments?.categories) {
      Object.entries(comments.categories).forEach(([catId, comment]) => {
        if (comment) {
          const catRegex = new RegExp(`^(\\s+)"${catId}": \\{`, 'gm');
          jsonStr = jsonStr.replace(catRegex, `$1// ${comment}\n$1"${catId}": {`);
        }
      });
    }
    
    return jsonStr;
  };

  // 2. Export
  const handleDownload = () => {
    if (!localConfig) return;
    const jsoncStr = convertToJSONC(localConfig);
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(jsoncStr);
    const downloadAnchorNode = document.createElement('a');
    const filename = localConfig._filename?.replace(/\.json$/, '.jsonc') || "oh-my-opencode.jsonc";
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  // 3. Reset
  const handleReset = () => {
    if (!storageKey) return;
    const backup = sessionStorage.getItem(storageKey);
    if (backup) {
      const next = JSON.parse(backup);
      setLocalConfig(next);
      if (onChange) onChange(next);
    }
  };

  // Update Agent Config
  const handleUpdateAgent = (agentId, field, value) => {
    setLocalConfig(prev => {
       // Deep copy
       const next = prev ? JSON.parse(JSON.stringify(prev)) : {
         "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
         "agents": {},
         "category": {}
       };
       if (!next.agents) next.agents = {};
       
       if (!next.agents[agentId]) {
          const meta = agentsData.find(a => a.id === agentId);
          next.agents[agentId] = {
             model: meta?.defaultModel || "",
             temperature: meta?.temperature || 0.1,
             mode: meta?.mode || "subagent",
             description: meta?.description || ""
          };
       }
       
       next.agents[agentId] = {
          ...next.agents[agentId],
          [field]: value
       };
       if (onChange) onChange(next);
       return next;
    });
  };

  // Update Category Config
  const handleUpdateCategory = (category, field, value) => {
    setLocalConfig(prev => {
       // Deep copy
        const next = prev ? JSON.parse(JSON.stringify(prev)) : {
          "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
          "agents": {},
          "categories": {}
        };
        if (!next.categories) next.categories = {};

        if (!next.categories[category]) {
           next.categories[category] = {};
        }

        next.categories[category] = {
           ...next.categories[category],
           [field]: value
        };
       if (onChange) onChange(next);
       return next;
    });
  };

  // Empty State
  if (!localConfig) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-end px-4 py-2 border-b border-border bg-muted/20 gap-2">
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json,.jsonc" 
                multiple
                onChange={handleFileUpload}
             />
        </div>

        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <FileJson className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground text-sm">
              {opencodeConfig ? t('agents.emptyStateCategory') : t('agents.emptyStateOpencodeMissing')}
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-11 px-10 bg-sidebar-primary text-sidebar-primary-foreground shadow hover:bg-sidebar-primary/90"
            >
              {t('common.clickToUpload')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
         <div className="flex items-center gap-4">
             {/* View Switcher */}
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                   <TabsTrigger 
                     value="agents" 
                     className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
                   >
                     Agents
                   </TabsTrigger>
                   <TabsTrigger 
                     value="categories" 
                     className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
                   >
                     Categories
                   </TabsTrigger>
                </TabsList>
             </Tabs>
         </div>
         
      <div className="flex items-center gap-2">
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept=".json,.jsonc" 
               multiple
               onChange={handleFileUpload}
            />
             <Button variant="ghost" onClick={handleReset} className="text-sm font-medium gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>{t('common.reset')}</span>
             </Button>
             <Button variant="ghost" onClick={handleDownload} className="text-sm font-medium gap-2">
                <Download className="h-4 w-4" />
                <span>{t('common.download')}</span>
             </Button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Column 1: Sidebar (Agent/Category List) */}
         <div className="w-64 border-r bg-sidebar shrink-0 overflow-hidden">
            <AgentListSidebar
               activeTab={activeTab}
               agentsData={agentsData}
               categoriesData={categoriesData}
               config={localConfig}
               selectedId={activeTab === 'agents' ? selectedAgentId : selectedCategoryId}
               onSelect={activeTab === 'agents' ? setSelectedAgentId : setSelectedCategoryId}
            />
         </div>

          {/* Column 2: Main Panel (Config) */}
         <div className="flex-1 bg-background border-r min-w-[400px] max-w-[480px] overflow-hidden flex flex-col">
            {activeTab === 'agents' ? (
               selectedAgentId ? (
                 <AgentConfigPanel
                    agentId={selectedAgentId}
                    agentMeta={agentsData.find(a => a.id === selectedAgentId)}
                    config={localConfig}
                    allModels={allModels}
                  onUpdate={handleUpdateAgent}
                     comment={comments.agents[selectedAgentId]}
                     onCommentChange={(agentId, value) => {
                       setComments((prev) => {
                         const next = { ...prev, agents: { ...prev.agents, [agentId]: value } };
                         if (onCommentsChange) onCommentsChange(next);
                         return next;
                       });
                     }}
                  />
               ) : (
                 <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                   <p className="mb-2">{t('agents.selectAgent')}</p>
                 </div>
               )
            ) : (
               selectedCategoryId ? (
                 <CategoryConfigPanel
                    categoryId={selectedCategoryId}
                    config={localConfig}
                    allModels={allModels}
                  onUpdate={handleUpdateCategory}
                     comment={comments.categories[selectedCategoryId]}
                     onCommentChange={(catId, value) => {
                       setComments((prev) => {
                         const next = { ...prev, categories: { ...prev.categories, [catId]: value } };
                         if (onCommentsChange) onCommentsChange(next);
                         return next;
                       });
                     }}
                  />
               ) : (
                 <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                   <p className="mb-2">{t('agents.selectCategory')}</p>
                 </div>
               )
            )}
         </div>

         {/* Column 3: JSON Preview */}
         <div className="flex-[2] min-w-[400px]">
            <JsonPreview config={localConfig} comments={comments} />
         </div>
      </div>
    </div>
  );
};

export default AgentEditor;
