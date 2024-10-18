"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRequired = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _secrets = require("../utils/secrets.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authRequired = function authRequired(req, res, next) {
  var token;
  return regeneratorRuntime.async(function authRequired$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.cookies.token;
          console.log(token);

          if (token) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Unauthorized"
          }));

        case 5:
          _jsonwebtoken["default"].verify(token, _secrets.JWT_SECRET, function (err, user) {
            if (err) {
              return res.status(401).json({
                message: "Token is not valid"
              });
            } // Guardamos el usuario en el request


            req.user = user;
            next();
          });

          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            message: _context.t0.message
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.authRequired = authRequired;