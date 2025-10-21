"use client";
import { BottomPanel } from "./BottomPanel/BottomPanel";
import { GameFinder } from "./GameFinder/GameFinder";
import { LetterPool } from "./LetterPool";
import { GameEnded } from "./GameEnded";
import useGameSockets from "../../utils/hooks/useGameSockets";
import { Board } from "./Cells";
import { SidePanel } from "../SidePanel/SidePanel";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { selectDraggedLetter } from "../../lib/redux/selectors";
import { handleDragEnd } from "../../utils/helpers";
import NakedLetterSkeleton from "./LetterRelated/NakedLetterSkeleton";

export const GameContainer = () => {
  useGameSockets();

  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );
  const activeLetter = useAppSelector(selectDraggedLetter);

  return (
    <DndContext sensors={sensors} onDragEnd={(e) => handleDragEnd(e, dispatch)}>
      <div className="w-full flex flex-col items-center text-black">
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
      <DragOverlay dropAnimation={null}>
        {activeLetter ? <NakedLetterSkeleton letter={activeLetter} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
