import { PrismaService } from '../src/modules/prisma/prisma.service';

async function addConstraint() {
    const prisma = new PrismaService();

    try {
        console.log('Adding constraints...')
        await prisma.$executeRaw`CREATE UNIQUE INDEX unique_email_when_not_deleted ON "users" (email) WHERE deleted_at IS NULL`;
        await prisma.$executeRaw`CREATE UNIQUE INDEX unique_title_when_not_deleted ON "books" (title) WHERE deleted_at IS NULL`;
        await prisma.$executeRaw`CREATE UNIQUE INDEX unique_publisher_name_when_not_deleted ON "publishers" (name) WHERE deleted_at IS NULL`;
        await prisma.$executeRaw`CREATE UNIQUE INDEX unique_author_name_when_not_deleted ON "authors" (name) WHERE deleted_at IS NULL`;
        await prisma.$executeRaw`CREATE UNIQUE INDEX unique_review_per_user_when_not_deleted ON "reviews" (created_by, book_id) WHERE deleted_at IS NULL`;
    } catch (err) {
        console.error('Error to adding constraints: ', err.message);
    }
}

addConstraint().then(() => console.log('done!'));
