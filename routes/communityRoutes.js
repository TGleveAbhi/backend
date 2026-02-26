import Router from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createCommunity, addUserToCommunity, getAllCommunities } from "../controllers/communityController.js"

const router = Router();

router.post("/", protect, adminOnly, createCommunity);
router.post("/add-user", protect, adminOnly, addUserToCommunity);
router.get("/", protect, getAllCommunities);

export default router;

