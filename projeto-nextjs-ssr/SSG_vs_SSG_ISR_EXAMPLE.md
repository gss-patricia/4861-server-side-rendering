# 🏗️ SSG vs SSG+ISR - Demonstração Prática

## 🎯 DIFERENÇAS CONCEITUAIS

### ✅ SSG PURO (Static Site Generation)

- **Build Time**: Gera todas as páginas como HTML estático
- **Runtime**: Serve HTML sem mudanças até próximo build
- **Performance**: Máxima (HTML estático)
- **Flexibilidade**: Dados congelados até rebuild

### 🔄 SSG + ISR (Incremental Static Regeneration)

- **Build Time**: Gera HTML inicial + configura TTL
- **Runtime**: Revalida páginas automaticamente
- **Performance**: Máxima + dados sempre frescos
- **Flexibilidade**: Melhor dos dois mundos

---

## 📊 IMPLEMENTAÇÃO ATUAL

### 🏠 HOME PAGE (SSG + ISR):

```javascript
// src/app/page.js
const produtos = await fetch("/api/products", {
  next: {
    revalidate: 1800, // ← ISR: revalida a cada 30min
    tags: ["products"],
  },
});

// 🎯 COMPORTAMENTO:
// Build: HTML gerado com dados atuais
// Runtime: Revalida automaticamente a cada 30min
```

### 🛍️ PRODUCT PAGES (SSG PURO):

```javascript
// src/app/produto/[slug]/page.jsx
const produto = await fetch("/api/products/123", {
  cache: "force-cache", // ← SSG: nunca revalida
});

// 🎯 COMPORTAMENTO:
// Build: HTML gerado com dados atuais
// Runtime: HTML estático até próximo build
```

---

## 🔄 FLUXO DE EXECUÇÃO

### 🏗️ BUILD TIME (`npm run build`):

```bash
# 1. generateStaticParams executa:
✓ fetch /api/products (lista todos)
✓ Gera rotas: /produto/1, /produto/2, /produto/N

# 2. Para cada rota, executa getProduto():
✓ fetch /api/products/1 (dados atuais)
✓ fetch /api/products/2 (dados atuais)
✓ Gera: produto/1.html, produto/2.html

# 3. Resultado:
✓ Páginas HTML estáticas salvas no disco
✓ Zero revalidação configurada = SSG puro
```

### 🚀 RUNTIME (`npm start`):

```bash
# Request para /produto/123:
1. ✅ Serve .html estático (instantâneo)
2. ❌ NUNCA revalida (diferente da Home)
3. ✅ Dados sempre os mesmos até rebuild

# Para atualizar dados:
$ npm run build  # ← Único modo de atualizar
$ npm start
```

---

## 🆚 COMPARAÇÃO PRÁTICA

| **Aspecto**       | **Home (SSG+ISR)**       | **Produto (SSG Puro)** |
| ----------------- | ------------------------ | ---------------------- |
| **Build**         | HTML + revalidate config | HTML estático final    |
| **Dados**         | Atualizados a cada 30min | Congelados até rebuild |
| **Performance**   | 🚀 Máxima                | 🚀 Máxima              |
| **Flexibilidade** | 🔄 Auto-update           | 🔒 Fixo                |
| **Use Case**      | Landing, feeds           | Documentação, blogs    |

---

## 🧪 TESTE PRÁTICO

### 1️⃣ **Mudar dados no Supabase:**

```sql
UPDATE products
SET name = 'Produto ATUALIZADO', price = 'R$ 999,99'
WHERE id = 1;
```

### 2️⃣ **Testar comportamento:**

```bash
# Home:
http://localhost:3000/
# ✅ Após 30min mostra "Produto ATUALIZADO"

# Produto:
http://localhost:3000/produto/1
# ❌ Continua mostrando dados antigos até rebuild
```

### 3️⃣ **Para atualizar produtos (SSG puro):**

```bash
npm run build  # ← Rebuilds páginas com dados novos
npm start       # ← Agora /produto/1 mostra dados atualizados
```

---

## 🎯 QUANDO USAR CADA UM

### ✅ SSG PURO:

- **Documentação** (raramente muda)
- **Posts de blog** (conteúdo fixo)
- **Páginas institucionais**
- **Performance máxima** sem necessidade de atualização

### 🔄 SSG + ISR:

- **E-commerce** (preços, estoque)
- **Feeds** (novos posts)
- **Dashboards** (dados dinâmicos)
- **Performance + dados frescos**

---

## ⚙️ CONFIGURAÇÃO ATUAL NO PROJETO

```javascript
// 🏠 Home (ISR):
next: {
  revalidate: 1800,      // 30 minutos
  tags: ['products']
}

// 🛍️ Produtos (SSG):
cache: 'force-cache'     // Nunca revalida
```

---

## 🔄 PARA TESTAR ISR NAS PÁGINAS DE PRODUTO

Se quiser ISR também nos produtos:

```javascript
// Mudar de:
cache: 'force-cache'

// Para:
next: {
  revalidate: 3600,           // 1 hora
  tags: ['products', `product-${id}`]
}
```

**🎯 Resultado: Melhor dos dois mundos - páginas estáticas + dados sempre atualizados!**
