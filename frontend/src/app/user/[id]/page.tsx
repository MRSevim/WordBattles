import Container from "@/components/Container";
import UserPage from "@/features/user/components/pages/UserPage";
import { fetchUser } from "@/features/user/utils/apiCalls";
import { UserSearchParams } from "@/features/user/utils/types";

export default async function Page({
  params,
  searchParams,
}: {
  searchParams: Promise<UserSearchParams>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const searchParamsAwaited = await searchParams;
  const { data } = await fetchUser(
    id,
    searchParamsAwaited.lang || "en",
    searchParamsAwaited.season || "Season1"
  );

  return (
    <Container>
      <UserPage user={data} searchParams={searchParamsAwaited} />
    </Container>
  );
}
