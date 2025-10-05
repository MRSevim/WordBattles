import { GameBoard } from "@/features/game/components/GameBoard";
import { SidePanel } from "@/features/game/components/SidePanel";
import Container from "../Container";

export const Homepage = () => {
  return (
    <Container className="flex relative py-6">
      <GameBoard />
      <SidePanel />
    </Container>
  );
};
