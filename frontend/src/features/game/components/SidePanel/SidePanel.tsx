"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { GameHistory } from "./GameHistory";
import { toggleSidePanel } from "../../lib/redux/slices/sidePanelToggleSlice";
import { _switch, leaveGame } from "../../lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { Division, GameType, Lang, Player } from "../../utils/types/gameTypes";
import {
  selectGameLanguage,
  selectGameRoomId,
  selectGameType,
  selectPlayers,
  selectSidePanelOpen,
} from "../../lib/redux/selectors";
import "./SidePanel.css";
import { removeCookie } from "@/utils/helpers";

import { Button } from "../GameBoard/BottomPanel/Button";
import { DivisionComp } from "../DivisionComp";
import UserLink from "@/components/UserLink";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";

export const SidePanel = () => {
  const sidePanelOpen = useAppSelector(selectSidePanelOpen);

  return (
    <div
      className={
        "w-full h-full top-0 left-0 absolute lg:relative lg:w-1/3 bg-gray z-40 flex flex-col transition-left lg:transition-none duration-200 ease-in-out " +
        (sidePanelOpen ? "left-0" : "left-full lg:left-0")
      }
    >
      <OngoingGameContainer />
    </div>
  );
};

const OngoingGameContainer = () => {
  const gameOngoing = useAppSelector(selectGameRoomId);
  const dispatch = useAppDispatch();
  const { dictionary } = useDictionaryContext();

  const leave = () => {
    dispatch(leaveGame());
    dispatch(toggleSidePanel());
    removeCookie("sessionId");
    removeCookie("roomId");
    removeCookie("lang");
    removeCookie("type");
  };

  return (
    <>
      {!gameOngoing && <Loader />}
      {gameOngoing && (
        <>
          <div className="flex justify-between m-2 xxs:m-3">
            <Button
              classes="bi bi bi-x-lg block lg:invisible"
              title={dictionary.game.toggleSidePanel}
              onClick={() => {
                dispatch(toggleSidePanel());
              }}
            />
            <div
              onClick={leave}
              className="bg-brown text-white font-bold rounded-lg p-2 flex justify-center items-center gap-2 cursor-pointer"
            >
              <span>{dictionary.game.leave}</span>
              <i className="bi bi-door-open"></i>
            </div>
          </div>
          <Players />
          <GameBanner />
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
      {players.length === 0 ? (
        <>
          <PlayerSkeleton />
          <PlayerSkeleton />
        </>
      ) : (
        players.map((player) => (
          <PlayerContainer key={player.id} player={player} />
        ))
      )}
    </div>
  );
};

const PlayerSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center bg-white text-center rounded p-2 xxs:p-4 w-26 xxs:w-36 animate-pulse">
      <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-12 bg-gray-300 rounded mb-3"></div>
      <div className="h-6 w-16 bg-gray-300 rounded"></div>
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player }) => {
  const timer = player.timer;
  const { dictionary } = useDictionaryContext();

  return (
    <div
      className={
        "flex flex-col items-center justify-around bg-white text-center rounded p-2 xxs:p-4 w-26 xxs:w-36	" +
        (player.id === socket.sessionId ? "border-solid border-2" : "")
      }
    >
      <UsernameAndPoints
        id={player.id}
        username={player.username}
        points={player.points}
        leftTheGame={player.leftTheGame}
        division={player.division}
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
          {timer} {timer > 1 ? dictionary.game.seconds : dictionary.game.second}
        </p>
      </div>
    </div>
  );
};

export const UsernameAndPoints = ({
  id,
  username,
  points,
  leftTheGame,
  division,
}: {
  id: string;
  username: string;
  leftTheGame: boolean;
  points: number;
  division?: Division;
}) => {
  const { dictionary, locale } = useDictionaryContext();

  return (
    <>
      <UserLink
        id={id}
        locale={locale}
        target="_blank"
        className="hover:underline"
      >
        {username}
      </UserLink>
      {leftTheGame && <p className="font-bold">{dictionary.left}</p>}
      {dictionary.points}: {points}
      <DivisionComp division={division} />
    </>
  );
};

const Loader = () => (
  <div id="loader">
    <div id="box"></div>
    <div id="hill"></div>
  </div>
);

const GameBanner = () => {
  const type = useAppSelector(selectGameType);
  const lang = useAppSelector(selectGameLanguage);
  return <GameBannerInner type={type} lang={lang} />;
};

export const GameBannerInner = ({
  type,
  lang,
}: {
  type: GameType;
  lang: Lang;
}) => {
  const { dictionary } = useDictionaryContext();

  return (
    <p className="p-2 text-center font-bold ">
      {dictionary.types[type]} {dictionary.lang[lang]} {dictionary.game.label}
    </p>
  );
};
