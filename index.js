import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import raRoutes from "./routes/raRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";
import seenRoutes from "./routes/seenMsgRoutes.js";

const app = express();

const port = 8080;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/raAuth", raRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/logs", seenRoutes);

app.listen(port, () => {
  console.log(`server running on port:${port}`);
  connectDb();
});
