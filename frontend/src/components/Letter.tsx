import { Letter as LetterType } from "../lib/commonVariables";

interface props {
  letter: LetterType;
}
export const Letter = ({ letter }: props) => {
  return (
    <div className="w-9 h-9 bg-orange-900 rounded-lg relative">
      <p className="flex items-center justify-center h-full text-lg text-white ">
        {letter.letter}
      </p>
      <div className="absolute bottom-0 right-0.5 text-xxs text-white">
        {letter.point}
      </div>
    </div>
  );
};
