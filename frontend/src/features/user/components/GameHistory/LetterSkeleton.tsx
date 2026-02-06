import { Letter } from "@/features/game/utils/types/gameTypes";

export const LetterSkeleton = ({ letter }: { letter: Letter }) => {
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
        <div>{letter.letter}</div>
      </div>

      <div className="absolute bottom-0 right-0.5 text-xxxs sm:text-xxs text-white">
        {letter.points}
      </div>
    </div>
  );
};
