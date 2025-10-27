import Container from "@/components/Container";
import UserPage from "@/features/user/components/pages/UserPage";
import { fetchUser } from "@/features/user/utils/apiCalls";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await fetchUser(id);

  return (
    <Container>
      <UserPage user={data} />
    </Container>
  );
}
