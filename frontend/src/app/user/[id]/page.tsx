import Container from "@/components/Container";
import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";
import { interpolateString } from "@/features/language/lib/i18n";
import UserPage from "@/features/user/components/pages/UserPage";
import { fetchUser } from "@/features/user/utils/apiCalls";
import { UserSearchParams } from "@/utils/types";
import { notFound } from "next/navigation";

type SearchParamsPromise = Promise<UserSearchParams>;
type ParamsPromise = Promise<{ id: string }>;

const fetchHelper = async (
  params: ParamsPromise,
  searchParams: SearchParamsPromise
) => {
  const { id } = await params;
  const searchParamsAwaited = await searchParams;
  const { data } = await fetchUser(
    id,
    searchParamsAwaited.lang || "en",
    searchParamsAwaited.season || "Season1"
  );
  if (!data) return notFound();

  return data;
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  searchParams: Promise<UserSearchParams>;
  params: Promise<{ id: string }>;
}) {
  const dictionary = await getDictionaryFromSubdomain();
  const data = await fetchHelper(params, searchParams);

  const title = interpolateString(dictionary.metadata.userPage.title, {
    username: data.name,
  });
  const description = interpolateString(
    dictionary.metadata.userPage.description,
    {
      username: data.name,
    }
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  searchParams: Promise<UserSearchParams>;
  params: Promise<{ id: string }>;
}) {
  const searchParamsAwaited = await searchParams;
  const data = await fetchHelper(params, searchParams);
  return (
    <Container>
      <UserPage user={data} searchParams={searchParamsAwaited} />
    </Container>
  );
}
