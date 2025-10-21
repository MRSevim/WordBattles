"use client";
import { createContext, use, useEffect, useState } from "react";
import { setCookie } from "../helpers";

type ThemeType = "dark" | "light" | undefined;

type ThemeContextType = [ThemeType, () => void];

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
  const context = use(ThemeContext);
  if (!context)
    throw new Error("ThemeContext must be used within its provider");

  return context;
};

export const Provider = ({
  initialTheme,
  children,
}: {
  initialTheme?: string;
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<ThemeType>(initialTheme as ThemeType);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setCookie("theme", newTheme, 365);
  };

  // Apply class whenever theme changes
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Auto-detect system preference on first load
  useEffect(() => {
    if (
      !initialTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
      setCookie("theme", "dark", 365);
    }
  }, []);

  return <ThemeContext value={[theme, toggleTheme]}>{children}</ThemeContext>;
};
