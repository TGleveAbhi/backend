import mongoose from "mongoose";
import { required } from "zod/mini";

const messageSeenLogSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    communityName: { type: String, required: true },
    subCommunityName: {
      type: String,
      required: true,
    },

    seen_at: { type: Date, required: true },
    msgType: {
      type: String,
      required: true,
      enum: ["trade", "promotion", "flaunt", "feedback", "follow-up"],
    },
  },
  { timestamps: true },
);

// IMPORTANT: prevent duplicate seen logs for same user + message
messageSeenLogSchema.index({ message_id: 1, user_id: 1 }, { unique: true });

const MessageSeenLog = mongoose.model("MessageSeenLog", messageSeenLogSchema);

export default MessageSeenLog;
