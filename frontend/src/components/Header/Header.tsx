import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import Container from "../Container";
import MobileHeaderLinks from "./MobileHeaderLinks";
import { Links } from "./Links";

export const Header = async () => {
  return (
    <header className="bg-primary text-white">
      <Container
        isMain={false}
        className="py-3 flex justify-between items-center"
      >
        <Link href={routeStrings.home} className="font-bold text-2xl me-2">
          WordBattles
        </Link>

        <div className="hidden lg:block">
          <Links />
        </div>

        <MobileHeaderLinks />
      </Container>
    </header>
  );
};
