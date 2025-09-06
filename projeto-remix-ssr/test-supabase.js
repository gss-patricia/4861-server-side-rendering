// 🧪 TESTE DE CONEXÃO SUPABASE
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Carregar .env manualmente para Node.js
config();

// No Node.js, as variáveis VITE_ não são carregadas automaticamente
// Vamos verificar diretamente do .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Debug: mostrar todas as variáveis env que começam com VITE_
console.log("🔍 Variáveis de ambiente disponíveis:");
Object.keys(process.env)
  .filter((key) => key.startsWith("VITE_"))
  .forEach((key) => {
    console.log(`${key}: ${process.env[key] ? "✅ Definida" : "❌ Vazia"}`);
  });

console.log("🔍 Testando conexão Supabase...");
console.log("URL:", supabaseUrl ? "✅ Configurada" : "❌ Não encontrada");
console.log("Key:", supabaseAnonKey ? "✅ Configurada" : "❌ Não encontrada");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Teste 1: Buscar categorias
console.log("\n📋 Testando busca de categorias...");
try {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .limit(3);

  if (error) {
    console.error("❌ Erro:", error.message);
  } else {
    console.log("✅ Categorias encontradas:", categories?.length || 0);
    console.log("📄 Dados:", categories);
  }
} catch (err) {
  console.error("💥 Erro na conexão:", err.message);
}

// Teste 2: Buscar produtos
console.log("\n🛍️ Testando busca de produtos...");
try {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price")
    .eq("is_active", true)
    .limit(2);

  if (error) {
    console.error("❌ Erro:", error.message);
  } else {
    console.log("✅ Produtos encontrados:", products?.length || 0);
    console.log("📄 Dados:", products);
  }
} catch (err) {
  console.error("💥 Erro na conexão:", err.message);
}

console.log("\n🎯 Teste concluído!");
