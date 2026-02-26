import Router from "express";
import { getSeenByMessage, getSeenByUser, markAsSeen, markBulkAsSeen } from "../controllers/seenMsgController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, markAsSeen);
router.post("/bulk", protect, markBulkAsSeen);
router.get("/message/:messageId", protect, adminOnly, getSeenByMessage);  // give message_id
router.get("/user/:userId", protect, adminOnly, getSeenByUser);

export default router;


