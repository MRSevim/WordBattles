import { Lang } from "@/features/language/helpers/types";
import { cookies } from "next/headers";
import { GameType } from "./types/gameTypes";

type StringOrUnd = string | undefined;

export const getGameCookies = async () => {
  let sessionId: StringOrUnd;
  let roomId: StringOrUnd;
  let lang: Lang | undefined;
  let type: GameType | undefined;

  //  Try to load cookies separately
  try {
    const cookieStore = await cookies();
    lang = cookieStore.get("lang")?.value as Lang;
    sessionId = cookieStore.get("sessionId")?.value;
    roomId = cookieStore.get("roomId")?.value;
    type = cookieStore.get("type")?.value as GameType;
  } catch (err) {
    console.error("Failed to read cookies:", err);
  }

  //  Return fallback-safe render
  return { sessionId, roomId, lang, type };
};
