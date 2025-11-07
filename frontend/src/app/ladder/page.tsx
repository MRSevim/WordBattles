import { Ladder } from "@/features/ladder/components/Ladder";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { LadderSearchParams } from "@/utils/types";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const locale = await getLocaleFromCookie(cookies);
  const title = t(locale, "metadata.ladder.title");
  const description = t(locale, "metadata.ladder.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

const page = ({ searchParams }: { searchParams: LadderSearchParams }) => {
  return <Ladder searchParams={searchParams} />;
};

export default page;
