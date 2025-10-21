"use client";

import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { useThemeContext } from "@/utils/contexts/ThemeContext";

export const ThemeToggler = () => {
  const [theme, toggleTheme] = useThemeContext();
  const [locale] = useLocaleContext();

  return (
    <button
      onClick={() => toggleTheme()}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 transition-colors duration-200 hover:bg-gray-800 text-xl cursor-pointer"
      title={t(locale, "switchTheme")}
    >
      <i
        className={`bi ${
          theme === "dark" ? "bi-moon-stars-fill" : "bi-brightness-high-fill"
        }`}
      ></i>
    </button>
  );
};
