"use client";
import { createContext, use } from "react";
import { DictionaryType } from "../lib/dictionaries";
import { Lang } from "./types";

const DictionaryContext = createContext<{
  dictionary: DictionaryType;
  locale: Lang;
} | null>(null);

export const useDictionaryContext = () => {
  const context = use(DictionaryContext);
  if (!context)
    throw new Error("useDictionaryContext must be used within its provider");
  return context;
};

export const Provider = ({
  initialDictionary,
  initialLocale,
  children,
}: {
  initialDictionary: DictionaryType;
  initialLocale: Lang;
  children: React.ReactNode;
}) => {
  return (
    <DictionaryContext
      value={{ dictionary: initialDictionary, locale: initialLocale }}
    >
      {children}
    </DictionaryContext>
  );
};
