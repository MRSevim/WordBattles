import { GameContainer } from "@/features/game/components/GameBoard/GameBoard";

export const Homepage = () => {
  return (
    /* Did not put a container here to prevent horizontal padding on game */
    <div className="flex relative py-6 mx-auto max-w-7xl">
      <GameContainer />
    </div>
  );
};
