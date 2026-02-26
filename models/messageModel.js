import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content:     { type: String, required: true },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }], // broadcast to these
    total_seen:  { type: Number, default: 0 } // cached count for fast admin dashboard
  }, { timestamps: true });

  const Message = mongoose.model("Message",messageSchema);
  export default Message;