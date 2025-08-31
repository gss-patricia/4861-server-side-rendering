import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import {
  buildApiUrl,
  createFetchConfig,
  API_ENDPOINTS,
  ISR_CONFIG,
} from "../../lib/config";

// Função para buscar categorias da API interna (BFF)
const fetchCategories = async () => {
  const response = await fetch(
    buildApiUrl(API_ENDPOINTS.CATEGORIES),
    createFetchConfig(ISR_CONFIG.CATEGORIES_TTL, ["categories"])
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar categorias: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

// Função para buscar produtos da API interna (BFF)
const fetchProducts = async () => {
  const response = await fetch(
    buildApiUrl(API_ENDPOINTS.PRODUCTS, { limit: 6 }),
    createFetchConfig(ISR_CONFIG.PRODUCTS_TTL, [
      "products",
      "featured-products",
    ])
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar produtos: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

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
