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
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";
import { buttonClasses, FindButton } from "./FindButton";
import GameSettingsModal from "./GameSettingsModal";

export const GameFinder = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectGameRoomId);
  const [locale] = useLocaleContext();
  const lang = useAppSelector(selectGameLanguage);
  const type = useAppSelector(selectGameType);
  const looking = gameStatus === "looking";
  const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (roomId || looking) {
      socket.connect();
    }
  }, [roomId, gameStatus]);

  useEffect(() => {
    if (looking) socket.emit("Started Looking", { lang, type });
    if (!isClient) setIsClient(true);
  }, []);

  const stopLooking = () => {
    socket.disconnect();
    dispatch(setGameStatus("idle"));
    removeCookie("sessionId");
    removeCookie("lang");
    removeCookie("type");
  };

  if (gameStatus === "playing") return null;

  if (roomId) {
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          {t(locale, "game.connectingToExisting")}
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
          <Spinner variant="white" locale={locale} />
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
  const [locale] = useLocaleContext();

  return (
    <>
      {user === null && <Spinner variant="white" locale={locale} />}
      {user && (
        <FindButton
          onClick={openGameSettings}
          text={tReact(locale, "game.findGameWithAccount", { name: user.name })}
        />
      )}
      {user === undefined && (
        <>
          <Link href={routeStrings.signin} className={buttonClasses}>
            {t(locale, "game.signInToAccount")}{" "}
          </Link>
          {t(locale, "game.or")}
          <FindButton
            onClick={openGameSettings}
            text={t(locale, "game.findAsGuest")}
          />
        </>
      )}
    </>
  );
};

export const LookingModal = ({ stopLooking }: { stopLooking: () => void }) => {
  const [locale] = useLocaleContext();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format to mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <Modal>
      <div className="bg-primary text-white flex flex-col items-center justify-center gap-3 font-medium rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <i className="bi bi-search animate-pulse text-2xl" />
            {t(locale, "game.lookingForAGame")}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-200">
            <i className="bi bi-clock-history text-lg" />
            <span className="font-mono text-lg tracking-wider">
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        <FindButton onClick={stopLooking} text={t(locale, "game.stop")} />
      </div>
    </Modal>
  );
};
