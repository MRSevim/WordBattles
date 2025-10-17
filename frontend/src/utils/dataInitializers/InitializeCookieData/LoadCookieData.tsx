import { cookies } from "next/headers";
import InitializeCookieData from "./InitializeCookieData";

type StringOrUnd = string | undefined;

const LoadCookieData = async () => {
  let sessionId: StringOrUnd;
  let roomId: StringOrUnd;

  //  Try to load cookies separately
  try {
    const cookieStore = await cookies();
    sessionId = cookieStore.get("sessionId")?.value;
    roomId = cookieStore.get("roomId")?.value;
  } catch (err) {
    console.error("Failed to read cookies:", err);
  }

  //  Return fallback-safe render
  return <InitializeCookieData cookies={{ sessionId, roomId }} />;
};

export default LoadCookieData;
