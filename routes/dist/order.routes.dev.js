"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _client = require("@prisma/client");

var _validateToken = require("../middlewares/validateToken.js");

var _orderController = require("../controllers/order.controller.js");

// import { prisma } from "../db.js";
var router = (0, _express.Router)();
router.get("/get-orders/:userId", _orderController.getOrders);
router.post("/create-order/:userId", _orderController.createOrder);
router.put("/cancel-order/:id", _orderController.cancelOrder);
router.get("/get-general-orders", _orderController.getOrdersGeneral); // router.get("/get-order/:id", getOrders);

router.get("/get-specific-order/:id", _orderController.getSpecificOrder);
var _default = router;
exports["default"] = _default;