import { Router } from "express";
import games from "./games.route.js";


const router = Router();

router.use("/games", games);

export default router;