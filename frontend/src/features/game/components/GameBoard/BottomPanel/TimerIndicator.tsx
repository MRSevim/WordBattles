import { findSocketPlayer } from "@/features/game/utils/helpers";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

const TimerIndicator = () => {
  const playerTurn: boolean | null =
    useAppSelector((state: RootState) => {
      const player = findSocketPlayer(state.game);
      return player?.turn;
    }) ?? null;
  const playerTimer: number | null =
    useAppSelector((state: RootState) => {
      const player = findSocketPlayer(state.game);
      return player?.timer;
    }) ?? null;

  if (playerTimer && playerTurn) {
    return (
      <div className="flex justify-center items-center gap-2 absolute right-0 top-0 me-0.5 mt-0.5">
        <div
          className={
            "text-sm xxs:text-base " +
            (playerTimer > 30
              ? "text-green-700"
              : playerTimer > 10
                ? "text-yellow-700"
                : "text-red-700")
          }
        >
          {playerTimer}
        </div>
        <div
          className={
            "w-4 h-4 rounded-full " +
            (playerTimer > 30
              ? "bg-green-700"
              : playerTimer > 10
                ? "bg-yellow-700"
                : "bg-red-700")
          }
        />
      </div>
    );
  }
};

export default TimerIndicator;
