import { reviewFactory } from '../prisma/factories/ReviewFactory';
import { userFactory } from '../prisma/factories/UserFactory';
import { bookFactory } from '../prisma/factories/BookFactory';
import { authorFactory } from '../prisma/factories/AuthorFactory';
import { publisherFactory } from '../prisma/factories/PublisherFactory';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

const factories = [
  { name: 'user', run: userFactory },
  { name: 'book', run: bookFactory },
  { name: 'author', run: authorFactory },
  { name: 'publisher', run: publisherFactory },
  { name: 'review', run: reviewFactory },
];

const factoryName = process.argv[2];
const count = Number(process.argv[3]);
const factory = factories.find(f => f.name === factoryName);

async function run() {
  if (!factory) {
    console.error(`Unknown factory: ${factoryName}`);
    process.exit(1);
  } else if (isNaN(count) || count < 1) {
    console.error(`Invalid count: ${count}`);
    process.exit(1);
  } else {
    for (let i = 0; i < Number(count); i++) {
      const result = await factory.run();
      console.log(`${factoryName} created:`, result);
    }
  }
}

run().catch((err: Error) => {
  console.error('Error running factory: ', err.message);
}).finally(() => {
  prisma.$disconnect();
});