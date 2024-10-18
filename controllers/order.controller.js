import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { sendEmail } from "../utils/transporterNodeMailer.js";

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    // Obtener los parámetros de paginación desde la URL o definir valores predeterminados
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
    const limit = parseInt(req.query.limit) || 10; // Número de resultados por página (por defecto 10)

    // Calcular cuántos registros omitir (skip) basado en la página actual y el límite
    const skip = (page - 1) * limit;

    // Consulta Prisma con paginación
    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
        isActive: true,
      },
      skip: skip, // Omitir el número de registros calculados
      take: limit, // Traer solo el número de registros indicados en "limit"
    });

    // Contar el número total de órdenes activas para este usuario
    const totalOrders = await prisma.order.count({
      where: {
        userId: parseInt(userId),
        isActive: true,
      },
    });

    // Devolver los datos paginados junto con el número total de páginas
    res.json({
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders: totalOrders,
      orders: orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersGeneral = async (req, res) => {
  try {
    // Obtener los parámetros de paginación desde la consulta o definir valores predeterminados
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
    const limit = parseInt(req.query.limit) || 10; // Número de resultados por página (por defecto 10)

    // Calcular cuántos registros omitir (skip) basado en la página actual y el límite
    const skip = (page - 1) * limit;

    // Consulta Prisma con paginación
    const orders = await prisma.order.findMany({
      skip: skip, // Omitir el número de registros calculados
      take: limit, // Limitar el número de registros a devolver
      select: {
        id: true,
        total: true,
        observation: true,
        orderState: true,
        createdAt: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    });

    // Contar el número total de órdenes
    const totalOrders = await prisma.order.count();

    // Devolver los datos paginados junto con el número total de páginas
    res.json({
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders: totalOrders,
      orders: orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
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
    const { userId } = req.params;
    console.log(detailOrder);

    // Validate input
    console.log("user id");

    // console.log(detailOrder);
    // console.log(Array.isArray(detailOrder));

    if (!userId || !detailOrder || !Array.isArray(detailOrder)) {
      return res.status(400).json(["Invalid input data"]);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    // Calculate total based on detailOrder items
    const total = detailOrder.reduce((acc, item) => {
      if (
        typeof item.quantity !== "number" ||
        typeof item.price !== "number" ||
        typeof item.productId !== "number"
      ) {
        return res.status(400).json(["Invalid input data"]);
      }
      if (!item.productId || !item.quantity || !item.price) {
        throw new Error("Incomplete detailOrder item"); // Throw error for missing data
      }
      return acc + item.quantity * item.price;
    }, 0);

    // Create order in the database
    const resultOrder = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total,
        observation: req.body.observation,
        detailOrder: {
          create: detailOrder.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        detailOrder: {
          include: {
            Product: {
              select: {
                codeCompatibility: true, // Get the codeCompatibility
              },
            },
          },
        },
      }, // Include detailOrder with product details
    });

    console.log(resultOrder);

    // Limit to 5 products in the email
    const limitedOrderDetails = resultOrder.detailOrder.slice(0, 5);

    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Resumen de Pedido</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #ff6f00;
          }
          .order-summary {
            margin-top: 20px;
          }
          .order-summary th, .order-summary td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .total {
            font-weight: bold;
            color: #ff6f00;
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nuevo Pedido</h1>
          <p>Estimado <strong>${user.firstName} ${user.lastName}</strong>,</p>
          <p>Gracias por tu pedido. A continuación, te presentamos el resumen del pedido realizado:</p>

          <h2>Detalles del Pedido</h2>
          <table class="order-summary" width="100%">
            <thead>
              <tr>
                <th>Producto (Código de Compatibilidad)</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${limitedOrderDetails
                .map(
                  (detail) => `
                <tr>
                  <td>${detail.Product.codeCompatibility}</td>
                  <td>${detail.quantity}</td>
                  <td>$${detail.price.toFixed(2)}</td>
                  <td>$${(detail.price * detail.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr>
                <td colspan="3" class="total">Total:</td>
                <td class="total">$${resultOrder.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <h3>Observaciones: ${
            resultOrder.observation || "Sin observaciones"
          }</h3>

          <p>Estado del pedido: <strong>${resultOrder.orderState}</strong></p>

          <div class="footer">
            <p>© 2024 Distri7030. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    // Send email to user and admin
    sendEmail(
      user.email,
      `RESUMEN DE TU PEDIDO ${resultOrder.id}`,
      emailTemplate
    );
    sendEmail(
      process.env.MAIL_ADRESS_ADDRESS,
      `NUEVO PEDIDO: ${resultOrder.id}`,
      emailTemplate
    );

    res.status(201).json(resultOrder);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error creating order" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    console.log(req.params.id);
    // Delete order from the database
    const updateOrder = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { orderState: "CANCELADO" },
    });

    res.status(204).json(updateOrder);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error canceling order" });
  }
};

export const getSpecificOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        total: true,
        observation: true,
        orderState: true,
        detailOrder: {
          select: {
            quantity: true,
            price: true,
            Product: {
              select: {
                codeCompatibility: true,
                priceSale: true,
                description: true,
              },
            },
          },
        },
        User: {
          select: {
            email: true,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    console.error("Error getting specific order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
