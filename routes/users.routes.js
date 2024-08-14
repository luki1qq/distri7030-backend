import { Router } from "express";

import { activate, desactivate, getUsers, update } from "../controllers/user.controller.js";

const router = Router();

router.get("/users",getUsers);

router.put("/update/:id", update);
router.put("/desactivate/:id", desactivate);
router.put("/activate/:id", activate);

export default router;