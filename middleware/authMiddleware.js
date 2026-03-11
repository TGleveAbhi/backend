import jwt from "jsonwebtoken";
import Ra from "../models/raModel.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check RA
    const ra = await Ra.findById(decoded.id).select("-password");

    if (ra) {
      req.ra = ra; // attach RA
      req.role = "ra";
      return next();
    }

    // check normal user
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user; // attach User
      req.role = "user";
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

export const raOnly = (req, res, next) => {
  if (req.role !== "ra") {
    return res.status(403).json({
      success: false,
      message: "Access denied. RA only.",
    });
  }

  next();
};

export const userOnly = (req, res, next) => {
  if (req.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Users only.",
    });
  }

  next();
};
