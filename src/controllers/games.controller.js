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
