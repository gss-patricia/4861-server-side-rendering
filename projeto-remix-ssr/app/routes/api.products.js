import { fetchProducts } from "../lib/data-layer.js";

/**
 * 🌐 API ROUTE - /api/products
 *
 * ✅ MESMO CONTRATO do Next.js /api/products
 * ✅ BFF: API interna que chama Supabase
 * ✅ Suporte a query params: limit, category, featured
 * ✅ JavaScript puro (sem TypeScript)
 * ✅ Usado pelo loader da Home
 */

export async function loader({ request }) {
  try {
    console.log("🌐 API /api/products chamada");

    const url = new URL(request.url);

    // 🔧 Extrair query params (mesmo contrato do Next.js)
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const featured = url.searchParams.get("featured") === "true";

    console.log("📋 Parâmetros:", { category, limit, featured });

    // 📊 Usar DATA LAYER (já testamos - está funcionando!)
    const products = await fetchProducts({
      limit,
      category, // category_id no Supabase
      featured, // featured_only internamente
    });

    return Response.json(products, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (loader gerencia)
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de produtos:", error);

    return Response.json(
      { error: "Erro interno do servidor" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
