import { LettersArray } from "../lib/helpers";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { Letter } from "./Letter";
import { socket } from "../lib/socketio";
import { makePlay, shuffleHand } from "../lib/redux/slices/gameSlice";

export const BottomPanel = ({
  setLetterPoolOpen,
}: {
  setLetterPoolOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const playerHand: LettersArray | null =
    useAppSelector((state: RootState) => {
      let id = socket.id;
      const player = state.game?.game?.players.find((player) => {
        return player.socketId === id;
      });
      return player?.hand;
    }) ?? null;

  if (playerHand) {
    return (
      <div className="p-4 bg-slate-500 w-full flex justify-between">
        <div className="flex gap-2">
          <Button
            classes="bi bi-archive"
            title="Harf Havuzu"
            onClick={() => {
              setLetterPoolOpen((prev) => !prev);
            }}
          />
          <Button classes="bi bi-arrow-down-up" title="Değiştir" />
          <Button
            classes="bi bi-arrow-left-right"
            title="Karıştır"
            onClick={() => {
              dispatch(shuffleHand());
            }}
          />
        </div>

        <div className="flex gap-2">
          {playerHand.map((letter, i) => {
            return (
              <Letter
                handLength={playerHand.length}
                letter={letter}
                key={i}
                draggable={true}
                droppable={true}
                i={i}
              />
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button classes="bi bi-arrow-right" title="Geç" />{" "}
          <Button
            classes="bi bi-arrow-right-square"
            title="Gönder"
            onClick={() => {
              dispatch(makePlay());
            }}
          />
        </div>
      </div>
    );
  }
};

export const Button = ({
  onClick,
  classes,
  title,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  classes: string;
  title: string;
}) => {
  return (
    <i
      onClick={onClick}
      title={title}
      className={
        "bg-orange-900 rounded-lg w-9 h-9 text-center leading-9 text-white cursor-pointer " +
        classes
      }
    ></i>
  );
};
