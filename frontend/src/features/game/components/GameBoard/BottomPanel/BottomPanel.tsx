import useIsClient from "@/utils/hooks/isClient";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import HandWrapper from "./HandWrapper";
import TimerIndicator from "./TimerIndicator";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectGameStatus } from "@/features/game/lib/redux/selectors";

export const BottomPanel = () => {
  const isClient = useIsClient();
  const gameStatus = useAppSelector(selectGameStatus);
  const showBottomPanel = gameStatus === "playing" || gameStatus === "ended";

  if (isClient && showBottomPanel) {
    return (
      <div className="p-2 xxs:p-4 md:pt-7 bg-gray w-full lg:w-2/3 flex flex-col md:flex-row justify-between relative">
        <TimerIndicator />
        <div className="hidden md:block">
          <LeftPanel />
        </div>

        <HandWrapper />
        <div className="block md:hidden flex pt-2 justify-between">
          <LeftPanel />
          <RightPanel />
        </div>
        <div className="hidden md:block">
          <RightPanel />
        </div>
      </div>
    );
  }
};
