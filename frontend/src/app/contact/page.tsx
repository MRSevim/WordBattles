import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import ContactForm from "./ContactForm";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const locale = await getLocaleFromCookie(cookies);
  const title = t(locale, "metadata.contact.title");
  const description = t(locale, "metadata.contact.description");

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
