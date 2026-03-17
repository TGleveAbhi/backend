import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import raRoutes from "./routes/raRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";
import seenRoutes from "./routes/seenMsgRoutes.js";

const app = express();

const port = 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/raAuth", raRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/logs", seenRoutes);

app.post("/test", (req, res) => {
  res.send("test working");
});

app.listen(port,"0.0.0.0", () => {
  console.log(`server running on port:${port}`);
  connectDb();
});
