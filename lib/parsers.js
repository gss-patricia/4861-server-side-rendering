/**
 * PARSERS/MAPPERS - Transformação de dados do Supabase para formato padrão
 *
 * Responsabilidade única: transformar dados
 * Reutilizável em Data Layer, APIs, etc.
 * Formato consistente em toda aplicação
 */

// Parser para Categorias
export const parseCategory = (rawCategory) => {
  if (!rawCategory) return null;

  return {
    id: rawCategory.id,
    name: rawCategory.name,
    imageSrc: rawCategory.image_src, // snake_case → camelCase
  };
};

// Parser para lista de Categorias
export const parseCategories = (rawCategories) => {
  if (!Array.isArray(rawCategories)) return [];

  return rawCategories.map(parseCategory).filter(Boolean);
};

// Parser para Produtos
export const parseProduct = (rawProduct) => {
  if (!rawProduct) return null;

  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    price: rawProduct.price,
    imageSrc: rawProduct.image_src, // snake_case → camelCase
    colors: rawProduct.colors || [],
    sizes: rawProduct.sizes || [],
    categoryId: rawProduct.category_id, // snake_case → camelCase
    isFeatured: rawProduct.is_featured, // snake_case → camelCase
    category: rawProduct.category
      ? {
          id: rawProduct.category.id,
          name: rawProduct.category.name,
        }
      : null,
  };
};

// Parser para lista de Produtos
export const parseProducts = (rawProducts) => {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts.map(parseProduct).filter(Boolean);
};
