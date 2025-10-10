import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setGameStatus, setGameState } from "../../lib/redux/slices/gameSlice";
import { useEffect } from "react";
import { GameState } from "../../utils/types/gameTypes";
import { Modal } from "@/components/Modal";
import { selectGameStatus } from "../../lib/redux/selectors";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import {
  selectUserName,
  selectUserRoomId,
} from "@/features/auth/lib/redux/selectors";

const buttonClasses =
  "bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5";

export const GameFinder = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectUserRoomId);
  const name = useAppSelector(selectUserName);

  const findGame = () => {
    socket.connect();
    dispatch(setGameStatus("looking"));
  };

  const stopLooking = () => {
    socket.disconnect();
    dispatch(setGameStatus("idle"));
  };

  useEffect(() => {
    socket.on("Start Game", (game: GameState) => {
      dispatch(setGameState(game));
      socket.emit("Timer", game);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("Start Game");
    };
  }, [dispatch]);

  if (gameStatus === "playing") return null;

  if (roomId) {
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          Devam eden oyuna bağlanılıyor...
        </div>
      </Modal>
    );
  }
  if (gameStatus === "looking") {
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          Oyun aranıyor...
          <FindButton onClick={stopLooking} text="Dur" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div className="text-white bg-primary rounded-lg p-4 flex flex-col gap-2 justify-center	items-center">
        {name && (
          <FindButton onClick={findGame} text={name + " olarak oyun bul"} />
        )}
        {!name && (
          <>
            <Link href={routeStrings.signin} className={buttonClasses}>
              Sign in to your account{" "}
            </Link>
            or
            <FindButton onClick={findGame} text="Find Game as guest" />
          </>
        )}
      </div>
    </Modal>
  );
};

const FindButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => {
  return (
    <button onClick={onClick} className={buttonClasses}>
      {text}
    </button>
  );
};
