import { useLoaderData } from "react-router";
import { Suspense } from "react";
import { Await } from "react-router";
import { Categorias } from "../components/Categorias";
import { Produtos } from "../components/Produtos";

/**
 * Loader com streaming: Categorias (críticas) carregam imediatamente
 * Produtos (não-críticos) via Promise para streaming (React Router v7)
 */
export async function loader({ request }) {
  try {
    const baseUrl = new URL(request.url).origin;

    // 🚀 DADOS CRÍTICOS: Awaited - bloqueia render até carregar
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`);

    if (!categoriesResponse.ok) {
      throw new Error(
        `Erro na API de categorias: ${categoriesResponse.status}`
      );
    }

    const categorias = await categoriesResponse.json();

    // ⏳ DADOS NÃO-CRÍTICOS: Promise (não awaited) - streaming
    // 🎓 DIDÁTICO: Delay artificial para ver o streaming funcionando
    const produtos = fetch(`${baseUrl}/api/products?limit=6`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na API de produtos: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 🕐 Delay de 3s para demonstrar streaming claramente
        return new Promise((resolve) => setTimeout(() => resolve(data), 3000));
      })
      .catch(() => []);

    // React Router v7: Retornar objeto com promises diretamente
    return {
      categorias,
      produtos, // Promise - será resolvida pelo <Await>
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      categorias: [],
      produtos: Promise.resolve([]),
      error: error.message || "Erro ao carregar dados",
      timestamp: new Date().toISOString(),
    };
  }
}

export function meta({}) {
  return [
    { title: "E-commerce SSR - React Router v7" },
    {
      name: "description",
      content: "E-commerce com SSR usando React Router v7",
    },
  ];
}

export default function Home() {
  const { categorias, produtos, error, timestamp } = useLoaderData();

  if (error) {
    return (
      <main>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#d32f2f",
            backgroundColor: "#ffebee",
            margin: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>Erro ao carregar dados</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div>
        <h1>🌊 React Router v7 - Streaming Demo</h1>

        {/* 🎯 SEÇÃO 1: Dados imediatos (SSR) */}
        <div
          style={{
            border: "2px solid #4CAF50",
            padding: "20px",
            margin: "10px 0",
            borderRadius: "8px",
            backgroundColor: "#f1f8e9",
          }}
        >
          <h2>✅ Categorias (Dados Críticos - SSR)</h2>
          <p>
            <small>⚡ Carregado imediatamente no servidor</small>
          </p>
          <Categorias categorias={categorias} />
        </div>

        {/* 🎯 SEÇÃO 2: Dados via streaming */}
        <div
          style={{
            border: "2px solid #FF9800",
            padding: "20px",
            margin: "10px 0",
            borderRadius: "8px",
            backgroundColor: "#fff3e0",
          }}
        >
          <h2>⏳ Produtos (Dados Não-Críticos - Streaming)</h2>
          <p>
            <small>🌊 Carregado via streaming após render inicial</small>
          </p>

          <Suspense fallback={<ProdutosLoadingDidatico />}>
            <Await resolve={produtos}>
              {(produtosData) => (
                <div>
                  <p style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    ✅ Produtos carregados via streaming!
                  </p>
                  <Produtos produtos={produtosData} />
                </div>
              )}
            </Await>
          </Suspense>
        </div>

        {/* Debug para demo */}
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "#9c27b0",
            color: "#fff",
            padding: "12px",
            fontSize: "14px",
            borderRadius: "8px",
            zIndex: 9999,
            maxWidth: "250px",
          }}
        >
          <strong>🎓 Demo Streaming:</strong>
          <br />
          📊 Categorias: {categorias.length} (imediato)
          <br />⏰ Iniciado: {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </main>
  );
}

function ProdutosLoading() {
  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        margin: "20px 0",
        borderRadius: "8px",
        border: "2px dashed #ccc",
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: "30px",
          height: "30px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #9c27b0",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: "10px", color: "#666" }}>Carregando produtos...</p>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
        }}
      />
    </div>
  );
}
