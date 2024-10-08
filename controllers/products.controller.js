import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const {
      codeCompatibility,
      priceSale,
      image,
      description,
      categoryId,
      subCategoryId,
    } = req.body;

    // Validación de datos
    if (!codeCompatibility || !priceSale || !categoryId || !subCategoryId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      typeof categoryId === "undefined" ||
      typeof subCategoryId === "undefined" ||
      typeof priceSale === "undefined"
    ) {
      return res.status(400).json(["Invalid category or subcategory ID"]);
    }

    if (typeof priceSale !== "number") {
      return res.status(400).json(["Invalid price expected number"]);
    }
    if (typeof codeCompatibility !== "string") {
      return res
        .status(400)
        .json(["Invalid codeCompatibility expected string"]);
    }
    if (typeof image !== "string") {
      return res.status(400).json(["Invalid image expected string"]);
    }
    if (typeof description !== "string") {
      return res.status(400).json(["Invalid description expected string"]);
    }
    if (typeof categoryId !== "number") {
      return res.status(400).json(["Invalid categoryId expected number"]);
    }
    if (typeof subCategoryId !== "number") {
      return res.status(400).json(["Invalid subCategoryId expected number"]);
    }

    // Verificación de existencia de categoría y subcategoría
    const [categoryExists, subCategoryExists] = await prisma.$transaction([
      prisma.category.findUnique({ where: { id: categoryId } }),
      prisma.subCategory.findUnique({ where: { id: subCategoryId } }),
    ]);

    if (!categoryExists || !subCategoryExists) {
      return res
        .status(400)
        .json({ error: "Invalid category or subcategory ID" });
    }

    // Creación del producto con transacción
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.products.create({
        data: {
          codeCompatibility,
          priceSale,
          image,
          description,
          categoryId, // Conecta directamente por ID
          subCategoryId, // Conecta directamente por ID
        },
      });

      return newProduct; // Devuelve el producto creado
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsWithDiscount = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        discount: {
          not: null,
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await prisma.products.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
