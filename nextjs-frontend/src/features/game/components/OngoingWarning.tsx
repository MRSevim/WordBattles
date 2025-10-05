import { useEffect, useState } from "react";

import useIds from "../utils/hooks/useIds";
import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";

export const OngoingWarning = () => {
  /*   const location = useLocation(); */
  const [open, setOpen] = useState(false);
  const { roomId, sessionId } = useIds();

  useEffect(() => {
    if (location.pathname !== "/" && (roomId || sessionId)) {
      setOpen(true);
    }
    if (location.pathname === "/") {
      setOpen(false);
    }
  }, [location, roomId, sessionId]);

  if (open) {
    return (
      <div className="absolute left-5 z-30 bg-green-800 text-white p-4 rounded-lg mt-2">
        <span
          onClick={() => setOpen(false)}
          className="absolute top-0 right-0 me-1 text-red-400 cursor-pointer"
        >
          X
        </span>
        {roomId && "Şu anda devam eden oyununuz bulunmaktadır"}
        {!roomId &&
          sessionId &&
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
