import { useAppSelector } from "../lib/redux/hooks";
import { Letter, LetterSkeleton } from "./Letter";

export const LetterPool = () => {
  const letterPool = useAppSelector(
    (state) => state.game.game?.undrawnLetterPool
  );
  if (letterPool) {
    return (
      <div className="p-5 bg-slate-500 flex gap-2 flex-wrap w-96">
        {letterPool.map((letter, i) => {
          return (
            <Letter letter={letter} key={i} draggable={false} droppable={false}>
              <LetterSkeleton
                draggable={false}
                letter={letter}
              ></LetterSkeleton>
            </Letter>
          );
        })}
      </div>
    );
  }
};
