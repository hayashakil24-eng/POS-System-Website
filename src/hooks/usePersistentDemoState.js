import { useEffect, useRef } from 'react';
import { saveDemoState } from '../lib/demoStorage';

/**
 * Persists selected demo state slices to localStorage via the centralized storage service.
 */
export function usePersistentDemoState(stateSlice, { enabled = true } = {}) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    // Persist on mount and whenever the slice changes.
    saveDemoState(stateSlice);
    if (isFirst.current) isFirst.current = false;
  }, [stateSlice, enabled]);
}