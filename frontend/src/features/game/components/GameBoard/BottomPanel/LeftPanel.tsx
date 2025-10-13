import {
  selectGameStatus,
  selectIsSwitching,
  selectPlayerHand,
} from "@/features/game/lib/redux/selectors";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./Button";
import { toggleSwitching } from "@/features/game/lib/redux/slices/switchSlice";
import { toggleLetterPool } from "@/features/game/lib/redux/slices/letterPoolToggleSlice";
import {
  returnEverythingToHand,
  shuffleHand,
} from "@/features/game/lib/redux/slices/gameSlice";

const LeftPanel = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const playerHand = useAppSelector(selectPlayerHand);
  const switching = useAppSelector(selectIsSwitching);

  return (
    <div className="flex gap-2">
      <Button
        classes="bi bi-archive"
        title="Harf Havuzu"
        onClick={() => {
          dispatch(toggleLetterPool());
        }}
      />
      <SwitchButton />
      <Button
        classes="bi bi-arrow-left-right"
        title="Eldeki Harfleri Karıştır"
        onClick={() => {
          if (gameStatus === "playing") {
            dispatch(shuffleHand());
          }
        }}
      />
      <Button
        classes="bi bi-arrow-down"
        title="Harfleri Ele Geri Getir"
        onClick={() => {
          if (gameStatus === "playing") {
            dispatch(returnEverythingToHand());
          }
        }}
      />
    </div>
  );
};

const SwitchButton = () => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const playerHand = useAppSelector(selectPlayerHand);
  const switching = useAppSelector(selectIsSwitching);
  return (
    <Button
      classes={"bi bi-arrow-down-up " + (switching ? "animate-bounce" : "")}
      title="Harf Havuzu İle Harf Değiştir"
      onClick={() => {
        if (gameStatus === "playing") {
          dispatch(toggleSwitching(playerHand));
        }
      }}
    />
  );
};

export default LeftPanel;
