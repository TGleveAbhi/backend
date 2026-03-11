import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Ra from "../models/raModel.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Ra
export const registerRa = async (req, res) => {
  try {
    const { name, email, password, role, mobileNo } = req.body;
    if (!name || !email || !password || !role || !mobileNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingRa = await Ra.findOne({ email });
    if (existingRa) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role !== "ra" || mobileNo.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "ra role or valid  mo no should be there",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const ra = await Ra.create({
      name,
      email,
      password: hashed,
      role,
      mobileNo,
    });
    res.status(201).json({ token: generateToken(ra._id), ra , });
  } catch (err) {
    console.error("Register RA Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// create admin
// export const createAdmin = async (req, res) => {
//     const { name, email, password } = req.body;
//     const hashed = await bcrypt.hash(password, 10);
//     const admin = await User.create({ name, email, password: hashed, role: "admin" });
//     res.status(201).json({ token: generateToken(admin._id), admin });
// }

export const ralogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role || role !== "ra" ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required or valid field",
      });
    }
    const ra = await Ra.findOne({ email });
    if (!ra || !(await bcrypt.compare(password, ra.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ token: generateToken(ra._id), role: ra.role, ra });
  } catch (err) {
    console.error("Register RA Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
