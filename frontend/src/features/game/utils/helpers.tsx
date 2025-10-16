import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "@/lib/redux/store";
import { Board, GameState } from "@/features/game/utils/types/gameTypes";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setDraggingValues } from "../lib/redux/slices/gameSlice";
import { moveLetter } from "@/features/game/lib/redux/slices/gameSlice";

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const initialBoard: Board = Array.from({ length: 15 }, () =>
  Array(15).fill(null)
);

export const responsiveLetterSizesTailwind =
  "h-5.25 w-5.25 xxs:w-6 xxs:h-6 xs:h-7 xs:w-7 sm:w-9 sm:h-9 rounded-sm sm:rounded-lg";

export const findSocketPlayer = (state: GameState) => {
  return state.players.find((player) => player.id === socket.sessionId);
};

export const handleDragEnd = (e: DragEndEvent, dispatch: AppDispatch) => {
  const { active, over } = e;

  if (active && over) {
    dispatch(moveLetter(over.data.current?.coordinates));
    dispatch(
      setDraggingValues({
        over: null,
        active: null,
        activeLetter: null,
      })
    );
  }
};
