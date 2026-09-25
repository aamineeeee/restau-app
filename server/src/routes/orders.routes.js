import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  listMyOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/", requireAuth, requireRole("client"), createOrder);
router.get("/mine", requireAuth, requireRole("client"), listMyOrders);
router.get("/", requireAuth, requireRole("staff"), getAllOrders);
router.patch("/:id/status", requireAuth, requireRole("staff"), updateOrderStatus);

export default router;
