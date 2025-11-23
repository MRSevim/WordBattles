import { About } from "@/components/pages/About";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
} from "@/features/language/helpers/helpersServer";
import { routeStrings } from "@/utils/routeStrings";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);

  const title = dictionary.metadata.about.title;
  const description = dictionary.metadata.about.description;
  const keywords = dictionary.metadata.about.keywords;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.about),
    title,
    description,
    keywords,
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

const page = () => {
  return <About />;
};

export default page;
