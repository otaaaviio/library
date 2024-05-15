import { CategoryEnumHelper } from '../../src/enums/CategoryEnum';
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function categorySeeder() {
  for (const value of CategoryEnumHelper.getValues()) {
    if (await prisma.category.findFirst({where: {name_normalized: value}})) {
      console.log(`[INFO]: Category ${value} already exists`);
      continue;
    }

    const res = await prisma.category.create({
      data: {
        name: CategoryEnumHelper.getLabel(value),
        name_normalized: value
      },
    });
    console.log(`[INFO]: Category ${value} created with id:`, res.id);
  }
}