import { useState } from "react";
import { capitalizeFirstLetter } from "@/features/game/utils/helpers";
import { useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { selectGameHistory, selectPlayers } from "../../lib/redux/selectors";

export const GameHistory = () => {
  const history = useAppSelector(selectGameHistory);
  const players = useAppSelector(selectPlayers);

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  return (
    <div className="p-2 xxs:p-4 bg-gray-100 rounded-lg shadow-md m-3 overflow-auto">
      <h2 className="text-base xxs:text-xl font-bold text-center mb-6 text-gray-800">
        Oyun Geçmişi
      </h2>
      {history
        .map((item, i) => {
          const player = players?.find((player) => player.id === item.playerId);
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
                      (player?.id === socket.sessionId ? "font-bold" : "")
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
