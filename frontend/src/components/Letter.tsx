import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Letter as LetterType } from "../lib/commonVariables";
import { CSS } from "@dnd-kit/utilities";

interface props {
  letter: LetterType;
  hand: boolean;
  i: number;
}

export const Letter = ({ letter, hand, i }: props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: i + 1,
    data: { target: i },
  });

  const {
    over,
    isOver,
    setNodeRef: setDroppableNodeRef,
  } = useDroppable({
    id: i,
  });

  const otherElementIsOver = over && i !== over?.id && isOver;

  console.log(over?.id, isOver);

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div className="relative flex">
      <div ref={setDroppableNodeRef} className={`w-9 h-9 absolute`}></div>
      {otherElementIsOver && <div className="w-9 h-9"></div>}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-9 h-9 bg-orange-900 rounded-lg relative cursor-pointer z-50"
      >
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
