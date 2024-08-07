import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDiscounts = async (req, res) => {
  try {
    const discounts = await prisma.discount.findMany();
    res.json(discounts);
  } catch (error) {
    console.error("Error getting discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDiscountsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const discounts = await prisma.discount.findMany({
      where: {
        productId: parseInt(productId),
      },
    });
    res.json(discounts);
  } catch (error) {
    console.error("Error getting discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDiscountsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const discounts = await prisma.discount.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.json(discounts);
  } catch (error) {
    console.error("Error getting discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
