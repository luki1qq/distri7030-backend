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
router.post("/create-discount",  createDiscount);
router.post("/create-discount-to-user",  createDiscountToUser);
router.get("/get-all-products-with-discount/:user",  getAllProductsByDiscountByUser);
router.post("/create-discount-to-many-user",  associateManyUsersToDiscount);
router.get("/get-discounts-users",  getDiscountsUsers)
export default router;
