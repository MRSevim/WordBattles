import { getServerSession } from "@/features/auth/utils/getServerSideSession";
import InitializeData from "./InitializeData";

const LoadInitialData = async () => {
  try {
    const { data: session } = await getServerSession();
    const user = session?.user
      ? {
          ...session.user,
          createdAt: new Date(session.user.createdAt).getTime(),
          updatedAt: new Date(session.user.updatedAt).getTime(),
        }
      : undefined;
    return <InitializeData user={user} />;
  } catch (error) {
    console.error("Error loading initial data:", error);
    return <InitializeData user={undefined} />;
  }
};

export default LoadInitialData;
