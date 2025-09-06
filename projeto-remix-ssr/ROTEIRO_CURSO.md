# 🎓 REACT ROUTER V7 (REMIX) - SSR & STREAMING

---

## **🎬 VÍDEO 1 - HISTÓRIA E FUNDAMENTOS**

**[Contexto]**  
Remix nasceu em 2020 como framework pago focado em Web Standards. Em 2024, se fundiu ao React Router criando a v7, unificando o melhor dos dois mundos: SSR robusto + routing familiar.

**[Problema]**  
Desenvolvedores usam SPAs que prejudicam SEO e performance. Precisam de SSR real, mas Next.js é complexo. Como ter SSR simples e performático?

**[Solução]**  
React Router v7 Framework Mode oferece SSR nativo com file-based routing, loaders para buscar dados no servidor, e streaming para UX otimizada.

**[Teoria]**  
Framework Mode usa convenção sobre configuração: rotas = arquivos, loaders = getServerSideProps, Progressive Enhancement = funciona sem JS.

---

## **🎬 VÍDEO 2 - SSR COM LOADERS**

**[Contexto]**  
SPAs mostram página branca até JavaScript carregar e buscar dados. Usuário espera, SEO não vê conteúdo, Core Web Vitals ruins.

**[Problema]**  
Como entregar HTML completo com dados já renderizados no servidor? Como eliminar loading states da primeira renderização?

**[Solução]**  
Loaders executam no servidor antes do render. Dados chegam hidratados no HTML. Página funciona 100% sem JavaScript ativo.

**[Teoria]**  
Loaders = async functions que rodam server-side. useLoaderData retorna dados prontos. SSR real = HTML completo no view-source.

---

## **🎬 VÍDEO 3 - STREAMING AVANÇADO**

**[Contexto]**  
SSR tradicional bloqueia página até dados mais lentos carregarem. Categorias são rápidas, produtos demoram 2s. Usuário espera tudo.

**[Problema]**  
Como mostrar conteúdo rápido imediatamente e streamear partes lentas progressivamente? Como melhorar perceived performance?

**[Solução]**  
defer() + Suspense + Await permite streaming. Dados rápidos = await (HTML inicial), dados lentos = Promise (stream depois).

**[Teoria]**  
Streaming = HTTP chunks progressivos. Browser renderiza conforme chunks chegam. Melhor UX = usuário vê progresso, não loading.

---

## **🎯 CONCEITOS COBERTOS**

✅ **História:** Remix → React Router v7  
✅ **Framework Mode:** SSR nativo + file routing  
✅ **Loaders:** Server-side data fetching  
✅ **Resource Routes:** APIs integradas  
✅ **Progressive Enhancement:** Funciona sem JS  
✅ **Streaming:** defer + Suspense + Await

**PROJETO:** E-commerce com categorias + produtos, SSR real + streaming progressivo
