import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSidePanel } from "@/features/game/lib/redux/slices/sidePanelToggleSlice";
import {
  _switch,
  makePlay,
  pass,
} from "@/features/game/lib/redux/slices/gameSlice";
import {
  selectIsSwitching,
  selectSwitchValues,
} from "@/features/game/lib/redux/selectors";
import { toggleSwitching } from "@/features/game/lib/redux/slices/switchSlice";

const RightPanel = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-2">
      <Button
        classes="bi bi bi-three-dots-vertical block lg:hidden"
        title="Yan Paneli Aç"
        onClick={() => {
          dispatch(toggleSidePanel());
        }}
      />{" "}
      <Button
        classes="bi bi-arrow-right"
        title="Sıra Geç"
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
  const switchValues = useAppSelector(selectSwitchValues);

  return (
    <Button
      classes="bi bi-arrow-right-square"
      title="Oyunu Gönder"
      onClick={() => {
        if (switching) {
          dispatch(_switch(switchValues));
          dispatch(toggleSwitching());
        } else {
          dispatch(makePlay());
        }
      }}
    />
  );
};

export default RightPanel;
