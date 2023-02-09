import { db } from "../database/database.connection.js";


export async function getGames(req, res) {
    try{
        const result = await db.query('SELECT * FROM games');
        res.send(result.rows);
    }
    catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

export async function postGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
      const gameExists = await db.query('SELECT * FROM games WHERE name = $1', [
        name,
      ]);
      if (gameExists.rowCount > 0) {
        return res.sendStatus(409);
      }
      const result = await db.query(
        'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
        [name, image, stockTotal, pricePerDay]
      );
      if (result.rowCount === 0) {
        return res.sendStatus(400);
      }
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(500);
    }
  }
