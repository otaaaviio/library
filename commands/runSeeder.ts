import { categorySeeder } from '../prisma/seed/CategorySeeder';
import { PrismaService } from '../src/modules/prisma/prisma.service';

const prisma = new PrismaService();

const seeders = [
  { name: 'category', run: categorySeeder },
];

const seederName = process.argv[2];
const seeder = seeders.find(f => f.name === seederName);

async function run() {
  if (!seeder) {
    console.error(`Unknown seeder: ${seederName}`);
    process.exit(1);
  } else  {
      await seeder.run();
  }
}

run().catch((err: Error) => {
  console.error('Error running factory: ', err.message);
}).finally(() => {
  prisma.$disconnect();
});