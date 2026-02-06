import Container from "@/components/Container";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
} from "@/features/language/utils/helpersServer";
import { interpolateString } from "@/features/language/lib/i18n";
import UserPage from "@/features/user/components/pages/UserPage";
import { fetchUser } from "@/features/user/utils/apiCalls";
import { routeStrings } from "@/utils/routeStrings";
import { UserSearchParams } from "@/utils/types";
import { notFound } from "next/navigation";

type SearchParamsPromise = Promise<UserSearchParams>;
type ParamsPromise = Promise<{ id: string }>;

const fetchHelper = async (
  params: ParamsPromise,
  searchParams: SearchParamsPromise,
) => {
  const { id } = await params;
  const searchParamsAwaited = await searchParams;
  const { data } = await fetchUser(
    id,
    searchParamsAwaited.lang || "en",
    searchParamsAwaited.season || "Season1",
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
  const [dictionary, BASE_URL, data] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
    fetchHelper(params, searchParams),
  ]);

  const title = interpolateString(dictionary.metadata.userPage.title, {
    username: data.name,
  });
  const description = interpolateString(
    dictionary.metadata.userPage.description,
    {
      username: data.name,
    },
  );

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.userPage(data.id)),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
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
