import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import Container from "../Container";
import MobileHeaderLinks from "./MobileHeaderLinks";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";
import { Links } from "./Links";

export const Header = async () => {
  const locale = await getLocaleFromCookie(cookies);
  return (
    <header className="bg-primary text-white">
      <Container className="py-3 flex justify-between items-center">
        <Link href={routeStrings.home} className="font-bold text-2xl">
          WordBattles
        </Link>

        <div className="hidden md:block">
          <Links locale={locale} />
        </div>

        <MobileHeaderLinks locale={locale} />
      </Container>
    </header>
  );
};
