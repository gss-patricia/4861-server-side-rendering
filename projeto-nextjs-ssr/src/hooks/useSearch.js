"use client";

import { useState, useEffect, useCallback } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../../lib/config";

// Hook customizado para busca com debounce
export const useSearch = (initialQuery = "", debounceMs = 500) => {
  // 📊 Estados
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce do query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Função para fazer a busca
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = { q: searchQuery.trim(), limit: 20 };
      const url = buildApiUrl(API_ENDPOINTS.SEARCH, params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Erro na busca:", err);
      setError(err.message || "Erro ao buscar produtos");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger automático quando debounced query muda
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Função para limpar busca
  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setLoading(false);
  }, []);

  return {
    // Estados
    query,
    results,
    loading,
    error,
    hasSearched,

    // Ações
    setQuery,
    clearSearch,

    // Utilitários
    isEmpty: results.length === 0 && hasSearched && !loading,
    isSearching: loading,
    hasResults: results.length > 0,
  };
};
