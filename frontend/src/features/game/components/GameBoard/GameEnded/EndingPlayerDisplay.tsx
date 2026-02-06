import {
  selectEndingPlayerId,
  selectEndReason,
  selectPlayers,
} from "@/features/game/lib/redux/selectors";
import { EndReason, Player } from "@/features/game/utils/types/gameTypes";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";
import { interpolateReact } from "@/features/language/lib/i18n";
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
  const { dictionary } = useDictionaryContext();

  return (
    <p>
      {dictionary.game.endedModal.endReason.label}
      {interpolateReact(dictionary.game.endedModal.endReason[endReason], {
        player: <span className="font-bold">{endingPlayer?.username}</span>,
      })}
    </p>
  );
};

export default EndingPlayerDisplay;
