import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import { Lang } from "../helpers/types";
import { availableLocales } from "../helpers/helpers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import React from "react";
import { getCookie } from "@/utils/helpers";

const translations: Record<string, any> = { en, tr };

export const t = (lang: Lang, key: string, vars?: Record<string, string>) => {
  // Navigate through nested keys like "game.signIn"
  const text = key.split(".").reduce((obj, k) => obj?.[k], translations[lang]);

  if (typeof text !== "string") return key; // fallback if translation missing

  if (vars) {
    // Replace all {{var}} placeholders with actual values
    return text.replace(/{{\s*(\w+)\s*}}/g, (_, name) => vars[name] ?? "");
  }

  return text;
};

export const tReact = (
  lang: Lang,
  key: string,
  vars: Record<string, React.ReactNode>
) => {
  const raw = t(lang, key); // get the plain string from translations

  // Split text into segments: either text or placeholders like {{words}}
  const parts = raw.split(/({{\s*\w+\s*}})/g).filter(Boolean);

  // Map each part → React node
  return parts.map((part, i) => {
    const match = part.match(/{{\s*(\w+)\s*}}/);
    if (match) {
      // if part is a placeholder, replace it with the React node
      const name = match[1];
      return <React.Fragment key={i}>{vars[name]}</React.Fragment>;
    }

    // otherwise, just render the plain text
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

export const getLocaleFromCookie = async (
  cookies: () => Promise<ReadonlyRequestCookies>
) => {
  const locale = (await cookies()).get("locale")?.value;
  const initialLocale = availableLocales.includes(locale as Lang)
    ? (locale as Lang)
    : "en";
  return initialLocale;
};

export const getLocaleFromClientCookie = () => {
  const locale = getCookie("locale");
  const initialLocale = availableLocales.includes(locale as Lang)
    ? (locale as Lang)
    : "en";
  return initialLocale;
};
