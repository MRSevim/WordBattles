import { useAppSelector } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import {
  selectGameHistory,
  selectInitialPlayerData,
} from "../../lib/redux/selectors";
import { InitialData } from "../../utils/types/gameTypes";
import { History, Word } from "../../utils/types/gameTypes";
import {
  createContext,
  RefObject,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";

const HistoryLengthContext = createContext<number | null>(null);

export const GameHistory = () => {
  const [locale] = useLocaleContext();

  return (
    <div className="history-scrollable p-2 xxs:p-4 bg-gray-100 rounded-lg shadow-md m-3 overflow-auto max-h-80">
      <h2 className="text-base xxs:text-xl font-bold text-center mb-1 sm:mb-4 text-gray-800">
        {t(locale, "game.gameHistory")}
      </h2>
      <HistoryInner />
    </div>
  );
};

const HistoryInner = () => {
  const history = useAppSelector(selectGameHistory);
  const players = useAppSelector(selectInitialPlayerData);

  return (
    <HistoryLengthContext value={history.length}>
      {history
        .map((item, i) => {
          return <HistoryItem key={i} i={i} item={item} players={players} />;
        })
        .reverse()}
    </HistoryLengthContext>
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
  const [locale] = useLocaleContext();

  if (player) {
    return (
      <div className={i % 2 === 0 ? "bg-slate-300	" : ""} key={i}>
        <div className="ms-4 p-2">
          <div
            className={
              "inline " + (player?.id === socket.sessionId ? "font-bold" : "")
            }
          >
            {player.username}
          </div>
          {wordsLength === 0 &&
            item.type !== "switch" &&
            t(locale, "game.passed")}
          {wordsLength === 0 &&
            item.type === "switch" &&
            t(locale, "game.switched")}
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
          {" (" + points + t(locale, "game.pointsPr")}
        </div>
      </div>
    );
  }
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
        {wordsLength > 1 && i === wordsLength - 1 && t(locale, "game.and")}
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

  const historyLength = use(HistoryLengthContext);
  if (!historyLength)
    throw new Error("HistoryLengthContext must be used within its provider");

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
  }, [spanRef.current, historyLength]);

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
