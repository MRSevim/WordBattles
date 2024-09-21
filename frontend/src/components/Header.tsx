import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="container mx-auto p-4 py-3 flex justify-between">
      <Link to="/">Kelime Savaşları</Link>
      <Links />
    </header>
  );
};

const Links = () => {
  return (
    <nav className="gap-4 flex">
      <Link to="/oyun-kuralları">Oyun Kuralları</Link>
      <Link to="/giriş-yap">Giriş Yap</Link>
      <Link to="/hesap-oluştur">Hesap Oluştur</Link>
    </nav>
  );
};
