/**
 * 🌐 Configurações da aplicação
 */

// 🌍 Base URL para APIs internas (BFF)
export const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Endpoints da API
export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  PRODUCTS: "/api/products",
};

// ⏰ Configurações de ISR
export const ISR_CONFIG = {
  CATEGORIES_TTL: 7200, // 2 horas
  PRODUCTS_TTL: 1800, // 30 minutos
  DEFAULT_TTL: 3600, // 1 hora
};

// 🔧 Utilitário para construir URLs completas
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL);

  // Adicionar query parameters se fornecidos
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
};

// 📊 Configurações padrão para fetch com ISR
export const createFetchConfig = (ttl = ISR_CONFIG.DEFAULT_TTL, tags = []) => ({
  next: {
    revalidate: ttl,
    tags: Array.isArray(tags) ? tags : [tags],
  },
});
