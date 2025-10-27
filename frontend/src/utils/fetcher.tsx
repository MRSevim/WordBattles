"use server";
import { headers } from "next/headers";
export const fetchFromBackend = async (endpoint: string, options = {}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`, {
    headers: await headers(),
    ...options,
  });
};
