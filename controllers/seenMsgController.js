import MessageSeenLog from "../models/seenMsgModel.js"
import Message from "../models/messageModel.js";

export const markAsSeen = async (req, res) => {
    const { message_id, community_id } = req.body;
    const user_id = req.user._id;

    try {
        // insertOne will fail silently if duplicate (because of unique index)
        const log = await MessageSeenLog.create({ message_id, user_id, community_id });

        // increment cached count on message
        await Message.findByIdAndUpdate(message_id, { $inc: { total_seen: 1 } });

        res.status(201).json({ message: "Marked as seen", log });
    } catch (err) {
        if (err.code === 11000) {
            // duplicate — user already saw it, silently ignore
            return res.status(200).json({ message: "Already seen" });
        }
        res.status(500).json({ message: "Server error" });
    }
}

export const markBulkAsSeen = async (req, res) => {
    const { message_ids, community_id } = req.body; // message_ids is array
    const user_id = req.user._id;

    const logs = message_ids.map((message_id) => ({
        message_id,
        user_id,
        community_id,
        seen_at: new Date()
    }));

    try {
        // insertMany with ordered:false + ignore duplicate errors
        const result = await MessageSeenLog.insertMany(logs, { ordered: false });

        // increment total_seen count for each message that was newly seen
        await Message.updateMany(
            { _id: { $in: message_ids } },
            { $inc: { total_seen: 1 } }
        );

        res.status(201).json({ message: "Marked as seen", inserted: result.length });
    } catch (err) {
        // code 11000 = duplicate key — some already seen, that's fine
        if (err.code === 11000 || err.writeErrors) {
            return res.status(200).json({ message: "Some or all already seen" });
        }
        res.status(500).json({ message: "Server error" });
    }
}


export const getSeenByMessage = async (req, res) => {
    const { messageId } = req.params;

    const logs = await MessageSeenLog.find({ message_id: messageId })
        .populate("user_id", "name email")        // get user name and email
        .populate("community_id", "name")          // get community name
        .sort({ seen_at: 1 });                     // oldest seen first

    res.json({
        message_id: messageId,
        total_seen: logs.length,                   // count of users who saw
        seen_by: logs.map((log) => ({
            user_id: log.user_id._id,
            name: log.user_id.name,
            email: log.user_id.email,
            community: log.community_id.name,
            seen_at: log.seen_at
        }))
    });
}


export const getSeenByUser = async (req, res) => {
    const { userId } = req.params;

    const logs = await MessageSeenLog.find({ user_id: userId })
        .populate("message_id", "content createdAt")   // get message content
        .populate("community_id", "name")               // get community name
        .sort({ seen_at: -1 });                         // latest seen first

    res.json({
        user_id: userId,
        total_messages_seen: logs.length,
        messages: logs.map((log) => ({
            message_id: log.message_id._id,
            message_content: log.message_id.content,
            community: log.community_id.name,
            seen_at: log.seen_at
        }))
    })
}