import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { useLetterPoolToggleContext } from "../../utils/contexts/LetterPoolToggleContext";
import { t } from "@/features/language/lib/i18n";
import NakedLetterSkeleton from "@/features/game/components/GameBoard/LetterRelated/NakedLetterSkeleton";
import { LetterAndPoints } from "@/features/game/utils/types/gameTypes";

export const BottomPanel = ({
  undrawnLettersLength,
  currentHand,
}: {
  undrawnLettersLength: number;
  currentHand: LetterAndPoints[];
}) => {
  return (
    <div className="p-2 xxs:p-4 md:pt-7 bg-gray w-full flex flex-row justify-around relative">
      <ToggleLetterPoolButton undrawnLettersLength={undrawnLettersLength} />
      <HandWrapper hand={currentHand} />
    </div>
  );
};

const ToggleLetterPoolButton = ({
  undrawnLettersLength,
}: {
  undrawnLettersLength: number;
}) => {
  const [locale] = useLocaleContext();
  const [, setLetterPoolOpen] = useLetterPoolToggleContext();

  return (
    <i
      onMouseDown={() => setLetterPoolOpen((prev) => !prev)}
      title={t(locale, "game.letterPool")}
      className="bg-brown rounded-lg flex flex-col items-center justify-center w-9 h-9 text-center text-white cursor-pointer"
    >
      <i className="bi bi-archive text-lg leading-none mt-1"></i>
      <span className="text-xxs">{undrawnLettersLength}</span>
    </i>
  );
};

const HandWrapper = ({ hand }: { hand: LetterAndPoints[] }) => {
  return (
    <div className="flex gap-2 self-center">
      {hand.map((letter, i) => {
        return (
          <NakedLetterSkeleton letter={{ ...letter, amount: 1 }} key={i} />
        );
      })}
    </div>
  );
};
