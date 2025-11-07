import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";
import Image from "next/image";
import { UserSearchParams } from "@/utils/types";
import { Division } from "@/features/game/utils/types/gameTypes";
import { DivisionComp } from "@/features/game/components/DivisionComp";
import UserPastGames, { UserPastGamesSkeleton } from "../UserPastGames";
import { Suspense } from "react";
import LangAndSeasonSelectors from "@/components/LangAndSeasonSelectors";

interface User {
  id: string;
  name: string;
  division: Division;
  image?: string;
  ranks?: { rankedPoints: number }[];
  stats?: {
    totalGames: number;
    wins: number;
    losses: number;
    ties: number;
    totalPoints: number;
    totalWords: number;
    totalPointsDiff: number;
    currentStreak: number;
    currentStreakType: "win" | "loss" | "none";
    longestWinStreak: number;
    longestLossStreak: number;
  }[];
}

const roundTo2Decimals = (number: number) => (number || 0).toFixed(2);

const Span = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

const UserPage = async ({
  user,
  searchParams,
}: {
  user: User;
  searchParams: UserSearchParams;
}) => {
  const locale = await getLocaleFromCookie(cookies);
  const stats = user.stats?.[0];
  const ranks = user.ranks?.[0];
  const division = user.division;
  return (
    <div className="w-full py-8 flex flex-col gap-3 md:flex-row md:gap-6 items-start">
      {/* Left side: Profile */}
      <div className="flex flex-col items-center gap-4 w-full md:flex-1">
        {/* User Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600 dark:border-gray-300">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center text-white text-xl">
              {user.name[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and Ranked Score */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {user.name}
        </h2>
        <LangAndSeasonSelectors searchParams={searchParams} />
        {ranks && (
          <p className="text-gray-700 dark:text-gray-300">
            <Span>{t(locale, "publicUserPage.stats.rankedPoints")}</Span>{" "}
            {ranks.rankedPoints}
          </p>
        )}
        {division && <DivisionComp division={division} />}

        {/* Stats */}
        <div className="w-full mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {t(locale, "publicUserPage.stats.stats")}
          </h3>
          {stats && stats.totalGames > 0 ? (
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
              <div>
                <Span>{t(locale, "publicUserPage.stats.totalGames")}</Span>{" "}
                {stats.totalGames}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.winrate")}</Span>{" "}
                {t(locale, "publicUserPage.stats.winrateNumber", {
                  number: roundTo2Decimals(
                    (stats.wins / stats.totalGames) * 100
                  ),
                })}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.w/l/t")}</Span>{" "}
                {stats.wins}/{stats.losses}/{stats.ties}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgGamePoints")}</Span>{" "}
                {roundTo2Decimals(stats.totalPoints / stats.totalGames)}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgPointsDiff")}</Span>{" "}
                {roundTo2Decimals(stats.totalPointsDiff / stats.totalGames)}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.wordsPerGame")}</Span>{" "}
                {roundTo2Decimals(stats.totalWords / stats.totalGames)}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgPerWord")}</Span>{" "}
                {stats.totalWords > 0
                  ? roundTo2Decimals(stats.totalPoints / stats.totalWords)
                  : 0}
              </div>
              {stats.currentStreakType !== "none" && (
                <div>
                  <Span>{t(locale, "publicUserPage.stats.currentStreak")}</Span>{" "}
                  {stats.currentStreak}{" "}
                  {stats.currentStreakType === "win" ? "🏆" : "💀"}
                </div>
              )}
              <div>
                {" "}
                <Span>
                  {t(locale, "publicUserPage.stats.longestWinStreak")}
                </Span>{" "}
                {stats.longestWinStreak} 🏆
              </div>
              <div>
                {" "}
                <Span>
                  {t(locale, "publicUserPage.stats.longestLossStreak")}
                </Span>{" "}
                {stats.longestLossStreak} 💀
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              {" "}
              <Span>{t(locale, "noData")}</Span>{" "}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Past games */}

      <Suspense fallback={<UserPastGamesSkeleton />}>
        <UserPastGames id={user.id} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default UserPage;
