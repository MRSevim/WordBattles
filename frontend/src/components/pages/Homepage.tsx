import { getDictionaryFromSubdomain } from "@/features/language/helpers/helpersServer";
import Container from "../Container";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";

export const Homepage = async () => {
  const dictionary = await getDictionaryFromSubdomain();
  return (
    <Container className="mt-20 mb-60 flex flex-col gap-10 sm:mt-0 sm:gap-20 sm:flex-row justify-between items-center">
      {/* Left side content */}
      <div className="flex flex-col items-center gap-6 shrink sm:flex-1 text-center">
        <h2 className="text-2xl font-semibold">{dictionary.homepage.title}</h2>

        <Link
          href={routeStrings.game}
          className="py-6 px-10 bg-primary text-white text-lg rounded-xl transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
        >
          {dictionary.homepage.play}
        </Link>
      </div>

      {/* Right side video */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-foreground border-2 shrink h-auto sm:flex-2">
        <video
          src="/how-to-play-WordBattles.webm"
          autoPlay
          loop
          muted
          controls
          playsInline
          className="w-full rounded-2xl"
        />
      </div>
    </Container>
  );
};
