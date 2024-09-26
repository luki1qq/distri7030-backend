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

export const getDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await prisma.discount.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.json(discount);
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

export const createDiscount = async (req, res) => {
  try {
    const { percentage, name, startDate, endDate, products } = req.body;
    // Validate input
    if (!percentage || !name || !startDate || !endDate || !products) {
      return res.status(400).json(["Invalid input data"]);
    }
    // const productsId = products.map((product) => product.id);
    // Create discount in the database
    // console.log(productsId)
    const resultDiscount = await prisma.discount.create({
      data: {
        percentage,
        name,
        startDate,
        endDate,
        ProductDiscount: {
          create: products.map((productId) => ({ productId })),
        },
      },
    });

    res.json(resultDiscount);
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ToDo : Verificar la existencia de los descuentos actualmente aplicados al usuarios
export const createDiscountToUser = async (req, res) => {
  try {
    const { userId, discountId } = req.body;
    // Validate input
    if (!discountId || !userId) {
      return res.status(400).json(["Invalid input data"]);
    }

    // Create discount in the database
    const resultDiscount = await prisma.userDiscount.create({
      data: {
        userId: parseInt(userId),
        discountId: parseInt(discountId),
      },
    });

    res.json(resultDiscount);
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProductsByDiscountByUser = async (req, res) => {
  try {
    // Obtener los productos con descuento
    const productsWithDescounts = await prisma.products.findMany({
      include: {
        ProductDiscount: {
          where: {
            Discount: {
              isActive: true,
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
              UserDiscount: { some: { userId: parseInt(req.user.id) } },
            },
          },
          include: {
            Discount: true,
          },
        },
      },
    });

    // Obtener el mejor descuento por producto
    const bestDiscountPerProducts = new Map();
    for (const product of productsWithDescounts) {
      for (const productDiscount of product.ProductDiscount) {
        const discount = productDiscount.Discount;
        if (bestDiscountPerProducts.has(product.id)) {
          const bestDiscountExist = bestDiscountPerProducts.get(product.id);
          if (discount.percentage > bestDiscountExist.percentage) {
            bestDiscountPerProducts.set(product.id, discount);
          }
        } else {
          bestDiscountPerProducts.set(product.id, discount);
        }
      }
    }
    // Obtener los productos sin descuento
    const productsWithoutDiscount = productsWithDescounts
      .filter((product) => !bestDiscountPerProducts.has(product.id))
      .map((product) => ({
        id: product.id,
        codeCompatibility: product.codeCompatibility,
        priceSale: product.priceSale,
        description: product.description,
        percentage: 0,
        finalPrice: product.priceSale,
        discountPercentage: 0,
      }));

    // Obtener los productos con descuento
    const resultProductsWithDescounts = Array.from(
      bestDiscountPerProducts.entries()
    ).map(([productId, discount]) => {
      const product = productsWithDescounts.find(
        (product) => product.id === productId
      );
      return {
        id: product.id,
        codeCompatibility: product.codeCompatibility,
        priceSale: product.priceSale,
        description: product.description,
        percentage: discount.percentage,
        finalPrice:
          product.priceSale - (product.priceSale * discount.percentage) / 100,
        discountPercentage: discount.percentage,
      };
    });
    // Unir los productos con descuento y sin descuento
    const products = resultProductsWithDescounts.concat(
      productsWithoutDiscount
    );

    res.json(products);
  } catch (error) {
    console.error("Error getting discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const associateManyUsersToDiscount = async (req, res) => {
  try {
    const { userIds, discountId } = req.body;
    // Validate input

    console.log(userIds);
    console.log(discountId);

    if (!discountId || !userIds) {
      return res.status(400).json(["fqefqe"]);
    }

    // Create discount in the database
    const resultDiscount = await prisma.userDiscount.createMany({
      data: userIds.map((userId) => ({
        userId: Number(userId.id),
        discountId: Number(discountId),
      })),
    });

    res.json(resultDiscount);
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDiscountsUsers = async (req, res) => {  
  try {
    const discounts = await prisma.userDiscount.findMany();
    res.json(discounts);
  } catch (error) {
    console.error("Error getting discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};