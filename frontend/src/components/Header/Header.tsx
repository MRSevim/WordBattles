import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import Container from "../Container";
import MobileHeaderLinks from "./MobileHeaderLinks";
import UserMenu from "./UserMenu";

export const Header = () => {
  return (
    <header className="bg-primary text-white">
      <Container className="py-3 flex justify-between items-center">
        <Link href={routeStrings.home} className="font-bold text-2xl">
          WordBattles
        </Link>

        <div className="hidden md:block">
          <Links />
        </div>

        <MobileHeaderLinks />
      </Container>
    </header>
  );
};

export const Links = ({
  mobile,
  closeMenu,
}: {
  mobile?: boolean;
  closeMenu?: () => void;
}) => {
  const LinkClasses = `${
    mobile ? "py-2" : ""
  } hover:scale-105 transition-transform`;

  return (
    <nav
      className={`flex items-center ${
        mobile ? "flex-col h-full w-full text-2xl" : "gap-4"
      }`}
    >
      <Link
        className={LinkClasses}
        href={routeStrings.about}
        onClick={closeMenu}
      >
        About The Game
      </Link>
      <Link
        className={LinkClasses}
        href={routeStrings.ladder}
        onClick={closeMenu}
      >
        Ladder Points
      </Link>
      <UserMenu onClick={closeMenu} />
    </nav>
  );
};
