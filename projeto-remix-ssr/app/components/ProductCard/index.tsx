import { Link } from "react-router";
import styles from "./productCard.module.css";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image_src: string;
  is_featured?: boolean;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  console.log(product);
  return (
    <div className={styles.card}>
      <figure style={{ position: "relative" }}>
        <img
          width={350}
          height={422}
          src={product.image_src}
          alt={product.name}
          className={styles.image}
        />
        {product.is_featured && (
          <span className={styles.badge}>⭐ Destaque</span>
        )}
      </figure>
      <section className={styles.info}>
        <p className={styles.title}>{product.name}</p>
        <div className={styles.description}>{product.description}</div>
        <div className={styles.price}>{product.price}</div>
        <Link to={`/produto/${product.id}`} className={styles.button}>
          Ver mais
        </Link>
      </section>
    </div>
  );
}
