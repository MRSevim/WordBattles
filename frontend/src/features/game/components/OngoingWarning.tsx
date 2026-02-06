"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectGameRoomId, selectGameStatus } from "../lib/redux/selectors";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";

const game = routeStrings.game;

export const OngoingWarning = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const gameStatus = useAppSelector(selectGameStatus);
  const roomId = useAppSelector(selectGameRoomId);
  const gameIsOngoing = roomId;
  const lookingForGame = gameStatus === "looking";
  const { dictionary } = useDictionaryContext();

  useEffect(() => {
    if (pathname !== game && (gameIsOngoing || lookingForGame)) {
      setOpen(true);
    }
    if (pathname === game) {
      setOpen(false);
    }
  }, [pathname, gameStatus, roomId]);

  if (open) {
    return (
      <div className="absolute left-5 z-30 bg-green-800 text-white p-4 rounded-lg mt-2">
        <span
          onClick={() => setOpen(false)}
          className="absolute top-0 right-0 me-1 text-red-400 cursor-pointer"
        >
          X
        </span>
        {gameIsOngoing && dictionary.game.ongoing.ongoingGameWarning}
        {!gameIsOngoing &&
          lookingForGame &&
          dictionary.game.ongoing.ongoingLookingWarning}
        <div className="flex items-center justify-center">
          <Link className="underline" href={game}>
            {" "}
            {dictionary.game.ongoing.go}
          </Link>
        </div>
      </div>
    );
  }
};
