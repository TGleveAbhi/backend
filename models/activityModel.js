import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String, // e.g. "2026-03-14"
      required: true,
    },

    firstSeenAt: {
      type: Date,
    },

    lastSeenAt: {
      type: Date,
    },

    activeTime: {
      type: Number,
      default: 0,
    },

    messagesSeen: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    communityName: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("UserDailyActivity", activitySchema);
