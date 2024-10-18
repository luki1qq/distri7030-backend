import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/validateToken.js";

import { getOrders, createOrder, cancelOrder,getOrdersGeneral, getSpecificOrder } from "../controllers/order.controller.js";

const router = Router();

router.get("/get-orders/:userId", getOrders);
router.post("/create-order/:userId", createOrder);
router.put("/cancel-order/:id", cancelOrder);
router.get("/get-general-orders", getOrdersGeneral);
// router.get("/get-order/:id", getOrders);
router.get("/get-specific-order/:id", getSpecificOrder);

export default router;
