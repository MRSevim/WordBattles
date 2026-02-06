import Signin from "@/features/auth/components/Signin";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
} from "@/features/language/utils/helpersServer";
import { routeStrings } from "@/utils/routeStrings";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);

  const title = dictionary.metadata.signIn.title;
  const description = dictionary.metadata.signIn.description;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.signin),
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
  return <Signin />;
};

export default page;
