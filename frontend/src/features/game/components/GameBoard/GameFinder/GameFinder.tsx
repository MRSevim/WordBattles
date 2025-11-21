import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setGameStatus } from "../../../lib/redux/slices/gameSlice";
import { Modal } from "@/components/Modal";
import {
  selectGameLanguage,
  selectGameRoomId,
  selectGameStatus,
  selectGameType,
} from "../../../lib/redux/selectors";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import { selectUser } from "@/features/auth/lib/redux/selectors";
import Spinner from "@/components/Spinner";
import { removeCookie } from "@/utils/helpers";
import { useEffect, useState } from "react";

import { buttonClasses, FindButton } from "./FindButton";
import GameSettingsModal from "./GameSettingsModal";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { interpolateReact } from "@/features/language/lib/i18n";

export const GameFinder = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectGameRoomId);
  const { dictionary } = useDictionaryContext();
  const lang = useAppSelector(selectGameLanguage);
  const type = useAppSelector(selectGameType);
  const looking = gameStatus === "looking";
  const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (looking && !roomId) {
        socket.emit("Started Looking", { lang, type });
      }
    };

    // If connecting is needed
    if ((roomId || looking) && !socket.connected) {
      socket.connect();
    }

    // Listen once
    socket.once("connect", handleConnect);

    if (!isClient) setIsClient(true);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  const stopLooking = () => {
    socket.emit("Stopped Looking", undefined, () => {
      socket.disconnect();
      dispatch(setGameStatus("idle"));
      removeCookie("sessionId");
      removeCookie("lang");
      removeCookie("type");
    });
  };

  if (gameStatus === "playing") return null;

  if (roomId) {
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          {dictionary.game.connectingToExisting}
        </div>
      </Modal>
    );
  }
  if (looking) {
    return <LookingModal stopLooking={stopLooking} />;
  }

  return (
    <Modal>
      <div className="text-white bg-primary rounded-lg p-4 flex flex-col gap-2 justify-center items-center">
        {!isClient ? (
          <Spinner variant="white" dictionary={dictionary} />
        ) : (
          <>
            {gameSettingsModalOpen && (
              <GameSettingsModal
                cancel={() => {
                  setGameSettingsModalOpen(false);
                }}
              />
            )}
            {!gameSettingsModalOpen && (
              <>
                {" "}
                <UserPanel
                  openGameSettings={() => setGameSettingsModalOpen(true)}
                />
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

const UserPanel = ({ openGameSettings }: { openGameSettings: () => void }) => {
  const user = useAppSelector(selectUser);
  const { dictionary } = useDictionaryContext();

  return (
    <>
      {user === null && <Spinner variant="white" dictionary={dictionary} />}
      {user && (
        <FindButton
          onClick={openGameSettings}
          text={interpolateReact(dictionary.game.findGameWithAccount, {
            name: user.name,
          })}
        />
      )}
      {user === undefined && (
        <>
          <Link href={routeStrings.signin} className={buttonClasses}>
            {dictionary.game.signInToAccount}{" "}
          </Link>
          {dictionary.or}
          <FindButton
            onClick={openGameSettings}
            text={dictionary.game.findAsGuest}
          />
        </>
      )}
    </>
  );
};

export const LookingModal = ({ stopLooking }: { stopLooking: () => void }) => {
  const { dictionary } = useDictionaryContext();
  const [milliseconds, setMilliseconds] = useState<number | undefined>();

  useEffect(() => {
    socket.on("Looking Tick", ({ elapsedMs }: { elapsedMs: number }) => {
      setMilliseconds(elapsedMs);
    });

    return () => {
      socket.off("Looking Tick");
    };
  }, []);

  // Format to mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Modal>
      <div className="bg-primary text-white flex flex-col items-center justify-center gap-3 font-medium rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <i className="bi bi-search animate-pulse text-2xl" />
            {dictionary.game.lookingForAGame}
          </div>

          {milliseconds !== undefined ? (
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <i className="bi bi-clock-history text-lg" />
              <span className="font-mono text-lg tracking-wider">
                {formatTime(milliseconds)}
              </span>
            </div>
          ) : (
            <div className="w-20 h-6 bg-gray-400 rounded-md animate-pulse mt-2" />
          )}
        </div>

        <FindButton onClick={stopLooking} text={dictionary.game.stop} />
      </div>
    </Modal>
  );
};
