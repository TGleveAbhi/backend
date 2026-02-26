import jwt from "jsonwebtoken";
import User from "../models/userModel.js"

// only authenticated users can access the route (protection)
export const protect  = async(req , res , next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
}


// only admin can access this
export const adminOnly = (req , res , next)=>{
    if (req.user.role !== "admin") 
        return res.status(403).json({ message: "Admin access only" });
      next(); 
}