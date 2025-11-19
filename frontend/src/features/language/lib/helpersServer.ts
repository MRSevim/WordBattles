"use server";
import { headers } from "next/headers";
import { Lang } from "../helpers/types";
import { DictionaryType, getDictionary } from "./dictionaries";
import { availableLocales } from "../helpers/helpers";

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
