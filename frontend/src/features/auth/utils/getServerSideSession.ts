"use server";
import { headers } from "next/headers";
import { authClient } from "../lib/authClient";

export const getUserData = async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (session?.user) {
    return {
      ...session.user,
      createdAt: new Date(session.user.createdAt).getTime(),
      updatedAt: new Date(session.user.updatedAt).getTime(),
    };
  }
  return undefined;
};
