import React, { ReactNode } from "react";
import { fetchPastGames } from "../utils/apiCalls";
import { UserSearchParams } from "@/utils/types";
import Pagination from "@/components/Paginations";
import Games from "./Games";
import { GameState } from "@/features/game/utils/types/gameTypes";
import ErrorMessage from "@/components/ErrorMessage";
import { getDictionaryFromSubdomain } from "@/features/language/lib/helpersServer";

const PastGamesWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex-1 flex-2 mt-6 md:mt-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 w-full min-h-[200px]">
    {children}
  </div>
);

const UserPastGames = async ({
  searchParams,
  id,
}: {
  id: string;
  searchParams: UserSearchParams;
}) => {
  const dictionary = await getDictionaryFromSubdomain();
  const currentPage = Number(searchParams.page) || 1;
  let data;
  try {
    const {
      data: dataInner,
    }: {
      data: {
        games: GameState[];
        pageSize: number;
        totalGames: number;
      };
    } = await fetchPastGames(
      id,
      searchParams.lang || "en",
      searchParams.season || "Season1"
    );
    data = dataInner;
  } catch (error) {
    if (error instanceof Error) {
      return (
        <PastGamesWrapper>
          <ErrorMessage error={error.message} />
        </PastGamesWrapper>
      );
    }
    // fallback for non-Error cases
    return (
      <PastGamesWrapper>
        <ErrorMessage error={dictionary.unexpectedError} />
      </PastGamesWrapper>
    );
  }
  const games = data.games;

  return (
    <PastGamesWrapper>
      {" "}
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {dictionary.publicUserPage.pastGames.pastGames}
      </h3>
      <div className="text-gray-600 dark:text-gray-400">
        {!games.length && <>{dictionary.publicUserPage.pastGames.noGames}</>}
        {games.length !== 0 && (
          <>
            <Games games={games} />
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={data.totalGames}
              pageSize={data.pageSize}
            />
          </>
        )}
      </div>
    </PastGamesWrapper>
  );
};

export const UserPastGamesSkeleton = () => {
  return (
    <div className="flex-1 flex-2 mt-6 md:mt-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 w-full min-h-[200px] animate-pulse">
      {/* Title skeleton */}
      <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>

      {/* Game cards skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {/* Left section */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Right section (buttons) */}
            <div className="flex gap-2 mt-3 sm:mt-0">
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default UserPastGames;
