import {
  selectEmptyLetterIds,
  selectValidLetters,
} from "@/features/game/lib/redux/selectors";
import { changeEmptyLetter } from "@/features/game/lib/redux/slices/gameSlice";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";
import { Letter } from "@/features/game/utils/types/gameTypes";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toast } from "react-toastify";

export const LetterSkeleton = ({ letter }: { letter: Letter }) => {
  const notFixed = !letter.fixed;
  const { dictionary } = useDictionaryContext();
  const id = letter.id;
  const emptyLetterIds = useAppSelector(selectEmptyLetterIds);
  const dispatch = useAppDispatch();
  const activeInput = emptyLetterIds.includes(id) && notFixed;
  const validLetters = useAppSelector(selectValidLetters);

  // Determine background
  let colorClasses = "bg-brown"; // default
  if (letter.formsNewWords)
    colorClasses = "bg-emerald-700"; // forming new words
  else if (letter.fixed) colorClasses = "bg-stone-700"; // fixed, not part of new words

  // Determine border
  const borderClass = letter.newlyPlaced
    ? "ring-1 xs:ring-2 ring-rose-500"
    : "";

  return (
    <div
      className={`relative z-10 rounded-sm sm:rounded-lg text-white font-bold ${colorClasses} ${borderClass} ${responsiveLetterSizesTailwind}`}
    >
      <div className="flex items-center justify-center h-full text-xxs xxs:text-xs xs:text-base sm:text-lg">
        {activeInput ? (
          <input
            type="text"
            maxLength={1}
            className="w-full h-full bg-transparent text-center text-white"
            value={letter.letter}
            onChange={(e) => {
              const newLetter = e.target.value.toUpperCase(); // Convert to uppercase for comparison

              if (!validLetters.includes(newLetter) && newLetter !== "") {
                toast.error(dictionary.game.pleaseEnterValid);
              }
              dispatch(
                changeEmptyLetter({
                  newLetter,
                  targetId: id,
                }),
              );
            }}
          />
        ) : (
          <div>{letter.letter}</div>
        )}
      </div>

      <div className="absolute bottom-0 right-0.5 text-xxxs sm:text-xxs">
        {letter.points}
      </div>
    </div>
  );
};
