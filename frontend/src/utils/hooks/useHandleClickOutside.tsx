import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

const useHandleClickOutside = ({
  dropdownRef,
  setOpen,
}: {
  dropdownRef: RefObject<HTMLElement | null>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
};

export default useHandleClickOutside;
