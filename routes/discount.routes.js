import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getDiscounts,
  getDiscountsByProduct,
  createDiscount,
  createDiscountToUser,
  getAllProductsByDiscountByUser
} from "../controllers/discount.controller.js";
const prisma = new PrismaClient();
const router = Router();

router.get("/get-discounts", getDiscounts);
router.get("/get-discounts-by-product/:productId", getDiscountsByProduct);
router.post("/create-discount", authRequired, createDiscount);
router.post("/create-discount-to-user", authRequired, createDiscountToUser);
router.get("/get-all-products-with-discount", authRequired, getAllProductsByDiscountByUser);
export default router;
