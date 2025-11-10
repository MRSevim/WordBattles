"use client"; //this has to be client because it is used inside mobileHeaderLinks which is client

import LanguageSwitcher from "@/features/language/components/LanguageSwitcher";
import { Lang } from "@/features/language/helpers/types";
import { t } from "@/features/language/lib/i18n";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { ThemeToggler } from "./ThemeToggler";

export const Links = ({
  mobile,
  closeMenu,
  locale,
}: {
  mobile?: boolean;
  closeMenu?: () => void;
  locale: Lang;
}) => {
  const linkBase =
    "transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400";
  const mobileLinks =
    "w-full text-center py-2 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700/70 hover:translate-x-1 transition-transform";

  const mobileLine = (
    <div className="h-px w-2/3 bg-gray-300/70 dark:bg-gray-700/70" />
  );
  return (
    <nav
      className={`flex items-center ${
        mobile
          ? "text-black dark:text-white flex-col w-full h-full gap-3 py-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-lg rounded-lg shadow-inner"
          : "gap-4"
      }`}
    >
      {mobile && (
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {t(locale, "header.menu")}
        </h2>
      )}
      {/* Links */}
      <Link
        href={routeStrings.about}
        onClick={closeMenu}
        className={`${linkBase} ${mobile ? mobileLinks : ""}`}
      >
        {t(locale, "header.about")}
      </Link>

      {mobile && mobileLine}

      <Link
        href={routeStrings.ladder + `?lang=${locale}`}
        onClick={closeMenu}
        className={`${linkBase} ${mobile ? mobileLinks : ""}`}
      >
        {t(locale, "header.leaderboard")}
      </Link>

      <Link
        href={routeStrings.contact}
        onClick={closeMenu}
        className={`${linkBase} ${mobile ? mobileLinks : ""}`}
      >
        {t(locale, "header.contact")}
      </Link>

      {mobile && mobileLine}

      {/* Language & Theme */}
      <div
        className={`flex items-center justify-center ${
          mobile ? "flex-col gap-3 mt-2" : "gap-3"
        }`}
      >
        <LanguageSwitcher />
        <ThemeToggler />
        <UserMenu onClick={closeMenu} locale={locale} />
      </div>
    </nav>
  );
};
