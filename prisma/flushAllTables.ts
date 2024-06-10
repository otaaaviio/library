import {db_client} from "../src/pg";

async function flushAllTables() {
    await db_client.connect();

    try {
        console.log('flushing all tables...')
        await db_client.query('TRUNCATE "users", "sessions", "books", "book_images", "reviews", "authors", "publishers", "categories", "user_books" CASCADE');
        console.log('done!');
    } catch (err) {
        console.error('Error: ', err.message);
    } finally {
        await db_client.end();
    }
}

flushAllTables();