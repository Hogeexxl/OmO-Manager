/**
 * [INPUT]: 依赖 StepsSidebar、OpencodeEditor、AgentEditor，管理文件与会话缓存
 * [OUTPUT]: 对外提供 Dashboard 作为应用主壳与编辑区布局
 * [POS]: layouts 的主容器，负责文件状态与步骤切换
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import StepsSidebar from './StepsSidebar';
import OpencodeEditor from '../features/opencode/OpencodeEditor';
import AgentEditor from '../features/agents/AgentEditor';

const Dashboard = () => {
  // 页面刷新时清除备份
  useEffect(() => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('opencode_backup_') || key.startsWith('agent_backup_')) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const stripJsonComments = (content) => {
    let result = '';
    let inString = false;
    let isEscaped = false;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < content.length; i += 1) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (inLineComment) {
        if (char === '\n') {
          inLineComment = false;
          result += char;
        }
        continue;
      }

      if (inBlockComment) {
        if (char === '*' && nextChar === '/') {
          inBlockComment = false;
          i += 1;
        }
        continue;
      }

      if (inString) {
        result += char;
        if (!isEscaped && char === '"') {
          inString = false;
        }
        isEscaped = !isEscaped && char === '\\';
        continue;
      }

      if (char === '"') {
        inString = true;
        result += char;
        continue;
      }

      if (char === '/' && nextChar === '/') {
        inLineComment = true;
        i += 1;
        continue;
      }

      if (char === '/' && nextChar === '*') {
        inBlockComment = true;
        i += 1;
        continue;
      }

      result += char;
    }

    return result;
  };

  const parseJsonc = (content) => JSON.parse(stripJsonComments(content));

  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

  const opencodeTemplate = {
    "$schema": "https://opencode.ai/config.json",
    model: "opencode/kimi-k2.5-free",
    plugin: [
      "oh-my-opencode@latest",
      "opencode-antigravity-auth@latest"
    ],
    provider: {
      anthropic: {
        name: "Anthropic",
        models: {
          "claude-opus-4-5": {
            name: "Claude 3.5 Opus",
            limit: {
              context: 200000,
              output: 4096
            }
          },
          "claude-sonnet-4-5": {
            name: "Claude 3.5 Sonnet",
            limit: {
              context: 200000,
              output: 8192
            }
          },
          "claude-haiku-4-5": {
            name: "Claude 3.5 Haiku",
            limit: {
              context: 200000,
              output: 4096
            }
          }
        }
      },
      openai: {
        name: "OpenAI",
        models: {
          "gpt-5.2-codex": {
            name: "GPT-5.2 Codex",
            limit: {
              context: 128000,
              output: 65536
            }
          },
          "gpt-5.2": {
            name: "GPT-5.2",
            limit: {
              context: 128000,
              output: 8192
            }
          }
        }
      },
      google: {
        name: "Google",
        models: {
          "gemini-3-pro": {
            name: "Gemini 3 Pro",
            limit: {
              context: 2097152,
              output: 32768
            },
            modalities: {
              input: ["text", "image", "audio", "video", "pdf"],
              output: ["text"]
            }
          },
          "gemini-3-flash": {
            name: "Gemini 3 Flash",
            limit: {
              context: 1048576,
              output: 32768
            },
            modalities: {
              input: ["text", "image", "pdf"],
              output: ["text"]
            }
          }
        }
      },
      "zai-coding-plan": {
        name: "ZhipuAI",
        models: {
          "glm-4.7": {
            name: "GLM-4.7",
            limit: {
              context: 128000,
              output: 8192
            }
          }
        }
      },
      "github-copilot": {
        name: "GitHub Copilot",
        models: {
          "grok-code-fast-1": {
            name: "Grok Code Fast 1",
            limit: {
              context: 128000,
              output: 4096
            }
          }
        }
      }
    }
  };

  const agentTemplate = {
    "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
    google_auth: false,
    background_task: {
      defaultConcurrency: 5,
      providerConcurrency: {
        anthropic: 3,
        openai: 5,
        google: 10
      },
      modelConcurrency: {
        "google/antigravity-claude-opus-4-5-thinking": 2,
        "google/gemini-3-flash": 10,
        "google/antigravity-gemini-3-flash": 10
      }
    },
    sisyphus_agent: {
      disabled: false,
      default_builder_enabled: false,
      planner_enabled: true,
      replace_plan: true
    },
    agents: {
      sisyphus: {
        model: "anthropic/claude-opus-4-5",
        variant: "max",
        temperature: 0.1,
        description: "Primary orchestrator",
        mode: "primary"
      },
      atlas: {
        model: "kimi-for-coding/k2p5",
        temperature: 0.1,
        description: "Master orchestrator",
        mode: "primary"
      },
      prometheus: {
        model: "anthropic/claude-opus-4-5",
        variant: "max",
        temperature: 0.1,
        description: "Strategic planning",
        mode: "primary"
      },
      hephaestus: {
        model: "openai/gpt-5.2-codex",
        variant: "medium",
        temperature: 0.1,
        description: "Autonomous deep worker, \"The Legitimate Craftsman\"",
        mode: "subagent"
      },
      oracle: {
        model: "openai/gpt-5.2",
        variant: "high",
        temperature: 0.1,
        description: "Consultation, debugging",
        mode: "subagent",
        tools: {
          write: false,
          edit: false,
          task: false,
          delegate_task: false
        }
      },
      librarian: {
        model: "zai-coding-plan/glm-4.7",
        temperature: 0.1,
        description: "Docs, GitHub search",
        mode: "subagent",
        tools: {
          write: false,
          edit: false,
          task: false,
          delegate_task: false,
          call_omo_agent: false
        }
      },
      explore: {
        model: "github-copilot/grok-code-fast-1",
        temperature: 0.1,
        description: "Fast contextual grep",
        mode: "subagent",
        tools: {
          write: false,
          edit: false,
          task: false,
          delegate_task: false,
          call_omo_agent: false
        }
      },
      "multimodal-looker": {
        model: "google/gemini-3-flash",
        temperature: 0.1,
        description: "PDF/image analysis",
        mode: "subagent",
        tools: {
          write: false,
          edit: false,
          task: false,
          delegate_task: false
        }
      },
      metis: {
        model: "anthropic/claude-opus-4-5",
        variant: "max",
        temperature: 0.3,
        description: "Pre-planning analysis",
        mode: "subagent"
      },
      momus: {
        model: "openai/gpt-5.2",
        variant: "medium",
        temperature: 0.1,
        description: "Plan validation",
        mode: "subagent"
      },
      "sisyphus-junior": {
        model: "google/gemini-3-pro",
        temperature: 0.1,
        description: "Category-spawned executor",
        mode: "subagent",
        tools: {
          task: false,
          delegate_task: false
        }
      }
    },
    categories: {
      "visual-engineering": {
        model: "google/gemini-3-pro"
      },
      ultrabrain: {
        model: "openai/gpt-5.2-codex",
        variant: "xhigh"
      },
      deep: {
        model: "openai/gpt-5.2-codex",
        variant: "medium"
      },
      artistry: {
        model: "google/gemini-3-pro",
        variant: "max"
      },
      quick: {
        model: "anthropic/claude-haiku-4-5"
      },
      "unspecified-low": {
        model: "anthropic/claude-sonnet-4-5"
      },
      "unspecified-high": {
        model: "anthropic/claude-opus-4-5",
        variant: "max"
      },
      writing: {
        model: "google/gemini-3-flash"
      }
    }
  };

  // Global State for Files
  const [opencodeFiles, setOpencodeFiles] = useState([]);
  const [agentFiles, setAgentFiles] = useState([]);
  const [selectedOpencodeId, setSelectedOpencodeId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  
  // Navigation State
  const [activeStep, setActiveStep] = useState('opencode');

  // --- Handlers ---
  const createFileEntry = (fileName, config, createdAtOverride, extras = {}) => {
    const id = createId();
    const createdAt = typeof createdAtOverride === 'number' ? createdAtOverride : Date.now();
    const entry = {
      id,
      name: fileName,
      createdAt,
      config: { ...config, _filename: fileName },
      ...extras
    };
    return entry;
  };

  const handleUploadOpencode = async (e) => {
    const files = e?.target?.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    try {
      const baseTime = Date.now();
      const results = await Promise.all(files.map(async (file, index) => {
        const content = await readFileAsText(file);
        const json = parseJsonc(content);
        return createFileEntry(file.name, json, baseTime + index, {
          comments: { agents: {}, categories: {} }
        });
      }));

      setOpencodeFiles((prev) => {
        const next = [...prev, ...results];
        return next;
      });
      results.forEach((entry) => {
        sessionStorage.setItem(`opencode_backup_${entry.id}`, JSON.stringify(entry.config));
      });
      const newest = results[results.length - 1];
      setSelectedOpencodeId(newest?.id || null);
      setActiveStep('opencode');
    } catch (err) {
      alert("JSON Error: " + err.message);
    }

    e.target.value = '';
  };

  const handleUploadAgents = async (e) => {
    const files = e?.target?.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    try {
      const baseTime = Date.now();
      const results = await Promise.all(files.map(async (file, index) => {
        const content = await readFileAsText(file);
        const json = parseJsonc(content);
        return createFileEntry(file.name, json, baseTime + index);
      }));

      setAgentFiles((prev) => {
        const next = [...prev, ...results];
        return next;
      });
      results.forEach((entry) => {
        sessionStorage.setItem(`agent_backup_${entry.id}`, JSON.stringify(entry.config));
      });
      const newest = results[results.length - 1];
      setSelectedAgentId(newest?.id || null);
      setActiveStep('agents');
    } catch (err) {
      alert("JSON Error: " + err.message);
    }

    e.target.value = '';
  };

  const handleRemoveOpencode = (id) => {
    setOpencodeFiles((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (selectedOpencodeId === id) {
        const sorted = [...next].sort((a, b) => b.createdAt - a.createdAt);
        setSelectedOpencodeId(sorted[0]?.id || null);
      }
      return next;
    });
    sessionStorage.removeItem(`opencode_backup_${id}`);
  };

  const handleRemoveAgent = (id) => {
    setAgentFiles((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (selectedAgentId === id) {
        const sorted = [...next].sort((a, b) => b.createdAt - a.createdAt);
        setSelectedAgentId(sorted[0]?.id || null);
      }
      return next;
    });
    sessionStorage.removeItem(`agent_backup_${id}`);
  };

  const handleAddOpencodeTemplate = () => {
    const entry = createFileEntry('opencode.jsonc', opencodeTemplate);
    setOpencodeFiles((prev) => [entry, ...prev]);
    sessionStorage.setItem(`opencode_backup_${entry.id}`, JSON.stringify(entry.config));
    setSelectedOpencodeId(entry.id);
    setActiveStep('opencode');
  };

  const handleAddAgentTemplate = () => {
    const entry = createFileEntry('oh-my-opencode.jsonc', agentTemplate, undefined, {
      comments: { agents: {}, categories: {} }
    });
    setAgentFiles((prev) => [entry, ...prev]);
    sessionStorage.setItem(`agent_backup_${entry.id}`, JSON.stringify(entry.config));
    setSelectedAgentId(entry.id);
    setActiveStep('agents');
  };

  const updateOpencodeFile = (id, config) => {
    setOpencodeFiles((prev) => prev.map((item) => (
      item.id === id ? { ...item, config: { ...config } } : item
    )));
  };

  const updateAgentFile = (id, config) => {
    setAgentFiles((prev) => prev.map((item) => (
      item.id === id ? { ...item, config: { ...config } } : item
    )));
  };

  const updateAgentComments = (id, comments) => {
    setAgentFiles((prev) => prev.map((item) => (
      item.id === id ? { ...item, comments } : item
    )));
  };

  const sortedOpencodeFiles = [...opencodeFiles].sort((a, b) => b.createdAt - a.createdAt);
  const sortedAgentFiles = [...agentFiles].sort((a, b) => b.createdAt - a.createdAt);
  const selectedOpencodeFile = opencodeFiles.find((item) => item.id === selectedOpencodeId) || null;
  const selectedAgentFile = agentFiles.find((item) => item.id === selectedAgentId) || null;

  useEffect(() => {
    if (!selectedOpencodeId && sortedOpencodeFiles.length > 0) {
      setSelectedOpencodeId(sortedOpencodeFiles[0].id);
    }
  }, [selectedOpencodeId, sortedOpencodeFiles]);

  useEffect(() => {
    if (!selectedAgentId && sortedAgentFiles.length > 0) {
      setSelectedAgentId(sortedAgentFiles[0].id);
    }
  }, [selectedAgentId, sortedAgentFiles]);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden px-6 pb-6 pt-0 gap-6 bg-muted/5">
        {/* Unified Sidebar (Bento Box 1) */}
        <aside className="w-72 flex flex-col h-full bg-transparent border-none shadow-none overflow-hidden">
            <StepsSidebar 
               opencodeFiles={sortedOpencodeFiles}
               agentFiles={sortedAgentFiles}
               selectedOpencodeId={selectedOpencodeId}
               selectedAgentId={selectedAgentId}
               onSelectOpencode={(id) => {
                 setSelectedOpencodeId(id);
                 setActiveStep('opencode');
               }}
               onSelectAgents={(id) => {
                 setSelectedAgentId(id);
                 setActiveStep('agents');
               }}
               onUploadOpencode={handleUploadOpencode}
               onUploadAgents={handleUploadAgents}
               onRemoveOpencode={handleRemoveOpencode}
               onRemoveAgents={handleRemoveAgent}
               onAddOpencodeTemplate={handleAddOpencodeTemplate}
               onAddAgentTemplate={handleAddAgentTemplate}
            />
        </aside>

        {/* Main Stage (Bento Box 2) */}
        <main className="flex-1 flex flex-col h-full bg-background border border-border rounded-2xl overflow-hidden relative">
{activeStep === 'opencode' && (
                <OpencodeEditor 
                  initialConfig={selectedOpencodeFile?.config || null}
                  storageKey={selectedOpencodeId ? `opencode_backup_${selectedOpencodeId}` : null}
                  onUpload={handleUploadOpencode}
                  onChange={(config) => {
                    if (selectedOpencodeId) updateOpencodeFile(selectedOpencodeId, config);
                  }}
                />
            )}

           {activeStep === 'agents' && (
               <AgentEditor 
                 initialConfig={selectedAgentFile?.config || null}
                 opencodeConfig={selectedOpencodeFile?.config || null}
                 storageKey={selectedAgentId ? `agent_backup_${selectedAgentId}` : null}
                 onUpload={handleUploadAgents}
                 onChange={(config) => {
                   if (selectedAgentId) updateAgentFile(selectedAgentId, config);
                 }}
                 initialComments={selectedAgentFile?.comments || { agents: {}, categories: {} }}
                 onCommentsChange={(comments) => {
                   if (selectedAgentId) updateAgentComments(selectedAgentId, comments);
                 }}
               />
           )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
