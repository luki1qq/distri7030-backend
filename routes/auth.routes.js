import { Router } from "express";

import {
  login,
  signupHandler,
  register,
  createRoles,
  logout,
  profile,
  confirm,
  reSendEmailClient,
  GETresetPassword,
  forgotPassword,
  POSTresetPassword,
  createClient
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
router.post("/create-client", createClient);

router.get('/confirm/:token', confirm)

router.get('/reset-password/:id/:token', GETresetPassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id/:token', POSTresetPassword)

router.get("/profile", authRequired, profile);
router.post('/resend-client', authRequired, reSendEmailClient)
export default router;
