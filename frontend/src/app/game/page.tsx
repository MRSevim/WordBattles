import { GameContainer } from "@/features/game/components/GameBoard/GameBoard";

const page = () => {
  return (
    /* Did not put a container here to prevent horizontal padding on game */
    <main className="flex relative py-6 mx-auto max-w-7xl">
      <GameContainer />
    </main>
  );
};

export default page;
