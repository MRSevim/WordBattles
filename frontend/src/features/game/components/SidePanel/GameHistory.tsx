import { capitalizeFirstLetter } from "@/features/game/utils/helpers";
import { useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import {
  selectGameHistory,
  selectInitialPlayerData,
} from "../../lib/redux/selectors";
import { InitialData } from "../../utils/types/gameTypes";
import { History, Word } from "../../utils/types/gameTypes";
import { useEffect, useRef, useState } from "react";

export const GameHistory = () => {
  return (
    <div className="p-2 xxs:p-4 bg-gray-100 rounded-lg shadow-md m-3 overflow-auto max-h-80">
      <h2 className="text-base xxs:text-xl font-bold text-center mb-1 sm:mb-4 text-gray-800">
        Oyun Geçmişi
      </h2>
      <HistoryInner />
    </div>
  );
};

const HistoryInner = () => {
  const history = useAppSelector(selectGameHistory);
  const players = useAppSelector(selectInitialPlayerData);

  return (
    <>
      {history
        .map((item, i) => {
          return <HistoryItem key={i} i={i} item={item} players={players} />;
        })
        .reverse()}
    </>
  );
};

//Need manual memo here since react compiler does not memoize it for some reason
const HistoryItem = ({
  item,
  players,
  i,
}: {
  i: number;
  item: History;
  players?: InitialData["players"];
}) => {
  const player = players?.find((player) => player.id === item.playerId);
  const wordsLength = item.words.length;
  const points = item.playerPoints;

  if (player) {
    return (
      <div className={i % 2 === 0 ? "bg-slate-300	" : ""} key={i}>
        <div className="ms-4 p-2">
          <div
            className={
              "inline " + (player?.id === socket.sessionId ? "font-bold" : "")
            }
          >
            {capitalizeFirstLetter(player.username)}
          </div>
          {wordsLength === 0 && item.type !== "switch" && " sırasını geçti. "}
          {wordsLength === 0 && item.type === "switch" && " harf değiştirdi. "}
          {wordsLength > 0 && (
            <>
              ; <Words words={item.words} wordsLength={wordsLength} />
              {wordsLength === 1 && " kelimesini"}
              {wordsLength > 1 && " kelimelerini"} türetti.{" "}
            </>
          )}
          {"(" + points + " puan)"}
        </div>
      </div>
    );
  }
};
const Words = ({
  words,
  wordsLength,
}: {
  words: Word[];
  wordsLength: number;
}) => {
  return (
    <>
      {words.map((word, i) => (
        <WordComp key={i} wordsLength={wordsLength} word={word} i={i} />
      ))}
    </>
  );
};

const WordComp = ({
  wordsLength,
  word,
  i,
}: {
  i: number;
  wordsLength: number;
  word: Word;
}) => {
  const [top, setTop] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setTop(rect.bottom);
  }, [ref.current]);

  return (
    <div key={i} className="inline">
      <div className="group relative inline">
        {wordsLength > 1 && i === wordsLength - 1 && "ve "}
        <span className="cursor-pointer" ref={ref}>
          {word.word}
        </span>

        <div
          style={{ top: top + "px" }}
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
  );
};
