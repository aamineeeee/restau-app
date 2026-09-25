import { Router } from "express";
import { createOrder, listMyOrders } from "../controllers/orders.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/", requireAuth, requireRole("client"), createOrder);
router.get("/mine", requireAuth, requireRole("client"), listMyOrders);

export default router;
