import User from "../models/userModel.js";
import Community from "../models/communityModel.js";


// admin can create community
export const createCommunity  = async (req, res) => {
    const { name, description } = req.body;
    const community = await Community.create({ name, description, created_by: req.user._id });
    res.status(201).json(community);
}


// admin add users/members to community

export const addUserToCommunity = async (req, res) => {
    const { communityId, userId } = req.body;
    const community = await Community.findByIdAndUpdate(
        communityId,
        { $addToSet: { members: userId } }, // $addToSet avoids duplicates
        { new: true }
    );
    // also store community in user's list
    await User.findByIdAndUpdate(userId, { $addToSet: { communities: communityId } });
    res.json(community);
}


// get all community data 

export const getAllCommunities = async (req, res) => {
    const communities = await Community.find().populate("created_by", "name email");
    res.json(communities);
}