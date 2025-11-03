"use client";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { UserSearchParams } from "../utils/types";
import { t } from "@/features/language/lib/i18n";
import { usePathname, useRouter } from "next/navigation";

const SearchParamSelectors = ({
  searchParams,
}: {
  searchParams: UserSearchParams;
}) => {
  const [locale] = useLocaleContext();
  const pathname = usePathname();
  const { replace } = useRouter();
  const lang = searchParams.lang || "en";
  const season = searchParams.season || "Season1";
  const callReplace = (val: string) => replace(`${pathname}?${val}`);
  return (
    <div className="flex flex-wrap items-center gap-4 mt-3 mb-4">
      {/* Language Selector */}
      <div className="flex flex-col">
        <label
          htmlFor="lang"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t(locale, "publicUserPage.selectors.language.label")}
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) =>
            callReplace(`lang=${e.target.value}&season=${season}`)
          }
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="en">
            {t(locale, "publicUserPage.selectors.language.en")}
          </option>
          <option value="tr">
            {" "}
            {t(locale, "publicUserPage.selectors.language.tr")}
          </option>
        </select>
      </div>

      {/* Season Selector */}
      <div className="flex flex-col">
        <label
          htmlFor="season"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t(locale, "publicUserPage.selectors.season.label")}
        </label>
        <select
          id="season"
          value={season}
          onChange={(e) => callReplace(`lang=${lang}&season=${e.target.value}`)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="Season1">
            {" "}
            {t(locale, "publicUserPage.selectors.season.Season1")}
          </option>
        </select>
      </div>
    </div>
  );
};

export default SearchParamSelectors;
