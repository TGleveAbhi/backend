import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// normal user
export const userReg = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({
      data: null,
      success: false,
      message: "all fileds required",
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({
      data: null,
      success: false,
      message: "user already exist",
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  
  res.status(201).json({ token: generateToken(user._id), user });
};

// create admin
// export const createAdmin = async (req, res) => {
//     const { name, email, password } = req.body;
//     const hashed = await bcrypt.hash(password, 10);
//     const admin = await User.create({ name, email, password: hashed, role: "admin" });
//     res.status(201).json({ token: generateToken(admin._id), admin });
// }

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.json({
      data: null,
      success: false,
      message: "all fields required",
    });
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: generateToken(user._id), role: user.role, user });
};
