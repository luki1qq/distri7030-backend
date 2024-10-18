"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _client = require("@prisma/client");

var _validateToken = require("../middlewares/validateToken.js");

var _discountController = require("../controllers/discount.controller.js");

var prisma = new _client.PrismaClient();
var router = (0, _express.Router)();
router.get("/get-discounts", _discountController.getDiscounts);
router.get("/get-discount/:id", _discountController.getDiscount);
router.get("/get-discounts-by-product/:productId", _discountController.getDiscountsByProduct);
router.post("/create-discount", _discountController.createDiscount);
router.post("/create-discount-to-user", _discountController.createDiscountToUser);
router.get("/get-all-products-with-discount/:user", _discountController.getAllProductsByDiscountByUser);
router.post("/create-discount-to-many-user", _discountController.associateManyUsersToDiscount);
router.get("/get-discounts-users", _discountController.getDiscountsUsers);
var _default = router;
exports["default"] = _default;