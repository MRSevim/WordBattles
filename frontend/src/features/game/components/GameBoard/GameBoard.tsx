"use client";
import { BottomPanel } from "./BottomPanel/BottomPanel";
import { FindGame } from "./FindGame";
import { LetterPool } from "./LetterPool";
import { GameEnded } from "./GameEnded";
import useGameSockets from "../../utils/hooks/useGameSockets";
import { Cells } from "./Cells";

export const GameBoard = () => {
  useGameSockets();

  return (
    <div className="w-full lg:w-2/3 flex flex-col items-center">
      <div className="w-full flex justify-center overflow-auto">
        <div className="relative">
          <FindGame />
          <LetterPool />
          <GameEnded />
          <Cells />
        </div>
      </div>

      <BottomPanel />
    </div>
  );
};
