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
  createImageLink,
} from "../controllers/products.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload, s3 } from "../middlewares/upload.js";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import XLSX from 'xlsx';
import path from 'path';
import { isAdmin } from "../middlewares/validateRol.js";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/create-product-with-image",
  
  upload.single("image"),
  createProductWithImage
);
// Usados con el runner
router.post("/create-products", createProduct);
router.post("/create-images-link", createImageLink);
router.get("/get-products", getProducts);
router.get("/get-product/:id", getProduct);
router.get("/get-products-by-category/:categoryId", getProductsByCategory);
router.delete("/delete-product/:id",   deleteProduct);
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
    const bucketName = process.env.AWS_BUCKET_NAME;
    const folderPrefix = "nombre-de-la-carpeta/";

    const params = {
      Bucket: bucketName,
    };

    let allObjects = [];
    let continuationToken = undefined;

    do {
      const command = new ListObjectsV2Command({
        ...params,
        ContinuationToken: continuationToken,
      });
      const data = await s3.send(command);
      allObjects = allObjects.concat(data.Contents);
      continuationToken = data.IsTruncated ? data.NextContinuationToken : undefined;
    } while (continuationToken);

    const permanentLinks = allObjects.map((item) => {
      const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
      return { key: item.Key, url };
    });

    // Crear y guardar archivo Excel
    const workbook = XLSX.utils.book_new();
    const worksheetData = permanentLinks.map(link => [link.key, link.url]);
    const worksheet = XLSX.utils.aoa_to_sheet([["Key", "URL"], ...worksheetData]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "S3 Links");

    const excelFilePath = path.join(process.cwd(), 's3_links.xlsx');
    XLSX.writeFile(workbook, excelFilePath);
    console.log(`Enlaces guardados en Excel: ${excelFilePath}`);

    res.json({ message: "Enlaces generados y guardados correctamente.", excelFilePath });
  } catch (error) {
    console.error("Error al listar objetos en S3:", error);
    res.status(500).json({ error: "Error al obtener las imágenes." });
  }
});

export default router;
