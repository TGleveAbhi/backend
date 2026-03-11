// admin create messages (RA)

import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import ddbDocClient from "../config/dynonoDb.js";
import Message from "../models/messageModel.js";
import { messageSchema } from "./validators/messageSchema.js";

export const sendMsg = async (req, res) => {
  try {
    // 1 Validate request body
    const result = messageSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { msgContent, communityName, subCommunityName, msgType } =
      result.data;

    const raId = req.ra._id;
    const raName = req.ra.name;

    // 2 Save in MongoDB
    const mongoMessage = await Message.create({
      raId,
      raName,
      msgContent,
      community: communityName.trim(),
      subCommunity: subCommunityName.map((sub) => sub.trim()),
      msgType: msgType.trim(),
    });

    // 3 Prepare DynamoDB data
    const messageData = {
      msg_id: mongoMessage._id.toString(),
      raId: raId.toString(),
      raName,
      msgContent,
      community: communityName.trim(),
      subCommunity: subCommunityName.map((sub) => sub.trim()),
      msgType: msgType.trim(),
      createdAt: new Date().toISOString(),
    };

    // 4 Save in DynamoDB
    await ddbDocClient.send(
      new PutCommand({
        TableName: "messages",
        Item: messageData,
      }),
    );

    return res.status(201).json({
      success: true,
      message: "Message stored in MongoDB and DynamoDB",
      data: mongoMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMessagesByCommunity = async (req, res) => {
  try {
    let { community, subCommunity } = req.body;

    if (!community || !subCommunity) {
      return res.status(400).json({
        success: false,
        message: "community and subCommunity are required",
      });
    }

    const params = {
      TableName: "messages",
      FilterExpression:
        "#community = :community AND contains(#subCommunity, :sub)",
      ExpressionAttributeNames: {
        "#community": "community",
        "#subCommunity": "subCommunity",
      },
      ExpressionAttributeValues: {
        ":community": community,
        ":sub": subCommunity,
      },
    };

    if (!params) {
      return res.status(400).json({ data: null, success: false });
    }

    const result = await ddbDocClient.send(new ScanCommand(params));

    return res.status(200).json({
      success: true,
      count: result.Items?.length || 0,
      data: result.Items,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
