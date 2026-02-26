import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who created
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // users in community
}, { timestamps: true });


const Community = mongoose.model("Community", communitySchema);
export default Community;