import {Factory} from "rosie";
import casual from "casual";
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function authorFactory() {
    const data = Factory.define('author')
        .attr('name', () => casual.full_name)
        .build();

    return prisma.author.create({
        data: data,
    });
}
