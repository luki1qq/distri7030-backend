import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets.js";

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Guardamos el usuario en el request
    req.user = decoded;
  });
  next();
};
