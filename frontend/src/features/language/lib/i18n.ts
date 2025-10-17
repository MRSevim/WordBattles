import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import { Lang } from "../helpers/types";
import { availableLocales } from "../helpers/helpers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const translations: Record<string, any> = { en, tr };

export const t = (lang: Lang, key: string) =>
  key.split(".").reduce((obj, k) => obj?.[k], translations[lang]);

export const getLocaleFromCookie = async (
  cookies: () => Promise<ReadonlyRequestCookies>
) => {
  const locale = (await cookies()).get("locale")?.value;
  const initialLocale = availableLocales.includes(locale as Lang)
    ? (locale as Lang)
    : "en";
  return initialLocale;
};
