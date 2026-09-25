import { Router } from "express";
import { listMenu } from "../controllers/menu.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listMenu);

export default router;
