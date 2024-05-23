import {Client} from "pg";
import { config } from 'dotenv';
config();

const db_client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export {db_client};