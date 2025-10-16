import {
  selectEmptyLetterIds,
  selectValidLetters,
} from "@/features/game/lib/redux/selectors";
import { changeEmptyLetter } from "@/features/game/lib/redux/slices/gameSlice";
import { Letter } from "@/features/game/utils/types/gameTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toast } from "react-toastify";

export const LetterSkeleton = ({ letter }: { letter: Letter }) => {
  const notFixed = !letter.fixed;
  const id = letter.id;
  const emptyLetterIds = useAppSelector(selectEmptyLetterIds);
  const dispatch = useAppDispatch();
  const activeInput = emptyLetterIds.includes(id) && notFixed;
  const validLetters = useAppSelector(selectValidLetters);

  return (
    <div
      className={
        "w-full h-full bg-brown relative z-10 rounded-sm sm:rounded-lg " +
        (!notFixed ? "bg-stone-700" : "")
      }
    >
      <div className="flex items-center justify-center h-full text-xxs xxs:text-xs xs:text-base sm:text-lg text-white">
        {activeInput ? (
          <input
            type="text"
            maxLength={1}
            className="w-full h-full bg-transparent text-center text-white"
            value={letter.letter}
            onChange={(e) => {
              const newLetter = e.target.value.toUpperCase(); // Convert to uppercase for comparison

              if (!validLetters.includes(newLetter) && newLetter !== "") {
                toast.error("Lütfen geçerli bir türkçe harf giriniz");
              }
              dispatch(
                changeEmptyLetter({
                  newLetter,
                  targetId: id,
                })
              );
            }}
          />
        ) : (
          <div>{letter.letter}</div>
        )}
      </div>
      <div className="absolute bottom-0 right-0.5 text-xxxs sm:text-xxs text-white">
        {letter.point}
      </div>
    </div>
  );
};
