import { cookies } from "next/headers";
import InitializeCookieData from "./InitializeCookieData";
import { Lang } from "@/features/language/helpers/types";
import { getLocaleFromCookie } from "@/features/language/lib/i18n";

type StringOrUnd = string | undefined;

const LoadCookieData = async () => {
  let sessionId: StringOrUnd;
  let roomId: StringOrUnd;
  let lang: Lang | undefined;

  //  Try to load cookies separately
  try {
    const cookieStore = await cookies();
    lang = cookieStore.get("lang")?.value as Lang;
    sessionId = cookieStore.get("sessionId")?.value;
    roomId = cookieStore.get("roomId")?.value;
  } catch (err) {
    console.error("Failed to read cookies:", err);
  }

  //  Return fallback-safe render
  return <InitializeCookieData cookies={{ sessionId, roomId, lang }} />;
};

export default LoadCookieData;
