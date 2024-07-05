import { PrismaService } from '../src/modules/prisma/prisma.service';

async function flushAllTables() {
    const prisma = new PrismaService();
    try {
        console.log('flushing all tables...')
        await prisma.$executeRaw`TRUNCATE "users", "sessions", "books", "book_images", "reviews", "authors", "publishers", "categories", "user_books" CASCADE`;
    } catch (err) {
        console.error('Error: ', err.message);
    }
}

flushAllTables().then(() => console.log('done!'));