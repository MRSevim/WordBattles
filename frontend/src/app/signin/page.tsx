import Signin from "@/features/auth/components/Signin";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const locale = await getLocaleFromCookie(cookies);
  const title = t(locale, "metadata.signIn.title");
  const description = t(locale, "metadata.signIn.description");

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
  return <Signin />;
};

export default page;
