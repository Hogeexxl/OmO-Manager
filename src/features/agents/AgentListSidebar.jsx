/* [INPUT] List of Official Agents or Categories */
/* [OUTPUT] Sidebar list with search */
/* [POS] src/features/agents/AgentListSidebar.jsx */
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const AgentListSidebar = ({ activeTab, agentsData, categoriesData, config, selectedId, onSelect }) => {
  const [search, setSearch] = useState('');
  


  // 处理 categoriesData 是字符串数组的情况
  const normalizedCategoriesData = categoriesData.map(cat => 
    typeof cat === 'string' ? { id: cat, name: cat.replace(/-/g, ' ') } : cat
  );

  const list = activeTab === 'agents' ? agentsData : normalizedCategoriesData;
  const configKey = activeTab === 'agents' ? 'agents' : 'categories';

  const filteredList = list.filter(item => {
     const name = item.name || item.id;
     return name.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col bg-sidebar">
       <div className="p-4">
          <h2 className="text-base font-semibold tracking-tight mb-3">
             {activeTab === 'agents' ? 'agents' : 'categories'}
          </h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={`Search ${activeTab}...`} 
              className="pl-8 h-9 bg-card border-border" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
       </div>
       
        <ScrollArea className="flex-1 pb-4 px-4">
           <div className="space-y-1 w-full">
               {filteredList.map(item => {
                  const categoryConfig = config?.[configKey];
                  const itemConfig = categoryConfig?.[item.id];
                  const isConfigured = !!itemConfig;
                  
                  // Debug categories
                  if (activeTab === 'categories' && ['visual-engineering', 'ultrabrain', 'quick'].includes(item.id)) {
                    console.log(`Category ${item.id}:`, { isConfigured, configKey, hasCategoryConfig: !!categoryConfig, itemConfig });
                  }
                  
                  const isSelected = selectedId === item.id;
                
                return (
                  <div 
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors",
                      isSelected 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                     <div className="flex-1 min-w-0 overflow-hidden">
                        <span className="text-sm font-medium truncate block">{item.name || item.id}</span>
                     </div>
                     
                     <div className="pl-2 pr-1 shrink-0">
                        {isConfigured && (
                           <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                        )}
                     </div>
                  </div>
                );
             })}
             
             {filteredList.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                   No results found
                </div>
             )}
          </div>
       </ScrollArea>
    </div>
  );
};

export default AgentListSidebar;
