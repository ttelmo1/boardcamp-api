import joi from 'joi';

export const postRentalSchema = joi.object({
    customerId: joi
    .number()
    .integer()
    .min(1)
    .max(Number.MAX_SAFE_INTEGER)
    .required(),
    gameId: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
    daysRented: joi
    .number()
    .integer()
    .min(1)
    .max(Number.MAX_SAFE_INTEGER)
    .required(),
});