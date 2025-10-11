import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setGameStatus } from "../../lib/redux/slices/gameSlice";
import { Modal } from "@/components/Modal";
import { selectGameRoomId, selectGameStatus } from "../../lib/redux/selectors";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import { selectUser } from "@/features/auth/lib/redux/selectors";
import Spinner from "@/components/Spinner";
import useIsClient from "@/utils/hooks/isClient";
import { removeCookie } from "../../utils/serverActions";
import { useEffect } from "react";

const buttonClasses =
  "bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5";

export const GameFinder = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectGameRoomId);
  const user = useAppSelector(selectUser);
  const isClient = useIsClient();

  useEffect(() => {
    if (roomId) socket.connect();
  }, [roomId]);

  const findGame = () => {
    socket.connect();
    dispatch(setGameStatus("looking"));
  };

  const stopLooking = () => {
    socket.disconnect();
    dispatch(setGameStatus("idle"));
    removeCookie("sessionId");
  };

  if (gameStatus === "playing") return null;

  if (roomId && isClient) {
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          Devam eden oyuna bağlanılıyor...
        </div>
      </Modal>
    );
  }
  if (gameStatus === "looking" && isClient) {
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
        {!isClient ? (
          <Spinner className="w-12 h-12" variant="white" />
        ) : (
          <>
            {user === null && <Spinner className="w-12 h-12" variant="white" />}
            {user && (
              <FindButton
                onClick={findGame}
                text={user.name + " olarak oyun bul"}
              />
            )}
            {user === undefined && (
              <>
                <Link href={routeStrings.signin} className={buttonClasses}>
                  Sign in to your account{" "}
                </Link>
                or
                <FindButton onClick={findGame} text="Find Game as guest" />
              </>
            )}
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
