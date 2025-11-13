import {
  GameState,
  History,
  Player,
  Word,
} from "@/features/game/utils/types/gameTypes";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";
import { RefObject, useEffect, useRef, useState } from "react";
import { useReplayIndexContext } from "../../utils/contexts/replayIndexContext";

export const GameMoves = ({ game }: { game: GameState }) => {
  return (
    <div className="history-scrollable bg-gray-100 rounded-lg shadow-md overflow-auto max-h-100">
      {game.history
        .map((item, i) => {
          return (
            <HistoryItem key={i} i={i} item={item} players={game.players} />
          );
        })
        .reverse()}
    </div>
  );
};

const HistoryItem = ({
  item,
  i,
  players,
}: {
  i: number;
  item: History;
  players: Player[];
}) => {
  const wordsLength = item.words.length;
  const points = item.playerPoints;
  const [locale] = useLocaleContext();
  const player = players.find((player) => item.playerId === player.id);
  const [replayIndex, setReplayIndex] = useReplayIndexContext();

  const isActive = replayIndex === i;
  const handleClick = () => setReplayIndex(i);
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-colors text-black duration-200 ${
        isActive
          ? "bg-blue-200 dark:bg-blue-700"
          : i % 2 === 0
          ? "bg-slate-300"
          : "bg-transparent"
      } hover:bg-blue-200 dark:hover:bg-blue-600`}
    >
      <div className="ms-4 p-2">
        <span>{i + 1}.</span>
        <span>{player?.username}</span>
        {wordsLength === 0 && item.type === "pass" && t(locale, "game.passed")}
        {wordsLength === 0 &&
          item.type === "switch" &&
          t(locale, "game.switched")}
        {wordsLength === 0 &&
          item.type === "leave" &&
          t(locale, "game.leftGame")}
        {wordsLength > 0 && (
          <>
            {" "}
            {wordsLength === 1 &&
              tReact(locale, "game.generatedWords-one", {
                words: <Words words={item.words} />,
              })}
            {wordsLength > 1 &&
              tReact(locale, "game.generatedWords-multiple", {
                words: <Words words={item.words} />,
              })}
          </>
        )}
        {" (" + points + " " + t(locale, "points") + ")"}
      </div>
    </div>
  );
};

const Words = ({ words }: { words: Word[] }) => {
  return (
    <>
      {words.map((word, i) => (
        <WordComp key={i} wordsLength={words.length} word={word} i={i} />
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
  const ref = useRef<HTMLSpanElement>(null);
  const [locale] = useLocaleContext();

  return (
    <div className="inline">
      <div className="group relative inline">
        {wordsLength > 1 && i === wordsLength - 1 && t(locale, "and")}
        <span className="cursor-pointer" ref={ref}>
          {word.word}
        </span>
        <Meanings meanings={word.meanings} spanRef={ref} />
      </div>
      {wordsLength > 1 && i < wordsLength - 1 && ", "}
    </div>
  );
};

const Meanings = ({
  meanings,
  spanRef,
}: {
  meanings: string[];
  spanRef: RefObject<HTMLSpanElement | null>;
}) => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const container = document.querySelector(".history-scrollable");

    if (!spanRef.current || !container) return;

    const updatePosition = () => {
      const wordRect = spanRef.current!.getBoundingClientRect();
      setTop(wordRect.bottom);
    };

    //requestAnimationFrame prevents too much rerenders on fast scrolling
    const handleScroll = () => requestAnimationFrame(updatePosition);

    container.addEventListener("scroll", handleScroll);
    updatePosition(); // initial calc

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [spanRef.current]);

  return (
    <div
      style={{ top: top + "px" }}
      className="hidden group-hover:block fixed w-72 max-h-40 bg-slate-800 text-white shadow-lg p-4 rounded-md z-30 overflow-auto"
    >
      <ul>
        {meanings.map((meaning, i) => {
          return (
            <li key={i} className="list-disc ms-3">
              {meaning}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
