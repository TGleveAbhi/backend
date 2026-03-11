import mongoose from "mongoose";

const raSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,  default: "ra" },
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }], // communities user belongs to
  },
  { timestamps: true },
);

const Ra = mongoose.model("Ra", raSchema);

export default Ra;
