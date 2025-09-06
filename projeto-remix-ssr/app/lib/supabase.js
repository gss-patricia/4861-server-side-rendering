import { createClient } from "@supabase/supabase-js";

/**
 * 🗄️ SUPABASE CLIENT - React Router v7
 *
 * ✅ Cliente JavaScript puro (sem TypeScript)
 * ✅ Variáveis de ambiente com Vite
 * ✅ Mesmas credenciais do projeto Next.js
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
