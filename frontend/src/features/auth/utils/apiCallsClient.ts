import { returnErrorFromUnknown } from "@/utils/helpers";
import { authClient } from "../lib/authClient";
import { redirect } from "next/navigation";
import { routeStrings } from "@/utils/routeStrings";

export const signInWithGoogle = async () => {
  let url: string;
  try {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      /**
       * A URL to redirect after the user authenticates with the provider
       * @default "/"
       */
      callbackURL: process.env.NEXT_PUBLIC_BASE_URL! + routeStrings.home,
    });
    if (!data?.url)
      throw new Error("No URL returned from sign-in" + error?.message);
    url = data.url;
  } catch (error) {
    console.error("Sign-in error:", error);
    return returnErrorFromUnknown(error);
  }
  redirect(url);
};
export const logout = async () => {
  try {
    const { error } = await authClient.signOut();
    if (error) throw error;
    return { error: "" };
  } catch (error) {
    console.error("Logout error:", error);
    return returnErrorFromUnknown(error);
  }
};
export const deleteUser = async () => {
  try {
    const { error } = await authClient.deleteUser();

    if (error) throw error;
    return { error: "" };
  } catch (error) {
    console.error("Logout error:", error);
    return returnErrorFromUnknown(error);
  }
};
