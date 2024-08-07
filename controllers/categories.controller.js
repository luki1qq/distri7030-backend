import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  try {
    const { description } = req.body;

    // Validación de datos
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const category = await prisma.category.create({
      data: { description },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const createSubCategory = async (req, res) => {
  try {
    const { description, categoryId } = req.body;

    // Validación básica
    if (!description || !categoryId) {
      return res
        .status(400)
        .json({ error: "Description and category ID are required" });
    }

    // Verificación de existencia de la categoría
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const subCategory = await prisma.subCategory.create({
      data: { description, categoryId },
    });

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getCategories = async (req, res) => {
  try {
    const category = await prisma.category.findMany();
    res.json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const subCategory = await prisma.subCategory.findMany();
    res.json(subCategory);
  } catch (error) {
    console.error("Error getting subcategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId: parseInt(id) },
    });

    if (!subCategories) {
      return res.status(404).json({ error: "Subcategories not found" });
    }

    res.json(subCategories);
  } catch (error) {
    console.error("Error getting subcategories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
