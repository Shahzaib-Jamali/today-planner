"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark";
export type FontSize = "small" | "medium" | "large";

type SettingsState = {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (t: Theme) => void;
  setFontSize: (s: FontSize) => void;
  settingsOpen: boolean;
  toggleSettings: () => void;
};

const SettingsContext = createContext<SettingsState | null>(null);

const fontSizeMap: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSizeMap[fontSize];
  }, [fontSize]);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        fontSize,
        setTheme,
        setFontSize,
        settingsOpen,
        toggleSettings: () => setSettingsOpen((p) => !p),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
