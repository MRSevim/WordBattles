import { GameContainer } from "@/features/game/components/GameBoard/GameBoard";
import { getGameCookies } from "@/features/game/utils/serverHelpers";

export const Homepage = async () => {
  return (
    /* Did not put a container here to prevent horizontal padding on game */
    <div className="flex relative py-6 mx-auto max-w-7xl">
      <GameContainer />
    </div>
  );
};
