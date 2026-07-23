import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ImapConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  useSsl: boolean;
}

interface Settings {
  currency: string;
  reminderDays: number;
  darkMode: boolean;
  imap: ImapConfig;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  updateImap: (config: Partial<ImapConfig>) => void;
}

const defaultSettings: Settings = {
  currency: "HKD",
  reminderDays: 3,
  darkMode: false,
  imap: { host: "", port: 993, user: "", password: "", useSsl: true },
};

function load(): Settings {
  try {
    const raw = localStorage.getItem("settings");
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return defaultSettings;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const updateSettings = (patch: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const updateImap = (config: Partial<ImapConfig>) =>
    setSettings((prev) => ({ ...prev, imap: { ...prev.imap, ...config } }));

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateImap }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
