import Message from "../models/messageModel.js";
import MessageSeenLog from "../models/seenMsgModel.js";


// admin create messages
export const createMessage = async (req, res) => {
    const { content, community_ids } = req.body; // community_ids is array
    const message = await Message.create({
        content,
        created_by: req.user._id,
        communities: community_ids
    });
    res.status(201).json(message);

}

// Get all messages for a specific community (for users to see their feed)
export const getMessagesForCommunity = async (req, res) => {
    const { communityId } = req.params;
    const messages = await Message.find({ communities: communityId })
        .populate("created_by", "name")
        .sort({ createdAt: -1 });
    res.json(messages);
}


// Admin gets stats for a message — how many saw it, who, when
export const getMessageStats = async (req, res) => {
    const { messageId } = req.params;
    const logs = await MessageSeenLog.find({ message_id: messageId })
        .populate("user_id", "name email")
        .populate("community_id", "name")
        .sort({ seen_at: 1 });
    const totalSeen = logs.length;
    res.json({ message_id: messageId, total_seen: totalSeen, logs });
}
