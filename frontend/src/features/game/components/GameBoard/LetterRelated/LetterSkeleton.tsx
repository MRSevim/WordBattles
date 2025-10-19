import {
  selectEmptyLetterIds,
  selectValidLetters,
} from "@/features/game/lib/redux/selectors";
import { changeEmptyLetter } from "@/features/game/lib/redux/slices/gameSlice";
import { Letter } from "@/features/game/utils/types/gameTypes";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toast } from "react-toastify";

export const LetterSkeleton = ({ letter }: { letter: Letter }) => {
  const notFixed = !letter.fixed;
  const [locale] = useLocaleContext();
  const id = letter.id;
  const emptyLetterIds = useAppSelector(selectEmptyLetterIds);
  const dispatch = useAppDispatch();
  const activeInput = emptyLetterIds.includes(id) && notFixed;
  const validLetters = useAppSelector(selectValidLetters);

  // Determine background
  let bgColor = "bg-brown"; // default
  if (letter.formsNewWords) bgColor = "bg-emerald-700"; // forming new words
  else if (letter.fixed) bgColor = "bg-stone-700"; // fixed, not part of new words

  // Determine border
  const borderClass = letter.newlyPlaced
    ? "ring-1 xs:ring-2 ring-indigo-600"
    : "";

  return (
    <div
      className={`w-full h-full relative z-10 rounded-sm sm:rounded-lg ${bgColor} ${borderClass}`}
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
                toast.error(t(locale, "game.pleaseEnterValid"));
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
      {notFixed && (
        <div className="absolute bottom-0 right-0.5 text-xxxs sm:text-xxs text-white">
          {letter.point}
        </div>
      )}
    </div>
  );
};
