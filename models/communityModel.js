import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    raName: { type: String, required: true },
    raId: { type: String, required: true },
    msgContent: { type: String, required: true },
    community: {
      type: String,
      required: true,
      enum: ["nifty", "equity", "commodity", "swingTrade"],
    },
    subCommunity: {
      type:[ String],
      required: true,
    },
    msgType: {
      type: String,
      required: true,
      enum: ["trade", "promotion", "flaunt", "feedback", "follow-up"],
    },

    total_seen: { type: Number, default: 0 }, // cached count for fast admin dashboard
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
