import { Router } from "express";

import {
  login,
  signupHandler,
  register,
  createRoles,
  logout,
  profile,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

// Necesario para la creación de usuarios
router.post("/create-role", createRoles);
// Rutas de autenticación
router.post("/signup", signupHandler);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.get("/profile", authRequired, profile);
export default router;
