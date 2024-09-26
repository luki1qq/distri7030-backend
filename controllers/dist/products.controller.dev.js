"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProduct = exports.getProduct = exports.getProductsByCategory = exports.getProductsWithDiscount = exports.getProducts = exports.createImage = exports.createProductWithImage = exports.createProduct = void 0;

var _client = require("@prisma/client");

var _upload = require("../middlewares/upload.js");

var _clientS = require("@aws-sdk/client-s3");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var prisma = new _client.PrismaClient();

var createProduct = function createProduct(req, res) {
  return regeneratorRuntime.async(function createProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createProduct = createProduct;

var createProductWithImage = function createProductWithImage(req, res) {
  var _req$body, codeCompatibility, priceSale, _titleImage, description, categoryId, subCategoryId, _ref, _ref2, categoryExists, subCategoryExists, file, params, command, imageUrl, newImage, imageId, product;

  return regeneratorRuntime.async(function createProductWithImage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, codeCompatibility = _req$body.codeCompatibility, priceSale = _req$body.priceSale, _titleImage = _req$body.titleImage, description = _req$body.description, categoryId = _req$body.categoryId, subCategoryId = _req$body.subCategoryId;
          console.log(req.body);
          console.log(req.file); // Validación de datos

          if (!(!codeCompatibility || !priceSale || !categoryId || !subCategoryId || !req.file // Verificamos que el archivo de imagen esté presente
          )) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Missing required fields"
          }));

        case 6:
          if (!(isNaN(priceSale) || typeof codeCompatibility !== "string" || typeof description !== "string" || isNaN(categoryId) || isNaN(subCategoryId))) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Invalid data types"
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(prisma.$transaction([prisma.category.findUnique({
            where: {
              id: parseInt(categoryId)
            }
          }), prisma.subCategory.findUnique({
            where: {
              id: parseInt(subCategoryId)
            }
          })]));

        case 10:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          categoryExists = _ref2[0];
          subCategoryExists = _ref2[1];

          if (!(!categoryExists || !subCategoryExists)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Invalid category or subcategory ID"
          }));

        case 16:
          file = req.file;
          params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            // Asegúrate de definir esta variable de entorno
            Key: Date.now().toString() + "-" + file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype // No usamos ACL si el bucket no lo permite

          };
          command = new _clientS.PutObjectCommand(params);
          _context2.next = 21;
          return regeneratorRuntime.awrap(_upload.s3.send(command));

        case 21:
          // Construir la URL pública de la imagen
          imageUrl = "https://".concat(params.Bucket, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(params.Key); // Creación de la imagen en la base de datos

          _context2.next = 24;
          return regeneratorRuntime.awrap(prisma.image.create({
            data: {
              title: _titleImage || file.originalname,
              imageUrl: imageUrl,
              categoryId: parseInt(categoryId)
            }
          }));

        case 24:
          newImage = _context2.sent;
          console.log(newImage);
          imageId = newImage.id; // Creación del producto con transacción

          _context2.next = 29;
          return regeneratorRuntime.awrap(prisma.products.create({
            data: {
              codeCompatibility: codeCompatibility,
              priceSale: parseFloat(priceSale),
              imageId: imageId,
              description: description,
              categoryId: parseInt(categoryId),
              subCategoryId: parseInt(subCategoryId)
            }
          }));

        case 29:
          product = _context2.sent;
          res.status(200).json(product);
          _context2.next = 37;
          break;

        case 33:
          _context2.prev = 33;
          _context2.t0 = _context2["catch"](0);
          console.error("Error creating product:", _context2.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

exports.createProductWithImage = createProductWithImage;

var createImage = function createImage(req, res) {
  var _req$body2, title, categoryId, file, params, command, imageUrl, newImage;

  return regeneratorRuntime.async(function createImage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, title = _req$body2.title, categoryId = _req$body2.categoryId;
          file = req.file;

          if (file) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Missing required fields"
          }));

        case 5:
          params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Date.now().toString() + "-" + file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype // ACL: 'public-read', // Eliminamos esta línea

          };
          command = new _clientS.PutObjectCommand(params);
          _context3.next = 9;
          return regeneratorRuntime.awrap(_upload.s3.send(command));

        case 9:
          imageUrl = "https://".concat(params.Bucket, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(params.Key);

          if (!(!titleImage || !imageUrl)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Missing required fields"
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(prisma.image.create({
            data: {
              title: titleImage,
              imageUrl: imageUrl,
              categoryId: categoryId // Asocia la imagen a una categoría

            }
          }));

        case 14:
          newImage = _context3.sent;
          res.status(200).json(newImage);
          _context3.next = 22;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          console.error("Error creating image:", _context3.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // get


exports.createImage = createImage;

var getProducts = function getProducts(req, res) {
  var products;
  return regeneratorRuntime.async(function getProducts$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(prisma.products.findMany());

        case 3:
          products = _context4.sent;
          res.json(products);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("Error getting products:", _context4.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getProducts = getProducts;

var getProductsWithDiscount = function getProductsWithDiscount(req, res) {
  var products;
  return regeneratorRuntime.async(function getProductsWithDiscount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              discount: {
                not: null
              }
            }
          }));

        case 3:
          products = _context5.sent;
          res.json(products);
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error("Error getting products:", _context5.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getProductsWithDiscount = getProductsWithDiscount;

var getProductsByCategory = function getProductsByCategory(req, res) {
  var categoryId, products;
  return regeneratorRuntime.async(function getProductsByCategory$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          categoryId = req.params.categoryId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              categoryId: parseInt(categoryId)
            }
          }));

        case 4:
          products = _context6.sent;
          res.json(products);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error("Error getting products:", _context6.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getProductsByCategory = getProductsByCategory;

var getProduct = function getProduct(req, res) {
  var id, product;
  return regeneratorRuntime.async(function getProduct$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(prisma.products.findUnique({
            where: {
              id: parseInt(id)
            }
          }));

        case 4:
          product = _context7.sent;
          res.json(product);
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error("Error getting product:", _context7.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getProduct = getProduct;

var deleteProduct = function deleteProduct(req, res) {
  var id, product;
  return regeneratorRuntime.async(function deleteProduct$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          id = req.params.id;
          _context8.next = 4;
          return regeneratorRuntime.awrap(prisma.products["delete"]({
            where: {
              id: parseInt(id)
            }
          }));

        case 4:
          product = _context8.sent;
          res.json(product);
          _context8.next = 12;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error("Error deleting product:", _context8.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.deleteProduct = deleteProduct;