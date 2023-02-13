import { Router } from "express";
import customers from "./customer.routes.js";
import games from "./games.routes.js";
import rental from "./rentals.routes.js";


const router = Router();

router.use("/games", games);
router.use("/customers", customers);
router.use("/rentals", rental);


export default router;