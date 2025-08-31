import { supabase } from "../../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validar se o ID foi fornecido
    if (!id) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar produto individual no Supabase
    const { data: product, error } = await supabase
      .from("products")
      .select("name, description, price, image_src, colors, sizes")
      .eq("id", id)
      .eq("is_active", true)
      .single(); // single() porque esperamos apenas 1 resultado

    if (error) {
      console.error("Erro ao buscar produto:", error);

      // Se produto não encontrado
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Erro ao buscar produto" },
        { status: 500 }
      );
    }

    // ✅ Retorna direto do Supabase (nomes em inglês, sem duplicação)
    return NextResponse.json(product, {
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
