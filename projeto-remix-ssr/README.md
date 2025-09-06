# 🎓 React Router v7 (Remix) - SSR & Streaming

Projeto base para o curso de SSR com React Router v7, demonstrando as principais funcionalidades do framework mode.

## 🚀 Como executar

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp env.example .env
   # Edite o .env com suas credenciais do Supabase
   ```

3. **Executar em desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Build para produção:**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Estrutura do Projeto

```
app/
├── components/          # 🎨 Componentes de UI
│   ├── Header/         # Cabeçalho com navegação
│   ├── CategoryGrid/   # Grid de categorias
│   ├── ProductGrid/    # Grid de produtos
│   └── ProductCard/    # Card individual de produto
├── lib/                # 🛠️ Utilitários
│   └── supabase.ts    # Configuração do Supabase
├── routes/             # 🛤️ File-based routing
│   └── home.tsx       # Página inicial (dados mockados)
├── app.css            # 🎨 Estilos globais
└── root.tsx           # 🏠 Layout raiz
```

## 🎯 Objetivos do Curso

### **Vídeo 1 - História & Fundamentos**

- ✅ **Projeto configurado** sem Tailwind
- ✅ **CSS Modules** ativo
- ✅ **Componentes** migrados do Next.js
- ✅ **Supabase** configurado

### **Vídeo 2 - SSR com Loaders**

- ⏳ Resource Routes (`api.categories.ts`, `api.products.ts`)
- ⏳ Loader na Home (`useLoaderData`)
- ⏳ Demonstração SSR real

### **Vídeo 3 - Streaming**

- ⏳ Defer pattern
- ⏳ Suspense + Await
- ⏳ Progressive loading

## 🔧 Tecnologias

- **React Router v7** (Framework Mode)
- **TypeScript**
- **CSS Modules**
- **Supabase** (Database)
- **Vite** (Build tool integrado)

## 📝 Próximos Passos

1. **Configurar Supabase** com tabelas `categories` e `products`
2. **Implementar loaders** para buscar dados reais
3. **Adicionar streaming** com defer + Suspense
4. **Deploy** para produção

---

**🎬 Pronto para gravar o curso!** Este projeto base está configurado e funcional para demonstrar SSR, loaders e streaming com React Router v7.
