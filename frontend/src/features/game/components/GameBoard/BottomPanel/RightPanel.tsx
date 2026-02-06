import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSidePanel } from "@/features/game/lib/redux/slices/sidePanelToggleSlice";
import {
  _switch,
  makePlay,
  pass,
} from "@/features/game/lib/redux/slices/gameSlice";
import { selectIsSwitching } from "@/features/game/lib/redux/selectors";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";

const RightPanel = () => {
  const dispatch = useAppDispatch();
  const { dictionary } = useDictionaryContext();

  return (
    <div className="flex gap-2">
      <Button
        classes="bi bi bi-three-dots-vertical block lg:hidden"
        title={dictionary.game.toggleSidePanel}
        onClick={() => {
          dispatch(toggleSidePanel());
        }}
      />{" "}
      <Button
        classes="bi bi-arrow-right"
        title={dictionary.game.pass}
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
  const { dictionary } = useDictionaryContext();

  return (
    <Button
      classes="bi bi-arrow-right-square"
      title={dictionary.game.play}
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
