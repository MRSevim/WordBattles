import {
  selectGameStatus,
  selectPlayerHand,
} from "@/features/game/lib/redux/selectors";
import { useAppSelector } from "@/lib/redux/hooks";
import { LetterComp, LetterSkeleton } from "../LetterComp";
import { RootState } from "@/lib/redux/store";
import { useDroppable } from "@dnd-kit/core";

const HandWrapper = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const playerHand = useAppSelector(selectPlayerHand);

  if (playerHand)
    return (
      <div className="flex gap-2 self-center">
        {playerHand.map((letter, i) => {
          const draggable = gameStatus === "playing" && !letter.fixed;
          return (
            <LetterComp
              letter={letter}
              key={letter.id}
              draggable={draggable}
              droppable={gameStatus === "playing" && !letter.fixed}
              i={i}
            >
              <LetterSkeleton
                draggable={draggable}
                letter={letter}
                i={i}
              ></LetterSkeleton>
            </LetterComp>
          );
        })}
        {playerHand.length !== 7 && (
          <LastLetterSpot
            handLength={playerHand.length}
            droppable={gameStatus === "playing"}
          />
        )}
      </div>
    );
};

const LastLetterSpot = ({
  handLength,
  droppable,
}: {
  droppable: boolean;
  handLength: number;
}) => {
  const isSwitching = useAppSelector(
    (state: RootState) => state.switch.switching
  );
  const { isOver, setNodeRef } = useDroppable({
    id: handLength ? handLength + 1 : "last",
    disabled: !droppable || isSwitching,
  });
  return (
    <div
      ref={setNodeRef}
      className={
        "h-5.25 w-5.25 xxs:w-6 xxs:h-6 xs:h-7 xs:w-7 sm:w-9 sm:h-9 " +
        (isOver ? "bg-green-400 rounded-lg" : "")
      }
    ></div>
  );
};

export default HandWrapper;
