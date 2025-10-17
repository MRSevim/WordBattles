"use client";
import { createContext, Dispatch, SetStateAction, use, useState } from "react";
import { Lang } from "./types";

const LocaleContext = createContext<
  [Lang, Dispatch<SetStateAction<Lang>>] | null
>(null);

export const useLocaleContext = () => {
  const context = use(LocaleContext);
  if (!context)
    throw new Error("useLocaleContext must be used within its provider");
  return context;
};
export const Provider = ({
  initialLocale,
  children,
}: {
  initialLocale: Lang;
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<Lang>(initialLocale);
  return <LocaleContext value={[locale, setLocale]}>{children}</LocaleContext>;
};
