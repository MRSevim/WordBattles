import { LettersArray } from "@/features/game/utils/types/gameTypes";
import { useLetterPoolToggleContext } from "../../utils/contexts/LetterPoolToggleContext";
import { Modal } from "@/components/Modal";
import NakedLetterSkeleton from "@/features/game/components/GameBoard/LetterRelated/NakedLetterSkeleton";

export const LetterPool = ({ letterPool }: { letterPool: LettersArray }) => {
  const [letterPoolOpen] = useLetterPoolToggleContext();

  if (letterPool && letterPoolOpen) {
    return (
      <Modal z={40}>
        <div className="p-5 bg-gray flex gap-2 flex-wrap w-96">
          {letterPool.map((letter) => {
            return <NakedLetterSkeleton key={letter.id} letter={letter} />;
          })}
        </div>
      </Modal>
    );
  }
};
