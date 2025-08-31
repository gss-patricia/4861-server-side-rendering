import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || 20), 50); // Máx 50

    // 🔍 Se não tem query, retorna array vazio
    if (!query || query.length < 2) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    // 🗃️ Query base no Supabase
    let supabaseQuery = supabase
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
        is_featured
      `
      )
      .eq("is_active", true)
      .limit(limit);

    // 🔍 Busca por nome OU descrição (case insensitive)
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );

    // 📂 Filtro por categoria (opcional)
    if (category && category !== "all") {
      supabaseQuery = supabaseQuery.eq("category_id", parseInt(category));
    }

    // ⏰ Ordenar por relevância (featured first, depois nome)
    supabaseQuery = supabaseQuery
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true });

    const { data: products, error } = await supabaseQuery;

    if (error) {
      console.error("Erro na busca:", error);
      return NextResponse.json(
        { error: "Erro na busca de produtos" },
        { status: 500 }
      );
    }

    // 🎨 Formatar resultados
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
        "Cache-Control": "no-store", // CSR não precisa de cache
      },
    });
  } catch (error) {
    console.error("Erro interno na busca:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
