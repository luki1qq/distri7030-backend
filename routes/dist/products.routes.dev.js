"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _client = require("@prisma/client");

var _productsController = require("../controllers/products.controller.js");

var _validateToken = require("../middlewares/validateToken.js");

var _upload = require("../middlewares/upload.js");

var _clientS = require("@aws-sdk/client-s3");

var _xlsx = _interopRequireDefault(require("xlsx"));

var _path = _interopRequireDefault(require("path"));

var _validateRol = require("../middlewares/validateRol.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prisma = new _client.PrismaClient();
var router = (0, _express.Router)();
router.post("/create-product-with-image", _validateToken.authRequired, _upload.upload.single("image"), _productsController.createProductWithImage); // Usados con el runner

router.post("/create-products", _productsController.createProduct);
router.post("/create-images-link", _productsController.createImageLink);
router.get("/get-products", _productsController.getProducts);
router.get("/get-product/:id", _productsController.getProduct);
router.get("/get-products-by-category/:categoryId", _productsController.getProductsByCategory);
router["delete"]("/delete-product/:id", _validateToken.authRequired, _validateRol.isAdmin, _productsController.deleteProduct);
router.post("/create-image-by-category", _upload.upload.single("image"), _productsController.createImage);
router.post("/create-image", _productsController.createImageAsociatedAtURL);
router.post("/upload", _upload.upload.single("image"), function _callee(req, res) {
  var file, params, command, imageUrl, newImage;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log(req.body);
          file = req.file;
          params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Date.now().toString() + "-" + file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype // ACL: 'public-read', // Eliminamos esta línea

          };
          command = new _clientS.PutObjectCommand(params);
          _context.next = 7;
          return regeneratorRuntime.awrap(_upload.s3.send(command));

        case 7:
          imageUrl = "https://".concat(params.Bucket, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(params.Key); // Guardar en la base de datos

          _context.next = 10;
          return regeneratorRuntime.awrap(prisma.image.create({
            data: {
              title: req.body.title,
              imageUrl: imageUrl,
              categoryId: 1
            }
          }));

        case 10:
          newImage = _context.sent;
          res.status(200).json({
            message: "Imagen subida exitosamente",
            image: newImage
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            error: "Error al subir la imagen"
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.get("/get-images-s3", function _callee2(req, res) {
  var bucketName, folderPrefix, params, allObjects, continuationToken, command, data, permanentLinks, workbook, worksheetData, worksheet, excelFilePath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          bucketName = process.env.AWS_BUCKET_NAME;
          folderPrefix = "nombre-de-la-carpeta/";
          params = {
            Bucket: bucketName
          };
          allObjects = [];
          continuationToken = undefined;

        case 6:
          command = new _clientS.ListObjectsV2Command(_objectSpread({}, params, {
            ContinuationToken: continuationToken
          }));
          _context2.next = 9;
          return regeneratorRuntime.awrap(_upload.s3.send(command));

        case 9:
          data = _context2.sent;
          allObjects = allObjects.concat(data.Contents);
          continuationToken = data.IsTruncated ? data.NextContinuationToken : undefined;

        case 12:
          if (continuationToken) {
            _context2.next = 6;
            break;
          }

        case 13:
          permanentLinks = allObjects.map(function (item) {
            var url = "https://".concat(bucketName, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(item.Key);
            return {
              key: item.Key,
              url: url
            };
          }); // Crear y guardar archivo Excel

          workbook = _xlsx["default"].utils.book_new();
          worksheetData = permanentLinks.map(function (link) {
            return [link.key, link.url];
          });
          worksheet = _xlsx["default"].utils.aoa_to_sheet([["Key", "URL"]].concat(_toConsumableArray(worksheetData)));

          _xlsx["default"].utils.book_append_sheet(workbook, worksheet, "S3 Links");

          excelFilePath = _path["default"].join(process.cwd(), 's3_links.xlsx');

          _xlsx["default"].writeFile(workbook, excelFilePath);

          console.log("Enlaces guardados en Excel: ".concat(excelFilePath));
          res.json({
            message: "Enlaces generados y guardados correctamente.",
            excelFilePath: excelFilePath
          });
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al listar objetos en S3:", _context2.t0);
          res.status(500).json({
            error: "Error al obtener las imágenes."
          });

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
var _default = router;
exports["default"] = _default;