import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import app from "./app.js";

import dotenv from "dotenv";
dotenv.config();

app.listen(3000);

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/discount", discountRoutes);
console.log("server on port ", 3000);
