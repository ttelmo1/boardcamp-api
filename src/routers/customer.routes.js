import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, putCustomer } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";


const customers = Router();

customers.get("/", getCustomers);
customers.get("/:id", getCustomerById);
customers.post("/", validateSchema(customerSchema), postCustomer);
customers.put("/:id", validateSchema(customerSchema), putCustomer);

export default customers;