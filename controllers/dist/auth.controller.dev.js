"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.POSTSetPassword = exports.GETSetPassword = exports.POSTresetPassword = exports.GETresetPassword = exports.forgotPassword = exports.reSendEmailClient = exports.confirm = exports.createClient = exports.profile = exports.logout = exports.createRoles = exports.register = exports.login = exports.signupHandler = void 0;

var _client = require("@prisma/client");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _jwt = require("../libs/jwt.js");

var _generateRamdonPassword = require("../utils/generateRamdonPassword.js");

var _transporterNodeMailer = require("../utils/transporterNodeMailer.js");

var _getEmailByToken = require("../utils/getEmailByToken.js");

var _secrets = require("../utils/secrets.js");

var _roles = require("./roles.js");

var _getIdByToken = require("../utils/getIdByToken.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var prisma = new _client.PrismaClient();

var signupHandler = function signupHandler(req, res) {
  var _req$body, email, firstName, lastName, password, user;

  return regeneratorRuntime.async(function signupHandler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, firstName = _req$body.firstName, lastName = _req$body.lastName, password = _req$body.password;
          _context.next = 3;
          return regeneratorRuntime.awrap(_client.PrismaClient.user.findUnique({
            where: {
              email: email
            }
          }));

        case 3:
          user = _context.sent;

          if (!user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User already exists"
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(prisma.user.create({
            data: {
              email: email,
              firstName: firstName,
              lastName: lastName,
              password: hashSync(password, 10)
            }
          }));

        case 8:
          user = _context.sent;
          res.json(user);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.signupHandler = signupHandler;

var login = function login(req, res) {
  var _req$body2, email, password, userFound, isMatch, isAdmin, isSecure, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          console.log(email, password);
          _context2.next = 4;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: email
            },
            include: {
              UserRoles: {
                include: {
                  RoleTable: true
                }
              }
            }
          }));

        case 4:
          userFound = _context2.sent;

          if (userFound) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json(["las credenciales no son validas"]));

        case 7:
          if (userFound.isActive) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json(["El usuario no esta activo"]));

        case 9:
          console.log(userFound);
          _context2.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, userFound.password));

        case 12:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(400).json(["las credenciales no son validas"]));

        case 15:
          isAdmin = userFound.UserRoles.some(function (userRole) {
            return userRole.RoleTable.name === _roles.RoleTable.ADMIN;
          });
          isSecure = req.secure || req.headers["x-forwarded-proto"] === "https"; // Verificar si la solicitud es HTTPS

          console.log(isSecure);
          _context2.next = 20;
          return regeneratorRuntime.awrap((0, _jwt.createAccessToken)({
            id: userFound.id
          }));

        case 20:
          token = _context2.sent;
          console.log(token);
          res.cookie("token", token, {
            httpOnly: false,
            // No accesible desde JavaScript del frontend
            secure: isSecure,
            // Solo enviar en HTTPS en producción
            sameSite: isSecure ? "None" : "Lax" // 'None' si está en HTTPS, de lo contrario 'Lax' (para desarrollo HTTP)

          });
          res.json({
            id: userFound.id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            isAdmin: isAdmin,
            verified: userFound.verified,
            isActive: userFound.isActive
          });

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //toDo - Implementar transacciones si es necesario


exports.login = login;

var register = function register(req, res) {
  var _req$body3, email, firstName, lastName, password, roleId, user, passwordHash, userSaved, token;

  return regeneratorRuntime.async(function register$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, firstName = _req$body3.firstName, lastName = _req$body3.lastName, password = _req$body3.password, roleId = _req$body3.roleId;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context3.sent;

          if (!user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            messsage: "User already exists"
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 9:
          passwordHash = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(prisma.user.create({
            data: {
              password: passwordHash,
              firstName: firstName,
              lastName: lastName,
              email: email
            }
          }));

        case 12:
          userSaved = _context3.sent;

          if (!roleId) {
            _context3.next = 18;
            break;
          }

          _context3.next = 16;
          return regeneratorRuntime.awrap(prisma.userRoles.create({
            data: {
              userId: userSaved.id,
              roleId: roleId,
              isActive: true // suponiendo que cuando se pasa un rol no es cliente

            }
          }));

        case 16:
          _context3.next = 20;
          break;

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(prisma.userRoles.create({
            data: {
              userId: userSaved.id,
              roleId: 2 // User default (Puede ser 1 si es admin)

            }
          }));

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap((0, _jwt.createAccessToken)({
            id: userSaved.id
          }));

        case 22:
          token = _context3.sent;
          res.cookie("token", token);
          res.json({
            id: userSaved.id,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            email: userSaved.email
          });
          _context3.next = 30;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: "Error creating user"
          });

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 27]]);
};

exports.register = register;

var createRoles = function createRoles(req, res) {
  var _req$body4, name, description, role;

  return regeneratorRuntime.async(function createRoles$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, name = _req$body4.name, description = _req$body4.description;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(prisma.roleTable.create({
            data: {
              name: name,
              description: description
            }
          }));

        case 4:
          role = _context4.sent;
          res.json(role);
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: "Error creating role"
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.createRoles = createRoles;

var logout = function logout(req, res) {
  return regeneratorRuntime.async(function logout$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.cookie("token", "", {
            expires: new Date(0)
          });
          res.sendStatus(200);

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.logout = logout;

var profile = function profile(req, res) {
  var id, userFound;
  return regeneratorRuntime.async(function profile$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.user.id;
          _context6.next = 3;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: id
            }
          }));

        case 3:
          userFound = _context6.sent;

          if (userFound) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          res.json({
            id: userFound.id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email
          });

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.profile = profile;

var createClient = function createClient(req, res) {
  var _req$body5, email, firstName, lastName, password, user, passwordHash, userSaved;

  return regeneratorRuntime.async(function createClient$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body5 = req.body, email = _req$body5.email, firstName = _req$body5.firstName, lastName = _req$body5.lastName;
          password = (0, _generateRamdonPassword.generatePassword)();
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: email
            }
          }));

        case 5:
          user = _context7.sent;

          if (!user) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "El cliente ya fue creado."
          }));

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 10:
          passwordHash = _context7.sent;
          _context7.next = 13;
          return regeneratorRuntime.awrap(prisma.user.create({
            data: {
              password: passwordHash,
              email: email,
              firstName: firstName,
              lastName: lastName
            }
          }));

        case 13:
          userSaved = _context7.sent;
          _context7.next = 16;
          return regeneratorRuntime.awrap(prisma.userRoles.create({
            data: {
              userId: userSaved.id,
              roleId: 2 // User default (Puede ser 1 si es admin)

            }
          }));

        case 16:
          sendEmailActivate(email, {
            email: email,
            password: password,
            id: userSaved.id
          });
          res.status(200).send("ok");
          _context7.next = 24;
          break;

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](2);
          console.log(_context7.t0);
          res.status(500).json({
            message: "Error creating user"
          });

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 20]]);
};

exports.createClient = createClient;

var confirm = function confirm(req, res) {
  var email;
  return regeneratorRuntime.async(function confirm$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          try {
            email = (0, _getEmailByToken.getEmailByToken)(req.params.token); // console.log("confrim", email);
            // const updatedUser = await prisma.user.update({
            //   where: {
            //     email,
            //   },
            //   data: {
            //     verified: true,
            //   },
            // });
            // const email = getEmailByToken(req.params.token)

            res.status(200).render("setPassword");
          } catch (error) {
            console.log(error);
            res.status(500).json({
              message: "Error confirming email"
            });
          }

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.confirm = confirm;

var reSendEmailClient = function reSendEmailClient(req, res) {
  var email, password, user, passwordHash, id;
  return regeneratorRuntime.async(function reSendEmailClient$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          email = req.body.email;
          password = (0, _generateRamdonPassword.generatePassword)();
          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: email
            }
          }));

        case 5:
          user = _context9.sent;
          console.log(user);

          if (user) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "User no exits"
          }));

        case 9:
          _context9.next = 11;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 11:
          passwordHash = _context9.sent;
          _context9.next = 14;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              email: email
            },
            data: {
              password: passwordHash,
              verified: true
            }
          }));

        case 14:
          id = user.id;
          sendEmailActivate(email, {
            email: email,
            password: password,
            id: id
          });
          return _context9.abrupt("return", res.status(200).send({
            ok: true
          }));

        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](2);
          console.log(_context9.t0);
          res.status(500).json({
            message: "Error al enviar el mail",
            ok: false
          });

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 19]]);
};

exports.reSendEmailClient = reSendEmailClient;

var forgotPassword = function forgotPassword(req, res) {
  var email, oldUser, secret, token, link;
  return regeneratorRuntime.async(function forgotPassword$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          email = req.body.email;
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: email
            }
          }));

        case 4:
          oldUser = _context10.sent;

          if (oldUser) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: "User no exists"
          }));

        case 7:
          secret = process.env.JWT_SECRET + oldUser.password;
          token = _jsonwebtoken["default"].sign({
            email: oldUser.email,
            id: oldUser.id
          }, secret, {
            expiresIn: "1d"
          });
          link = "".concat(process.env.APIGATEWAY_URL, "/api/auth/reset-password/").concat(oldUser.id, "/").concat(token); // Enviar el email con la plantilla mejorada

          (0, _transporterNodeMailer.sendEmail)(email, "Resetea tu Contraseña", "\n      <!DOCTYPE html>\n      <html lang=\"es\">\n        <head>\n          <meta charset=\"UTF-8\" />\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n          <title>Resetear Contrase\xF1a</title>\n          <style>\n            body {\n              font-family: Arial, sans-serif;\n              background-color: #f4f4f4;\n              color: #333;\n              margin: 0;\n              padding: 0;\n            }\n            .container {\n              max-width: 600px;\n              margin: 0 auto;\n              padding: 20px;\n              background-color: #333;\n              border-radius: 8px;\n            }\n            .header {\n              text-align: center;\n              padding: 10px 0;\n              background-color: #ff6f00;\n              color: white;\n              border-radius: 8px 8px 0 0;\n            }\n            .content {\n              padding: 20px;\n              background-color: #fff;\n              border-radius: 0 0 8px 8px;\n            }\n            .button {\n              display: block;\n              width: 100%;\n              max-width: 250px;\n              margin: 20px auto;\n              padding: 15px;\n              background-color: #ff6f00;\n              color: white !important;\n              text-align: center;\n              text-decoration: none;\n              border-radius: 4px;\n              font-weight: bold;\n              font-size: 16px;\n              cursor: pointer;\n            }\n            .button:hover {\n              background-color: #e65d00; /* Hacer m\xE1s oscuro al pasar el cursor */\n            }\n            .content p{\n              color: #000 !important;\n            }\n            .footer {\n              text-align: center;\n              margin-top: 30px;\n              color: #999;\n            }\n          </style>\n        </head>\n        <body>\n          <div class=\"container\">\n            <div class=\"header\">\n              <h1>Resetear tu Contrase\xF1a</h1>\n            </div>\n            <div class=\"content\">\n              <p>Hola,</p>\n              <p>Has solicitado un reseteo de contrase\xF1a para tu cuenta. Por favor, haz clic en el bot\xF3n de abajo para restablecer tu contrase\xF1a.</p>\n              <a href=\"".concat(link, "\" class=\"button\" target=\"_blank\">RESETEAR CONTRASE\xD1A</a>\n              <p>Si no solicitaste un reseteo de contrase\xF1a, simplemente ignora este correo.</p>\n              <p>Gracias,</p>\n              <p>El equipo de Distri7030</p>\n            </div>\n            <div class=\"footer\">\n              <p>\xA9 2024 Distri7030. Todos los derechos reservados.</p>\n            </div>\n          </div>\n        </body>\n      </html>\n      "));
          res.status(200).send({
            ok: true
          });
          _context10.next = 18;
          break;

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](1);
          console.log(_context10.t0);
          return _context10.abrupt("return", res.status(404).json({
            ok: false,
            message: "Ocurrió un error."
          }));

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

exports.forgotPassword = forgotPassword;

var GETresetPassword = function GETresetPassword(req, res) {
  var _req$params, id, token, idParse, oldUser, secret, verify;

  return regeneratorRuntime.async(function GETresetPassword$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, token = _req$params.token;
          idParse = parseInt(id, 10);
          _context11.next = 4;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 4:
          oldUser = _context11.sent;

          if (oldUser) {
            _context11.next = 8;
            break;
          }

          console.log("aqi");
          return _context11.abrupt("return", res.status(404).json({
            message: "User no exits"
          }));

        case 8:
          secret = process.env.JWT_SECRET + oldUser.password;

          try {
            verify = _jsonwebtoken["default"].verify(token, secret);
            res.render("index", {
              email: verify.email
            });
          } catch (error) {
            console.log(error);
            res.status(404).send("Link inválido");
          }

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.GETresetPassword = GETresetPassword;

var POSTresetPassword = function POSTresetPassword(req, res) {
  var _req$params2, id, token, password, idParse, oldUser, passwordHash;

  return regeneratorRuntime.async(function POSTresetPassword$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$params2 = req.params, id = _req$params2.id, token = _req$params2.token;
          password = req.body.password;
          idParse = parseInt(id, 10);
          _context12.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 5:
          oldUser = _context12.sent;

          if (oldUser) {
            _context12.next = 9;
            break;
          }

          console.log("aqi 2");
          return _context12.abrupt("return", res.status(404).json({
            message: "User no exits"
          }));

        case 9:
          _context12.prev = 9;
          // const verify = jwt.verify(token, secret);
          console.log(req.body);
          _context12.next = 13;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 13:
          passwordHash = _context12.sent;
          _context12.next = 16;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              id: idParse
            },
            data: {
              password: passwordHash,
              verified: true
            }
          }));

        case 16:
          res.render("redirect");
          _context12.next = 23;
          break;

        case 19:
          _context12.prev = 19;
          _context12.t0 = _context12["catch"](9);
          console.log(_context12.t0);
          return _context12.abrupt("return", res.status(400).json({
            ok: false,
            message: "Ocurrió un error."
          }));

        case 23:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[9, 19]]);
}; // const sendEmailActivate = (email, user) => {
//   var token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2d" });
//   const urlConfirm = `${process.env.APIGATEWAY_URL}/api/auth/confirm/${token}`;
// }


exports.POSTresetPassword = POSTresetPassword;

var GETSetPassword = function GETSetPassword(req, res) {
  var _req$params3, id, token, idParse, oldUser, secret, verify;

  return regeneratorRuntime.async(function GETSetPassword$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$params3 = req.params, id = _req$params3.id, token = _req$params3.token;
          idParse = parseInt(id, 10);
          _context13.next = 4;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: idParse
            }
          }));

        case 4:
          oldUser = _context13.sent;

          if (oldUser) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            message: "User no exits"
          }));

        case 7:
          secret = process.env.JWT_SECRET + oldUser.password;

          try {
            verify = _jsonwebtoken["default"].verify(token, secret);
            res.render("setPassword");
          } catch (error) {
            console.log(error);
            res.status(404).send("Link inválido");
          }

        case 9:
        case "end":
          return _context13.stop();
      }
    }
  });
};

exports.GETSetPassword = GETSetPassword;

var POSTSetPassword = function POSTSetPassword(req, res) {
  var token, password, id, oldUser, passwordHash;
  return regeneratorRuntime.async(function POSTSetPassword$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          token = req.params.token;
          password = req.body.password;
          id = parseInt((0, _getIdByToken.getIdByToken)(token));
          console.log(id);
          _context14.next = 6;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              id: id
            }
          }));

        case 6:
          oldUser = _context14.sent;

          if (oldUser) {
            _context14.next = 9;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            message: "User no exits"
          }));

        case 9:
          _context14.prev = 9;
          _context14.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 12:
          passwordHash = _context14.sent;
          _context14.next = 15;
          return regeneratorRuntime.awrap(prisma.user.update({
            where: {
              id: id
            },
            data: {
              password: passwordHash
            }
          }));

        case 15:
          res.render("redirect");
          _context14.next = 22;
          break;

        case 18:
          _context14.prev = 18;
          _context14.t0 = _context14["catch"](9);
          console.log(_context14.t0);
          return _context14.abrupt("return", res.status(400).json({
            ok: false,
            message: "Ocurrió un error."
          }));

        case 22:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[9, 18]]);
};

exports.POSTSetPassword = POSTSetPassword;

var sendEmailActivate = function sendEmailActivate(email, user) {
  var id = user.id;

  var token = _jsonwebtoken["default"].sign({
    email: email,
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "2d"
  });

  var urlConfirm = "".concat(process.env.APIGATEWAY_URL, "/api/auth/confirm/").concat(token);
  var message = "<p>Tu cuenta de cliente es: <br>\n      CORREO ELECTRONICO: ".concat(user.email, "\n      Confirma tu mail haciendo click en el siguiente enlace y establece una contrase\xF1a. </p> \n            <a href=\"").concat(urlConfirm, "\" style=\"display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;\">CONFIRMAR EMAIL</a>\n            <small>Link v\xE1lido por 3 dias</small>");
  (0, _transporterNodeMailer.sendEmail)(email, "CONFIRMA TU CUENTA EN DISTRI7030", message);
}; // createEditor = async (req, res) => {
//   const { email } = req.body
//   const result = validateUser(email, password)
//   if (!result.ok) {
//     return res.status(400).json({ message: result.message, ok: false })
//   }
//   try {
//     const existsEmail = await this.userModel.findEmail({ email })
//     if (existsEmail !== undefined) {
//       return res.status(400).json({ message: 'El email ya se encuentra registrado.', ok: false })
//     }
//     const hashedPassword = bcryptjs.hashSync(password, 10)
//     const input = {
//       email,
//       password: hashedPassword
//     }
//     const newUser = await this.userModel.createEditor({ input })
//     this.sendEmailActivate(email, { email, password })
//     res.status(201).json({ "id": newUser.id_user, "email": newUser.email, "rol": newUser.rol, "verified": newUser.verified })
//   } catch (error) {
//     res.status(404).json({ message: error.message, ok: false })
//   }
// }


var verifyToken = function verifyToken(req, res) {
  var token;
  return regeneratorRuntime.async(function verifyToken$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          token = req.cookies.token;

          if (token) {
            _context16.next = 3;
            break;
          }

          return _context16.abrupt("return", res.status(401).json({
            message: "Unauthorized"
          }));

        case 3:
          _jsonwebtoken["default"].verify(token, _secrets.JWT_SECRET, function _callee(err, user) {
            var userFound, isAdmin;
            return regeneratorRuntime.async(function _callee$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    if (!err) {
                      _context15.next = 2;
                      break;
                    }

                    return _context15.abrupt("return", res.status(401).json({
                      message: "Unauthorized"
                    }));

                  case 2:
                    _context15.next = 4;
                    return regeneratorRuntime.awrap(prisma.user.findUnique({
                      where: {
                        id: user.id
                      },
                      include: {
                        UserRoles: {
                          include: {
                            RoleTable: true
                          }
                        }
                      }
                    }));

                  case 4:
                    userFound = _context15.sent;

                    if (userFound) {
                      _context15.next = 7;
                      break;
                    }

                    return _context15.abrupt("return", res.status(404).json({
                      message: "User not found"
                    }));

                  case 7:
                    isAdmin = userFound.UserRoles.some(function (userRole) {
                      return userRole.RoleTable.name === _roles.RoleTable.ADMIN;
                    });
                    res.json({
                      id: userFound.id,
                      firstName: userFound.firstName,
                      lastName: userFound.lastName,
                      email: userFound.email,
                      isAdmin: isAdmin
                    });

                  case 9:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context16.stop();
      }
    }
  });
};

exports.verifyToken = verifyToken;