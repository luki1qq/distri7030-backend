import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getDiscounts,
  getDiscountsByProduct,
} from "../controllers/discount.controller.js";
const prisma = new PrismaClient();
const router = Router();

router.get("/get-discounts", getDiscounts);
router.get("/get-discounts-by-product/:productId", getDiscountsByProduct);

export default router;
