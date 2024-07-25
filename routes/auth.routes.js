import { Router } from "express";

import { login, signupHandler, register, createRoles } from "../controllers/auth.controller.js";

const router = Router();


// Necesario para la creación de usuarios
router.post("/create-role", createRoles);
// Rutas de autenticación
router.post("/signup", signupHandler);
router.post("/login", login);
router.post("/register", register);

export default router;
