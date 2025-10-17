"use client";
import { useRef, useState } from "react";
import { Lang } from "../helpers/types";
import { t } from "../lib/i18n";
import "./LanguageSwitcher.css";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { selectGameStatus } from "@/features/game/lib/redux/selectors";
import { toast } from "react-toastify";
import useHandleClickOutside from "@/utils/hooks/useHandleClickOutside";
import { useLocaleContext } from "../helpers/LocaleContext";

type LangItem = {
  lang: Lang;
  abbr: string;
  name: string;
};

const LangArr: LangItem[] = [
  {
    lang: "tr",
    abbr: "🇹🇷",
    name: "langSwitcher.langTurkish",
  },
  {
    lang: "en",
    abbr: "🇺🇸",
    name: "langSwitcher.langEnglish",
  },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useLocaleContext();
  const router = useRouter();
  const gameStatus = useAppSelector(selectGameStatus);
  const dropdownRef = useRef(null);

  const handleSelect = (lang: Lang) => {
    // close dropdown
    setOpen(false);
    if (gameStatus !== "idle") {
      return toast.error(t(locale, "langSwitcher.cantSwitch"));
    }
    // set cookie for persistence
    document.cookie = `locale=${lang}; path=/; max-age=31536000`; // 1 year
    // update context
    setLocale(lang);
    // refresh page
    router.refresh();
  };

  useHandleClickOutside({ dropdownRef, setOpen });

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        ref={dropdownRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
      >
        <i className="bi bi-translate text-lg"></i>
        <span>{t(locale, "langSwitcher.language")}</span>
        <i
          className={`bi bi-chevron-down text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 transition-all animate-fadeIn z-50">
          <ul className="py-1 text-sm text-gray-700">
            {LangArr.map((lang) => (
              <Li item={lang} key={lang.lang} onClick={handleSelect} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const Li = ({
  item,
  onClick,
}: {
  item: LangItem;
  onClick: (lang: Lang) => void;
}) => {
  const [locale] = useLocaleContext();

  return (
    <li>
      <button
        onClick={() => {
          console.log("first");
          onClick(item.lang);
        }}
        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 rounded-lg transition"
      >
        {item.abbr} <span className="ml-2">{t(locale, item.name)}</span>
      </button>
    </li>
  );
};
