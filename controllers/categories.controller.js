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
    const category = await prisma.category.findMany({
      select: {
        id: true,
        description: true,
        isActive: true,
      },
    });
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

// export const getCatalogByCategory = async (req, res) => {
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

export const getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }
    const images = await prisma.image.findMany({
      where: {
        categoryId: parseInt(categoryId), // ID de la categoría seleccionada
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        categoryId: true,
      },
    });
    res.json(images);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductSelectedByImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "image ID is required" });
    }

    const products = await prisma.products.findMany({
      where: {
        imageId: parseInt(imageId), // ID de la imagen seleccionada
      },
      select: {
        id: true,
        codeCompatibility: true,
        priceSale: true,
        description: true,
        Category: {
          select: {
            description: true, // Obtener el nombre de la categoría (campo description)
          },
        },
        subCategory: {
          select: {
            description: true, // Obtener el nombre de la subcategoría (campo description)
          },
        },
      },
    });

    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsByImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }
    const products = await prisma.products.findMany({
      where: { imageId: parseInt(imageId) },
      select: {
        codeCompatibility: true,
        description: true,
        measure: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getImageInfo = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }
    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
    });
    res.json(image);
  } catch (error) {
    console.error("Error getting image info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductByCategory = async (req, res) => {
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
