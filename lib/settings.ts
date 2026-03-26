export interface AppSettings {
  baseUrl: string;
}

const SETTINGS_KEY = "teamix_settings";

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return { baseUrl: "" };
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return { baseUrl: window.location.origin };
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
