import Container from "../../../components/Container";
import Pagination from "../../../components/Paginations";
import { fetchLadder } from "../utils/apiCalls";
import { Division } from "@/features/game/utils/types/gameTypes";
import { DivisionComp } from "@/features/game/components/DivisionComp";
import { UserSearchParams } from "@/utils/types";
import LangAndSeasonSelectors from "@/components/LangAndSeasonSelectors";
import UserLink from "@/components/UserLink";
import {
  getDictionaryFromSubdomain,
  getLocaleFromSubdomain,
} from "@/features/language/lib/helpersServer";

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
  userId: string;
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

  const {
    data: ladder,
  }: {
    data: {
      ladder: Ladder[];
      userRank?: UserRank;
      totalPlayers: number;
    } | null;
  } = await fetchLadder({ page, limit, lang, season });

  const dictionary = await getDictionaryFromSubdomain();
  const locale = await getLocaleFromSubdomain();
  const userRank = ladder?.userRank;
  return (
    <Container className="py-10">
      <LangAndSeasonSelectors searchParams={{ lang, season }} />
      {ladder && ladder.ladder.length > 0 && ladder.totalPlayers > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {/* Table Header */}
            <div className="col-span-3 grid grid-cols-subgrid items-center p-2 font-semibold border-b text-sm sm:text-base">
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>{dictionary.ladder.username}</span>
                <span>{dictionary.ladder.rankedPoints}</span>
              </div>
              <span className="text-end">{dictionary.ladder.division}</span>
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
                    <span>
                      <UserLink
                        id={item.userId}
                        locale={locale}
                        target="_blank"
                        className="hover:underline"
                      >
                        {item.user.name}
                      </UserLink>
                    </span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
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
            totalItems={ladder.totalPlayers}
            pageSize={limit}
          />

          {userRank && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center gap-2">
                <span>
                  {userRank.rank}:{" "}
                  <UserLink
                    id={userRank.userId}
                    locale={locale}
                    target="_blank"
                    className="hover:underline"
                  >
                    {userRank.username}
                  </UserLink>
                </span>
                <span className="font-bold"> {userRank.rankedPoints}</span>
                <DivisionComp division={userRank.division} />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="font-bold text-lg mx-4">{dictionary.noData}</p>
      )}
    </Container>
  );
};
