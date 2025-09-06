import { Link } from "react-router";
import { useState } from "react";
import styles from "./header.module.css";
import logo from "./logo.png";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // No React Router v7, navegação será feita via Link ou Form
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = "/search";
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/">
          <img src={logo} alt="Meteora logo" width={100} height={22} />
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
          <input
            className={styles.searchInput}
            placeholder="Digite o produto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}
