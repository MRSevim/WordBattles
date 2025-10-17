"use client"; //this has to be client because it is used inside mobileHeaderLinks which is client
import LanguageSwitcher from "@/features/language/components/LanguageSwitcher";
import { Lang } from "@/features/language/helpers/types";
import { t } from "@/features/language/lib/i18n";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import UserMenu from "./UserMenu";

export const Links = ({
  mobile,
  closeMenu,
  locale,
}: {
  mobile?: boolean;
  closeMenu?: () => void;
  locale: Lang;
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
        {t(locale, "header.about")}
      </Link>
      <Link
        className={LinkClasses}
        href={routeStrings.ladder}
        onClick={closeMenu}
      >
        {t(locale, "header.leaderboard")}
      </Link>
      <LanguageSwitcher />
      <UserMenu onClick={closeMenu} locale={locale} />
    </nav>
  );
};
