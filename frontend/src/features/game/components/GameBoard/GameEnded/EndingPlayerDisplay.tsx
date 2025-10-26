import {
  selectEndingPlayerId,
  selectEndReason,
  selectPlayers,
} from "@/features/game/lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { tReact } from "@/features/language/lib/i18n";
import { useAppSelector } from "@/lib/redux/hooks";

const EndingPlayerDisplay = () => {
  const players = useAppSelector(selectPlayers);
  const endingPlayerId = useAppSelector(selectEndingPlayerId);
  const endingPlayer = players.find((player) => player.id === endingPlayerId);
  const endReason = useAppSelector(selectEndReason);
  const [locale] = useLocaleContext();

  // 🗣️ Localized reason text
  let localeText;
  switch (endReason) {
    case "consecutivePasses":
      localeText = "consecutivePasses";
      break;
    case "allTilesUsed":
      localeText = "allTilesUsed";
      break;
    case "playerLeft":
      localeText = "playerLeft";
      break;
    default:
      localeText = "default";
  }
  return (
    <p>
      {tReact(locale, "game.endedModal.endReason." + localeText, {
        player: <span className="font-bold">{endingPlayer?.username}</span>,
      })}
    </p>
  );
};

export default EndingPlayerDisplay;
