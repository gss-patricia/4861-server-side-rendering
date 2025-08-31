import { searchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // Máx 50

    // 🔍 Se não tem query, retorna array vazio
    if (!query || query.length < 2) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    // 📊 Usar DATA LAYER (já retorna formato padrão com parsers + contexto de busca)
    const products = await searchProducts(query, { limit });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // CSR não precisa de cache
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de busca:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
