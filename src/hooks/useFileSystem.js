/* [INPUT] None (Browser API) */
/* [OUTPUT] File Handle Management & Read/Write methods */
/* [POS] src/hooks/useFileSystem.js */
import { useState, useCallback } from 'react';

// Configurations filenames we look for
const CONFIG_FILES = {
  OPENCODE: 'opencode.json',
  AGENT: 'oh-my-opencode.json',
};

export const useFileSystem = () => {
  const [handle, setHandle] = useState(null); // Type: FileSystemDirectoryHandle
  const [fileHandles, setFileHandles] = useState({}); // Map: filename -> FileSystemFileHandle
  const [configs, setConfigs] = useState({
    opencode: null,
    agent: null,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Open Directory Picker
  const openConfigFolder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dirHandle = await window.showDirectoryPicker();
      setHandle(dirHandle);

      // 2. Scan for specific config files
      const handles = {};
      const loadedConfigs = { opencode: null, agent: null };

      // Helper to read JSON file
      const readJson = async (filename) => {
        try {
          const fileHandle = await dirHandle.getFileHandle(filename);
          handles[filename] = fileHandle;
          const file = await fileHandle.getFile();
          const text = await file.text();
          return JSON.parse(text);
        } catch (e) { 
          if (e.name === 'NotFoundError') return null; // File might not exist yet
          throw e;
        }
      };

      loadedConfigs.opencode = await readJson(CONFIG_FILES.OPENCODE);
      loadedConfigs.agent = await readJson(CONFIG_FILES.AGENT);

      setFileHandles(handles);
      setConfigs(loadedConfigs);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to open folder:', err);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Save Logic
  const saveConfig = useCallback(async (type, data) => {
    const filename = type === 'opencode' ? CONFIG_FILES.OPENCODE : CONFIG_FILES.AGENT;
    try {
      if (!handle) throw new Error("No folder opened");
      
      // Get handle (create if not exists)
      const fileHandle = await handle.getFileHandle(filename, { create: true });
      
      // Create a writable stream
      const writable = await fileHandle.createWritable();
      
      // Write the JSON string
      await writable.write(JSON.stringify(data, null, 2));
      
      // Close the file
      await writable.close();
      
      // Update local state handles if new
      setFileHandles(prev => ({...prev, [filename]: fileHandle}));
      setConfigs(prev => ({...prev, [type]: data}));
      
      return true;
    } catch (err) {
      console.error(`Failed to save ${filename}:`, err);
      setError(`Failed to save ${filename}: ${err.message}`);
      return false;
    }
  }, [handle]);

  return {
    isReady: !!configs.opencode || !!configs.agent,
    configs,
    isLoading,
    error,
    openConfigFolder,
    saveConfig,
    setConfigs // Expose setter to allow UI optimistic updates before save
  };
};
