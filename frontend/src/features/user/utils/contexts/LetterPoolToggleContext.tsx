import { createContext, Dispatch, SetStateAction, use, useState } from "react";

type LetterPoolToggleContextType =
  | [boolean, Dispatch<SetStateAction<boolean>>]
  | null;

const LetterPoolToggleContext =
  createContext<LetterPoolToggleContextType>(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [letterPoolOpen, setLetterPoolOpen] = useState(false);
  return (
    <LetterPoolToggleContext value={[letterPoolOpen, setLetterPoolOpen]}>
      {children}
    </LetterPoolToggleContext>
  );
};
export const useLetterPoolToggleContext = () => {
  const context = use(LetterPoolToggleContext);
  if (!context)
    throw new Error(
      "useLetterPoolToggleContext must be used within its provider"
    );
  return context;
};
