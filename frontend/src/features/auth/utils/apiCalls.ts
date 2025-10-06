"use server";

import { returnErrorFromUnknown } from "@/utils/helpers";
import { authClient } from "../lib/authClient";
import { redirect } from "next/navigation";

export const signIn = async () => {
  let url: string;
  try {
    const { data } = await authClient.signIn.social({
      provider: "google",
    });
    if (!data?.url) throw new Error("No URL returned from sign-in");
    url = data.url;
  } catch (error) {
    console.error("Sign-in error:", error);
    return returnErrorFromUnknown(error);
  }
  redirect(url);
};
