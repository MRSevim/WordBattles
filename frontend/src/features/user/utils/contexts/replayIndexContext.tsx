import { createContext, Dispatch, SetStateAction, use, useState } from "react";

type ReplayContextType = [number, Dispatch<SetStateAction<number>>] | null;

const ReplayContext = createContext<ReplayContextType>(null);

export const Provider = ({
  children,
  initialValue,
}: {
  children: React.ReactNode;
  initialValue: number;
}) => {
  const [replayIndex, setReplayIndex] = useState(initialValue);
  return (
    <ReplayContext value={[replayIndex, setReplayIndex]}>
      {children}
    </ReplayContext>
  );
};
export const useReplayIndexContext = () => {
  const context = use(ReplayContext);
  if (!context)
    throw new Error("useReplayContext must be used within its provider");
  return context;
};
