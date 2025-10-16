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
import useIsClient from "@/utils/hooks/isClient";
import { removeCookie } from "../../utils/serverActions";

export const SidePanel = () => {
  const sidePanelOpen = useAppSelector(selectSidePanelOpen);
  const isClient = useIsClient();

  return (
    <div
      className={
        "w-full h-full top-0 left-0 absolute lg:relative lg:w-1/3 bg-gray z-30 flex flex-col " +
        (sidePanelOpen ? "block" : "hidden lg:block")
      }
    >
      {!isClient ? <Loader /> : <OngoingGameContainer />}
    </div>
  );
};

const OngoingGameContainer = () => {
  const gameOngoing = useAppSelector(selectGameRoomId);
  const dispatch = useAppDispatch();

  const leave = () => {
    dispatch(leaveGame());
    dispatch(toggleSidePanel());
    socket.disconnect();
    removeCookie("sessionId");
    removeCookie("roomId");
  };

  return (
    <>
      {!gameOngoing && <Loader />}
      {gameOngoing && (
        <>
          <div className="flex justify-end">
            <div
              onClick={leave}
              className="bg-brown rounded-lg p-2 px-4 w-16 m-2 xxs:m-3 flex justify-center items-center gap-2 text-white cursor-pointer"
            >
              <span>Ayrıl</span>
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

  return (
    <div
      className={
        "flex flex-col items-center justify-center bg-white text-center border-solid border-2 rounded p-2 xxs:p-4 w-26 xxs:w-36	" +
        (player.id === socket.sessionId ? "border-amber-500" : "")
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
          {timer} saniye
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
}) => (
  <>
    <p>{username}</p>
    {leftTheGame && <p className="font-bold">(Left)</p>}
    Puan: {score}
  </>
);

const Loader = () => (
  <div id="loader">
    <div id="box"></div>
    <div id="hill"></div>
  </div>
);
