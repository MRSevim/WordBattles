import PrivacyPolicy from "@/components/pages/PrivacyPolicy";
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
  const title = dictionary.metadata.privacyPolicy.title;
  const description = dictionary.metadata.privacyPolicy.description;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.privacyPolicy),
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

const page = () => {
  return <PrivacyPolicy />;
};

export default page;
