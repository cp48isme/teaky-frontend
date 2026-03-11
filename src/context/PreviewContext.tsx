import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface PreviewState {
  splitMode: boolean;
  splitRatio: number;
  viewportSize: ViewportSize;
}

interface PreviewContextType extends PreviewState {
  setSplitMode: (enabled: boolean) => void;
  setSplitRatio: (ratio: number) => void;
  setViewportSize: (size: ViewportSize) => void;
  toggleSplitMode: () => void;
  refreshTrigger: number; // Increments to signal refresh needed
  triggerRefresh: () => void; // Call this to refresh preview (debounced)
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

const STORAGE_KEY = 'teaky_preview_state';

const defaultState: PreviewState = {
  splitMode: false,
  splitRatio: 60,
  viewportSize: 'desktop',
};

function loadState(): PreviewState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load preview state:', error);
  }
  return defaultState;
}

function saveState(state: PreviewState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save preview state:', error);
  }
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreviewState>(loadState);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const debounceTimerRef = useRef<number | null>(null);

  // Persist state to localStorage on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const setSplitMode = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, splitMode: enabled }));
  }, []);

  const setSplitRatio = useCallback((ratio: number) => {
    setState((prev) => ({ ...prev, splitRatio: ratio }));
  }, []);

  const setViewportSize = useCallback((size: ViewportSize) => {
    setState((prev) => ({ ...prev, viewportSize: size }));
  }, []);

  const toggleSplitMode = useCallback(() => {
    setState((prev) => ({ ...prev, splitMode: !prev.splitMode }));
  }, []);

  // Debounced refresh trigger (500ms delay)
  const triggerRefresh = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <PreviewContext.Provider
      value={{
        ...state,
        setSplitMode,
        setSplitRatio,
        setViewportSize,
        toggleSplitMode,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}
