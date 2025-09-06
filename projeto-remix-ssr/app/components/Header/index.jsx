import { Image } from "../Image";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./header.module.css";
import logo from "./logo.png";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/">
          <Image src={logo} alt="Meteora logo" width={100} height={22} />
        </Link>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">🔍 Buscar</Link>
          </li>
          <li>Nossas Lojas</li>
          <li>Novidades</li>
          <li>Promoções</li>
        </ul>
      </nav>
      <div className={styles.search}>
        <form onSubmit={handleSearch}>
          <Input
            variant="header"
            placeholder="Digite o produto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="primary" size="medium">
            Buscar
          </Button>
        </form>
      </div>
    </header>
  );
};
