import { Ladder } from "@/features/ladder/components/Ladder";
import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";
import { UserSearchParams } from "@/utils/types";

export async function generateMetadata() {
  const dictionary = await getDictionaryFromSubdomain();
  const title = dictionary.metadata.ladder.title;
  const description = dictionary.metadata.ladder.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
