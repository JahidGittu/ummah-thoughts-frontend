/**
 * Persist custom virtual background image in localStorage.
 * Uses base64 data URL for cross-session persistence.
 */

const STORAGE_KEY = "ummah-debate-custom-bg";
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB to stay within localStorage limits

export function getStoredCustomBackground(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { dataUrl: string; savedAt: number };
    if (parsed?.dataUrl?.startsWith("data:image/")) return parsed.dataUrl;
    return null;
  } catch {
    return null;
  }
}

export function saveCustomBackground(dataUrl: string): boolean {
  if (typeof window === "undefined") return false;
  if (!dataUrl.startsWith("data:image/")) return false;
  try {
    const size = new Blob([dataUrl]).size;
    if (size > MAX_SIZE_BYTES) return false;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dataUrl, savedAt: Date.now() })
    );
    return true;
  } catch {
    return false;
  }
}

export function clearStoredCustomBackground(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
