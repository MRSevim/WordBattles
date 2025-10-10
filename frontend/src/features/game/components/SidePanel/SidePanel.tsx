"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { GameHistory } from "./GameHistory";
import { useEffect } from "react";
import { toggleSwitching } from "../../lib/redux/slices/switchSlice";
import { toast } from "react-toastify";
import { toggleSidePanel } from "../../lib/redux/slices/sidePanelToggleSlice";
import { leaveGame, makePlay, pass } from "../../lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { Player } from "../../utils/types/gameTypes";
import {
  selectGameStatus,
  selectIsSwitching,
  selectPlayers,
  selectSidePanelOpen,
} from "../../lib/redux/selectors";
import "./SidePanel.css";

export const SidePanel = () => {
  const gameOngoing = useAppSelector(selectGameStatus) === "playing";
  const sidePanelOpen = useAppSelector(selectSidePanelOpen);
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();

  const leave = () => {
    dispatch(leaveGame());
    dispatch(toggleSidePanel());
    socket.disconnect();
  };

  return (
    <div
      className={
        "w-full h-full top-0 left-0 absolute lg:relative lg:w-1/3 bg-slate-400 z-30 " +
        (sidePanelOpen ? "block" : "hidden lg:block")
      }
    >
      {!gameOngoing && (
        <div id="loader">
          <div id="box"></div>
          <div id="hill"></div>
        </div>
      )}
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
          <div className="flex align-center justify-around mb-2 xxs:mb-8">
            <PlayerContainer player={players[0]} />
            <PlayerContainer player={players[1]} />
          </div>
          <GameHistory />
        </>
      )}
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player | undefined }) => {
  const playerTurn = player?.turn;
  const timer = player?.timer;
  const dispatch = useAppDispatch();
  const switching = useAppSelector(selectIsSwitching);

  const socketUserId = socket.user?.id;

  useEffect(() => {
    if (playerTurn && timer === 0 && player?.id === socketUserId) {
      if (switching) {
        dispatch(pass());
        toast.error("Zamanında değişmediğiniz için sıranız pas geçildi");
        dispatch(toggleSwitching());
      } else dispatch(makePlay(true));
    }
  }, [playerTurn, timer, dispatch]);

  return (
    <div
      className={
        "flex flex-col items-center justify-center bg-white text-center border-solid border-2 rounded p-2 xxs:p-4 w-26 xxs:w-36	" +
        (player?.id === socketUserId ? "border-amber-500" : "")
      }
    >
      <p>{player?.username}</p>
      Puan: {player?.score}
      {player && (
        <div className="mt-2 w-20">
          <p
            className={
              "text-base xxs:text-lg font-semibold " +
              (player.timer > 30
                ? "text-green-500"
                : player.timer > 10
                ? "text-yellow-500"
                : "text-red-500")
            }
          >
            {player.timer} saniye
          </p>
        </div>
      )}
    </div>
  );
};
