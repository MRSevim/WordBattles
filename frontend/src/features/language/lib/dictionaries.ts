import "server-only";
import { Lang } from "../helpers/types";

const dictionaries = {
  en: () => import("@/locales/en.json").then((module) => module.default),
  tr: () => import("@/locales/tr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Lang) => dictionaries[locale]();

// Type of `await getDictionary(locale)`
export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>;
