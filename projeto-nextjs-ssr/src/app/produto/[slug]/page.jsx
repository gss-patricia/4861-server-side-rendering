import styles from "./page.module.css";
import Produto from "@/app/components/Produto";

// 🏗️ Função para buscar produto individual - DIRETO DO SUPABASE (para build)
async function getProduto(id) {
  // Durante o build, busca direto do Supabase (API interna não está rodando)
  const { supabase } = await import("../../../../lib/supabase");

  const { data: product, error } = await supabase
    .from("products")
    .select("name, description, price, image_src, colors, sizes")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    // Se produto não encontrado
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar produto: ${error.message}`);
  }

  if (!product) {
    return null;
  }

  // ✅ Retorna direto do Supabase (nomes em inglês, sem duplicação)
  return product;
}

// 🏗️ Função para buscar todos os produtos - DIRETO DO SUPABASE (para generateStaticParams)
async function getAllProducts() {
  // Durante o build, busca direto do Supabase (API interna não está rodando)
  const { supabase } = await import("../../../../lib/supabase");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, is_active")
    .eq("is_active", true)
    .limit(1000);

  if (error) {
    console.error("Erro ao buscar produtos no build:", error);
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }

  return products || [];
}

export default async function ProdutoPage({ params }) {
  const produto = await getProduto(params.slug);

  // Se produto não encontrado, mostrar 404
  if (!produto) {
    return (
      <main className={styles.main}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Produto não encontrado</h1>
          <p>O produto que você está procurando não existe ou foi removido.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Produto produto={produto} />
    </main>
  );
}

// 🏗️ Gera páginas estáticas para todos os produtos no build time
export async function generateStaticParams() {
  try {
    const produtos = await getAllProducts();

    return produtos.map((produto) => ({
      slug: produto.id.toString(),
    }));
  } catch (error) {
    console.error("Erro no generateStaticParams:", error);
    // Retorna array vazio para evitar quebrar o build
    return [];
  }
}
