/* [INPUT] opencode.json configuration object, providers and models data */
/* [OUTPUT] React UI for editing provider settings */
/* [POS] src/components/ProviderEditor.jsx */
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import providersData from '../data/providers.json';
import modelsData from '../data/models.json';

const ProviderEditor = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState(providersData[0]);

  // Handle provider enablement toggle
  const toggleProvider = (providerName) => {
    e.stopPropagation();
    const currentEnabled = config.enabled_providers || [];
    let newEnabled;
    if (currentEnabled.includes(providerName)) {
      newEnabled = currentEnabled.filter(p => p !== providerName);
    } else {
      newEnabled = [...currentEnabled, providerName];
    }
    onChange({ ...config, enabled_providers: newEnabled });
  };

  return (
    <div className="flex h-full border rounded-md overflow-hidden bg-background">
      {/* Sidebar: Provider List */}
      <div className="w-1/3 border-r bg-muted/50 overflow-y-auto">
        {providersData.map(provider => (
          <div
            key={provider}
            onClick={() => setActiveTab(provider)}
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer hover:bg-muted",
              activeTab === provider && "bg-background font-medium border-l-4 border-primary"
            )}
          >
            <span>{provider}</span>
            <input 
              type="checkbox" 
              checked={(config.enabled_providers || []).includes(provider)}
              onChange={(e) => toggleProvider(provider)}
              className="h-4 w-4"
            />
          </div>
        ))}
      </div>

      {/* Main Content: Config Form */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 capitalize">{activeTab} Settings</h3>
        
        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Default Model</label>
          <select 
            className="w-full p-2 border rounded bg-background"
            value={config.model?.startsWith(activeTab + '/') ? config.model : ''}
            onChange={(e) => onChange({...config, model: e.target.value})}
          >
            <option value="">Select a model...</option>
            {(modelsData[activeTab] || []).map(model => (
              <option key={model} value={`${activeTab}/${model}`}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* API Key (Conceptual) */}
         <div className="mb-4">
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input 
            type="password" 
            placeholder="Enter API Key"
            className="w-full p-2 border rounded bg-background"
            disabled // Placeholder for now, real implementation needs secure storage strategy discussion
          />
          <p className="text-xs tracking-wide text-muted-foreground mt-1">API Key management requires secure local storage integration.</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderEditor;
