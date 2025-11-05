import { Provider as LetterPoolToggleProvider } from "../../utils/contexts/LetterPoolToggleContext";
import {
  Provider as ReplayIndexProvider,
  useReplayIndexContext,
} from "../../utils/contexts/replayIndexContext";
import { LetterPool } from "./LetterPool";
import { BottomPanel } from "./BottomPanel";
import { SidePanel } from "./SidePanel";
import { BoardComp } from "./Board";
import { getReplaySnapshot } from "../../utils/helpers";
import { GameState } from "@/features/game/utils/types/gameTypes";

export const GameHistoryDisplayWrapper = ({ game }: { game: GameState }) => (
  <div className="flex flex-col lg:flex-row">
    <ReplayIndexProvider initialValue={game.history.length - 1}>
      <GameHistoryDisplay game={game} />
    </ReplayIndexProvider>
  </div>
);

const GameHistoryDisplay = ({ game }: { game: GameState }) => {
  const [replayIndex] = useReplayIndexContext();
  const { board, currentHand, players } = getReplaySnapshot(game, replayIndex);

  const undrawnLetterPool = game.history[replayIndex].undrawnLetterPool;

  return (
    <>
      <LetterPoolToggleProvider>
        <div className="w-full flex flex-col">
          <div className="flex overflow-auto">
            <div className="relative flex justify-center flex-1">
              <LetterPool letterPool={undrawnLetterPool} />
              <BoardComp board={board} />
            </div>
          </div>
          <BottomPanel
            currentHand={currentHand}
            undrawnLettersLength={undrawnLetterPool.length}
          />
        </div>
      </LetterPoolToggleProvider>
      <SidePanel game={game} players={players} />
    </>
  );
};
