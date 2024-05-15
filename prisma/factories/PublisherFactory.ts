import {Factory} from "rosie";
import casual from "casual";
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function publisherFactory() {
    const data = Factory.define('publisher')
        .attr('name', () => casual.name)
        .build();

    return prisma.publisher.create({
        data: data,
    });
}