import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setGameStatus } from "../../../lib/redux/slices/gameSlice";
import { Modal } from "@/components/Modal";
import {
  selectGameLanguage,
  selectGameRoomId,
  selectGameStatus,
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
  const looking = gameStatus === "looking" && lang;
  const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (roomId || looking) {
      socket.connect();
    }
  }, [roomId, gameStatus, gameStatus, lang]);

  useEffect(() => {
    if (looking) socket.emit("Started Looking", lang);
    if (!isClient) setIsClient(true);
  }, []);

  const stopLooking = () => {
    socket.disconnect();
    dispatch(setGameStatus("idle"));
    removeCookie("sessionId");
    removeCookie("lang");
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
    return (
      <Modal>
        <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
          {t(locale, "game.lookingForAGame")}
          <FindButton onClick={stopLooking} text={t(locale, "game.stop")} />
        </div>
      </Modal>
    );
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
