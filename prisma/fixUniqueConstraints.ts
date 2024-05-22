import { Client } from 'pg';
import { config } from 'dotenv';
config();

const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function addConstraint() {
    await client.connect();

    try {
        console.log('Adding constraints...')
        await client.query('CREATE UNIQUE INDEX unique_email_when_not_deleted ON "users" (email) WHERE deleted_at IS NULL');
        await client.query('CREATE UNIQUE INDEX unique_title_when_not_deleted ON "books" (title) WHERE deleted_at IS NULL');
        await client.query('CREATE UNIQUE INDEX unique_publisher_name_when_not_deleted ON "publishers" (name) WHERE deleted_at IS NULL');
        await client.query('CREATE UNIQUE INDEX unique_author_name_when_not_deleted ON "authors" (name) WHERE deleted_at IS NULL');
        console.log('done!');
    } catch (err) {
        console.error('Error to adding constraints: ', err.message);
    } finally {
        await client.end();
    }
}

addConstraint();