/**
 * [INPUT]: 依赖 modelsData 与上传/变更回调，接收 initialConfig 与 storageKey
 * [OUTPUT]: 对外提供 OpencodeEditor 组件（编辑/预览/空状态上传）
 * [POS]: features/opencode 的主编辑视图
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProviderSidebar from './ProviderSidebar';
import ModelConfigPanel from './ModelConfigPanel';
import JsonPreview from './JsonPreview';
import modelsData from '@/data/models.json';
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, FileJson } from 'lucide-react';

const OpencodeEditor = ({ initialConfig, storageKey, onUpload, onChange }) => {
  const { t } = useTranslation();
  // State - 初始为 null 表示未上传文件
  const [localConfig, setLocalConfig] = useState(initialConfig);
  
  // 监听 initialConfig 变化
  useEffect(() => {
    setLocalConfig(initialConfig);
  }, [initialConfig]);

  
  const [selectedProviderKey, setSelectedProviderKey] = useState(
    Object.keys(modelsData)[0] || null
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    const firstProvider = Object.keys(initialConfig?.provider || {})[0];
    if (firstProvider) setSelectedProviderKey(firstProvider);
  }, [initialConfig]);

  // 1. Import - 上传时保存备份
  const handleFileUpload = (e) => {
    if (onUpload) onUpload(e);
    e.target.value = '';
  };

  // 2. Export / Download
  const handleDownload = () => {
    if (!localConfig) return;
    // 排除内部字段 _filename
    const { _filename, ...cleanConfig } = localConfig;
    const jsoncStr = JSON.stringify(cleanConfig, null, 2);
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(jsoncStr);
    const downloadAnchorNode = document.createElement('a');
    const filename = _filename?.replace(/\.json$/, '.jsonc') || "opencode.jsonc";
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // 3. Reset - 从 sessionStorage 加载备份
  const handleReset = () => {
    if (!storageKey) return;
    const backup = sessionStorage.getItem(storageKey);
    if (backup) {
      const next = JSON.parse(backup);
      setLocalConfig(next);
      if (onChange) onChange(next);
    }
  };

  // 4. Modifiers (Toggle Provider)
  const toggleProvider = (key, enabled) => {
    setLocalConfig(prev => {
      // 深拷贝，避免修改原始对象
      const next = prev 
        ? JSON.parse(JSON.stringify(prev))
        : {
            "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/opencode.schema.json",
            "provider": {}
          };
      if (!next.provider) next.provider = {};
      
      if (enabled) {
        if (!next.provider[key]) {
           const meta = modelsData[key];
           next.provider[key] = {
             name: meta?.name || key,
             models: {}
           };
        }
      } else {
        delete next.provider[key];
      }
      if (onChange) onChange(next);
      return next;
    });
  };

  // 5. Modifiers (Toggle Model)
  const toggleModel = (providerKey, modelId, enabled) => {
    setLocalConfig(prev => {
       // 深拷贝，避免修改原始对象
       const next = prev 
         ? JSON.parse(JSON.stringify(prev))
         : {
             "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/opencode.schema.json",
             "provider": {}
           };
       if (!next.provider) next.provider = {};
       
       if (enabled && !next.provider[providerKey]) {
          const meta = modelsData[providerKey];
          next.provider[providerKey] = {
             name: meta?.name || providerKey,
             models: {}
          };
       }
       
       if (!next.provider?.[providerKey]) return next; 
       
        if (enabled) {
           const modelMeta = modelsData[providerKey]?.models?.find(m => m.id === modelId);
           next.provider[providerKey].models[modelId] = {
              name: modelMeta?.name || modelId,
              limit: modelMeta?.limit || { context: 128000, output: 4096 },
              modalities: modelMeta?.modalities || { input: ["text"], output: ["text"] }
           };
        } else {
          delete next.provider[providerKey].models[modelId];
       }
       if (onChange) onChange(next);
       return next;
    });
  };

  // 空状态 UI
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
            <p className="text-muted-foreground text-sm">{t('opencode.emptyState')}</p>
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
       <div className="flex items-center justify-end px-4 py-2 border-b border-border bg-muted/20 gap-2">
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

       <div className="flex flex-1 overflow-hidden">
            <div className="w-64 border-r bg-sidebar shrink-0">
               <ProviderSidebar 
                  modelsData={modelsData}
                  config={localConfig}
                  selectedKey={selectedProviderKey}
                  onSelect={setSelectedProviderKey}
                  onToggle={toggleProvider}
               />
            </div>
            
            <div className="flex-1 bg-background border-r min-w-[400px] max-w-[480px]">
               <ModelConfigPanel 
                  providerKey={selectedProviderKey}
                  providerMeta={modelsData[selectedProviderKey]}
                  config={localConfig}
                  onToggleModel={toggleModel}
                  onToggleProvider={toggleProvider}
               />
            </div>

             <div className="flex-[2] min-w-[400px]">
                <JsonPreview config={localConfig} />
          </div>
       </div>
    </div>
  );
};

export default OpencodeEditor;
