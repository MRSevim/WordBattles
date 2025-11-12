import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { FindButton } from "./FindButton";
import { Lang } from "@/features/language/helpers/types";
import { t } from "@/features/language/lib/i18n";
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

const selectClasses =
  "w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500";

const GameSettingsModal = ({ cancel }: { cancel: () => void }) => {
  const [locale] = useLocaleContext();
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
        {t(locale, "game.finder.selectLanguage")}
      </h2>

      <select
        value={lang}
        onChange={(e) => dispatch(setGameLanguage(e.target.value as Lang))}
        className={selectClasses}
      >
        <option value="en">{t(locale, "lang.en")}</option>
        <option value="tr">{t(locale, "lang.tr")}</option>
      </select>

      <select
        value={type}
        onChange={(e) => dispatch(setGameType(e.target.value as GameType))}
        className={selectClasses}
      >
        <option value="casual">{t(locale, "types.casual")}</option>
        {userLoggedIn && (
          <option value="ranked">{t(locale, "types.ranked")}</option>
        )}
      </select>

      <div className="flex gap-2 mt-2">
        <FindButton onClick={cancel} text={t(locale, "cancel")} />
        <FindButton onClick={findGame} text={t(locale, "game.finder.find")} />
      </div>
    </>
  );
};

export default GameSettingsModal;
