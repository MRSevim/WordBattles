import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";
import { Letter } from "@/features/game/utils/types/gameTypes";

//this component is for non interactive display of letters, namely for letter pool and letter overlay
const NakedLetterSkeleton = ({ letter }: { letter: Letter }) => {
  return (
    <div className={"bg-brown relative z-10 " + responsiveLetterSizesTailwind}>
      <div className="flex items-center justify-center h-full text-xxs xxs:text-xs xs:text-base sm:text-lg text-white">
        <div>{letter.letter}</div>
      </div>
      <div className="absolute bottom-0 right-0.5 text-xxxs sm:text-xxs text-white">
        {letter.point}
      </div>
    </div>
  );
};

export default NakedLetterSkeleton;
