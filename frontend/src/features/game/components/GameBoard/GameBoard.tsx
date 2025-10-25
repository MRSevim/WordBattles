"use client";
import { BottomPanel } from "./BottomPanel/BottomPanel";
import { GameFinder } from "./GameFinder/GameFinder";
import { LetterPool } from "./LetterPool";
import { GameEnded } from "./GameEnded/GameEnded";
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
      <div className="w-full flex items-center text-black relative overflow-x-hidden">
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="flex overflow-auto">
            <div className="relative flex justify-center flex-1">
              <GameFinder />
              <LetterPool />
              <GameEnded />
              <Board />
            </div>
          </div>
          <BottomPanel />
        </div>
        <SidePanel />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeLetter ? <NakedLetterSkeleton letter={activeLetter} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
