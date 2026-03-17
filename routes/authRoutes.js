import express from "express";

import { userReg, userLogin  } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/userReg", userReg);
router.post("/userLogin", userLogin);


export default router;
