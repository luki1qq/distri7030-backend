"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecificOrder = exports.cancelOrder = exports.createOrder = exports.getOrdersByUser = exports.getOrdersGeneral = exports.getOrders = void 0;

var _client = require("@prisma/client");

var prisma = new _client.PrismaClient();

var getOrders = function getOrders(req, res) {
  var page, limit, skip, orders, totalOrders;
  return regeneratorRuntime.async(function getOrders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Obtener los parámetros de paginación desde la URL o definir valores predeterminados
          page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)

          limit = parseInt(req.query.limit) || 10; // Número de resultados por página (por defecto 10)
          // Calcular cuántos registros omitir (skip) basado en la página actual y el límite

          skip = (page - 1) * limit; // Consulta Prisma con paginación

          _context.next = 6;
          return regeneratorRuntime.awrap(prisma.order.findMany({
            where: {
              userId: req.user.id,
              isActive: true
            },
            skip: skip,
            // Omitir el número de registros calculados
            take: limit // Traer solo el número de registros indicados en "limit"

          }));

        case 6:
          orders = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(prisma.order.count({
            where: {
              userId: req.user.id,
              isActive: true
            }
          }));

        case 9:
          totalOrders = _context.sent;
          // Devolver los datos paginados junto con el número total de páginas
          res.json({
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders: totalOrders,
            orders: orders
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error("Error getting orders:", _context.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getOrders = getOrders;

var getOrdersGeneral = function getOrdersGeneral(req, res) {
  var page, limit, skip, orders, totalOrders;
  return regeneratorRuntime.async(function getOrdersGeneral$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Obtener los parámetros de paginación desde la consulta o definir valores predeterminados
          page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)

          limit = parseInt(req.query.limit) || 10; // Número de resultados por página (por defecto 10)
          // Calcular cuántos registros omitir (skip) basado en la página actual y el límite

          skip = (page - 1) * limit; // Consulta Prisma con paginación

          _context2.next = 6;
          return regeneratorRuntime.awrap(prisma.order.findMany({
            skip: skip,
            // Omitir el número de registros calculados
            take: limit,
            // Limitar el número de registros a devolver
            select: {
              id: true,
              total: true,
              observation: true,
              orderState: true,
              createdAt: true,
              User: {
                select: {
                  email: true
                }
              }
            }
          }));

        case 6:
          orders = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(prisma.order.count());

        case 9:
          totalOrders = _context2.sent;
          // Devolver los datos paginados junto con el número total de páginas
          res.json({
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders: totalOrders,
            orders: orders
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error getting orders:", _context2.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getOrdersGeneral = getOrdersGeneral;

var getOrdersByUser = function getOrdersByUser(req, res) {
  var userId, orders;
  return regeneratorRuntime.async(function getOrdersByUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.order.findMany({
            where: {
              userId: parseInt(userId)
            }
          }));

        case 4:
          orders = _context3.sent;
          res.json(orders);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error getting products:", _context3.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //toDo Validate Discount on the order controller
// Consider using a middleware to validate the discount
// The middleware should check if the discount is valid


exports.getOrdersByUser = getOrdersByUser;

var createOrder = function createOrder(req, res) {
  var detailOrder, total, resultOrder;
  return regeneratorRuntime.async(function createOrder$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          detailOrder = req.body.detailOrder;
          console.log(detailOrder); // return res.status(201).json(detailOrder);
          // Validate input

          if (!(!req.user.id || !detailOrder || !Array.isArray(detailOrder))) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json(["Invalid input data"]));

        case 5:
          // Calculate total based on detailOrder items
          total = detailOrder.reduce(function (acc, item) {
            if (typeof item.quantity !== "number" || typeof item.price !== "number" || typeof item.productId !== "number") {
              return res.status(400).json(["Invalid input data"]);
            }

            if (!item.productId || !item.quantity || !item.price) {
              throw new Error("Incomplete detailOrder item"); // Throw error for missing data
            }

            return acc + item.quantity * item.price;
          }, 0); // Create order in the database

          _context4.next = 8;
          return regeneratorRuntime.awrap(prisma.order.create({
            data: {
              userId: req.user.id,
              total: total,
              observation: req.body.observation,
              detailOrder: {
                create: detailOrder.map(function (item) {
                  return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                  };
                })
              }
            },
            include: {
              detailOrder: true
            } // Include detailOrder in the result

          }));

        case 8:
          resultOrder = _context4.sent;
          res.status(201).json(resultOrder);
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0); // Log the error for debugging

          res.status(500).json({
            error: "Error creating order"
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.createOrder = createOrder;

var cancelOrder = function cancelOrder(req, res) {
  var updateOrder;
  return regeneratorRuntime.async(function cancelOrder$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          console.log(req.params.id); // Delete order from the database

          _context5.next = 4;
          return regeneratorRuntime.awrap(prisma.order.update({
            where: {
              id: Number(req.params.id)
            },
            data: {
              orderState: "CANCELADO"
            }
          }));

        case 4:
          updateOrder = _context5.sent;
          res.status(204).json(updateOrder);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0); // Log the error for debugging

          res.status(500).json({
            error: "Error canceling order"
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.cancelOrder = cancelOrder;

var getSpecificOrder = function getSpecificOrder(req, res) {
  var id, order;
  return regeneratorRuntime.async(function getSpecificOrder$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(prisma.order.findUnique({
            where: {
              id: Number(id)
            },
            select: {
              total: true,
              observation: true,
              orderState: true,
              detailOrder: {
                select: {
                  quantity: true,
                  price: true,
                  Product: {
                    select: {
                      codeCompatibility: true,
                      priceSale: true,
                      description: true
                    }
                  }
                }
              },
              User: {
                select: {
                  email: true
                }
              }
            }
          }));

        case 4:
          order = _context6.sent;
          res.json(order);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error("Error getting specific order:", _context6.t0);
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

exports.getSpecificOrder = getSpecificOrder;