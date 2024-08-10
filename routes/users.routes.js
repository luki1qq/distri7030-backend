import { Router } from "express";

import { activate, desactivate, update } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", (req, res) => {
  res.send("users");
});

router.put("/update/:id", update);
router.put("/desactivate/:id", desactivate);
router.put("/activate/:id", activate);

export default router;