import { getServerSession } from "@/features/auth/utils/getServerSideSession";
import InitializeData from "./InitializeData";
import { cookies } from "next/headers";

const LoadInitialData = async () => {
  let user, sessionId, roomId;
  try {
    const { data: session } = await getServerSession();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    const roomId = cookieStore.get("roomId")?.value;
    user = session?.user
      ? {
          ...session.user,
          createdAt: new Date(session.user.createdAt).getTime(),
          updatedAt: new Date(session.user.updatedAt).getTime(),
        }
      : undefined;
    return <InitializeData user={user} sessionId={sessionId} roomId={roomId} />;
  } catch (error) {
    console.error("Error loading initial data:", error);
    return <InitializeData user={user} sessionId={sessionId} roomId={roomId} />;
  }
};

export default LoadInitialData;
