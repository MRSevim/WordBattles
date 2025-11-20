"use client";
import { useState } from "react";
import { Links } from "./Links";

const MobileHeaderLinks = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <button
        className="lg:hidden text-white cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <div
        className={`fixed top-[48px] lg:hidden right-0 w-full sm:w-1/2 bg-primary z-50 transition-all duration-300 ${
          menuOpen
            ? "translate-0 opacity-100 "
            : "translate-x-full opacity-0 translate-y-[-10px]"
        } `}
      >
        <Links mobile={true} closeMenu={() => setMenuOpen(false)} />
      </div>
    </>
  );
};

export default MobileHeaderLinks;
