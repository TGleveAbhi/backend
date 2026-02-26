import mongoose from "mongoose";

const messageSeenLogSchema = new mongoose.Schema({
    message_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
    user_id:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    community_id: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
    seen_at:      { type: Date, default: Date.now }
  });
  
  // IMPORTANT: prevent duplicate seen logs for same user + message
  messageSeenLogSchema.index({ message_id: 1, user_id: 1 }, { unique: true });

  const MessageSeenLog  = mongoose.model("MessageSeenLog", messageSeenLogSchema);

 export default MessageSeenLog