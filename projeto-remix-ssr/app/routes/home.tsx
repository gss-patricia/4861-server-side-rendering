import type { Route } from "./+types/home";
import { CategoryGrid } from "../components/CategoryGrid";
import { ProductGrid } from "../components/ProductGrid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "E-commerce SSR - React Router v7" },
    {
      name: "description",
      content: "E-commerce com SSR usando React Router v7 (Remix)",
    },
  ];
}

export default function Home() {
  // Dados mockados para demonstração inicial
  const categories = [
    {
      id: "1",
      name: "Camisetas",
      image_src: "https://via.placeholder.com/130x157",
    },
    {
      id: "2",
      name: "Bolsas",
      image_src: "https://via.placeholder.com/130x157",
    },
    {
      id: "3",
      name: "Calçados",
      image_src: "https://via.placeholder.com/130x157",
    },
  ];

  const products = [
    {
      id: "1",
      name: "Camiseta Conforto",
      description:
        "Multicores e tamanhos. Tecido de algodão 100%, fresquinho para o verão.",
      price: "R$ 70,00",
      image_src: "https://via.placeholder.com/350x422",
      is_featured: true,
    },
    {
      id: "2",
      name: "Calça Alfaiataria",
      description:
        "Modelo Wide Leg alfaiataria em linho. Uma peça pra vida toda!",
      price: "R$ 180,00",
      image_src: "https://via.placeholder.com/350x422",
    },
  ];

  return (
    <main>
      <CategoryGrid categories={categories} />
      <ProductGrid products={products} />
    </main>
  );
}
