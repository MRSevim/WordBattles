"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectGameStatus } from "../lib/redux/selectors";

export const OngoingWarning = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const gameStatus = useAppSelector(selectGameStatus);
  const gameIsOngoing = gameStatus === "playing" || gameStatus === "ended";
  const lookingForGame = gameStatus === "looking";

  useEffect(() => {
    if (pathname !== "/" && (gameIsOngoing || lookingForGame)) {
      setOpen(true);
    }
    if (pathname === "/") {
      setOpen(false);
    }
  }, [pathname, gameIsOngoing, lookingForGame]);

  if (open) {
    return (
      <div className="absolute left-5 z-30 bg-green-800 text-white p-4 rounded-lg mt-2">
        <span
          onClick={() => setOpen(false)}
          className="absolute top-0 right-0 me-1 text-red-400 cursor-pointer"
        >
          X
        </span>
        {gameIsOngoing && "Şu anda devam eden oyununuz bulunmaktadır"}
        {!gameIsOngoing &&
          lookingForGame &&
          "Şu anda devam eden oyun arayışınız bulunmaktadır"}
        <div className="flex items-center justify-center">
          <Link className="underline" href={routeStrings.home}>
            {" "}
            Dön
          </Link>
        </div>
      </div>
    );
  }
};
