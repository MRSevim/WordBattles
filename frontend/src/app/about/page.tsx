import { About } from "@/components/pages/About";
import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";

export async function generateMetadata() {
  const dictionary = await getDictionaryFromSubdomain();

  const title = dictionary.metadata.about.title;
  const description = dictionary.metadata.about.description;

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
