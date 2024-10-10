import { useDrag } from "react-dnd";
import { Letter as LetterType } from "../lib/commonVariables";
import { useDrop } from "react-dnd";
import { useAppDispatch } from "../lib/redux/hooks";
import { moveInHand } from "../lib/redux/slices/gameSlice";

interface props {
  letter: LetterType;
  hand: boolean;
  i: number;
}
export const Letter = ({ letter, hand, i }: props) => {
  const dispatch = useAppDispatch();
  const dropFunc = (item: { movedIndex: number }) => {
    if (hand) {
      dispatch(
        moveInHand({
          targetIndex: i,
          movedIndex: item.movedIndex,
        })
      );
    }
  };
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "letter",
    drop: dropFunc,
    canDrop: (item: { movedIndex: number }, monitor) => {
      let canDrop = true;

      // Add an event listener for the keydown event
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          canDrop = false;
        }
      });

      console.log(canDrop);

      return canDrop;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "letter",
    item: { movedIndex: i },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        dragRef(el);
        dropRef(el);
      }}
      style={{
        display: isDragging ? "none" : "flex",
      }}
    >
      <div className="w-9 h-9 bg-orange-900 rounded-lg relative cursor-pointer">
        <p className="flex items-center justify-center h-full text-lg text-white">
          {letter.letter === "empty" ? <></> : <>{letter.letter}</>}
        </p>
        <div className="absolute bottom-0 right-0.5 text-xxs text-white">
          {letter.point}
        </div>
      </div>
    </div>
  );
};
