import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import {
  createProductWithImage,
  getProduct,
  getProducts,
  deleteProduct,
  getProductsByCategory,
  createImage,
  createImageAsociatedAtURL,
  createProduct,
  createImageLink
} from "../controllers/products.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload, s3 } from "../middlewares/upload.js";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { isAdmin } from "../middlewares/validateRol.js";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/create-product-with-image",
  authRequired,
  upload.single("image"),
  createProductWithImage
);
// Usados con el runner
router.post("/create-products", createProduct);
router.post("/create-images-link", createImageLink);
router.get("/get-products", getProducts);
router.get("/get-product/:id", getProduct);
router.get("/get-products-by-category/:categoryId", getProductsByCategory);
router.delete("/delete-product/:id", authRequired, isAdmin, deleteProduct);
router.post("/create-image-by-category", upload.single("image"), createImage);
router.post("/create-image", createImageAsociatedAtURL);
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const file = req.file;
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

    // Guardar en la base de datos
    const newImage = await prisma.image.create({
      data: {
        title: req.body.title,
        imageUrl: imageUrl,
        categoryId: 1,
      },
    });

    res
      .status(200)
      .json({ message: "Imagen subida exitosamente", image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

router.get("/get-images-s3", async (req, res) => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME; // Asegúrate de obtener el nombre del bucket correctamente
    const folderPrefix = "nombre-de-la-carpeta/"; // Prefijo opcional, si deseas listar en una carpeta

    const params = {
      Bucket: bucketName,
      // Prefix: folderPrefix, // Si estás buscando dentro de una subcarpeta
    };

    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    // Crear los enlaces permanentes
    const permanentLinks = data.Contents.map((item) => {
      const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
      return { key: item.Key, url };
    });

    console.log("Enlaces permanentes de los objetos en S3:");
    permanentLinks.forEach((link) => console.log(link));

    res.json({ links: permanentLinks });
  } catch (error) {
    console.error("Error al listar objetos en S3:", error);
  }
});
export default router;
