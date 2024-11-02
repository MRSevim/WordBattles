import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";

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

export const RankedPoints = () => {
  const [ladder, setLadder] = useState<{
    ladder: User[];
    userRank: UserRank;
    totalUsers: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20; // Define the limit per page
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchLadder = async () => {
      try {
        const response = await fetch(
          `/api/user/ladder?page=${page}&limit=${limit}`,
          { method: "GET" }
        );
        const json = await response.json();

        if (!response.ok) {
          toast.error(json.message);
          return;
        }
        setLadder(json);
      } catch (error) {
        toast.error("Dereceli Puanları elde edilemedi, " + error);
      }
    };

    fetchLadder();
  }, [page, user]);

  const totalPages = ladder ? Math.ceil(ladder.totalUsers / limit) : 1;

  return (
    <div className="container mx-auto p-3">
      {!ladder && "Yükleniyor..."}

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

          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Önceki
            </button>
            <span>
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>

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
    </div>
  );
};
