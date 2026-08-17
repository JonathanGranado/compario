"use client";

import { useEffect, useState } from "react";
import { themeOptions, type ThemeOption } from "./themes";

export function ThemeMenu() {
  const [theme, setTheme] = useState<ThemeOption>("botanical");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("compario-theme");
    if (savedTheme && themeOptions.some((option) => option.value === savedTheme)) {
      const validTheme = savedTheme as ThemeOption;
      setTheme(validTheme);
      document.documentElement.dataset.theme = validTheme;
    }
    setLoaded(true);
  }, []);

  const updateTheme = (nextTheme: ThemeOption) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("compario-theme", nextTheme);
  };

  return (
    <label className="theme-menu">
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) => updateTheme(event.target.value as ThemeOption)}
        disabled={!loaded}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
