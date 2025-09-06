# 🎓 CURSO PRÁTICO: REACT ROUTER V7 (REMIX) - SSR & STREAMING

## **📚 ESTRUTURA DO CURSO - 3 AULAS (3h)**

### **🎥 AULA 1: HISTÓRIA & FUNDAMENTOS (1h)**

**CONTEXTO:** De onde veio o Remix e por que se tornou React Router v7?
**PROBLEMA:** Entender o ecossistema e quando usar cada mode
**SOLUÇÃO:** Overview histórico + estrutura do projeto + conceitos fundamentais

**ATIVIDADES:**

1. **História do Remix (15min):**
   - **2020:** Kent C. Dodds + Ryan Florence criam Remix (pago)
   - **2022:** Open source, foco em Web Standards
   - **2024:** Merger com React Router → v7
   - **Filosofia:** "Use the platform" (HTML forms, HTTP, etc.)

2. **3 Modes do React Router v7 (20min):**

   ```typescript
   // 1. FRAMEWORK MODE (Remix completo)
   // → SSR, file-based routing, loaders, actions
   // → Usar para: E-commerce, blogs, aplicações completas

   // 2. DATA MODE (SPA + data loading)
   // → Cliente-side routing + centralized data
   // → Usar para: Dashboards, admin panels

   // 3. DECLARATIVE MODE (React Router tradicional)
   // → <Route> components, sem data loading
   // → Usar para: Aplicações simples, migração gradual
   ```

3. **Estrutura do Projeto Framework Mode (15min):**

   ```
   app/
     components/        ← Componentes de UI (já prontos)
       Header/
       ProductCard/
       CategoryGrid/
     routes/            ← File-based routing
       home.tsx         ← "/" route
       api.products.ts  ← "/api/products" resource
     lib/
       supabase.js      ← Configuração DB
     root.tsx           ← Layout raiz
   ```

4. **Conceitos Fundamentais SSR (10min):**
   - **Loaders:** substituem `getServerSideProps` (Next.js)
   - **Actions:** substituem `getServerSideProps` + POST
   - **Resource Routes:** APIs integradas ao file routing
   - **Streaming:** Progressive loading com Suspense

**TEORIA:** React Router v7 = Remix philosophy + React Router ecosystem, SSR nativo com Web Standards

---

### **🎥 AULA 2: SSR COM LOADERS (1h)**

**CONTEXTO:** Como implementar SSR real, onde dados vêm do servidor
**PROBLEMA:** Página branca + loading → UX ruim, SEO zero
**SOLUÇÃO:** Loaders pattern para buscar dados no servidor antes do render

**ATIVIDADES:**

1. **Resource Routes - APIs Internas (20min):**

   ```typescript
   // app/routes/api.categories.ts
   import type { LoaderFunctionArgs } from "react-router";
   import { json } from "react-router";
   import { supabase } from "~/lib/supabase";

   export async function loader({ request }: LoaderFunctionArgs) {
     const { data: categories } = await supabase.from("categories").select("*");

     return json({ categories });
   }

   // app/routes/api.products.ts
   export async function loader({ request }: LoaderFunctionArgs) {
     const { data: products } = await supabase
       .from("products")
       .select("*")
       .limit(12);

     return json({ products });
   }
   ```

2. **Home Route com SSR (25min):**

   ```typescript
   // app/routes/home.tsx
   import type { LoaderFunctionArgs } from "react-router";
   import { json, useLoaderData } from "react-router";
   import { supabase } from "~/lib/supabase";
   import { CategoryGrid } from "~/components/CategoryGrid";
   import { ProductGrid } from "~/components/ProductGrid";

   export async function loader({ request }: LoaderFunctionArgs) {
     // Busca paralela no servidor
     const [categoriesRes, productsRes] = await Promise.all([
       supabase.from("categories").select("*"),
       supabase.from("products").select("*").limit(12)
     ]);

     return json({
       categories: categoriesRes.data || [],
       products: productsRes.data || []
     });
   }

   export default function Home() {
     const { categories, products } = useLoaderData<typeof loader>();

     return (
       <main>
         <h1>E-commerce SSR</h1>
         <CategoryGrid categories={categories} />
         <ProductGrid products={products} />
       </main>
     );
   }
   ```

3. **Demonstração SSR Real (15min):**
   - **Desabilitar JS:** Página funciona 100%
   - **view-source:** HTML completo com dados
   - **Network:** Zero requests AJAX
   - **Comparar:** SPA (loading) vs SSR (instant)

**TEORIA:** Loaders = `getServerSideProps` do Next.js, executam no servidor, dados chegam prontos no HTML

---

### **🎥 AULA 3: STREAMING AVANÇADO (1h)**

**CONTEXTO:** SSR bloqueia tudo até o dado mais lento estar pronto
**PROBLEMA:** Categorias carregam rápido, produtos demoram → usuário espera tudo
**SOLUÇÃO:** Streaming = mostrar partes da página conforme ficam prontas

**ATIVIDADES:**

1. **Defer Pattern - Streaming (30min):**

   ```typescript
   // app/routes/home.tsx
   import { defer, Await } from "react-router";
   import { Suspense } from "react";

   export async function loader({ request }: LoaderFunctionArgs) {
     // ESTRATÉGIA: Dados rápidos = await, dados lentos = Promise

     // Categorias (rápido) → bloquear renderização
     const categoriesPromise = supabase.from("categories").select("*");

     // Produtos (lento) → streamear depois
     const productsPromise = supabase
       .from("products")
       .select("*, categories(*)")
       .limit(20);

     return defer({
       categories: await categoriesPromise.data,  // await = HTML inicial
       products: productsPromise.data             // Promise = stream
     });
   }

   export default function Home() {
     const { categories, products } = useLoaderData<typeof loader>();

     return (
       <main>
         <h1>E-commerce Streaming</h1>

         {/* Renderiza imediatamente */}
         <CategoryGrid categories={categories} />

         {/* Vai "streamear" quando resolver */}
         <Suspense fallback={<ProductsSkeleton />}>
           <Await resolve={products}>
             {(resolvedProducts) => (
               <ProductGrid products={resolvedProducts} />
             )}
           </Await>
         </Suspense>
       </main>
     );
   }
   ```

2. **Skeleton Loading States (20min):**

   ```typescript
   // app/components/ProductsSkeleton/index.tsx
   export function ProductsSkeleton() {
     return (
       <div className="products-grid">
         {Array.from({ length: 12 }).map((_, i) => (
           <div key={i} className="skeleton-card">
             <div className="skeleton-image" />
             <div className="skeleton-text" />
             <div className="skeleton-price" />
           </div>
         ))}
       </div>
     );
   }
   ```

3. **Demonstração Streaming (10min):**
   - **Network throttling:** Slow 3G
   - **Mostrar:** Categorias aparecem instant
   - **Mostrar:** Skeleton carrega
   - **Mostrar:** Produtos "fazem stream" progressivamente
   - **Comparar:** SSR normal (tudo junto) vs Streaming

**TEORIA:** Streaming melhora perceived performance - usuário vê progresso, não loading infinito

---

## **🎯 CONCEITOS COBERTOS:**

✅ **História & Context:** De onde veio o Remix, por que virou React Router v7
✅ **Framework vs Data vs Declarative:** Quando usar cada mode  
✅ **File-based Routing:** Convenção sobre configuração
✅ **Loaders:** Substituem getServerSideProps, executam no servidor
✅ **Resource Routes:** APIs integradas ao file routing
✅ **SSR Real:** HTML completo, funciona sem JavaScript
✅ **Streaming:** defer + Suspense + Await para UX otimizada
✅ **Progressive Enhancement:** Funciona sem JS, melhora com JS

---

## **⚡ DIFERENCIAIS DO REACT ROUTER V7:**

1. **Unified:** Remix + React Router em um pacote só
2. **Zero Config:** Vite integrado, TypeScript, otimizações automáticas
3. **Streaming First:** Suspense nativo, não é addon
4. **Web Standards:** HTTP, HTML forms, progressive enhancement
5. **File-based:** Routing por convenção, não configuração

## **🕒 CRONOGRAMA TOTAL: 3h**

**PRÉ-REQUISITOS:** React básico + conceitos de SSR  
**RESULTADO FINAL:** E-commerce com SSR real + Streaming progressivo

**PROJETO ENTREGUE:** Base completa com componentes, Supabase, estrutura pronta para ensino prático
