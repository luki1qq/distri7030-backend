import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";
import {
  createProductWithImage,
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  getProductsByCategory,
  createImage,
} from "../controllers/products.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload, s3 } from "../middlewares/upload.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { isAdmin } from "../middlewares/validateRol.js";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/create-product-with-image",
  authRequired,
  upload.single("image"),
  createProductWithImage
);
router.post("/create-products")

router.get("/get-products", getProducts);
router.get("/get-product/:id", getProduct);
router.get("/get-products-by-category/:categoryId", getProductsByCategory);
router.delete("/delete-product/:id", authRequired, isAdmin, deleteProduct);
router.post("/create-image-by-category", upload.single("image"), createImage);
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
export default router;
