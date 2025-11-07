import Container from "../../../components/Container";
import Pagination from "../../../components/Paginations";
import { fetchLadder } from "../utils/apiCalls";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";
import { Division } from "@/features/game/utils/types/gameTypes";
import { DivisionComp } from "@/features/game/components/DivisionComp";
import { UserSearchParams } from "@/utils/types";
import LangAndSeasonSelectors from "@/components/LangAndSeasonSelectors";

interface Ladder {
  position: number;
  division: Division;
  user: {
    name: string;
    image: string | null;
  };
  userId: string;
  rankedPoints: number;
}

interface UserRank {
  rank: number;
  username: string;
  rankedPoints: number;
  division: Division;
}

export const Ladder = async ({
  searchParams,
}: {
  searchParams: Promise<UserSearchParams>;
}) => {
  const limit = 20; // Define the limit per page
  const params = await searchParams;
  const lang = params.lang || "en";
  const season = params.season || "Season1";
  const page = params.page ?? 1;

  const ladder: {
    ladder: Ladder[];
    userRank?: UserRank;
    totalUsers: number;
  } | null = await fetchLadder({ page, limit, lang, season });

  const locale = await getLocaleFromCookie(cookies);

  return (
    <Container className="py-10">
      <LangAndSeasonSelectors searchParams={{ lang, season }} />
      {ladder && ladder.ladder.length > 0 && ladder.totalUsers > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {/* Table Header */}
            <div className="col-span-3 grid grid-cols-subgrid items-center p-2 font-semibold border-b text-sm sm:text-base">
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>{t(locale, "ladder.username")}</span>
                <span>{t(locale, "ladder.rankedPoints")}</span>
              </div>
              <span className="text-end">{t(locale, "ladder.division")}</span>
            </div>

            {/* Ladder Items */}
            {ladder.ladder.map((item, index) => (
              <div
                key={item.userId}
                className="col-span-3 grid grid-cols-subgrid p-2 border-b text-sm sm:text-base"
              >
                <div className="col-span-2 grid grid-cols-subgrid items-center">
                  <div>
                    <span className="w-6 text-right">
                      {index + 1 + (page - 1) * limit}.
                    </span>
                    <span>{item.user.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">
                    {item.rankedPoints}
                  </span>
                </div>

                <div className="flex justify-end">
                  <DivisionComp division={item.division} />
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalItems={ladder.totalUsers}
            pageSize={limit}
          />

          {ladder.userRank && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center gap-2">
                <span>
                  {ladder.userRank.rank}: {ladder.userRank.username}
                </span>
                <span className="font-bold">
                  {" "}
                  {ladder.userRank.rankedPoints}
                </span>
                <DivisionComp division={ladder.userRank.division} />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="font-bold text-lg mx-4">{t(locale, "noData")}</p>
      )}
    </Container>
  );
};
