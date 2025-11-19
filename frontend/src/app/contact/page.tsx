import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";
import ContactForm from "./ContactForm";

export async function generateMetadata() {
  const dictionary = await getDictionaryFromSubdomain();
  const title = dictionary.metadata.contact.title;
  const description = dictionary.metadata.contact.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function page() {
  return <ContactForm />;
}
