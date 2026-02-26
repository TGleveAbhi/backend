import Router from "express";
import { register, login, createAdmin } from "../controllers/userControllers.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-admin", protect, adminOnly, createAdmin); // only admin can make another admin

export default router;
