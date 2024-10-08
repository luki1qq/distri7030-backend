"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = exports.activate = exports.desactivate = exports.update = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _client = require("@prisma/client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Sección de panel de administración.
var prisma = new _client.PrismaClient();

var update = function update(req, res) {
  var _req$body, password, newPassword, id, idParse, user, validPassword, newHashedPassword;

  return regeneratorRuntime.async(function update$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, password = _req$body.password, newPassword = _req$body.newPassword;
          console.log(newPassword);
          _context.prev = 2;
          id = req.params.id;
          idParse = parseInt(id, 10);
          _context.next = 7;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 7:
          user = _context.sent;
          validPassword = _bcrypt["default"].compareSync(password, user.password);

          if (validPassword) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Password incorrect"
          }));

        case 11:
          newHashedPassword = _bcrypt["default"].hashSync(newPassword, 10);
          _context.next = 14;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              id: idParse
            },
            data: {
              password: newHashedPassword
            }
          }));

        case 14:
          return _context.abrupt("return", res.json({
            ok: true
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](2);
          res.status(404).json({
            message: _context.t0.message
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 17]]);
};

exports.update = update;

var desactivate = function desactivate(req, res) {
  var id, idParse, user;
  return regeneratorRuntime.async(function desactivate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          idParse = parseInt(id, 10);
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 5:
          user = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              id: idParse
            },
            data: {
              isActive: false
            }
          }));

        case 8:
          return _context2.abrupt("return", res.json({
            ok: true
          }));

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](2);
          res.status(404).json({
            message: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

exports.desactivate = desactivate;

var activate = function activate(req, res) {
  var id, idParse, user;
  return regeneratorRuntime.async(function activate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          idParse = parseInt(id, 10);
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 5:
          user = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              id: idParse
            },
            data: {
              isActive: true
            }
          }));

        case 8:
          return _context3.abrupt("return", res.json({
            ok: true
          }));

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](2);
          res.status(404).json({
            message: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

exports.activate = activate;

var getUsers = function getUsers(req, res) {
  var page, limit, skip, users, totalUsers, totalPages;
  return regeneratorRuntime.async(function getUsers$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // Obtener los parámetros de paginación desde la consulta o usar valores predeterminados
          page = parseInt(req.query.page) || 1; // Página actual, por defecto 1

          limit = parseInt(req.query.limit) || 10; // Límite de usuarios por página, por defecto 10
          // Calcular cuántos registros omitir basado en la página actual

          skip = (page - 1) * limit; // Consulta Prisma con paginación

          _context4.next = 6;
          return regeneratorRuntime.awrap(prisma.user.findMany({
            where: {
              UserRoles: {
                some: {
                  roleId: 2 // Filtrar usuarios que tengan roleId igual a 2

                }
              }
            },
            skip: skip,
            // Omitir el número de registros calculados
            take: limit,
            // Traer solo el número de registros indicados en "limit"
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              isActive: true,
              verified: true
            }
          }));

        case 6:
          users = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(prisma.user.count({
            where: {
              UserRoles: {
                some: {
                  roleId: 2 // Filtrar usuarios que tengan roleId igual a 2

                }
              }
            }
          }));

        case 9:
          totalUsers = _context4.sent;
          // Calcular el número total de páginas
          totalPages = Math.ceil(totalUsers / limit); // Devolver los usuarios junto con la información de paginación

          res.json({
            users: users,
            page: page,
            limit: limit,
            totalPages: totalPages,
            totalUsers: totalUsers
          });
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.error("Error al obtener los usuarios con roleId 2:", _context4.t0);
          res.status(500).json({
            error: "Error interno del servidor"
          });

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.getUsers = getUsers;