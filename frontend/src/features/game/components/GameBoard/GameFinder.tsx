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
import { removeCookie } from "@/utils/helpers";
import { useEffect } from "react";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";

const buttonClasses =
  "bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5";

export const GameFinder = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectGameRoomId);
  const isClient = useIsClient();
  const [locale] = useLocaleContext();

  useEffect(() => {
    if (roomId) socket.connect();
  }, [roomId]);

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
          {t(locale, "game.connectingToExisting")}
        </div>
      </Modal>
    );
  }
  if (gameStatus === "looking" && isClient) {
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
      <div className="text-white bg-primary rounded-lg p-4 flex flex-col gap-2 justify-center	items-center">
        {!isClient ? <Spinner variant="white" /> : <UserPanel />}
      </div>
    </Modal>
  );
};

const UserPanel = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [locale] = useLocaleContext();

  const findGame = () => {
    socket.connect();
    dispatch(setGameStatus("looking"));
  };
  return (
    <>
      {user === null && <Spinner className="w-12 h-12" variant="white" />}
      {user && (
        <FindButton
          onClick={findGame}
          text={tReact(locale, "game.findGameWithAccount", { name: user.name })}
        />
      )}
      {user === undefined && (
        <>
          <Link href={routeStrings.signin} className={buttonClasses}>
            {t(locale, "game.signInToAccount")}{" "}
          </Link>
          {t(locale, "game.or")}
          <FindButton onClick={findGame} text={t(locale, "game.findAsGuest")} />
        </>
      )}
    </>
  );
};

const FindButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string | React.ReactNode;
}) => {
  return (
    <button onClick={onClick} className={buttonClasses}>
      {text}
    </button>
  );
};
