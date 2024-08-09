import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//toDo Validate Discount on the order controller
// Consider using a middleware to validate the discount
// The middleware should check if the discount is valid
export const createOrder = async (req, res) => {
  try {
    const { detailOrder } = req.body;

    // Validate input
    if (!req.user.id || !detailOrder || !Array.isArray(detailOrder)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Calculate total based on detailOrder items
    const total = detailOrder.reduce((acc, item) => {
      if (!item.productId || !item.quantity || !item.price) {
        throw new Error("Incomplete detailOrder item"); // Throw error for missing data
      }
      return acc + item.quantity * item.price;
    }, 0);

    // Create order in the database
    const resultOrder = await prisma.order.create({
      data: {
        userId : req.user.id,
        total,
        detailOrder: {
          create: detailOrder.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { detailOrder: true }, // Include detailOrder in the result
    });

    res.status(201).json(resultOrder);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error creating order" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Delete order from the database
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: "CANCELADO" },
    });

    res.status(204).end();
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error canceling order" });
  }
};
