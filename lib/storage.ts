export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = window.localStorage.getItem(key); if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (fallback === null) return parsed as T;
    if (typeof fallback === "string") return typeof parsed === "string" ? parsed as T : fallback;
    if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed as T : fallback;
    if (typeof fallback === "object") return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as T : fallback;
    return fallback; } catch { return fallback; }
}
export function setLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function removeLocalStorage(key: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(key); } catch { /* The browser may restrict storage. */ }
}
