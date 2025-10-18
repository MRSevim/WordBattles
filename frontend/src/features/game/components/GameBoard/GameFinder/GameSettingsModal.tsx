import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { useState } from "react";
import { FindButton } from "./FindButton";
import { Lang } from "@/features/language/helpers/types";
import { t } from "@/features/language/lib/i18n";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setGameLanguage,
  setGameStatus,
} from "@/features/game/lib/redux/slices/gameSlice";
import { setCookie } from "@/utils/helpers";

const GameSettingsModal = ({ cancel }: { cancel: () => void }) => {
  const [locale] = useLocaleContext();

  const [lang, setLang] = useState(locale);
  const dispatch = useAppDispatch();

  const findGame = () => {
    socket.connect();
    socket.emit("Selected Language", lang);
    setCookie("lang", lang);
    dispatch(setGameLanguage(lang));
    dispatch(setGameStatus("looking"));
  };
  return (
    <>
      <h2 className="text-lg font-semibold">
        {t(locale, "game.finder.selectLanguage")}
      </h2>

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="en">{t(locale, "game.finder.en")}</option>
        <option value="tr">{t(locale, "langSwitcher.langTurkish")}</option>
      </select>

      <div className="flex gap-2 mt-2">
        <FindButton onClick={cancel} text={t(locale, "cancel")} />
        <FindButton onClick={findGame} text={t(locale, "game.finder.find")} />
      </div>
    </>
  );
};

export default GameSettingsModal;
