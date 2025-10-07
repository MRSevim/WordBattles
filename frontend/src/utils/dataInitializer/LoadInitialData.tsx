import { getServerSession } from "@/features/auth/utils/getServerSideSession";
import InitializeData from "./InitializeData";

const LoadInitialData = async () => {
  const { data: session } = await getServerSession();

  const user = session?.user
    ? {
        ...session.user,
        createdAt: new Date(session.user.createdAt).getTime(),
        updatedAt: new Date(session.user.updatedAt).getTime(),
      }
    : null;

  return <InitializeData user={user} />;
};

export default LoadInitialData;
