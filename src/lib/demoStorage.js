const STORAGE_KEY = 'restroflow.demo.v1';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadDemoState(defaultState) {
  if (!canUseStorage()) return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultState;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function saveDemoState(state) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/serialization errors in demo mode.
  }
}

export function clearDemoState() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in demo mode.
  }
}

export function withDelay(result, ms = 450) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(typeof result === 'function' ? result() : result), ms);
  });
}

export { STORAGE_KEY };