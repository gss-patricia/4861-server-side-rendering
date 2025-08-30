import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";

const categorias = [
  {
    name: "Camisetas",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/camiseta.png",
  },
  {
    name: "Bolsas",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/bolsa.png",
  },
  {
    name: "Calçados",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/tenis.png",
  },
  {
    name: "Calças",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/calca.png",
  },
  {
    name: "Casacos",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/casaco.png",
  },
  {
    name: "Óculos",
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/oculos.png",
  },
];

const produtos = [
  {
    id: 1,
    name: "Camiseta conforto",
    colors: [
      {
        hexa: "#b39628",
        name: "Mostarda",
      },
    ],
    price: "R$ 70,00",
    size: ["P", "PP", "M", "G", "GG"],
    imageSrc:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/camiseta-conforto.jpeg",
    description:
      "Multicores e tamanhos. Tecido de algodão 100%, fresquinho para o verão. Modelagem unissex.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Categorias categorias={categorias} />
        <Produtos produtos={produtos} />
      </main>
    </div>
  );
}
