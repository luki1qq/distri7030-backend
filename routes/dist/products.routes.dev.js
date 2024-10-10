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

var _validateRol = require("../middlewares/validateRol.js");

// import { prisma } from "../db.js";
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
  var bucketName, folderPrefix, params, command, data, permanentLinks;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          bucketName = process.env.AWS_BUCKET_NAME; // Asegúrate de obtener el nombre del bucket correctamente

          folderPrefix = "nombre-de-la-carpeta/"; // Prefijo opcional, si deseas listar en una carpeta

          params = {
            Bucket: bucketName // Prefix: folderPrefix, // Si estás buscando dentro de una subcarpeta

          };
          command = new _clientS.ListObjectsV2Command(params);
          _context2.next = 7;
          return regeneratorRuntime.awrap(_upload.s3.send(command));

        case 7:
          data = _context2.sent;
          // Crear los enlaces permanentes
          permanentLinks = data.Contents.map(function (item) {
            var url = "https://".concat(bucketName, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(item.Key);
            return {
              key: item.Key,
              url: url
            };
          });
          console.log("Enlaces permanentes de los objetos en S3:");
          permanentLinks.forEach(function (link) {
            return console.log(link);
          });
          res.json({
            links: permanentLinks
          });
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al listar objetos en S3:", _context2.t0);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
var _default = router;
exports["default"] = _default;