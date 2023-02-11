import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
    try{
        const customers = await db.query('SELECT * FROM customers');
        res.send(customers.rows);
    }
    catch(err){
        res.sendStatus(500);
    }
}

export async function getCustomerById(req, res) {
    const id = Number(req.params.id);

    if(!id || id < 0 || !Number.isSafeInteger(id)){
        return res.sendStatus(400);
    }
    
    try{
        const customer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if(customer.rowCount === 0){
            return res.sendStatus(404);
        }
        res.send(customer.rows[0]);
    }
    catch(err){
        res.sendStatus(500);
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try{
        const customerExists = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if(customerExists.rowCount > 0){
            return res.sendStatus(409);
        }
        const customer = await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        if(customer.rowCount === 0){
            return res.sendStatus(400);
        }
        res.sendStatus(201);
    }
    catch(err){
        res.sendStatus(500);
    }
}

export async function putCustomer(req, res) {
    const id = Number(req.params.id);
    const { name, phone, cpf, birthday } = req.body;

    if(!id || id < 0 || !Number.isSafeInteger(id)){
        return res.sendStatus(400);
    }

    const cpfExists = await db.query("SELECT * FROM customers WHERE cpf = $1 AND id <> $2", [cpf, id]);
    if(cpfExists.rowCount > 0){
        return res.sendStatus(409);
    }
    
    try{
        const customerExists = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if(customerExists.rowCount === 0){
            return res.sendStatus(404);
        }
        const customer = await db.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [name, phone, cpf, birthday, id]);
        if(customer.rowCount === 0){
            return res.sendStatus(400);
        }
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
}

