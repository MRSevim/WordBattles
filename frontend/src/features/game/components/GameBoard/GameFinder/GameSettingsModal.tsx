import { FindButton } from "./FindButton";
import { Lang } from "@/features/language/helpers/types";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setGameLanguage,
  setGameStatus,
  setGameType,
} from "@/features/game/lib/redux/slices/gameSlice";
import { setCookie } from "@/utils/helpers";
import {
  selectGameLanguage,
  selectGameType,
} from "@/features/game/lib/redux/selectors";
import { GameType } from "@/features/game/utils/types/gameTypes";
import { selectUser } from "@/features/auth/lib/redux/selectors";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";

const selectClasses =
  "w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500";

const GameSettingsModal = ({ cancel }: { cancel: () => void }) => {
  const { dictionary } = useDictionaryContext();
  const userLoggedIn = useAppSelector(selectUser) !== undefined;

  const lang = useAppSelector(selectGameLanguage);
  const type = useAppSelector(selectGameType);
  const dispatch = useAppDispatch();

  const findGame = () => {
    setCookie("lang", lang);
    setCookie("type", type);
    socket.connect();
    socket.emit("Started Looking", { lang, type });
    dispatch(setGameStatus("looking"));
  };
  return (
    <>
      <h2 className="text-lg font-semibold">
        {dictionary.game.finder.selectLanguage}
      </h2>

      <select
        value={lang}
        onChange={(e) => dispatch(setGameLanguage(e.target.value as Lang))}
        className={selectClasses}
      >
        <option value="en">{dictionary.lang.en}</option>
        <option value="tr">{dictionary.lang.tr}</option>
      </select>

      <select
        value={type}
        onChange={(e) => dispatch(setGameType(e.target.value as GameType))}
        className={selectClasses}
      >
        <option value="casual">{dictionary.types.casual}</option>
        {userLoggedIn && (
          <option value="ranked">{dictionary.types.ranked}</option>
        )}
      </select>

      <div className="flex gap-2 mt-2">
        <FindButton onClick={cancel} text={dictionary.cancel} />
        <FindButton onClick={findGame} text={dictionary.game.finder.find} />
      </div>
    </>
  );
};

export default GameSettingsModal;
