import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  // 🌐 BFF API Routes (JavaScript puro)
  route("/api/categories", "routes/api.categories.js"),
  route("/api/products", "routes/api.products.js"),
] satisfies RouteConfig;
