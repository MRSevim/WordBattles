import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSidePanel } from "@/features/game/lib/redux/slices/sidePanelToggleSlice";
import {
  _switch,
  makePlay,
  pass,
} from "@/features/game/lib/redux/slices/gameSlice";
import { selectIsSwitching } from "@/features/game/lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

const RightPanel = () => {
  const dispatch = useAppDispatch();
  const [locale] = useLocaleContext();

  return (
    <div className="flex gap-2">
      <Button
        classes="bi bi bi-three-dots-vertical block lg:hidden"
        title={t(locale, "game.toggleSidePanel")}
        onClick={() => {
          dispatch(toggleSidePanel());
        }}
      />{" "}
      <Button
        classes="bi bi-arrow-right"
        title={t(locale, "game.pass")}
        onClick={() => {
          dispatch(pass());
        }}
      />{" "}
      <PlayButton />
    </div>
  );
};

const PlayButton = () => {
  const dispatch = useAppDispatch();
  const switching = useAppSelector(selectIsSwitching);
  const [locale] = useLocaleContext();

  return (
    <Button
      classes="bi bi-arrow-right-square"
      title={t(locale, "game.play")}
      onClick={() => {
        if (switching) {
          dispatch(_switch());
        } else {
          dispatch(makePlay());
        }
      }}
    />
  );
};

export default RightPanel;
