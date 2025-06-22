'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LiveModeContextType {
  isLiveMode: boolean;
  setIsLiveMode: (value: boolean) => void;
}

const LiveModeContext = createContext<LiveModeContextType | undefined>(undefined);

export function LiveModeProvider({ children }: { children: ReactNode }) {
  const [isLiveMode, setIsLiveMode] = useState(false);

  return (
    <LiveModeContext.Provider value={{ isLiveMode, setIsLiveMode }}>
      {children}
    </LiveModeContext.Provider>
  );
}

export function useLiveMode() {
  const context = useContext(LiveModeContext);
  if (context === undefined) {
    throw new Error('useLiveMode must be used within a LiveModeProvider');
  }
  return context;
}