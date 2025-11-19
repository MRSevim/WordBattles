import Signin from "@/features/auth/components/Signin";
import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";

export async function generateMetadata() {
  const dictionary = await getDictionaryFromSubdomain();
  const title = dictionary.metadata.signIn.title;
  const description = dictionary.metadata.signIn.description;

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
