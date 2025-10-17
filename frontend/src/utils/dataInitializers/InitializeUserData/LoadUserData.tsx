import { getServerSession } from "@/features/auth/utils/getServerSideSession";
import { User } from "@/features/auth/utils/types";
import InitializeUserData from "./InitializeUserData";

const LoadUserData = async () => {
  let user: User | undefined;

  // Try to load user session
  try {
    const { data: session } = await getServerSession();
    if (session?.user) {
      user = {
        ...session.user,
        createdAt: new Date(session.user.createdAt).getTime(),
        updatedAt: new Date(session.user.updatedAt).getTime(),
      };
    }
  } catch (err) {
    console.error("Failed to fetch session:", err);
  }

  // Return fallback-safe render
  return <InitializeUserData user={user} />;
};

export default LoadUserData;
