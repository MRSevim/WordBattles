import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { toast } from "react-toastify";
import { setUser } from "../lib/redux/slices/userSlice";

export const Header = () => {
  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto p-4 py-3 flex justify-between">
        <Link to="/" className="font-bold">
          Kelime Savaşları
        </Link>
        <Links />
      </div>
    </header>
  );
};

const Links = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.user);
  return (
    <nav className="gap-4 flex">
      <Link to="/oyun-hakkinda">Oyun Hakkında</Link>
      <Link to="/dereceli-puanlari">Dereceli Puanları</Link>
      {user && (
        <>
          <p
            className="cursor-pointer"
            onClick={async () => {
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
            }}
          >
            Çıkış
          </p>
        </>
      )}
    </nav>
  );
};
