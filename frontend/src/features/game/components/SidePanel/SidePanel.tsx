"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { GameHistory } from "./GameHistory";
import { toggleSidePanel } from "../../lib/redux/slices/sidePanelToggleSlice";
import { _switch, leaveGame } from "../../lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { Player } from "../../utils/types/gameTypes";
import {
  selectGameRoomId,
  selectPlayers,
  selectSidePanelOpen,
} from "../../lib/redux/selectors";
import "./SidePanel.css";
import { removeCookie } from "@/utils/helpers";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

export const SidePanel = () => {
  const sidePanelOpen = useAppSelector(selectSidePanelOpen);

  return (
    <div
      className={
        "w-full h-full top-0 left-0 absolute lg:relative lg:w-1/3 bg-gray z-40 flex flex-col " +
        (sidePanelOpen ? "block" : "hidden lg:block")
      }
    >
      <OngoingGameContainer />
    </div>
  );
};

const OngoingGameContainer = () => {
  const gameOngoing = useAppSelector(selectGameRoomId);
  const dispatch = useAppDispatch();
  const [locale] = useLocaleContext();

  const leave = () => {
    dispatch(leaveGame());
    dispatch(toggleSidePanel());
    socket.disconnect();
    removeCookie("sessionId");
    removeCookie("roomId");
    removeCookie("lang");
  };

  return (
    <>
      {!gameOngoing && <Loader />}
      {gameOngoing && (
        <>
          <div className="flex justify-end">
            <div
              onClick={leave}
              className="bg-brown rounded-lg p-2 m-2 xxs:m-3 flex justify-center items-center gap-2 text-white cursor-pointer"
            >
              <span>{t(locale, "game.leave")}</span>
              <i className="bi bi-door-open"></i>
            </div>
          </div>
          <Players />
          <GameHistory />
        </>
      )}
    </>
  );
};

const Players = () => {
  const players = useAppSelector(selectPlayers);

  return (
    <div className="flex align-center justify-around mb-0 xs:mb-2 sm:mb-6">
      {players.map((player) => (
        <PlayerContainer key={player.id} player={player} />
      ))}
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player }) => {
  const timer = player.timer;
  const [locale] = useLocaleContext();

  return (
    <div
      className={
        "flex flex-col items-center justify-center bg-white text-center rounded p-2 xxs:p-4 w-26 xxs:w-36	" +
        (player.id === socket.sessionId ? "border-solid border-2" : "")
      }
    >
      <UsernameAndScore
        username={player.username}
        score={player.score}
        leftTheGame={player.leftTheGame}
      />
      <div className="mt-2 w-20">
        <p
          className={
            "text-base xxs:text-lg font-semibold " +
            (timer > 30
              ? "text-green-500"
              : timer > 10
              ? "text-yellow-500"
              : "text-red-500")
          }
        >
          {timer}{" "}
          {timer > 1 ? t(locale, "game.seconds") : t(locale, "game.second")}
        </p>
      </div>
    </div>
  );
};

const UsernameAndScore = ({
  username,
  score,
  leftTheGame,
}: {
  username: string;
  leftTheGame: boolean;
  score: number;
}) => {
  const [locale] = useLocaleContext();
  return (
    <>
      <p>{username}</p>
      {leftTheGame && <p className="font-bold">{t(locale, "game.left")}</p>}
      {t(locale, "game.points")} {score}
    </>
  );
};

const Loader = () => (
  <div id="loader">
    <div id="box"></div>
    <div id="hill"></div>
  </div>
);
