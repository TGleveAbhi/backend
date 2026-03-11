import Router from "express";
import {
  sendMsg,
  getMessagesByCommunity,
} from "../controllers/messageController.js";
import { protect, raOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/sendMsg", protect, raOnly, sendMsg);
// router.get("/community/:communityId", protect, getMessagesForCommunity);
// router.get("/:messageId/stats", protect, adminOnly, getMessageStats);
router.get("/getMsg", protect, raOnly, getMessagesByCommunity);

export default router;
