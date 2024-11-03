import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { toast } from "react-toastify";
import { setUser } from "../lib/redux/slices/userSlice";
import { useState } from "react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto p-4 py-3 flex justify-between">
        <Link to="/" className="font-bold">
          Kelime Savaşları
        </Link>
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="hidden lg:block">
          <Links />
        </div>

        <div
          className={`fixed top-[48px] lg:hidden right-0 h-full w-full sm:w-1/2 bg-primary z-50 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <Links mobile={true} closeMenu={() => setMenuOpen(false)} />
        </div>
        {/* Overlay to close menu */}
        {menuOpen && (
          <div
            className="fixed top-[48px] right-0 h-full w-full bg-black opacity-50 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
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
  const dispatch = useAppDispatch();

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
    dispatch(setUser(null));
  };

  const user = useAppSelector((state: RootState) => state.user);
  return (
    <nav
      className={`gap-4 flex ${
        mobile ? "flex-col h-full w-full items-center text-2xl" : ""
      }`}
    >
      <Link to="/oyun-hakkinda" onClick={closeMenu}>
        Oyun Hakkında
      </Link>
      <Link to="/dereceli-puanlari" onClick={closeMenu}>
        Dereceli Puanları
      </Link>
      {user && (
        <>
          <p
            className="cursor-pointer"
            onClick={() => {
              handleLogout();
              if (closeMenu) closeMenu();
            }}
          >
            Çıkış
          </p>
        </>
      )}
    </nav>
  );
};
