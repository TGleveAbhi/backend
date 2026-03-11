import Router from "express";
import { userReg, userLogin  } from "../controllers/userControllers.js";


const router = Router();

router.post("/userReg", userReg);
router.post("/userLogin", userLogin);


export default router;
