import { getLocaleFromCookie, t, tReact } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  image?: string;
  rankedPoints: number;
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
  };
}

const roundTo2Decimals = (number: number) => (number || 0).toFixed(2);

const Span = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

const UserPage = async ({ user }: { user: User }) => {
  const locale = await getLocaleFromCookie(cookies);

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
        <p className="text-gray-700 dark:text-gray-300">
          <Span>{t(locale, "publicUserPage.stats.rankedPoints")}</Span>{" "}
          {user.rankedPoints}
        </p>

        {/* Stats */}
        <div className="w-full mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {t(locale, "publicUserPage.stats.stats")}
          </h3>
          {user.stats && user.stats.totalGames > 0 ? (
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
              <div>
                <Span>{t(locale, "publicUserPage.stats.totalGames")}</Span>{" "}
                {user.stats.totalGames}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.winrate")}</Span>{" "}
                {tReact(locale, "publicUserPage.stats.winrateNumber", {
                  number: (user.stats.wins / user.stats.totalGames) * 100,
                })}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.w/l/t")}</Span>{" "}
                {user.stats.wins}/{user.stats.losses}/{user.stats.ties}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgGamePoints")}</Span>{" "}
                {roundTo2Decimals(
                  user.stats.totalPoints / user.stats.totalGames
                )}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgPointsDiff")}</Span>{" "}
                {roundTo2Decimals(
                  user.stats.totalPointsDiff / user.stats.totalGames
                )}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.wordsPerGame")}</Span>{" "}
                {roundTo2Decimals(
                  user.stats.totalWords / user.stats.totalGames
                )}
              </div>
              <div>
                <Span>{t(locale, "publicUserPage.stats.avgPerWord")}</Span>{" "}
                {user.stats.totalWords > 0
                  ? roundTo2Decimals(
                      user.stats.totalPoints / user.stats.totalWords
                    )
                  : 0}
              </div>
              {user.stats.currentStreakType !== "none" && (
                <div>
                  <Span>{t(locale, "publicUserPage.stats.currentStreak")}</Span>{" "}
                  {user.stats.currentStreak}{" "}
                  {user.stats.currentStreakType === "win" ? "🏆" : "💀"}
                </div>
              )}
              <div>
                {" "}
                <Span>
                  {t(locale, "publicUserPage.stats.longestWinStreak")}
                </Span>{" "}
                {user.stats.longestWinStreak} 🏆
              </div>
              <div>
                {" "}
                <Span>
                  {t(locale, "publicUserPage.stats.longestLossStreak")}
                </Span>{" "}
                {user.stats.longestLossStreak} 💀
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              {" "}
              <Span>{t(locale, "publicUserPage.noData")}</Span>{" "}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Placeholder for past games */}
      <div className="flex-1 flex-2 mt-6 md:mt-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {t(locale, "publicUserPage.pastGames.pastGames")}
        </h3>
        <div className="text-gray-600 dark:text-gray-400">...</div>
      </div>
    </div>
  );
};

export default UserPage;
