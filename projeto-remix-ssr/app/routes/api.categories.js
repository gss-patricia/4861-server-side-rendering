import { fetchCategories } from "../lib/data-layer.js";

/**
 * 🌐 API ROUTE - /api/categories
 *
 * ✅ MESMO CONTRATO do Next.js /api/categories
 * ✅ BFF: API interna que chama Supabase
 * ✅ JavaScript puro (sem TypeScript)
 * ✅ Usado pelo loader da Home
 */

export async function loader() {
  try {
    console.log("🌐 API /api/categories chamada");

    // 📊 Usar DATA LAYER (já testamos - está funcionando!)
    const categories = await fetchCategories();

    return Response.json(categories, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (loader gerencia)
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de categorias:", error);

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
