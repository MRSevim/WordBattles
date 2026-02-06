import { returnErrorFromUnknown } from "@/utils/serverHelpers";
import { authClient } from "../lib/authClient";
import { routeStrings } from "@/utils/routeStrings";

export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      /**
       * A URL to redirect after the user authenticates with the provider
       * @default "/"
       */
      callbackURL: process.env.NEXT_PUBLIC_BASE_URL! + routeStrings.home,
    });
    return { error: "" };
  } catch (error) {
    console.error("Sign-in error:", error);
    return await returnErrorFromUnknown(error);
  }
};
export const logout = async () => {
  try {
    const { error } = await authClient.signOut();
    if (error) throw error;
    return { error: "" };
  } catch (error) {
    console.error("Logout error:", error);
    return await returnErrorFromUnknown(error);
  }
};
export const deleteUser = async () => {
  try {
    const { error } = await authClient.deleteUser();

    if (error) throw error;
    return { error: "" };
  } catch (error) {
    console.error("Logout error:", error);
    return await returnErrorFromUnknown(error);
  }
};
