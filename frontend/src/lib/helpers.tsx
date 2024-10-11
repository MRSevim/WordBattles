import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "./redux/store";
import { moveInHand } from "./redux/slices/gameSlice";

export const handleDragEnd = (e: DragEndEvent, dispatch: AppDispatch) => {
  /*  const { active, over } = e;
  if (active && over) {
    const activeId = +active.id - 1;
    const overId = +over?.id - 1;
    dispatch(moveInHand({ targetIndex: overId, movedIndex: activeId }));
  } */
  console.log("ended");
};
