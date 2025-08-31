import { supabase } from "./supabase.js";
import {
  parseCategories,
  parseProducts,
  parseProduct,
  parseStaticParams,
  parseSearchResults,
} from "./parsers.js";

/**
 * 📊 DATA LAYER - CATEGORIAS: Supabase | PRODUTOS: API Externa + ISR
 *
 * ✅ CATEGORIAS: Supabase direto (sem ISR, mudam pouco)
 * ✅ PRODUTOS: API Externa (npoint) com ISR (60s)
 * ✅ Retorna dados já no formato padrão
 * ✅ ISR funciona: API externa sempre disponível (build + runtime)
 */

// 🗂️ Buscar categorias - SUPABASE DIRETO
export const fetchCategories = async () => {
  try {
    const { data: rawCategories, error } = await supabase
      .from("categories")
      .select("id, name, image_src")
      .order("name");

    if (error) {
      console.error("❌ Erro ao buscar categorias do Supabase:", error);
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }

    return parseCategories(rawCategories);
  } catch (error) {
    console.error("💥 Erro no fetchCategories:", error);
    throw error;
  }
};

// 🛍️ Buscar produtos - API EXTERNA (npoint) com ISR
export const fetchProducts = async (options = {}) => {
  try {
    const { limit = 6, featured_only = false } = options;

    // 🔗 API Externa (npoint) - SEMPRE disponível
    const apiUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
    console.log("apiUrl", apiUrl);

    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_PRODUCTS_API_URL não configurada");
    }

    // ✅ ISR via fetch (API externa sempre disponível em build + runtime)
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // ISR: 1min para produtos
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar produtos da API externa: ${response.status}`
      );
    }

    let products = await response.json();

    // 🔧 Aplicar filtros localmente (API externa não tem query params)
    if (featured_only) {
      products = products.filter((product) => product.isFeatured);
    }

    if (limit && limit < products.length) {
      products = products.slice(0, limit);
    }

    return products;
  } catch (error) {
    console.error("💥 Erro no fetchProducts:", error);
    throw error;
  }
};

// 🔍 Buscar produto individual por ID
export const fetchProductById = async (productId) => {
  try {
    const { data: rawProduct, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        price, 
        image_src,
        colors,
        sizes,
        category_id,
        is_featured,
        category:categories(id, name)
      `
      )
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar produto do Supabase:", error);
      if (error.code === "PGRST116") {
        return null; // Produto não encontrado
      }
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }

    // 🔄 Parser aplicado: snake_case → camelCase, formato consistente
    return parseProduct(rawProduct);
  } catch (error) {
    console.error("💥 Erro no fetchProductById:", error);
    throw error;
  }
};

// 📋 Buscar todos os produtos para generateStaticParams
export const fetchAllProducts = async () => {
  try {
    const { data: rawProducts, error } = await supabase
      .from("products")
      .select("id, name")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("❌ Erro ao buscar todos os produtos:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    // 🔄 Parser para generateStaticParams: formato {slug: "id"}
    return parseStaticParams(rawProducts);
  } catch (error) {
    console.error("💥 Erro no fetchAllProducts:", error);
    throw error;
  }
};

// 🔍 Buscar produtos por termo de busca
export const searchProducts = async (searchTerm, options = {}) => {
  try {
    const { limit = 20 } = options;

    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const { data: rawProducts, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        price,
        image_src,
        is_featured,
        colors,
        sizes,
        category_id,
        category:categories(id, name)
      `
      )
      .eq("is_active", true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order("is_featured", { ascending: false })
      .order("name")
      .limit(limit);

    if (error) {
      console.error("❌ Erro na busca de produtos:", error);
      throw new Error(`Erro na busca: ${error.message}`);
    }

    // 🔄 Parser aplicado: snake_case → camelCase + contexto de busca
    return parseSearchResults(rawProducts, searchTerm);
  } catch (error) {
    console.error("💥 Erro no searchProducts:", error);
    throw error;
  }
};
