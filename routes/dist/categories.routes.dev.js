"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _client = require("@prisma/client");

var _validateToken = require("../middlewares/validateToken.js");

var _categoriesController = require("../controllers/categories.controller.js");

var prisma = new _client.PrismaClient();
var router = (0, _express.Router)();
router.post("/create-subcategory", _categoriesController.createSubCategory);
router.post("/create-category", _validateToken.authRequired, _categoriesController.createCategory);
router.get("/get-categories", _categoriesController.getCategories);
router.get("/get-product-by-category/:categoryId", _categoriesController.getProductByCategory);
router.get("/get-category/:id", _categoriesController.getCategory);
router.get("/get-subcategories", _categoriesController.getSubcategories);
router.get("/get-subcategory/:id", _categoriesController.getSubCategory);
router.get("/get-images-by-category/:categoryId", _categoriesController.getImagesByCategory);
router.get("/get-product-selected/:imageId", _categoriesController.getProductSelectedByImage);
router.get("/get-products-by-image/:imageId", _categoriesController.getProductsByImage);
router.get("/get-image-info/:imageId", _categoriesController.getImageInfo);
var _default = router;
exports["default"] = _default;