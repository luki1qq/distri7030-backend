"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProductByCategory = exports.getImageInfo = exports.getProductsByImage = exports.getProductSelectedByImage = exports.getImagesByCategory = exports.getSubCategory = exports.getSubcategories = exports.getCategories = exports.getCategory = exports.createSubCategory = exports.createCategory = void 0;

var _client = require("@prisma/client");

var prisma = new _client.PrismaClient();

var createCategory = function createCategory(req, res) {
  var description, category;
  return regeneratorRuntime.async(function createCategory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          description = req.body.description; // Validación de datos

          if (description) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Description is required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(prisma.category.create({
            data: {
              description: description
            }
          }));

        case 6:
          category = _context.sent;
          res.status(200).json(category);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Error creating category:", _context.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.createCategory = createCategory;

var createSubCategory = function createSubCategory(req, res) {
  var _req$body, description, categoryId, categoryExists, subCategory;

  return regeneratorRuntime.async(function createSubCategory$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, description = _req$body.description, categoryId = _req$body.categoryId; // Validación básica

          if (!(!description || !categoryId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Description and category ID are required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(prisma.category.findUnique({
            where: {
              id: categoryId
            }
          }));

        case 6:
          categoryExists = _context2.sent;

          if (categoryExists) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Invalid category ID"
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(prisma.subCategory.create({
            data: {
              description: description,
              categoryId: categoryId
            }
          }));

        case 11:
          subCategory = _context2.sent;
          res.status(200).json(subCategory);
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error("Error creating subcategory:", _context2.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.createSubCategory = createSubCategory;

var getCategory = function getCategory(req, res) {
  var id, category;
  return regeneratorRuntime.async(function getCategory$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.category.findUnique({
            where: {
              id: parseInt(id)
            }
          }));

        case 4:
          category = _context3.sent;

          if (category) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Category not found"
          }));

        case 7:
          res.json(category);
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error("Error getting category:", _context3.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getCategory = getCategory;

var getCategories = function getCategories(req, res) {
  var category;
  return regeneratorRuntime.async(function getCategories$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(prisma.category.findMany({
            select: {
              id: true,
              description: true,
              isActive: true
            }
          }));

        case 3:
          category = _context4.sent;
          res.json(category);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("Error getting category:", _context4.t0);
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

exports.getCategories = getCategories;

var getSubcategories = function getSubcategories(req, res) {
  var subCategory;
  return regeneratorRuntime.async(function getSubcategories$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(prisma.subCategory.findMany());

        case 3:
          subCategory = _context5.sent;
          res.json(subCategory);
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error("Error getting subcategory:", _context5.t0);
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

exports.getSubcategories = getSubcategories;

var getSubCategory = function getSubCategory(req, res) {
  var id, subCategories;
  return regeneratorRuntime.async(function getSubCategory$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(prisma.subCategory.findMany({
            where: {
              categoryId: parseInt(id)
            }
          }));

        case 4:
          subCategories = _context6.sent;

          if (subCategories) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "Subcategories not found"
          }));

        case 7:
          res.json(subCategories);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error("Error getting subcategories:", _context6.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // export const getCatalogByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     // Consulta optimizada
//     const products = await prisma.products.findMany({
//       where: {
//         categoryId: parseInt(categoryId), // Filtra por categoría
//         imageId: { not: null }, // Solo productos con una imagen asociada
//       },
//       select: {
//         imageId: true, // Selecciona el ID de la imagen (para evitar traer datos innecesarios de la relación)
//       },
//     });
//     // filtrar productos con imagen repetida
//     const uniqueProducts = products.filter(
//       (product, index, self) =>
//         index === self.findIndex((t) => t.imageId === product.imageId)
//     );
//     // obtener titulo y descripcion de la imagen
//     const ImageOfProducts = await prisma.image.findMany({
//       where: {
//         id: {
//           in: uniqueProducts.map((product) => product.imageId),
//         },
//       },
//       select: {
//         id: true,
//         title: true,
//         imageUrl: true,
//       },
//     });
//     res.json(ImageOfProducts);
//   } catch (error) {
//     console.error("Error getting products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


exports.getSubCategory = getSubCategory;

var getImagesByCategory = function getImagesByCategory(req, res) {
  var categoryId, images;
  return regeneratorRuntime.async(function getImagesByCategory$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          categoryId = req.params.categoryId;

          if (categoryId) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: "Category ID is required"
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(prisma.image.findMany({
            where: {
              categoryId: parseInt(categoryId) // ID de la categoría seleccionada

            },
            select: {
              id: true,
              title: true,
              imageUrl: true,
              categoryId: true
            }
          }));

        case 6:
          images = _context7.sent;
          res.json(images);
          _context7.next = 14;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error("Error getting products:", _context7.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getImagesByCategory = getImagesByCategory;

var getProductSelectedByImage = function getProductSelectedByImage(req, res) {
  var imageId, products;
  return regeneratorRuntime.async(function getProductSelectedByImage$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          imageId = req.params.imageId;

          if (imageId) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: "image ID is required"
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              imageId: parseInt(imageId) // ID de la imagen seleccionada

            },
            select: {
              id: true,
              codeCompatibility: true,
              priceSale: true,
              description: true,
              Category: {
                select: {
                  description: true // Obtener el nombre de la categoría (campo description)

                }
              },
              subCategory: {
                select: {
                  description: true // Obtener el nombre de la subcategoría (campo description)

                }
              }
            }
          }));

        case 6:
          products = _context8.sent;

          if (products) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: "Products not found"
          }));

        case 9:
          res.json(products);
          _context8.next = 16;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error("Error getting product:", _context8.t0);
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

exports.getProductSelectedByImage = getProductSelectedByImage;

var getProductsByImage = function getProductsByImage(req, res) {
  var imageId, products;
  return regeneratorRuntime.async(function getProductsByImage$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          imageId = req.params.imageId;

          if (imageId) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: "Image ID is required"
          }));

        case 4:
          _context9.next = 6;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              imageId: parseInt(imageId)
            },
            select: {
              codeCompatibility: true,
              description: true,
              measure: true
            }
          }));

        case 6:
          products = _context9.sent;
          res.json(products);
          _context9.next = 14;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error("Error getting products:", _context9.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getProductsByImage = getProductsByImage;

var getImageInfo = function getImageInfo(req, res) {
  var imageId, image;
  return regeneratorRuntime.async(function getImageInfo$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          imageId = req.params.imageId;

          if (imageId) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            error: "Image ID is required"
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(prisma.image.findUnique({
            where: {
              id: parseInt(imageId)
            }
          }));

        case 6:
          image = _context10.sent;
          res.json(image);
          _context10.next = 14;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.error("Error getting image info:", _context10.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getImageInfo = getImageInfo;

var getProductByCategory = function getProductByCategory(req, res) {
  var categoryId, products;
  return regeneratorRuntime.async(function getProductByCategory$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          categoryId = req.params.categoryId;
          _context11.next = 4;
          return regeneratorRuntime.awrap(prisma.products.findMany({
            where: {
              categoryId: parseInt(categoryId)
            }
          }));

        case 4:
          products = _context11.sent;
          res.json(products);
          _context11.next = 12;
          break;

        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          console.error("Error getting products:", _context11.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getProductByCategory = getProductByCategory;