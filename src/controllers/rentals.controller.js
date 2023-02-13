import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function postRentals(req, res){
    const {customerId, gameId, daysRented} = req.body;
    let rentDate = dayjs().format("YYYY-MM-DD");

    const gameExists = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    if(gameExists.rowCount === 0){
        return res.sendStatus(400);
    }

    const customerExists = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if(customerExists.rowCount === 0){
        return res.sendStatus(400);
    }

    const isGameRented = await db.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
    if(isGameRented.rowCount === gameExists.rows[0].stockTotal){
        return res.sendStatus(400);
    }

    try{

    const rental = await db.query(
        `
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") 
            VALUES ($1, $2, $3, $4, (SELECT "pricePerDay" FROM games WHERE id = $2) * $3);       
        `,
        [customerId, gameId, daysRented, rentDate]
    );

    if(rental.rowCount === 1){
        return res.sendStatus(201);
    }
}
catch(err){
    res.sendStatus(500);
    console.log(err);
}
}

export async function getRentals(req, res){
     try{
        const rentals = await db.query(`
            SELECT 
                rentals.*,
                    json_build_object('id', customers.id, 'name', customers.name) AS "customer",
                    json_build_object('id', games.id, 'name', games.name) AS "game"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
        `);
        res.send(rentals.rows);
     }
        catch(err){
            res.sendStatus(500);
        }
}

export async function finishRental(req, res){
    const id = Number(req.params.id);
    let returnDate = dayjs().format("YYYY-MM-DD");

    if(!id || id < 0 || !Number.isSafeInteger(id)){
        return res.sendStatus(400);
    }

    try{
        const thisRentalExists = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if(thisRentalExists.rowCount === 0){
            return res.sendStatus(404);
        }

        const thisRentalHasFinished = await db.query('SELECT * FROM rentals WHERE id = $1 AND "returnDate" IS NOT NULL', [id]);
        if(thisRentalHasFinished.rowCount !== 0){
            return res.sendStatus(400);
        }

        const rental = thisRentalExists.rows[0];
        let delayFee = 0;
        let today = dayjs().format("YYYY-MM-DD");
        let rentDateToDayjs = dayjs(rental.rentDate);
        let daysRentedToDayjs = dayjs(rental.daysRented);
        const daysWithGame = dayjs(today).diff(rentDateToDayjs, "day");

        if(daysWithGame > daysRentedToDayjs){
            delayFee = (daysWithGame - daysRentedToDayjs) * (rental.originalPrice / rental.daysRented);
        }

        await db.query(
            `
                UPDATE rentals
                SET "returnDate" = $1, "delayFee" = $2
                WHERE id = $3
            `,
            [returnDate, delayFee, id]
        );

        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}
