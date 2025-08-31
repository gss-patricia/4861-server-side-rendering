"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "../../hooks/useSearch";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { ProductCard } from "../components/ProductCard";
import styles from "./search.module.css";

// 🔧 Componente interno que usa useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    isEmpty,
    hasResults,
    setQuery,
    clearSearch,
  } = useSearch(initialQuery, 300); // 300ms debounce

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔍 Buscar Produtos</h1>
        <p>Encontre o que você procura em nosso catálogo</p>
      </div>

      <div className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <Input
            variant="search"
            placeholder="Digite o nome do produto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="small"
              className={styles.clearButton}
              aria-label="Limpar busca"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      <div className={styles.searchStatus}>
        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner}></span>
            <span>Buscando produtos...</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span>⚠️ {error}</span>
            <Button
              onClick={() => setQuery(query)}
              variant="danger"
              size="small"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {hasSearched && !loading && hasResults && (
          <div className={styles.resultCount}>
            <span>✅ {results.length} produto(s) encontrado(s)</span>
          </div>
        )}

        {isEmpty && (
          <div className={styles.noResults}>
            <span>🔍 Nenhum produto encontrado para &quot;{query}&quot;</span>
            <p>Tente buscar por:</p>
            <ul>
              <li>Termos mais genéricos</li>
              <li>Categoria diferente</li>
              <li>Verificar a ortografia</li>
            </ul>
          </div>
        )}
      </div>

      {hasResults && (
        <div className={styles.results}>
          <div className={styles.productsGrid}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Estado inicial (sem busca) */}
      {!hasSearched && !loading && (
        <div className={styles.welcomeState}>
          <div className={styles.welcomeIcon}>🔍</div>
          <h2>Comece a digitar para buscar</h2>
          <p>Digite pelo menos 2 caracteres para ver os resultados</p>
          <div className={styles.searchTips}>
            <h3>💡 Dicas:</h3>
            <ul>
              <li>Use palavras-chave relacionadas ao produto</li>
              <li>A busca é automática conforme você digita</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// 🌟 Componente principal com Suspense boundary
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>🔍 Buscar Produtos</h1>
            <p>Carregando página de busca...</p>
          </div>
          <div className={styles.loading}>
            <span className={styles.spinner}></span>
            <span>Preparando busca...</span>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
