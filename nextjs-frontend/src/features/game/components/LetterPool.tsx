import { useAppSelector } from "@/lib/redux/hooks";
import { LetterComp, LetterSkeleton } from "./LetterComp";

export const LetterPool = () => {
  const letterPool = useAppSelector(
    (state) => state.game.game?.undrawnLetterPool
  );
  if (letterPool) {
    return (
      <div className="p-5 bg-slate-500 flex gap-2 flex-wrap w-96">
        {letterPool.map((letter, i) => {
          return (
            <LetterComp
              letter={letter}
              key={i}
              draggable={false}
              droppable={false}
            >
              <LetterSkeleton
                draggable={false}
                letter={letter}
              ></LetterSkeleton>
            </LetterComp>
          );
        })}
      </div>
    );
  }
};
