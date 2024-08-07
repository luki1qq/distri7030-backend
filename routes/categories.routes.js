import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import {
  createCategory,
  createSubCategory,
  getCategory,
  getCategories,
  getSubcategories,
  getSubCategory
} from "../controllers/categories.controller.js";

const prisma = new PrismaClient();
const router = Router();
router.post("/create-subcategory", authRequired, createSubCategory);
router.post("/create-category", authRequired, createCategory);
router.get("/get-categories", getCategories);
router.get("/get-category/:id", getCategory);
router.get("/get-subcategories", getSubcategories);
router.get("/get-subcategory/:id", getSubCategory);
export default router;
