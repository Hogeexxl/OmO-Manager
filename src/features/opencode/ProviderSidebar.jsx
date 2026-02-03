/* [INPUT] List of all available providers */
/* [OUTPUT] Sidebar list with search, filter, and toggles */
/* [POS] src/features/opencode/ProviderSidebar.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Search, MoreVertical, RefreshCw, Check } from "lucide-react";

/**
 * modelsData: { [key]: { name, models: [] } }
 * config: current json
 */
const ProviderSidebar = ({ modelsData, config, selectedKey, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  
  // 缓存 provider 列表（只存储 key 和 name，不存储 isEnabled 状态）
  const baseProvidersRef = useRef(
    Object.entries(modelsData).map(([key, data]) => ({
      key,
      name: data.name,
    }))
  );
  
  // 排序后的 provider keys（只存储顺序）
  const [sortedKeys, setSortedKeys] = useState(() => 
    baseProvidersRef.current.map(p => p.key)
  );
  
  // 执行排序
  const performSort = () => {
    const keys = [...baseProvidersRef.current.map(p => p.key)];
    
    // 根据当前 config 排序
    keys.sort((a, b) => {
      const aEnabled = !!config?.provider?.[a];
      const bEnabled = !!config?.provider?.[b];
      if (aEnabled && !bEnabled) return -1;
      if (!aEnabled && bEnabled) return 1;
      return 0;
    });
    
    setSortedKeys(keys);
  };
  
  // 组件挂载时执行一次排序
  useEffect(() => {
    performSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // 手动刷新排序
  const handleRefresh = () => {
    performSort();
  };
  
  // 获取过滤后的列表
  const getFilteredProviders = () => {
    return sortedKeys
      .map(key => {
        const provider = baseProvidersRef.current.find(p => p.key === key);
        return {
          ...provider,
          isEnabled: !!config?.provider?.[key],
        };
      })
      .filter(p => {
        // 过滤模式
        if (filterMode === 'active' && !p.isEnabled) return false;
        
        // 搜索过滤
        return (
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.key.toLowerCase().includes(search.toLowerCase())
        );
      });
  };
  
  const providers = getFilteredProviders();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="p-4">
        {/* Header with title and buttons */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold tracking-tight">provider</h2>
          <div className="flex items-center gap-1">
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {/* Menu Popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-1">
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      filterMode === 'all' 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                    onClick={() => {
                      setFilterMode('all');
                      setIsOpen(false);
                    }}
                  >
                    <span>All providers</span>
                    {filterMode === 'all' && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      filterMode === 'active' 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                    onClick={() => {
                      setFilterMode('active');
                      setIsOpen(false);
                    }}
                  >
                    <span>Active only</span>
                    {filterMode === 'active' && <Check className="h-4 w-4" />}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search providers..." 
            className="pl-8 h-9 bg-card border-border" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Provider List */}
      <ScrollArea className="flex-1 pb-4 px-4">
        <div className="space-y-1 w-full">
          {providers.map(provider => {
            const isActive = selectedKey === provider.key;

            return (
              <div
                key={provider.key}
                onClick={() => onSelect(provider.key)}
                className={cn(
                  "flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <span className="text-sm font-medium truncate block">{provider.name}</span>
                </div>

                {/* Status indicator - shows enabled state only */}
                <div className="pl-2 pr-1 shrink-0">
                  {provider.isEnabled && (
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                  )}
                </div>
              </div>
            );
          })}
          
          {providers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No providers found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProviderSidebar;
