"use client";
import { selectUser } from "@/features/auth/lib/redux/selectors";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { logout } from "@/features/auth/utils/apiCallsClient";
import { selectGameStatus } from "@/features/game/lib/redux/selectors";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import useHandleClickOutside from "@/utils/hooks/useHandleClickOutside";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const UserMenu = ({ onClick }: { onClick?: () => void }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectUser);
  const gameStatus = useAppSelector(selectGameStatus);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { dictionary } = useDictionaryContext();

  useHandleClickOutside({ dropdownRef, setOpen });

  const handleLogout = async () => {
    if (gameStatus === "playing" || gameStatus === "looking") {
      toast.error(dictionary.header.userMenu.cantLogout);
      return;
    }

    const { error } = await logout();

    if (error) {
      return toast.error(error);
    }
    dispatch(setUser(undefined));
    router.push(routeStrings.home);
  };

  return (
    <>
      {user === undefined ? (
        <Link
          className="h-[46px] flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 my-2 md:my-0 hover:bg-gray-100 hover:text-black transition-colors"
          href={routeStrings.signin}
          onClick={onClick}
        >
          {dictionary.signIn}
        </Link>
      ) : user === null ? (
        <div
          className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 my-2 md:my-0 animate-pulse bg-gray-200"
          style={{ width: "100px", height: "46px" }}
        ></div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 my-2 md:my-0 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i className="bi bi-person-circle text-xl"></i>
            <span className="inline">
              {user.name ?? dictionary.header.userMenu.profile}
            </span>
            <i
              className={`bi bi-chevron-${
                open ? "up" : "down"
              } text-sm transition-transform`}
            ></i>
          </button>

          {open && (
            <div className="absolute right-0 w-44 bg-primary text-white shadow-lg rounded-lg border border-gray-200 z-50 animate-fadeIn">
              <Link
                href={routeStrings.profile}
                onClick={() => {
                  setOpen(false);
                  onClick?.();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-black rounded-t-lg transition-colors"
              >
                <i className="bi bi-person"></i>
                {dictionary.header.userMenu.profile}
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                  onClick?.();
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-red-600 rounded-b-lg transition-colors cursor-pointer"
              >
                <i className="bi bi-box-arrow-right"></i>
                {dictionary.header.userMenu.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserMenu;
