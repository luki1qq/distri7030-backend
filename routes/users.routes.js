import { Router } from "express";

import { update } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", (req, res) => {
  res.send("users");
});

router.put("/update/:id", update);

export default router;