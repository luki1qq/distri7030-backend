"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _authController = require("../controllers/auth.controller.js");

var _validateToken = require("../middlewares/validateToken.js");

var router = (0, _express.Router)(); // Necesario para la creación de usuarios

router.post("/create-role", _authController.createRoles); // Rutas de autenticación

router.post("/signup", _authController.signupHandler);
router.post("/login", _authController.login);
router.post("/register", _authController.register);
router.post("/logout", _authController.logout);
router.post("/create-client", _authController.createClient);
router.get('/confirm/:token', _authController.confirm);
router.get('/reset-password/:id/:token', _authController.GETresetPassword);
router.post('/reset-password/:id/:token', _authController.POSTresetPassword); // router.get('/set-password/:id/:token', GETSetPassword)

router.post('/confirm/:token', _authController.POSTSetPassword);
router.post('/forgot-password', _authController.forgotPassword);
router.get("/verifyToken", _authController.verifyToken);
router.get("/profile", _authController.profile);
router.post('/resend-client', _authController.reSendEmailClient);
var _default = router;
exports["default"] = _default;