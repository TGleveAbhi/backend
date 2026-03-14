import MessageSeenLog from "../models/seenMsgModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export const markAsSeen = async (req, res) => {
  const { message_id, communityName, subCommunityName, seen_at } = req.body;
  const user_id = req.user._id;

  try {
    if (!message_id || !communityName || !subCommunityName || !seen_at) {
      return res
        .status(400)
        .json({ data: null, success: true, message: "one field missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(message_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message id",
      });
    }
    const message = await Message.findById(message_id);
    if (!message) {
      return res
        .status(400)
        .json({ data: null, message: "message not found", success: false });
    }

    if (message.community !== communityName.toLowerCase().trim()) {
      return res.status(400).json({
        data: null,
        message: "commuinity does not match with message community",
        success: false,
      });
    }

    if (!message.subCommunity.includes(subCommunityName.trim())) {
      return res.status(400).json({
        data: null,
        message: " sub-community does not match with message sub-community",
        success: false,
      });
    }

    const msgType = message.msgType;
    if (msgType !== "trade") {
      return res.status(400).json({
        data: null,
        success: false,
        message: "invalid message , message should trade message",
      });
    }

    // insertOne will fail // will throw error silently if duplicate (because of unique index)
    const log = await MessageSeenLog.create({
      message_id,
      user_id,
      communityName: communityName.trim(),
      subCommunityName: subCommunityName.trim(),
      seen_at,
      msgType,
    });

    // increment cached count on message
    await Message.findByIdAndUpdate(message_id, { $inc: { total_seen: 1 } });
    res.status(201).json({ message: "Marked as seen", log });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      // duplicate — user already saw it, silently ignore
      return res.status(200).json({ message: "Already seen" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// export const markBulkAsSeen = async (req, res) => {
//   const { message_ids, community_id } = req.body; // message_ids is array
//   const user_id = req.user._id;

//   const logs = message_ids.map((message_id) => ({
//     message_id,
//     user_id,
//     community_id,
//     seen_at: new Date(),
//   }));

//   try {
//     // insertMany with ordered:false + ignore duplicate errors
//     const result = await MessageSeenLog.insertMany(logs, { ordered: false });

//     // increment total_seen count for each message that was newly seen
//     await Message.updateMany(
//       { _id: { $in: message_ids } },
//       { $inc: { total_seen: 1 } },
//     );

//     res
//       .status(201)
//       .json({ message: "Marked as seen", inserted: result.length });
//   } catch (err) {
//     // code 11000 = duplicate key — some already seen, that's fine
//     if (err.code === 11000 || err.writeErrors) {
//       return res.status(200).json({ message: "Some or all already seen" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getSeenByMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message id",
      });
    }
    const message = await Message.findById(messageId).select(
      "community subCommunity msgContent createdAt",
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // 2 Get seen logs
    const logs = await MessageSeenLog.find({ message_id: messageId })
      .populate("user_id", "name email")
      .sort({ seen_at: 1 });

    // 3 Prepare stats
    const totalSeen = logs.length;

    return res.status(200).json({
      success: true,
      messageInfo: {
        messageId,
        msgContent: message.msgContent,
        community: message.community,
        subCommunity: message.subCommunity,
        createdAt: message.createdAt,
      },
      stats: {
        totalSeen,
      },
      seenLogs: logs.map((log) => ({
        userName: log.user_id?.name,
        userEmail: log.user_id?.email,
        seenAt: log.seen_at,
      })),
    });
  } catch (error) {
    console.error("Seen stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getSeenByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message id",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // 1 Find all logs for this user
    const logs = await MessageSeenLog.find({
      user_id: userId,
    })
      .populate({
        path: "message_id",
        select: "msgContent community subCommunity msgType createdAt",
      })
      .sort({ seen_at: -1 });

    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: "No trade seen messages found for this user",
      });
    }

    // 2 Prepare response
    const seenMessages = logs.map((log) => ({
      messageId: log.message_id?._id,
      msgContent: log.message_id?.msgContent,
      community: log.message_id?.community,
      subCommunity: log.message_id?.subCommunity,
      msgType: log.message_id?.msgType,
      messageCreatedAt: log.message_id?.createdAt,
      seenAt: log.seen_at,
    }));

    return res.status(200).json({
      success: true,
      totalSeenMessages: seenMessages.length,
      data: seenMessages,
    });
  } catch (error) {
    console.error("User seen stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
