import { JWT_SECRET } from "../utils/secrets.js";
import jwt from "jsonwebtoken";
export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}
