import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import {  createProduct, getProduct, getProducts,deleteProduct, getProductsByCategory } from "../controllers/products.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/validateRol.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/create-product",authRequired, createProduct)
router.get("/get-products", getProducts);
router.get("/get-product/:id", getProduct);
router.get("/get-products-by-category/:categoryId", getProductsByCategory);
router.delete("/delete-product/:id", authRequired, isAdmin, deleteProduct);

export default router;
