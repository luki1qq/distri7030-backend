import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import {
  createCategory,
  createSubCategory,
  getCategory,
  getCategories,
  getSubcategories,
  getSubCategory,
  getImagesByCategory,
  getProductsByImage,
  getProductSelectedByImage,
  getImageInfo,
  getProductByCategory
} from "../controllers/categories.controller.js";

const prisma = new PrismaClient();
const router = Router();
router.post("/create-subcategory", authRequired, createSubCategory);
router.post("/create-category", authRequired, createCategory);
router.get("/get-categories", getCategories);
router.get("/get-product-by-category/:categoryId", getProductByCategory);
router.get("/get-category/:id", getCategory);
router.get("/get-subcategories", getSubcategories);
router.get("/get-subcategory/:id", getSubCategory);
router.get("/get-images-by-category/:categoryId", getImagesByCategory);
router.get("/get-product-selected/:imageId", getProductSelectedByImage);

router.get("/get-products-by-image/:imageId", getProductsByImage);
router.get("/get-image-info/:imageId", getImageInfo);

export default router;
