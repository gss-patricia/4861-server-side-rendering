import styles from "./productGrid.module.css";
import { ProductCard } from "../ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image_src: string;
  is_featured?: boolean;
};

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <section className={styles.products}>
      <h2>Produtos que estão bombando!</h2>
      <div className={styles.container}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
