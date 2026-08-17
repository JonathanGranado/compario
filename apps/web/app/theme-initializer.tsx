"use client";

import { useEffect } from "react";

const themes = [
  "botanical",
  "moonlight",
  "sherbet",
  "cozy-witch-cafe",
  "moonlit-cottage",
  "autumn-stardust",
];

export function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("compario-theme");
    if (savedTheme && themes.includes(savedTheme)) {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return null;
}
