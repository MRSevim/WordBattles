import { useState } from "react";
import { capitalizeFirstLetter } from "@/features/game/utils/helpers";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { socket } from "@/lib/socket.io/socketio";

export const GameHistory = () => {
  const history = useAppSelector((state: RootState) => state.game.history);
  const players = useAppSelector(
    (state: RootState) => state.game.game?.players
  );

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md m-3 max-h-96 overflow-auto">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        Oyun Geçmişi
      </h2>
      {history
        .map((item, i) => {
          const player = players?.find(
            (player) => player.sessionId === item.playerSessionId
          );
          const wordsLength = item.words.length;
          const points = item.playerPoints;
          const words = item.words.map((word, i) => (
            <div key={i} className="inline">
              <div className="group relative inline">
                {wordsLength > 1 && i === wordsLength - 1 && "ve "}
                <span
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                >
                  {word.word}
                </span>

                <div
                  style={{
                    top: mousePosition.y + "px",
                    left: mousePosition.x + "px",
                  }}
                  className="hidden group-hover:block fixed w-72 max-h-40 bg-slate-800 text-white shadow-lg p-4 rounded-md z-30 overflow-auto"
                >
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
          if (player) {
            return (
              <div className={i % 2 === 0 ? "bg-slate-300	" : ""} key={i}>
                <div className="ms-4 p-2">
                  <div
                    className={
                      "inline " +
                      (player?.sessionId === socket.sessionId
                        ? "font-bold"
                        : "")
                    }
                  >
                    {capitalizeFirstLetter(player.username)}
                  </div>
                  {words.length === 0 &&
                    item.type !== "switch" &&
                    " sırasını geçti. "}
                  {words.length === 0 &&
                    item.type === "switch" &&
                    " harf değiştirdi. "}
                  {words.length > 0 && (
                    <>
                      ; {words}
                      {words.length === 1 && " kelimesini"}
                      {words.length > 1 && " kelimelerini"} türetti.{" "}
                    </>
                  )}
                  {"(" + points + " puan)"}
                </div>
              </div>
            );
          }
        })
        .reverse()}
    </div>
  );
};
