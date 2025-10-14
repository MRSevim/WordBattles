"use client";
import { BottomPanel } from "./BottomPanel/BottomPanel";
import { GameFinder } from "./GameFinder";
import { LetterPool } from "./LetterPool";
import { GameEnded } from "./GameEnded";
import useGameSockets from "../../utils/hooks/useGameSockets";
import { Board } from "./Cells";
import { SidePanel } from "../SidePanel/SidePanel";

export const GameContainer = () => {
  useGameSockets();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative lg:flex">
        <div className="w-full lg:w-2/3 flex justify-center overflow-auto">
          <div className="relative">
            <GameFinder />
            <LetterPool />
            <GameEnded />
            <Board />
          </div>
        </div>
        <SidePanel />
      </div>
      <div className="w-full relative lg:flex px-2">
        <BottomPanel />
      </div>
    </div>
  );
};
