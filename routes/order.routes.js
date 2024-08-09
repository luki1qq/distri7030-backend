import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import { getOrders, createOrder, cancelOrder } from "../controllers/order.controller.js";

const router = Router();

router.get("/get-orders",authRequired, getOrders);
router.post("/create-order", authRequired, createOrder);
router.post("/cancel-order/:orderId", authRequired, cancelOrder);

router.get("/get-order/:id", getOrders);

export default router;
