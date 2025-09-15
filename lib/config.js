export const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  PRODUCTS: "/api/products",
};

// Utilitário para construir URLs completas
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL);

  // Adicionar query parameters se fornecidos
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
};
