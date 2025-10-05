import { GameBoard } from "@/features/game/components/GameBoard";
import { SidePanel } from "@/features/game/components/SidePanel";
import Container from "../Container";

export const Homepage = () => {
  return (
    <div className="flex relative py-6 mx-auto max-w-7xl">
      <GameBoard />
      <SidePanel />
    </div>
  );
};
