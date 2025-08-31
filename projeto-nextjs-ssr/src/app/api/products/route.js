import { fetchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // 🔧 Extrair parâmetros
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    // 📊 Usar DATA LAYER (já retorna formato padrão com parsers)
    const products = await fetchProducts({
      limit,
      category_id: category,
      featured_only: featured,
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (ISR gerencia o cache)
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de produtos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
