"use server";
import { headers } from "next/headers";
import { Lang } from "../utils/types";
import { DictionaryType, getDictionary } from "../lib/dictionaries";
import { availableLocales } from "../utils/helpers";

/**
 * Get dictionary from subdomain on the server (SSR / middleware / RootLayout)
 */
export const getDictionaryFromSubdomain = async (): Promise<DictionaryType> => {
  const host = (await headers()).get("host") || "";
  const subdomain = host.split(".")[0]; // e.g., "en.wordbattles.net"
  const locale = availableLocales.includes(subdomain as Lang)
    ? (subdomain as Lang)
    : "en";
  return getDictionary(locale);
};

/**
 * Get locale from subdomain on the server (SSR / middleware / RootLayout)
 */
export const getLocaleFromSubdomain = async (): Promise<Lang> => {
  const host = (await headers()).get("host") || "";
  const subdomain = host.split(".")[0]; // e.g., "en.wordbattles.net"
  return availableLocales.includes(subdomain as Lang)
    ? (subdomain as Lang)
    : "en";
};

/**
 * Get base url from subdomain (SSR / middleware / RootLayout)
 */
export const getBaseUrlFromSubdomain = async (): Promise<string> => {
  const locale = await getLocaleFromSubdomain();
  if (locale === "tr") {
    return process.env.NEXT_PUBLIC_BASE_URL_TR!;
  } else return process.env.NEXT_PUBLIC_BASE_URL_EN!;
};
