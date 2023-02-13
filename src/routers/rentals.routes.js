import { Router } from "express";
import { finishRental, getRentals, postRentals } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { postRentalSchema } from "../schemas/rental.schema.js";


const rental = Router();

rental.get("/", getRentals);
rental.post("/", validateSchema(postRentalSchema), postRentals);
rental.post("/:id/return", finishRental);

export default rental;