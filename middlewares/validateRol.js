import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const isAdmin = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET); // Decodificar el token


    const userIsAdmin = await prisma.roleTable.findUnique({
      where: { id: decodedToken.role },
    });
    console.log(userIsAdmin);

    if (decodedToken.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    // El usuario es administrador, pasa al siguiente middleware/handler
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
