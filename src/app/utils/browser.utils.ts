/**
 * Utility functions for browser environment detection
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isLocalStorageAvailable(): boolean {
  return isBrowser() && typeof window.localStorage !== 'undefined';
}

export function safeLocalStorage(): Storage | null {
  return isLocalStorageAvailable() ? window.localStorage : null;
}
