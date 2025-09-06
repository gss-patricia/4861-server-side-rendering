import styles from "./categoryGrid.module.css";

type Category = {
  id: string;
  name: string;
  image_src: string;
};

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className={styles.categories}>
      <h2>Busque por categoria:</h2>
      <div className={styles.container}>
        {categories.map((category) => (
          <div key={category.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img
                width={130}
                height={157}
                src={category.image_src}
                alt={category.name}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <p className={styles.title}>{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
