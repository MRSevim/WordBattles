import { LadderSearchParams } from "@/utils/types";
import Container from "../../../components/Container";
import Pagination from "../../../components/Paginations";
import { fetchLadder } from "../utils/apiCalls";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  rankedScore: number;
}

interface UserRank {
  rank: number;
  username: string;
  rankedScore: number;
}

export const Ladder = async ({
  searchParams,
}: {
  searchParams: LadderSearchParams;
}) => {
  const limit = 20; // Define the limit per page
  const pageQuery = (await searchParams).page;
  const page = Number(pageQuery) || 1;
  const ladder: {
    ladder: User[];
    userRank: UserRank;
    totalUsers: number;
  } | null = await fetchLadder({ page, limit });

  return (
    <Container className="py-10">
      {ladder && (
        <div>
          {ladder.ladder.map((user, index) => (
            <div key={user._id} className="flex justify-between p-2 border-b">
              <span>
                {index + 1 + (page - 1) * limit}: {user.username}
              </span>
              <span className="font-bold"> {user.rankedScore}</span>
            </div>
          ))}

          <Pagination
            currentPage={page}
            totalItems={ladder.totalUsers}
            pageSize={limit}
          />

          {ladder.userRank && (
            <div className=" mt-5 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between">
                <span>
                  {ladder.userRank.rank}: {ladder.userRank.username}
                </span>
                <span className="font-bold">
                  {" "}
                  {ladder.userRank.rankedScore}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};
