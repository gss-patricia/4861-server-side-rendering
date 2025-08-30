import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";

// Função para buscar categorias da API interna (BFF)
async function fetchCategories() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/categories`, {
    next: {
      revalidate: 1800, // ISR: revalidar a cada 30 MINUTOS (produção)
      tags: ["categories"], // Tag para revalidação manual
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar categorias: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// Função para buscar produtos da API interna (BFF)
async function fetchProducts() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/products?featured=true&limit=6`,
    {
      next: {
        revalidate: 1800, // ISR: revalidar a cada 30 MINUTOS (produção)
        tags: ["products", "featured-products"], // Tags para revalidação manual
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar produtos: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// 🌟 Página com SSG + ISR
export default async function Home() {
  // Buscar dados no build time e revalidar conforme TTL
  const [categorias, produtos] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
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
