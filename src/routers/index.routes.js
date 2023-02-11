import { Router } from "express";
import customers from "./customer.routes.js";
import games from "./games.routes.js";


const router = Router();

router.use("/games", games);
router.use("/customers", customers);


export default router;