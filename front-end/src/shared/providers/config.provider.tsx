'use client';
import { AppConfig, defaultConfig, loadConfig } from '@/config/app.config';
import { apiClient } from '@/shared/lib/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ConfigContext = createContext<AppConfig>(defaultConfig);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // const [config, setConfig] = useState<AppConfig>(defaultConfig);
  // Use null, not defaultConfig, so children can't mount prematurely!
  const [config, setConfig] = useState<AppConfig | null>(null);
  useEffect(() => {
    loadConfig().then((cfg) => {
      setConfig(cfg);
      apiClient.initialize(cfg); // <-- This is the only place you call it!
    });
  }, []);

  if (!config) {
    // Don't render any children until config is loaded!
    return null;
  }
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

// Use this in components/pages
export function useAppConfig() {
  return useContext(ConfigContext);
}
