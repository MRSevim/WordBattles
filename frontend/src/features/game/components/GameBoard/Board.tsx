import { socket } from "@/features/game/lib/socket.io/socketio";
import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import {
  selectGameStatus,
  selectPlayerTurnState,
} from "../../lib/redux/selectors";
import { initialBoard } from "../../utils/helpers";
import { Cell } from "./Cell/Cell";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

export const Board = () => {
  const [bingo, setBingo] = useState<boolean>(false);
  const playerTurn = useAppSelector(selectPlayerTurnState);
  const [playerTurnPopup, setPlayerTurnPopup] = useState<boolean>(false);
  const isPlaying = useAppSelector(selectGameStatus) === "playing";
  const [locale] = useLocaleContext();

  useEffect(() => {
    socket.on("Bingo", () => {
      setBingo(true);
    });
    return () => {
      socket.off("Bingo");
    };
  }, []);

  useEffect(() => {
    if (playerTurn) {
      setPlayerTurnPopup(true);
      setTimeout(() => {
        setPlayerTurnPopup(false);
      }, 3000);
    }
  }, [playerTurn]);

  useEffect(() => {
    if (bingo) {
      setTimeout(() => {
        setBingo(false);
      }, 3000);
    }
  }, [bingo]);

  return (
    <div className="mt-1 ml-1 relative">
      {(bingo || playerTurnPopup) && isPlaying && (
        <div className="absolute text-white p-4 z-20 top-1/3 left-1/2 bg-lime-900 rounded-lg -translate-x-1/2">
          <div
            className="absolute end-0 top-0 me-1 -mt-1 cursor-pointer"
            onClick={() => {
              setBingo(false);
              setPlayerTurnPopup(false);
            }}
          >
            x
          </div>
          {playerTurnPopup && t(locale, "game.yourTurn")}
          {bingo && t(locale, "game.bingo")}
        </div>
      )}
      <Cells />
    </div>
  );
};

const Cells = () => {
  return (
    <>
      {[...Array(initialBoard.length)].map((_e, i1) => {
        return (
          <div key={"row-" + i1} className="flex">
            {[...Array(initialBoard[0].length)].map((_e, i2) => {
              return (
                <Cell key={"row-" + i1 + "-col-" + i2} row={i1} col={i2} />
              );
            })}
          </div>
        );
      })}
    </>
  );
};
