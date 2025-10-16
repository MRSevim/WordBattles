import { useDraggable } from "@dnd-kit/core";
import { Letter } from "../../../../utils/types/gameTypes";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setDraggingValues } from "@/features/game/lib/redux/slices/gameSlice";
import { selectIsSwitching } from "@/features/game/lib/redux/selectors";
import { LetterSkeleton } from "../../LetterRelated/LetterSkeleton";

type StringOrUnd = string | undefined;

interface Props {
  id: string | number;
  letter: Letter;
  draggable: boolean;
  translateX: StringOrUnd;
  translateY: StringOrUnd;
  onClick: () => void;
}

export function Draggable({
  id,
  letter,
  draggable,
  translateX,
  translateY,
  onClick,
}: Props) {
  const dispatch = useAppDispatch();
  const isSwitching = useAppSelector(selectIsSwitching);

  const { isDragging, active, attributes, listeners, setNodeRef } =
    useDraggable({
      id,
      data: { letter },
      disabled: !draggable || isSwitching,
    });

  const style = {
    transform: translateX || translateY,
    zIndex: isDragging ? 11 : 10,
    opacity: isDragging ? 0 : 1,
    touchAction: "none",
  };

  useEffect(() => {
    if (active) {
      dispatch(
        setDraggingValues({
          active: active.id.toString(),
          activeLetter: active.data?.current?.letter,
        })
      );
    }
  }, [active]);

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full cursor-pointer"
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <LetterSkeleton letter={letter} />
    </div>
  );
}
