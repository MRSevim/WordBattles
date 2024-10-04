import { useRef } from "react";
import { Letter as LetterType } from "../lib/commonVariables";

interface props {
  letter: LetterType;
  hand: boolean;
}
export const Letter = ({ letter }: props) => {
  const draggedItem = useRef<HTMLInputElement>(null);
  let dx: number, dy: number;
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drag started");

    if (draggedItem.current) {
      dx = e.clientX - draggedItem.current.getBoundingClientRect().x;
      dy = e.clientY - draggedItem.current.getBoundingClientRect().y;
      console.log(dx, dy);
      draggedItem.current.style.position = "absolute";
      draggedItem.current.style.zIndex = "1000";
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("dragging");
    console.log(dx, dy);
    if (draggedItem.current) {
      draggedItem.current.style.left = `${e.clientX - dx}px`;
      draggedItem.current.style.top = `${e.clientY - dx}px`;
    }
  };
  const handleDragEnd = () => {
    console.log("drag ended");
  };

  return (
    <div
      ref={draggedItem}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className="w-9 h-9 bg-orange-900 rounded-lg relative cursor-pointer"
    >
      <p className="flex items-center justify-center h-full text-lg text-white ">
        {letter.letter === "empty" ? <></> : <>{letter.letter}</>}
      </p>
      <div className="absolute bottom-0 right-0.5 text-xxs text-white">
        {letter.point}
      </div>
    </div>
  );
};
