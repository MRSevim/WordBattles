import { LettersArray } from "../lib/commonVariables";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { Letter } from "./Letter";
import { socket } from "../lib/socketio";

export const BottomPanel = () => {
  const playerHand: LettersArray =
    useAppSelector((state: RootState) => {
      let id = socket.id;
      const player = state.game?.game?.players.find((player) => {
        return player.socketId === id;
      });
      return player?.hand;
    }) ?? [];

  if (playerHand.length) {
    return (
      <div className="p-4 bg-slate-500 w-full flex justify-between">
        <div className="flex gap-2">
          <Button classes="bi bi-archive" title="Harf Havuzu" />
          <Button classes="bi bi-arrow-down-up" title="Değiştir" />
          <Button classes="bi bi-arrow-left-right" title="Karıştır" />
        </div>
        <div className="flex gap-2">
          {playerHand.map((letter, i) => {
            return <Letter letter={letter} key={i} hand={true} i={i} />;
          })}
        </div>
        <div className="flex gap-2">
          <Button classes="bi bi-arrow-right" title="Geç" />{" "}
          <Button classes="bi bi-arrow-right-square" title="Gönder" />
        </div>
      </div>
    );
  }
};

export const Button = ({
  classes,
  title,
}: {
  classes: string;
  title: string;
}) => {
  return (
    <i
      title={title}
      className={
        "bg-orange-900 rounded-lg w-9 h-9 text-center leading-9 text-white cursor-pointer " +
        classes
      }
    ></i>
  );
};
