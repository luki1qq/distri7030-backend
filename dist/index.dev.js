"use strict";

var _productsRoutes = _interopRequireDefault(require("./routes/products.routes.js"));

var _usersRoutes = _interopRequireDefault(require("./routes/users.routes.js"));

var _categoriesRoutes = _interopRequireDefault(require("./routes/categories.routes.js"));

var _authRoutes = _interopRequireDefault(require("./routes/auth.routes.js"));

var _orderRoutes = _interopRequireDefault(require("./routes/order.routes.js"));

var _discountRoutes = _interopRequireDefault(require("./routes/discount.routes.js"));

var _app = _interopRequireDefault(require("./app.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";

_app["default"].listen(PORT, HOST, function () {
  console.log("Servidor corriendo en http://".concat(HOST, ":").concat(PORT));
});

_app["default"].use("/api/products", _productsRoutes["default"]);

_app["default"].use("/api/users", _usersRoutes["default"]);

_app["default"].use("/api/categories", _categoriesRoutes["default"]);

_app["default"].use("/api/auth", _authRoutes["default"]);

_app["default"].use("/api/order", _orderRoutes["default"]);

_app["default"].use("/api/discount", _discountRoutes["default"]);

console.log("server on port ", 3000);