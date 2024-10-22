import { capitalizeFirstLetter } from "../lib/helpers";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { socket } from "../lib/socketio";

export const GameHistory = () => {
  const history = useAppSelector((state: RootState) => state.game.history);
  const game = useAppSelector((state: RootState) => state.game.game);
  const players = game?.players;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md m-3 max-h-96 overflow-auto">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        Oyun Geçmişi
      </h2>
      {history
        .map((item, i) => {
          const player = players?.find(
            (player) => player.socketId === item.playerSocketId
          );
          const wordsLength = item.words.length;
          const points = item.playerPoints;
          const words = item.words.map((word, i) => (
            <div key={i} className="inline">
              <div className="group relative inline">
                {wordsLength > 1 && i === wordsLength - 1 && "ve "}
                <span className="cursor-pointer">{word.word}</span>

                <div className="hidden group-hover:block absolute w-72 bg-slate-800 text-white shadow-lg p-4 rounded-md z-50 -left-20 top-full ">
                  <ul>
                    {word.meanings.map((meaning, i) => {
                      return (
                        <li key={i} className="list-disc ms-3">
                          {meaning}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {wordsLength > 1 && i < wordsLength - 1 && ", "}
            </div>
          ));
          return (
            <div className="ms-4" key={i}>
              <div
                className={
                  "inline " +
                  (player?.socketId === socket.id ? "text-lime-800" : "")
                }
              >
                {capitalizeFirstLetter(player?.username as string)}
              </div>
              ; {words}
              {words.length === 1 && " kelimesini"}
              {words.length > 1 && " kelimelerini"} türetti.{" "}
              {"(" + points + " puan)"}
            </div>
          );
        })
        .reverse()}
    </div>
  );
};
