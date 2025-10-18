import { Lang } from "../types/types";
const en = require("../locales/en.json");
const tr = require("../locales/tr.json");

const translations: Record<string, any> = { en, tr };

export const t = (locale: any, key: string) => {
  const lang = convertToLangType(locale);

  // Navigate through nested keys like "game.signIn"
  const text = key.split(".").reduce((obj, k) => obj?.[k], translations[lang]);

  if (typeof text !== "string") return key; // fallback if translation missing
  return text;
};

export const availableLocales: Lang[] = ["tr", "en"];

export const convertToLangType = (locale: any) => {
  if (locale) {
    const localeConverted = availableLocales.includes(locale as Lang)
      ? (locale as Lang)
      : "en";
    return localeConverted;
  } else return "en";
};
