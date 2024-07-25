import { JWT_SECRET } from "../utils/secrets.js";
import jwt from "jsonwebtoken";
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
}
