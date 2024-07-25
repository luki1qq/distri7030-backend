import { Router } from "express";
// import { prisma } from "../db.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
router.get("/get-products", async (req, res) => {
  const products = await prisma.products.findMany();
  res.json(products);
});

router.get("/get-product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.products.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(product);
});

router.post("/create-product", async (req, res) => {
  const { codeCompatibility, priceSale, isActive, description, categoryId, subCategoryId, image } = req.body;
  const product = await prisma.products.create({
    data: {
      codeCompatibility,
      priceSale,
      isActive,
      description,
      categoryId,
      subCategoryId,
      image
    },
  });
  res.json(product);
})


export default router;
