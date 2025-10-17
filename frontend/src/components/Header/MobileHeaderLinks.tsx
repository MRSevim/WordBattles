"use client";
import { useState } from "react";
import { Links } from "./Links";
import { Lang } from "@/features/language/helpers/types";

const MobileHeaderLinks = ({ locale }: { locale: Lang }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden text-white cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <div
        className={`fixed top-[48px] md:hidden right-0 w-full sm:w-1/2 bg-primary z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } `}
      >
        <Links
          mobile={true}
          closeMenu={() => setMenuOpen(false)}
          locale={locale}
        />
      </div>
    </>
  );
};

export default MobileHeaderLinks;
