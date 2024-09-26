import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getDiscounts,
  getDiscountsByProduct,
  createDiscount,
  createDiscountToUser,
  getAllProductsByDiscountByUser,
  associateManyUsersToDiscount,
  getDiscountsUsers,
  getDiscount
} from "../controllers/discount.controller.js";
const prisma = new PrismaClient();
const router = Router();

router.get("/get-discounts", getDiscounts);
router.get("/get-discount/:id", getDiscount);
router.get("/get-discounts-by-product/:productId", getDiscountsByProduct);
router.post("/create-discount", authRequired, createDiscount);
router.post("/create-discount-to-user", authRequired, createDiscountToUser);
router.get("/get-all-products-with-discount", authRequired, getAllProductsByDiscountByUser);
router.post("/create-discount-to-many-user", authRequired, associateManyUsersToDiscount);
router.get("/get-discounts-users", authRequired,  getDiscountsUsers)
export default router;
