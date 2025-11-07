import { About } from "@/components/pages/About";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const locale = await getLocaleFromCookie(cookies);
  const title = t(locale, "metadata.about.title");
  const description = t(locale, "metadata.about.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

const page = () => {
  return <About />;
};

export default page;
