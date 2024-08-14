import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import { getOrders, createOrder, cancelOrder,getOrdersGeneral, getSpecificOrder } from "../controllers/order.controller.js";

const router = Router();

router.get("/get-orders",authRequired, getOrders);
router.post("/create-order", authRequired, createOrder);
router.put("/cancel-order/:id", authRequired, cancelOrder);
router.get("/get-general-orders", authRequired, getOrdersGeneral);
router.get("/get-order/:id", getOrders);
router.get("/get-specific-order/:id", authRequired, getSpecificOrder);

export default router;
