import express from "express";

import {
  getActiveTime,
  getSeenByMessage,
  getSeenByUser,
  markAsSeen,
  getCommunityUserStatus,
} from "../controllers/seenMsgController.js";
import { protect, raOnly, userOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/v1/mark-seen", protect, userOnly, markAsSeen);
// router.post("/bulk", protect, markBulkAsSeen);
// give message_id
router.get("/v1/users/active-time", getActiveTime);
router.get("/v1/users/community-status", getCommunityUserStatus);
router.get("/v1/users/:userId", getSeenByUser);
router.get("/v1/messages/:messageId", getSeenByMessage);

export default router;
