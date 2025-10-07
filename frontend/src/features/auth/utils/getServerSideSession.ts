"use server";
import { headers } from "next/headers";
import { authClient } from "../lib/authClient";

export const getServerSession = async () => {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  return session;
};
