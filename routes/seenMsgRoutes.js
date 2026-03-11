import Router from "express";
import {
  getSeenByMessage,
  getSeenByUser,
  markAsSeen,
} from "../controllers/seenMsgController.js";
import { protect, raOnly, userOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/markSeen", protect, userOnly, markAsSeen);
// router.post("/bulk", protect, markBulkAsSeen);
router.get("/message/:messageId", protect, getSeenByMessage); // give message_id
router.get("/user/:userId", protect, getSeenByUser);

export default router;
