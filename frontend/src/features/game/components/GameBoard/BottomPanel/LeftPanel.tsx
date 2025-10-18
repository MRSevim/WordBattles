import { selectIsSwitching } from "@/features/game/lib/redux/selectors";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSwitching } from "@/features/game/lib/redux/slices/gameSlice";
import { toggleLetterPool } from "@/features/game/lib/redux/slices/letterPoolToggleSlice";
import {
  returnEverythingToHand,
  shuffleHand,
} from "@/features/game/lib/redux/slices/gameSlice";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

const LeftPanel = () => {
  const dispatch = useAppDispatch();
  const [locale] = useLocaleContext();

  return (
    <div className="flex gap-2">
      <Button
        classes="bi bi-archive"
        title={t(locale, "game.letterPool")}
        onClick={() => {
          dispatch(toggleLetterPool());
        }}
      />
      <SwitchButton />
      <Button
        classes="bi bi-arrow-left-right"
        title={t(locale, "game.shuffle")}
        onClick={() => {
          dispatch(shuffleHand());
        }}
      />
      <Button
        classes="bi bi-arrow-down"
        title={t(locale, "game.bringBack")}
        onClick={() => {
          dispatch(returnEverythingToHand());
        }}
      />
    </div>
  );
};

const SwitchButton = () => {
  const dispatch = useAppDispatch();
  const switching = useAppSelector(selectIsSwitching);
  const [locale] = useLocaleContext();

  return (
    <Button
      classes={"bi bi-arrow-down-up " + (switching ? "animate-bounce" : "")}
      title={t(locale, "game.switch")}
      onClick={() => {
        dispatch(toggleSwitching());
      }}
    />
  );
};

export default LeftPanel;
