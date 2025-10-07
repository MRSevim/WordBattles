import { useEffect, useState } from "react";

export default function useIds() {
  const [sessionId, setSessionId] = useState<string | null>();
  /* localStorage.getItem("sessionId") */
  const [roomId, setRoomId] = useState<string | null>();
  /*     localStorage.getItem("roomId") */

  useEffect(() => {
    function checkLocalStorage() {
      const _sessionId = localStorage.getItem("sessionId");
      const _roomId = localStorage.getItem("roomId");

      setSessionId(_sessionId);
      setRoomId(_roomId);
    }

    window.addEventListener("storage", checkLocalStorage);

    return () => {
      window.removeEventListener("storage", checkLocalStorage);
    };
  }, []);

  return { roomId, sessionId };
}
