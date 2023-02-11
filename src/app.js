import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routers/index.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
