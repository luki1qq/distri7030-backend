import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets.js";

export const authRequired = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Guardamos el usuario en el request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
