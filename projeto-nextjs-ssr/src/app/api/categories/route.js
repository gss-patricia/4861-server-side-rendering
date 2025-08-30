import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Buscar categorias do Supabase SEM cache (evita cache em cascata)
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return NextResponse.json(
        { error: "Erro ao buscar categorias" },
        { status: 500 }
      );
    }

    // Retorna com headers para cache no CDN se desejar
    return NextResponse.json(categories, {
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
