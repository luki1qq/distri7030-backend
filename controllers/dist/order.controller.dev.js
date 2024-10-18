"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecificOrder = exports.cancelOrder = exports.createOrder = exports.getOrdersByUser = exports.getOrdersGeneral = exports.getOrders = void 0;

var _client = require("@prisma/client");

var _transporterNodeMailer = require("../utils/transporterNodeMailer.js");

var prisma = new _client.PrismaClient();

var getOrders = function getOrders(req, res) {
  var _parseInt, userId, page, limit, skip, orders, totalOrders;

  return regeneratorRuntime.async(function getOrders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _parseInt = parseInt(req.params), userId = _parseInt.userId; // Obtener los parámetros de paginación desde la URL o definir valores predeterminados

          page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)

          limit = parseInt(req.query.limit) || 10; // Número de resultados por página (por defecto 10)
          // Calcular cuántos registros omitir (skip) basado en la página actual y el límite

          skip = (page - 1) * limit; // Consulta Prisma con paginación

          _context.next = 7;
          return regeneratorRuntime.awrap(prisma.order.findMany({
            where: {
              userId: userId,
              isActive: true
            },
            skip: skip,
            // Omitir el número de registros calculados
            take: limit // Traer solo el número de registros indicados en "limit"

          }));

        case 7:
          orders = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(prisma.order.count({
            where: {
              userId: userId,
              isActive: true
            }
          }));

        case 10:
          totalOrders = _context.sent;
          // Devolver los datos paginados junto con el número total de páginas
          res.json({
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders: totalOrders,
            orders: orders
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Error getting orders:", _context.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
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
  var detailOrder, _parseInt2, userId, user, total, resultOrder, limitedOrderDetails, emailTemplate;

  return regeneratorRuntime.async(function createOrder$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          detailOrder = req.body.detailOrder;
          _parseInt2 = parseInt(req.params), userId = _parseInt2.userId;
          console.log(detailOrder); // Validate input

          if (!(!userId || !detailOrder || !Array.isArray(detailOrder))) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(400).json(["Invalid input data"]));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: userId
            }
          }));

        case 8:
          user = _context4.sent;
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

          _context4.next = 12;
          return regeneratorRuntime.awrap(prisma.order.create({
            data: {
              userId: userId,
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
              detailOrder: {
                include: {
                  Product: {
                    select: {
                      codeCompatibility: true // Get the codeCompatibility

                    }
                  }
                }
              }
            } // Include detailOrder with product details

          }));

        case 12:
          resultOrder = _context4.sent;
          console.log(resultOrder); // Limit to 5 products in the email

          limitedOrderDetails = resultOrder.detailOrder.slice(0, 5);
          emailTemplate = "\n    <!DOCTYPE html>\n    <html lang=\"es\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Resumen de Pedido</title>\n        <style>\n          body {\n            font-family: Arial, sans-serif;\n            background-color: #f4f4f4;\n            color: #333;\n          }\n          .container {\n            max-width: 600px;\n            margin: 0 auto;\n            background-color: #fff;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n          }\n          h1 {\n            color: #ff6f00;\n          }\n          .order-summary {\n            margin-top: 20px;\n          }\n          .order-summary th, .order-summary td {\n            padding: 10px;\n            text-align: left;\n            border-bottom: 1px solid #ddd;\n          }\n          .total {\n            font-weight: bold;\n            color: #ff6f00;\n            text-align: right;\n          }\n          .footer {\n            margin-top: 30px;\n            text-align: center;\n            font-size: 12px;\n            color: #777;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <h1>Nuevo Pedido</h1>\n          <p>Estimado <strong>".concat(user.firstName, " ").concat(user.lastName, "</strong>,</p>\n          <p>Gracias por tu pedido. A continuaci\xF3n, te presentamos el resumen del pedido realizado:</p>\n\n          <h2>Detalles del Pedido</h2>\n          <table class=\"order-summary\" width=\"100%\">\n            <thead>\n              <tr>\n                <th>Producto (C\xF3digo de Compatibilidad)</th>\n                <th>Cantidad</th>\n                <th>Precio Unitario</th>\n                <th>Subtotal</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(limitedOrderDetails.map(function (detail) {
            return "\n                <tr>\n                  <td>".concat(detail.Product.codeCompatibility, "</td>\n                  <td>").concat(detail.quantity, "</td>\n                  <td>$").concat(detail.price.toFixed(2), "</td>\n                  <td>$").concat((detail.price * detail.quantity).toFixed(2), "</td>\n                </tr>\n              ");
          }).join(""), "\n              <tr>\n                <td colspan=\"3\" class=\"total\">Total:</td>\n                <td class=\"total\">$").concat(resultOrder.total.toFixed(2), "</td>\n              </tr>\n            </tbody>\n          </table>\n\n          <h3>Observaciones: ").concat(resultOrder.observation || "Sin observaciones", "</h3>\n\n          <p>Estado del pedido: <strong>").concat(resultOrder.orderState, "</strong></p>\n\n          <div class=\"footer\">\n            <p>\xA9 2024 Distri7030. Todos los derechos reservados.</p>\n          </div>\n        </div>\n      </body>\n    </html>\n  "); // Send email to user and admin

          (0, _transporterNodeMailer.sendEmail)(user.email, "RESUMEN DE TU PEDIDO ".concat(resultOrder.id), emailTemplate);
          (0, _transporterNodeMailer.sendEmail)(process.env.MAIL_ADRESS_ADDRESS, "NUEVO PEDIDO: ".concat(resultOrder.id), emailTemplate);
          res.status(201).json(resultOrder);
          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0); // Log the error for debugging

          res.status(500).json({
            error: "Error creating order"
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
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