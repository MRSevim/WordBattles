import { LettersArray } from "../lib/helpers";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { Letter } from "./Letter";
import { socket } from "../lib/socketio";
import {
  _switch,
  makePlay,
  pass,
  returnEverythingToHand,
  shuffleHand,
} from "../lib/redux/slices/gameSlice";
import { toggleSwitching } from "../lib/redux/slices/switchSlice";
import { useDroppable } from "@dnd-kit/core";
import { toggleSidePanel } from "../lib/redux/slices/sidePanelToggleSlice";

export const BottomPanel = ({
  setLetterPoolOpen,
}: {
  setLetterPoolOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state) => state.game);
  const playerHand: LettersArray | null =
    useAppSelector((state: RootState) => {
      let sessionId = socket.sessionId;
      const player = state.game?.game?.players.find((player) => {
        return player.sessionId === sessionId;
      });
      return player?.hand;
    }) ?? null;
  const switching = useAppSelector(
    (state: RootState) => state.switch.switching
  );
  const switchValues = useAppSelector(
    (state: RootState) => state.switch.switchValues
  );

  if (playerHand) {
    const LeftPanel = () => {
      return (
        <div className="flex gap-2">
          <Button
            classes="bi bi-archive"
            title="Harf Havuzu"
            onClick={() => {
              setLetterPoolOpen((prev) => !prev);
            }}
          />
          <Button
            classes={
              "bi bi-arrow-down-up " + (switching ? "animate-bounce" : "")
            }
            title="Değiştir"
            onClick={() => {
              if (game.status !== "ended") {
                dispatch(toggleSwitching(playerHand));
              }
            }}
          />
          <Button
            classes="bi bi-arrow-left-right"
            title="Karıştır"
            onClick={() => {
              if (game.status !== "ended") {
                dispatch(shuffleHand());
              }
            }}
          />
        </div>
      );
    };
    const RightPanel = () => {
      return (
        <div className="flex gap-2">
          <Button
            classes="bi bi bi-three-dots-vertical block lg:hidden"
            title="Yan Paneli Aç"
            onClick={() => {
              dispatch(toggleSidePanel());
            }}
          />{" "}
          <Button
            classes="bi bi-arrow-right"
            title="Geç"
            onClick={() => {
              if (game.status !== "ended") {
                dispatch(pass());
              }
            }}
          />{" "}
          <Button
            classes="bi bi-arrow-right-square"
            title="Gönder"
            onClick={() => {
              if (game.status !== "ended") {
                if (switching) {
                  dispatch(_switch(switchValues));
                  dispatch(toggleSwitching(playerHand));
                  if (playerHand.length !== 7) {
                    dispatch(returnEverythingToHand());
                  }
                } else {
                  dispatch(makePlay(false));
                }
              }
            }}
          />
        </div>
      );
    };
    return (
      <div className="p-4 bg-slate-500 w-full flex flex-col sm:flex-row justify-between">
        <div className="hidden sm:block">
          <LeftPanel />
        </div>

        <div className="flex gap-2 self-center">
          {playerHand.map((letter, i) => {
            return (
              <Letter
                letter={letter}
                key={i + letter.letter}
                draggable={game.status !== "ended"}
                droppable={game.status !== "ended"}
                i={i}
              />
            );
          })}
          {playerHand.length !== 7 && (
            <LastLetterSpot
              handLength={playerHand.length}
              droppable={game.status !== "ended"}
            />
          )}
        </div>
        <div className="block sm:hidden flex pt-2 justify-between">
          <LeftPanel />
          <RightPanel />
        </div>
        <div className="hidden sm:block">
          <RightPanel />
        </div>
      </div>
    );
  }
};

const Button = ({
  onClick,
  classes,
  title,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  classes: string;
  title: string;
}) => {
  return (
    <i
      onMouseDown={onClick}
      title={title}
      className={
        "bg-orange-900 rounded-lg w-9 h-9 text-center leading-9 text-white cursor-pointer " +
        classes
      }
    ></i>
  );
};

const LastLetterSpot = ({
  handLength,
  droppable,
}: {
  droppable: boolean;
  handLength: number;
}) => {
  const isSwitching = useAppSelector(
    (state: RootState) => state.switch.switching
  );
  const { isOver, setNodeRef } = useDroppable({
    id: handLength ? handLength + 1 : "last",
    disabled: !droppable || isSwitching,
  });
  return (
    <div
      ref={setNodeRef}
      className={"w-9 h-9 " + (isOver ? "bg-green-400 rounded-lg" : "")}
    ></div>
  );
};
