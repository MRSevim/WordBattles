"use client";
import { selectUser } from "@/features/auth/lib/redux/selectors";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { logout } from "@/features/auth/utils/apiCallsClient";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const UserMenu = ({ onClick }: { onClick?: () => void }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const roomId = localStorage.getItem("roomId");
    if (roomId) {
      toast.error("Oyun içindeyken çıkış yapamazsınız");
      return;
    }

    if (sessionId) {
      toast.error("Oyun ararken çıkış yapamazsınız");
      return;
    }
    const { error } = await logout();

    if (error) {
      return toast.error(error);
    }
    dispatch(setUser(null));
    router.push(routeStrings.home);
  };

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

  return (
    <>
      {!user ? (
        <Link
          className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 my-2 md:my-0 hover:bg-gray-100 hover:text-black transition-colors"
          href={routeStrings.signin}
          onClick={onClick}
        >
          Sign In
        </Link>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 my-2 md:my-0 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i className="bi bi-person-circle text-xl"></i>
            <span className="inline">{user.name ?? "Profile"}</span>
            <i
              className={`bi bi-chevron-${
                open ? "up" : "down"
              } text-sm transition-transform`}
            ></i>
          </button>

          {open && (
            <div className="absolute right-0 w-44 bg-primary shadow-lg rounded-lg border border-gray-200 z-50 animate-fadeIn">
              <Link
                href={routeStrings.profile}
                onClick={() => {
                  setOpen(false);
                  onClick?.();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-black rounded-t-lg transition-colors"
              >
                <i className="bi bi-person"></i>
                Profile
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
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserMenu;
