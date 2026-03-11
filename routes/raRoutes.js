import { Router } from "express";
import { ralogin, registerRa } from "../controllers/raController.js" ;

const router  = Router();

router.post("/raReg" , registerRa);
router.post("/raLogin" , ralogin);

export default router;