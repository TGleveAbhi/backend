import Router from "express";
import { createMessage, getMessageStats, getMessagesForCommunity } from "../controllers/messageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router()

router.post("/", protect, adminOnly, createMessage);
router.get("/community/:communityId", protect, getMessagesForCommunity);
router.get("/:messageId/stats", protect, adminOnly, getMessageStats);


export default router;


