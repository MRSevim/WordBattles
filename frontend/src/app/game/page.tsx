import { GameContainer } from "@/features/game/components/GameBoard/GameBoard";
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
  const title = dictionary.metadata.game.title;
  const description = dictionary.metadata.game.description;

  return {
    metadataBase: new URL(BASE_URL! + routeStrings.game),
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
  return (
    /* Did not put a container here to prevent horizontal padding on game */
    <main className="flex relative pb-20 mx-auto max-w-7xl flex-1 w-full">
      <GameContainer />
    </main>
  );
};

export default page;
