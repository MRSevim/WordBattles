import {
  selectEndingPlayerId,
  selectEndReason,
  selectPlayers,
} from "@/features/game/lib/redux/selectors";
import { EndReason, Player } from "@/features/game/utils/types/gameTypes";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";
import { useAppSelector } from "@/lib/redux/hooks";

const EndingPlayerDisplay = () => {
  const players = useAppSelector(selectPlayers);
  const endingPlayerId = useAppSelector(selectEndingPlayerId);
  const endReason = useAppSelector(selectEndReason);

  return (
    <EndingPlayerDisplayInner
      players={players}
      endingPlayerId={endingPlayerId}
      endReason={endReason}
    />
  );
};

export const EndingPlayerDisplayInner = ({
  players,
  endingPlayerId,
  endReason,
}: {
  endReason: EndReason;
  players: Player[];
  endingPlayerId?: string;
}) => {
  const endingPlayer = players.find((player) => player.id === endingPlayerId);
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
      {t(locale, "game.endedModal.endReason.label")}
      {tReact(locale, "game.endedModal.endReason." + localeText, {
        player: <span className="font-bold">{endingPlayer?.username}</span>,
      })}
    </p>
  );
};

export default EndingPlayerDisplay;
