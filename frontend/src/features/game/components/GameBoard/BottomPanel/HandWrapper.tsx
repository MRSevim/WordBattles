import {
  selectGameStatus,
  selectIsSwitching,
  selectPlayerHand,
} from "@/features/game/lib/redux/selectors";
import { useAppSelector } from "@/lib/redux/hooks";
import { LetterOnHand } from "./LetterOnHand/LetterOnHand";
import { useDroppable } from "@dnd-kit/core";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";

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
              playerHand={playerHand}
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
  const isSwitching = useAppSelector(selectIsSwitching);
  const { isOver, setNodeRef } = useDroppable({
    id: "last",
    disabled: !droppable || isSwitching,
  });
  return (
    <div
      ref={setNodeRef}
      className={
        responsiveLetterSizesTailwind + " " + (isOver ? "bg-green-400" : "")
      }
    ></div>
  );
};

export default HandWrapper;
