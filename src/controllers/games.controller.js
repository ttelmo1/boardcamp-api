import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
    try{
        const games = await db.query('SELECT * FROM games');
        res.send(games.rows);
    }
    catch(err){
        res.sendStatus(500);
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
      const games = await db.query(
        'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
        [name, image, stockTotal, pricePerDay]
      );
      if (games.rowCount === 0) {
        return res.sendStatus(400);
      }
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(500);
    }
  }