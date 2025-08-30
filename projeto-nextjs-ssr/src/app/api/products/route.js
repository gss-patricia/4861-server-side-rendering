import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") || 10;

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
        created_at
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    // Filtrar por categoria se fornecida
    if (category) {
      query = query.eq("category_id", category);
    }

    // Para produtos em destaque
    const featured = searchParams.get("featured");
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return NextResponse.json(
        { error: "Erro ao buscar produtos" },
        { status: 500 }
      );
    }

    // Transformar dados para o formato esperado pelo frontend
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageSrc: product.image_src,
      colors: product.colors || [],
      sizes: product.sizes || [],
      categoryId: product.category_id,
      isFeatured: product.is_featured,
    }));

    return NextResponse.json(formattedProducts, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (ISR gerencia o cache)
      },
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
