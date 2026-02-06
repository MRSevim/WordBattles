import { Ladder } from "@/features/ladder/components/Ladder";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
} from "@/features/language/utils/helpersServer";
import { routeStrings } from "@/utils/routeStrings";
import { UserSearchParams } from "@/utils/types";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);

  const title = dictionary.metadata.ladder.title;
  const description = dictionary.metadata.ladder.description;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.ladder),
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

const page = ({
  searchParams,
}: {
  searchParams: Promise<UserSearchParams>;
}) => {
  return <Ladder searchParams={searchParams} />;
};

export default page;
