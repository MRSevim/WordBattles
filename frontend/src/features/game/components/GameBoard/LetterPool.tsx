import { useAppSelector } from "@/lib/redux/hooks";
import { LetterComp, LetterSkeleton } from "./LetterComp";
import {
  selectLetterPoolOpen,
  selectUndrawnLetterPool,
} from "../../lib/redux/selectors";
import { Modal } from "@/components/Modal";

export const LetterPool = () => {
  const letterPool = useAppSelector(selectUndrawnLetterPool);
  const letterPoolOpen = useAppSelector(selectLetterPoolOpen);

  if (letterPool && letterPoolOpen) {
    return (
      <Modal z={40}>
        <div className="p-5 bg-gray flex gap-2 flex-wrap w-96">
          {letterPool.map((letter, i) => {
            return (
              <LetterComp
                letter={letter}
                key={i}
                draggable={false}
                droppable={false}
              >
                <LetterSkeleton
                  draggable={false}
                  letter={letter}
                ></LetterSkeleton>
              </LetterComp>
            );
          })}
        </div>
      </Modal>
    );
  }
};
