/* [INPUT] Selected Provider Data */
/* [OUTPUT] Model list with details and toggles */
/* [POS] src/features/opencode/ModelConfigPanel.jsx */
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search, Info } from "lucide-react";

const ModelConfigPanel = ({ providerKey, providerMeta, config, onToggleModel, onToggleProvider }) => {
  const [search, setSearch] = useState('');
  
  const isProviderEnabled = !!config.provider?.[providerKey];
  
   const models = (providerMeta?.models || [])
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      // 按字母倒序排列（Z-A）
      return b.name.localeCompare(a.name, 'en', { sensitivity: 'base' });
    });

  return (
    <div className="flex h-full flex-col">
       {/* Header */}
       <div className="p-6 border-b bg-card space-y-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{providerMeta?.name}</h2>
              </div>
              {/* Provider Master Switch */}
              <Switch
                 checked={isProviderEnabled}
                 onCheckedChange={(checked) => onToggleProvider(providerKey, checked)}
              />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Search models..." 
                className="pl-9 bg-card border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
       </div>
       
       {/* Model List */}
       <ScrollArea className="flex-1">
          <div className="p-6 space-y-3">
             {models.map(model => {
                const isModelEnabled = !!config.provider?.[providerKey]?.models?.[model.id];
                
                return (
                   <div key={model.id} className="flex items-center justify-between p-4 rounded-md border bg-card hover:shadow-sm transition-shadow">
                      <div className="flex-1 min-w-0 mr-4">
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate text-sm">{model.name}</h4>
                         </div>
                         
                         <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {model.limit?.context && (
                               <div className="flex items-center gap-1">
                                  <span>Context:</span>
                                  <span className="font-medium text-foreground">{Math.round(model.limit.context / 1000)}k</span>
                               </div>
                            )}
                            {model.modalities?.input && (
                               <div className="flex items-center gap-1">
                                  <span>Input:</span>
                                  <span className="font-medium text-foreground truncate max-w-[100px]">
                                     {model.modalities.input.join(', ')}
                                  </span>
                               </div>
                            )}
                         </div>
                      </div>
                      
                      {/* Model Switch - No longer disabled. Toggling ON will force enable provider in parent handler */}
                      <Switch 
                         checked={isModelEnabled}
                         onCheckedChange={(checked) => onToggleModel(providerKey, model.id, checked)}
                      />
                   </div>
                );
             })}
             
             {models.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                   No models found matching "{search}"
                </div>
             )}
          </div>
       </ScrollArea>
    </div>
  );
};

export default ModelConfigPanel;
