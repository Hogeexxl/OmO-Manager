/**
 * [INPUT]: Config JSON + Comments
 * [OUTPUT]: Read-only formatted JSONC view with syntax highlighting
 * [POS]: src/features/opencode/JsonPreview.jsx
 */
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

const convertToJSONC = (config, comments) => {
  const { _filename, ...cleanConfig } = config || {};
  let jsonStr = JSON.stringify(cleanConfig, null, 2);
  
  if (!comments) return jsonStr;
  
  if (comments.agents) {
    Object.entries(comments.agents).forEach(([agentId, comment]) => {
      if (comment) {
        const agentRegex = new RegExp(`^(\\s+)"${agentId}": \\{`, 'gm');
        jsonStr = jsonStr.replace(agentRegex, `$1// ${comment}\n$1"${agentId}": {`);
      }
    });
  }
  
  if (comments.categories) {
    Object.entries(comments.categories).forEach(([catId, comment]) => {
      if (comment) {
        const catRegex = new RegExp(`^(\\s+)"${catId}": \\{`, 'gm');
        jsonStr = jsonStr.replace(catRegex, `$1// ${comment}\n$1"${catId}": {`);
      }
    });
  }
  
  return jsonStr;
};

const JsonPreview = ({ config, comments, title }) => {
  const codeRef = useRef(null);
  
  const { _filename, ...cleanConfig } = config || {};
  const displayTitle = title || _filename || "config.json";
  
  const jsonString = convertToJSONC(cleanConfig, comments);
  
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [jsonString]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-muted flex items-center justify-between">
        <span className="font-semibold text-card-foreground">{displayTitle}</span>
        <span className="text-muted-foreground text-xs">{jsonString.length} bytes</span>
      </div>
      <ScrollArea className="flex-1 bg-background">
        <pre className="p-4 m-0 font-mono text-sm">
          <code 
            ref={codeRef} 
            className="language-json"
            style={{ 
              fontFamily: '"Source Code Pro", monospace',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            {jsonString}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
};

export default JsonPreview;
