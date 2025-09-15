import { supabase } from "./supabase.js";
import {
  parseCategories,
  parseProducts,
  parseProduct,
  parseStaticParams,
  parseSearchResults,
} from "./parsers.js";

// Buscar categorias - SUPABASE DIRETO
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

// Buscar produtos - SUPABASE SSR PURO (sem cache)
export const fetchProducts = async (options = {}) => {
  try {
    const { limit = 6, featured_only = false } = options;

    let query = supabase
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
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    // Filtro por featured se solicitado
    if (featured_only) {
      query = query.eq("is_featured", true);
    }

    // Aplicar limite
    query = query.limit(limit);

    const { data: rawProducts, error } = await query;

    if (error) {
      console.error("❌ Erro ao buscar produtos do Supabase:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return parseProducts(rawProducts);
  } catch (error) {
    console.error("💥 Erro no fetchProducts:", error);
    throw error;
  }
};
