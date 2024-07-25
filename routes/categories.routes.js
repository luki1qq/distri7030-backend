import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/get-category", async (req, res) => {
  const products = await prisma.products.findMany();
  res.json(products);
});

router.post("/create-category", async (req, res) => {
  const { name, description } = req.body;
  res.json({ name, description });
});

export default router;
