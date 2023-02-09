import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";

const games = Router();

games.get("/", getGames);
games.post("/", validateSchema(gameSchema), postGame);

export default games;