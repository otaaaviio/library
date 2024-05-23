import {Factory} from "rosie";
import * as casual from "casual";
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function publisherFactory() {
    const data = Factory.define('publisher')
        .attr('name', () => casual.full_name)
        .build();

    return prisma.publisher.create({
        data: data,
    });
}