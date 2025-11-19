"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Lang } from "@/features/language/helpers/types";
import { Season } from "@/features/game/utils/types/gameTypes";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";

const LangAndSeasonSelectors = ({
  searchParams,
}: {
  searchParams: { lang?: Lang; season?: Season };
}) => {
  const { dictionary } = useDictionaryContext();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParamsObj = useSearchParams();

  const lang = searchParams.lang || "en";
  const season = searchParams.season || "Season1";

  const handleChange = (key: string, val: string) => {
    const params = new URLSearchParams(searchParamsObj.toString());
    params.set(key, val.toString());

    replace(pathname + "?" + params.toString());
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-3 mb-4">
      {/* Language Selector */}
      <div className="flex flex-col">
        <label
          htmlFor="lang"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {dictionary.publicUserPage.selectors.language.label}
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => handleChange("lang", e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="en">{dictionary.lang.en}</option>
          <option value="tr"> {dictionary.lang.tr}</option>
        </select>
      </div>

      {/* Season Selector */}
      <div className="flex flex-col">
        <label
          htmlFor="season"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {dictionary.publicUserPage.selectors.season.label}
        </label>
        <select
          id="season"
          value={season}
          onChange={(e) => handleChange("season", e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="Season1">
            {" "}
            {dictionary.publicUserPage.selectors.season.Season1}
          </option>
        </select>
      </div>
    </div>
  );
};

export default LangAndSeasonSelectors;
