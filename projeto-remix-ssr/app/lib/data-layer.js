import { supabase } from "./supabase.js";

/**
 * 📊 DATA LAYER - MESMO CONTRATO DO NEXT.JS
 *
 * ✅ JavaScript puro (sem TypeScript)
 * ✅ Usa APENAS SUPABASE
 * ✅ Mantém contrato das APIs do Next.js
 * ✅ Parsers automáticos: snake_case → camelCase
 * ✅ Compatible com loaders do React Router v7
 */

// 🔄 PARSERS inline para manter tudo junto (JavaScript puro)
const parseCategory = (raw) => ({
  id: raw.id,
  name: raw.name,
  imageSrc: raw.image_src, // snake_case → camelCase
});

const parseProduct = (raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  price: raw.price,
  imageSrc: raw.image_src, // snake_case → camelCase
  colors: raw.colors || [],
  sizes: raw.sizes || [],
  categoryId: raw.category_id, // snake_case → camelCase
  isFeatured: raw.is_featured, // snake_case → camelCase
  category: raw.category
    ? {
        id: raw.category.id,
        name: raw.category.name,
      }
    : null,
});

// 🗂️ Buscar categorias (MESMO CONTRATO do /api/categories do Next.js)
export const fetchCategories = async () => {
  try {
    console.log("🔍 Buscando categorias no Supabase...");

    const { data: rawCategories, error } = await supabase
      .from("categories")
      .select("id, name, image_src")
      .order("name");

    if (error) {
      console.error("❌ Erro ao buscar categorias:", error);
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }

    console.log(`✅ ${rawCategories?.length || 0} categorias encontradas`);
    return rawCategories?.map(parseCategory) || [];
  } catch (error) {
    console.error("💥 Erro no fetchCategories:", error);
    throw error;
  }
};

// 🛍️ Buscar produtos (MESMO CONTRATO do /api/products do Next.js)
export const fetchProducts = async (options = {}) => {
  try {
    const {
      limit = 6,
      featured = false, // next.js usa "featured", não "featured_only"
      category,
    } = options;

    console.log(
      `🔍 Buscando ${limit} produtos${featured ? " em destaque" : ""} no Supabase...`
    );

    let query = supabase
      .from("products")
      .select(
        "id, name, description, price, image_src, is_featured, colors, sizes, category_id"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (featured) {
      query = query.eq("is_featured", true);
    }

    if (category) {
      query = query.eq("category_id", category);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: rawProducts, error } = await query;

    if (error) {
      console.error("❌ Erro ao buscar produtos:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    console.log(`✅ ${rawProducts?.length || 0} produtos encontrados`);
    return rawProducts?.map(parseProduct) || [];
  } catch (error) {
    console.error("💥 Erro no fetchProducts:", error);
    throw error;
  }
};

// 🔍 Buscar produto individual por ID
export const fetchProductById = async (productId) => {
  try {
    console.log(`🔍 Buscando produto ${productId} no Supabase...`);

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
      console.error("❌ Erro ao buscar produto:", error);
      if (error.code === "PGRST116") {
        return null; // Produto não encontrado
      }
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }

    console.log(`✅ Produto encontrado: ${rawProduct?.name}`);
    return parseProduct(rawProduct);
  } catch (error) {
    console.error("💥 Erro no fetchProductById:", error);
    throw error;
  }
};

// 🔍 Buscar produtos por termo (MESMO CONTRATO DO NEXT.JS)
export const searchProducts = async (searchTerm, options = {}) => {
  try {
    const { limit = 20 } = options;

    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    console.log(`🔍 Buscando produtos com termo: "${searchTerm}"`);

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
        category_id
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

    console.log(`✅ ${rawProducts?.length || 0} produtos encontrados na busca`);
    return rawProducts?.map(parseProduct) || [];
  } catch (error) {
    console.error("💥 Erro no searchProducts:", error);
    throw error;
  }
};
