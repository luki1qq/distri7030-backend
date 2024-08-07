import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import { getOrders, createOrder, cancelOrder } from "../controllers/order.controller.js";

const router = Router();

router.get("/get-orders", getOrders);
router.post("/create-order", authRequired, createOrder);
router.post("/cancel-order/:orderId", authRequired, cancelOrder);

export default router;
