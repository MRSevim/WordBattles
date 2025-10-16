import {
  selectDraggingActive,
  selectDraggingActiveIndex,
  selectGameStatus,
  selectIsSwitching,
  selectPlayerHand,
} from "@/features/game/lib/redux/selectors";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { LetterOnHand } from "./LetterOnHand/LetterOnHand";
import { useDroppable } from "@dnd-kit/core";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";
import { useEffect } from "react";
import { setDraggingValues } from "@/features/game/lib/redux/slices/gameSlice";

const HandWrapper = () => {
  const isPlaying = useAppSelector(selectGameStatus) === "playing";
  const playerHand = useAppSelector(selectPlayerHand);

  if (playerHand)
    return (
      <div className="flex gap-2 self-center">
        {playerHand.map((letter, i) => {
          const activeGame = isPlaying && !letter.fixed;
          return (
            <LetterOnHand
              letter={letter}
              key={letter.id}
              draggable={activeGame}
              droppable={activeGame}
              i={i}
            />
          );
        })}
        {playerHand.length !== 7 && <LastLetterSpot droppable={isPlaying} />}
      </div>
    );
};

const LastLetterSpot = ({ droppable }: { droppable: boolean }) => {
  const id = "last";
  const isSwitching = useAppSelector(selectIsSwitching);
  const dispatch = useAppDispatch();
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !droppable || isSwitching,
  });
  const draggingActiveIndex = useAppSelector(selectDraggingActiveIndex);
  const draggingActive = useAppSelector(selectDraggingActive);

  useEffect(() => {
    if (isOver) {
      dispatch(setDraggingValues({ over: id }));
    }
  }, [isOver, dispatch]);

  if (draggingActiveIndex === -1 && draggingActive) {
    return (
      <div
        ref={setNodeRef}
        className={
          responsiveLetterSizesTailwind + " " + (isOver ? "bg-green-400" : "")
        }
      ></div>
    );
  }
};

export default HandWrapper;
