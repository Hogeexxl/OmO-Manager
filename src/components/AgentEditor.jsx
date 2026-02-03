/* [INPUT] oh-my-opencode.json configuration object */
/* [OUTPUT] React UI for editing agent settings */
/* [POS] src/components/AgentEditor.jsx */
import React from 'react';
import { cn } from '../lib/utils';

const AgentEditor = ({ config, onChange }) => {
  // Convert object to array for list rendering if it's an object
  const agents = config.agent || {};
  const agentKeys = Object.keys(agents);

  return (
    <div className="flex h-full border rounded-md overflow-hidden bg-background">
      <div className="w-full p-4 overflow-y-auto">
        <h3 className="text-base font-semibold mb-4">Agents Configuration</h3>
        
        <div className="space-y-4">
          {agentKeys.length === 0 && <p className="text-muted-foreground">No agents configured.</p>}
          
          {agentKeys.map(key => {
            const agent = agents[key];
            return (
              <div key={key} className="p-4 border rounded hover:bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">{key}</h4>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded",
                    agent.disable ? "bg-destructive/20 text-destructive" : "bg-secondary/20 text-secondary"
                  )}>
                    {agent.disable ? 'Disabled' : 'Enabled'}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{agent.description || 'No description'}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Model: <span className="font-mono">{agent.model || 'default'}</span></div>
                  <div>Temp: <span className="font-mono">{agent.temperature || 'N/A'}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentEditor;
