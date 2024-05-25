import {db_client} from "../src/pg.client";

async function addConstraint() {
    await db_client.connect();

    try {
        console.log('Adding constraints...')
        await db_client.query('CREATE UNIQUE INDEX unique_email_when_not_deleted ON "users" (email) WHERE deleted_at IS NULL');
        await db_client.query('CREATE UNIQUE INDEX unique_title_when_not_deleted ON "books" (title) WHERE deleted_at IS NULL');
        await db_client.query('CREATE UNIQUE INDEX unique_publisher_name_when_not_deleted ON "publishers" (name) WHERE deleted_at IS NULL');
        await db_client.query('CREATE UNIQUE INDEX unique_author_name_when_not_deleted ON "authors" (name) WHERE deleted_at IS NULL');
        console.log('done!');
    } catch (err) {
        console.error('Error to adding constraints: ', err.message);
    } finally {
        await db_client.end();
    }
}

addConstraint();