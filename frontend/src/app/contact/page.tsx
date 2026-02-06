import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
} from "@/features/language/utils/helpersServer";
import ContactForm from "./ContactForm";
import { routeStrings } from "@/utils/routeStrings";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);
  const title = dictionary.metadata.contact.title;
  const description = dictionary.metadata.contact.description;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.contact),
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

export default function page() {
  return <ContactForm />;
}
