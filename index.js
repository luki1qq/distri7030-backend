import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import app from "./app.js";

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/discount", discountRoutes);
console.log("server on port ", 3000);
