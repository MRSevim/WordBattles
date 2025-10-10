"use server";

import { cookies } from "next/headers";

export const setCookie = async (name: string, value: string, days: number) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: "/",
    maxAge: days * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
};
