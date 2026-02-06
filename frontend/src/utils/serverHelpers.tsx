"use server";
import { getDictionaryFromSubdomain } from "@/features/language/utils/helpersServer";
import { headers } from "next/headers";

export const fetchFromBackend = async (endpoint: string, options = {}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`, {
    headers: new Headers(await headers()),
    ...options,
  });
};

//Helper func to return error messages compatible with ts
export const returnErrorFromUnknown = async (error: unknown) => {
  const dictionary = await getDictionaryFromSubdomain();
  if (error instanceof Error && error.message) return { error: error.message };
  return { error: dictionary.unexpectedError };
};
