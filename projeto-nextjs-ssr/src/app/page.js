import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { fetchCategories, fetchProducts } from "../../lib/data-layer";

// 🌟 Página com SSG + ISR para PRODUTOS via API Externa
export default async function Home() {
  // 🗂️ CATEGORIAS: Supabase direto (sem ISR)
  // 🛍️ PRODUTOS: API externa (npoint) com ISR (60s) ✅
  const [categorias, produtos] = await Promise.all([
    fetchCategories(), // ← Supabase direto (sem revalidate)
    fetchProducts({ limit: 6 }), // ← API externa com next: { revalidate: 60 }
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Categorias categorias={categorias} />
        <Produtos produtos={produtos} />
      </main>
    </div>
  );
}

// Metadados para SEO (gerados estaticamente)
export const metadata = {
  title: "Meteora - Loja de Roupas | Últimas Tendências",
  description:
    "Descubra as últimas tendências em moda na Meteora. Camisetas, bolsas, calçados e muito mais com qualidade e estilo.",
  keywords: "moda, roupas, camisetas, bolsas, calçados, meteora",
  openGraph: {
    title: "Meteora - Loja de Roupas",
    description: "As últimas tendências em moda você encontra aqui!",
    type: "website",
  },
};

// ❌ REMOVIDO: export const revalidate = 60;
// ✅ AGORA: ISR apenas para produtos via fetch da API externa
