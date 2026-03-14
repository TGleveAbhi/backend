import Router from "express";
import {
  getSeenByMessage,
  getSeenByUser,
  markAsSeen,
} from "../controllers/seenMsgController.js";
import { protect, raOnly, userOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/v1/mark-seen", protect, userOnly, markAsSeen);
// router.post("/bulk", protect, markBulkAsSeen);
router.get("/v1/messages/:messageId", getSeenByMessage); // give message_id
router.get("/v1/users/:userId", getSeenByUser);

export default router;
