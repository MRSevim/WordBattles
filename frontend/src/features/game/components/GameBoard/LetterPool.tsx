import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectLetterPoolOpen,
  selectUndrawnLetterPool,
} from "../../lib/redux/selectors";
import { Modal } from "@/components/Modal";
import NakedLetterSkeleton from "./LetterRelated/NakedLetterSkeleton";

export const LetterPool = () => {
  const letterPool = useAppSelector(selectUndrawnLetterPool);
  const letterPoolOpen = useAppSelector(selectLetterPoolOpen);

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
