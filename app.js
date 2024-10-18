import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tienda.distri7030.com",
      "http://181.94.78.103:5173",
    ],
    credentials: true, // Permitir el envío de credenciales (cookies)
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
export default app;
