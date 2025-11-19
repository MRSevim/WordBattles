import {
  selectIsSwitching,
  selectUndrawnLetterPool,
} from "@/features/game/lib/redux/selectors";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSwitching } from "@/features/game/lib/redux/slices/gameSlice";
import { toggleLetterPool } from "@/features/game/lib/redux/slices/letterPoolToggleSlice";
import {
  returnEverythingToHand,
  shuffleHand,
} from "@/features/game/lib/redux/slices/gameSlice";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";

const LeftPanel = () => {
  const dispatch = useAppDispatch();
  const { dictionary } = useDictionaryContext();

  return (
    <div className="flex gap-2">
      <ToggleLetterPoolButton />
      <SwitchButton />
      <Button
        classes="bi bi-arrow-left-right"
        title={dictionary.game.shuffle}
        onClick={() => {
          dispatch(shuffleHand());
        }}
      />
      <Button
        classes="bi bi-arrow-down"
        title={dictionary.game.bringBack}
        onClick={() => {
          dispatch(returnEverythingToHand());
        }}
      />
    </div>
  );
};

const ToggleLetterPoolButton = () => {
  const dispatch = useAppDispatch();
  const { dictionary } = useDictionaryContext();
  const undrawnLetterPool = useAppSelector(selectUndrawnLetterPool);
  return (
    <i
      onMouseDown={() => dispatch(toggleLetterPool())}
      title={dictionary.game.letterPool}
      className="bg-brown text-white rounded-lg flex flex-col items-center justify-center w-9 h-9 text-center cursor-pointer"
    >
      <i className="bi bi-archive text-lg leading-none mt-1"></i>
      <span className="text-xxs">{undrawnLetterPool.length}</span>
    </i>
  );
};

const SwitchButton = () => {
  const dispatch = useAppDispatch();
  const switching = useAppSelector(selectIsSwitching);
  const { dictionary } = useDictionaryContext();

  return (
    <Button
      classes={"bi bi-arrow-down-up " + (switching ? "animate-bounce" : "")}
      title={dictionary.game.switch}
      onClick={() => {
        dispatch(toggleSwitching());
      }}
    />
  );
};

export default LeftPanel;
