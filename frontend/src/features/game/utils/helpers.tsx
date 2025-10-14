import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "@/lib/redux/store";
import {
  Board,
  GameState,
  LettersArray,
  Player,
} from "@/features/game/utils/types/gameTypes";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setDraggingValues } from "@/features/game/lib/redux/slices/dragSlice";
import { moveLetter } from "@/features/game/lib/redux/slices/gameSlice";
import { toast } from "react-toastify";

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const initialBoard: Board = Array.from({ length: 15 }, () =>
  Array(15).fill(null)
);

export const responsiveLetterSizesTailwind =
  "h-5.25 w-5.25 xxs:w-6 xxs:h-6 xs:h-7 xs:w-7 sm:w-9 sm:h-9 rounded-sm sm:rounded-lg";

export const checkPlayersTurn = (player: Player | undefined) => {
  if (player) {
    if (!player.turn) {
      toast.error("Sizin sıranız değil");
      return false;
    } else return true;
  }
};
export const findSocketPlayer = (state: GameState) => {
  return state.players.find((player) => player.id === socket.sessionId);
};

export const handleDragEnd = (e: DragEndEvent, dispatch: AppDispatch) => {
  const { active, over } = e;

  if (active && over) {
    const activeId = active.id.toString();
    const overId = over?.id.toString();

    const activeData = {
      id: activeId,
      letter: active.data.current?.letter,
    };
    let targetData = {
      id: overId,
      coordinates: over.data.current?.coordinates,
    };

    dispatch(
      setDraggingValues({
        over: null,
        active: null,
        activeLetter: null,
      })
    );
    dispatch(moveLetter({ targetData, activeData }));
  }
};
export const shuffle = (array: any[]) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

export const returnEverythingToHandHelper = (state: GameState) => {
  const player = findSocketPlayer(state);
  if (player) {
    let board = state.board;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = board[row][col];
        if (cell && !cell.fixed) {
          player.hand.push(cell);
          board[row][col] = null;
        }
      }
    }
  }
};

export const findInHand = (hand: LettersArray, targetId: string) =>
  hand.findIndex((letter) => letter.id === targetId);

export const findInBoard = (board: Board, targetId: string) => {
  for (let rowI = 0; rowI < board.length; rowI++) {
    for (let colI = 0; colI < board[rowI].length; colI++) {
      if (board[rowI][colI]?.id === targetId) {
        return { rowI, colI };
      }
    }
  }
};
