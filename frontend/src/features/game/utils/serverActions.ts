/* "use server";

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

export const removeCookie = async (name: string) => {
  (await cookies()).delete(name);
}; */

export const setCookie = (name: string, value: string, days: number) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )};path=/;max-age=${maxAge}`;
};

export const removeCookie = (name: string) => {
  // Set cookie with past max-age to delete it
  document.cookie = `${encodeURIComponent(name)}=;path=/;max-age=0`;
};
