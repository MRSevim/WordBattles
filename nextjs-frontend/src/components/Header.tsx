"use client";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-toastify";
import { useState } from "react";
import { routeStrings } from "@/utils/routeStrings";
import Container from "./Container";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white">
      <Container className="py-3 flex justify-between">
        <Link href={routeStrings.home} className="font-bold">
          WordBattles
        </Link>
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="hidden md:block">
          <Links />
        </div>

        <div
          className={`fixed top-[48px] md:hidden right-0 w-full sm:w-1/2 bg-primary z-50 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <Links mobile={true} closeMenu={() => setMenuOpen(false)} />
        </div>
      </Container>
    </header>
  );
};

const Links = ({
  mobile,
  closeMenu,
}: {
  mobile?: boolean;
  closeMenu?: () => void;
}) => {
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
    const response = await fetch("/api/user/logout", {
      method: "POST",
    });

    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message);
      return;
    }
  };

  const user = useAppSelector((state: RootState) => state.user);

  const LinkClasses = `${
    mobile ? "py-2" : ""
  } hover:scale-105 transition-transform`;

  return (
    <nav
      className={`flex ${
        mobile ? "flex-col h-full w-full items-center text-2xl" : "gap-4"
      }`}
    >
      <Link
        className={LinkClasses}
        href={routeStrings.about}
        onClick={closeMenu}
      >
        Oyun Hakkında
      </Link>
      <Link
        className={LinkClasses}
        href={routeStrings.ladder}
        onClick={closeMenu}
      >
        Dereceli Puanları
      </Link>
    </nav>
  );
};
