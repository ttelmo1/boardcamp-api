import { Router } from "express";
import { getGames } from "../controllers/games.controller.js";

const games = Router();

games.get("/", getGames);

export default games;