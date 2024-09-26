import { PrismaClient } from "@prisma/client";
import { upload, s3 } from "../middlewares/upload.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

export const createProduct = async(req,res) => {

}

export const createProductWithImage = async (req, res) => {
  try {
    const {
      codeCompatibility,
      priceSale,
      titleImage,
      description,
      categoryId,
      subCategoryId,
    } = req.body;

    console.log(req.body);
    console.log(req.file);
    // Validación de datos
    if (
      !codeCompatibility ||
      !priceSale ||
      !categoryId ||
      !subCategoryId ||
      !req.file // Verificamos que el archivo de imagen esté presente
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      isNaN(priceSale) ||
      typeof codeCompatibility !== "string" ||
      typeof description !== "string" ||
      isNaN(categoryId) ||
      isNaN(subCategoryId)
    ) {
      return res.status(400).json({ error: "Invalid data types" });
    }

    // Verificación de existencia de categoría y subcategoría
    const [categoryExists, subCategoryExists] = await prisma.$transaction([
      prisma.category.findUnique({ where: { id: parseInt(categoryId) } }),
      prisma.subCategory.findUnique({
        where: { id: parseInt(subCategoryId) },
      }),
    ]);
    if (!categoryExists || !subCategoryExists) {
      return res
        .status(400)
        .json({ error: "Invalid category or subcategory ID" });
    }

    const file = req.file;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Asegúrate de definir esta variable de entorno
      Key: Date.now().toString() + "-" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      // No usamos ACL si el bucket no lo permite
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    // Construir la URL pública de la imagen
    const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    // Creación de la imagen en la base de datos
    const newImage = await prisma.image.create({
      data: {
        title: titleImage || file.originalname,
        imageUrl: imageUrl,
        categoryId: parseInt(categoryId),
      },
    });
    console.log(newImage);
    const imageId = newImage.id;

    // Creación del producto con transacción
    const product = await prisma.products.create({
      data: {
        codeCompatibility,
        priceSale: parseFloat(priceSale),
        imageId,
        description,
        categoryId: parseInt(categoryId),
        subCategoryId: parseInt(subCategoryId),
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createImage = async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Date.now().toString() + "-" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Eliminamos esta línea
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    if (!titleImage || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newImage = await prisma.image.create({
      data: {
        title: titleImage,
        imageUrl: imageUrl,
        categoryId: categoryId, // Asocia la imagen a una categoría
      },
    });

    res.status(200).json(newImage);
  } catch (error) {
    console.error("Error creating image:", error);
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
