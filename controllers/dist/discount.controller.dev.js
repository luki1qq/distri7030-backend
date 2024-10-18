"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiscountsUsers = exports.associateManyUsersToDiscount = exports.getAllProductsByDiscountByUser = exports.createDiscountToUser = exports.createDiscount = exports.getDiscountsByUser = exports.getDiscountsByProduct = exports.getDiscount = exports.getDiscounts = void 0;

var _client = require("@prisma/client");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var prisma = new _client.PrismaClient();

var getDiscounts = function getDiscounts(req, res) {
  var discounts;
  return regeneratorRuntime.async(function getDiscounts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(prisma.discount.findMany());

        case 3:
          discounts = _context.sent;
          res.json(discounts);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error getting discounts:", _context.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getDiscounts = getDiscounts;

var getDiscount = function getDiscount(req, res) {
  var id, discount;
  return regeneratorRuntime.async(function getDiscount$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(prisma.discount.findUnique({
            where: {
              id: parseInt(id)
            }
          }));

        case 4:
          discount = _context2.sent;
          res.json(discount);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error("Error getting discounts:", _context2.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getDiscount = getDiscount;

var getDiscountsByProduct = function getDiscountsByProduct(req, res) {
  var productId, discounts;
  return regeneratorRuntime.async(function getDiscountsByProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          productId = req.params.productId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.discount.findMany({
            where: {
              productId: parseInt(productId)
            }
          }));

        case 4:
          discounts = _context3.sent;
          res.json(discounts);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error getting discounts:", _context3.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getDiscountsByProduct = getDiscountsByProduct;

var getDiscountsByUser = function getDiscountsByUser(req, res) {
  var userId, discounts;
  return regeneratorRuntime.async(function getDiscountsByUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(prisma.discount.findMany({
            where: {
              userId: parseInt(userId)
            }
          }));

        case 4:
          discounts = _context4.sent;
          res.json(discounts);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error("Error getting discounts:", _context4.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getDiscountsByUser = getDiscountsByUser;

var createDiscount = function createDiscount(req, res) {
  var _req$body, percentage, name, startDate, endDate, products, resultDiscount;

  return regeneratorRuntime.async(function createDiscount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body = req.body, percentage = _req$body.percentage, name = _req$body.name, startDate = _req$body.startDate, endDate = _req$body.endDate, products = _req$body.products; // Validate input

          if (!(!percentage || !name || !startDate || !endDate || !products)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).json(["Invalid input data"]));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(prisma.discount.create({
            data: {
              percentage: percentage,
              name: name,
              startDate: startDate,
              endDate: endDate,
              ProductDiscount: {
                create: products.map(function (productId) {
                  return {
                    productId: productId
                  };
                })
              }
            }
          }));

        case 6:
          resultDiscount = _context5.sent;
          res.json(resultDiscount);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error("Error creating discount:", _context5.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // ToDo : Verificar la existencia de los descuentos actualmente aplicados al usuarios


exports.createDiscount = createDiscount;

var createDiscountToUser = function createDiscountToUser(req, res) {
  var _req$body2, userId, discountId, resultDiscount;

  return regeneratorRuntime.async(function createDiscountToUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body2 = req.body, userId = _req$body2.userId, discountId = _req$body2.discountId; // Validate input

          if (!(!discountId || !userId)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json(["Invalid input data"]));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(prisma.userDiscount.create({
            data: {
              userId: parseInt(userId),
              discountId: parseInt(discountId)
            }
          }));

        case 6:
          resultDiscount = _context6.sent;
          res.json(resultDiscount);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error("Error creating discount:", _context6.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.createDiscountToUser = createDiscountToUser;

var getAllProductsByDiscountByUser = function getAllProductsByDiscountByUser(req, res) {
  var user, productsWithDiscounts, bestDiscountPerProducts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, product, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, productDiscount, discount, bestDiscountExist, productsWithoutDiscount, formattedProductsWithoutDiscount, formattedProductsWithDiscounts, products;

  return regeneratorRuntime.async(function getAllProductsByDiscountByUser$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          // Obtener los productos con descuento
          user = req.params.user;
          _context7.next = 4;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            include: {
              ProductDiscount: {
                where: {
                  Discount: {
                    isActive: true,
                    startDate: {
                      lte: new Date()
                    },
                    endDate: {
                      gte: new Date()
                    },
                    UserDiscount: {
                      some: {
                        userId: parseInt(user)
                      }
                    }
                  }
                },
                include: {
                  Discount: true
                }
              }
            }
          }));

        case 4:
          productsWithDiscounts = _context7.sent;
          // Obtener el mejor descuento por producto
          bestDiscountPerProducts = new Map();
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context7.prev = 9;
          _iterator = productsWithDiscounts[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context7.next = 35;
            break;
          }

          product = _step.value;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context7.prev = 16;

          for (_iterator2 = product.ProductDiscount[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            productDiscount = _step2.value;
            discount = productDiscount.Discount;

            if (bestDiscountPerProducts.has(product.id)) {
              bestDiscountExist = bestDiscountPerProducts.get(product.id);

              if (discount.percentage > bestDiscountExist.percentage) {
                bestDiscountPerProducts.set(product.id, discount);
              }
            } else {
              bestDiscountPerProducts.set(product.id, discount);
            }
          }

          _context7.next = 24;
          break;

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](16);
          _didIteratorError2 = true;
          _iteratorError2 = _context7.t0;

        case 24:
          _context7.prev = 24;
          _context7.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context7.prev = 27;

          if (!_didIteratorError2) {
            _context7.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context7.finish(27);

        case 31:
          return _context7.finish(24);

        case 32:
          _iteratorNormalCompletion = true;
          _context7.next = 11;
          break;

        case 35:
          _context7.next = 41;
          break;

        case 37:
          _context7.prev = 37;
          _context7.t1 = _context7["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context7.t1;

        case 41:
          _context7.prev = 41;
          _context7.prev = 42;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 44:
          _context7.prev = 44;

          if (!_didIteratorError) {
            _context7.next = 47;
            break;
          }

          throw _iteratorError;

        case 47:
          return _context7.finish(44);

        case 48:
          return _context7.finish(41);

        case 49:
          _context7.next = 51;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              ProductDiscount: {
                none: {} // Productos sin ninguna relación con descuentos

              }
            }
          }));

        case 51:
          productsWithoutDiscount = _context7.sent;
          // Formatear los productos sin descuento
          formattedProductsWithoutDiscount = productsWithoutDiscount.map(function (product) {
            return {
              id: product.id,
              codeCompatibility: product.codeCompatibility,
              priceSale: product.priceSale,
              description: product.description,
              percentage: 0,
              finalPrice: product.priceSale,
              discountPercentage: 0
            };
          }); // Obtener los productos con el mejor descuento

          formattedProductsWithDiscounts = Array.from(bestDiscountPerProducts.entries()).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                productId = _ref2[0],
                discount = _ref2[1];

            var product = productsWithDiscounts.find(function (product) {
              return product.id === productId;
            });
            return {
              id: product.id,
              codeCompatibility: product.codeCompatibility,
              priceSale: product.priceSale,
              description: product.description,
              percentage: discount.percentage,
              finalPrice: product.priceSale - product.priceSale * discount.percentage / 100,
              discountPercentage: discount.percentage
            };
          }); // Unir los productos con descuento y sin descuento

          products = formattedProductsWithDiscounts.concat(formattedProductsWithoutDiscount);
          res.json(products);
          _context7.next = 62;
          break;

        case 58:
          _context7.prev = 58;
          _context7.t2 = _context7["catch"](0);
          console.error("Error getting discounts:", _context7.t2);
          res.status(500).json({
            error: "Internal server error"
          });

        case 62:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 58], [9, 37, 41, 49], [16, 20, 24, 32], [25,, 27, 31], [42,, 44, 48]]);
};

exports.getAllProductsByDiscountByUser = getAllProductsByDiscountByUser;

var associateManyUsersToDiscount = function associateManyUsersToDiscount(req, res) {
  var _req$body3, userIds, discountId, resultDiscount;

  return regeneratorRuntime.async(function associateManyUsersToDiscount$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body3 = req.body, userIds = _req$body3.userIds, discountId = _req$body3.discountId; // Validate input

          console.log(userIds);
          console.log(discountId);

          if (!(!discountId || !userIds)) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(400).json(["fqefqe"]));

        case 6:
          _context8.next = 8;
          return regeneratorRuntime.awrap(prisma.userDiscount.createMany({
            data: userIds.map(function (userId) {
              return {
                userId: Number(userId.id),
                discountId: Number(discountId)
              };
            })
          }));

        case 8:
          resultDiscount = _context8.sent;
          res.json(resultDiscount);
          _context8.next = 16;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error("Error creating discount:", _context8.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.associateManyUsersToDiscount = associateManyUsersToDiscount;

var getDiscountsUsers = function getDiscountsUsers(req, res) {
  var discounts;
  return regeneratorRuntime.async(function getDiscountsUsers$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(prisma.userDiscount.findMany());

        case 3:
          discounts = _context9.sent;
          res.json(discounts);
          _context9.next = 11;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error("Error getting discounts:", _context9.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getDiscountsUsers = getDiscountsUsers;