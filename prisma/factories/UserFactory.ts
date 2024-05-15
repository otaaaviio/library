import {Factory} from "rosie";
import casual from "casual";
import bcrypt from "bcrypt"
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function userFactory() {
    const data = Factory.define('user')
        .attrs({
            'name': () => casual.full_name,
            'email': () => casual.email,
            'password': () => bcrypt.hashSync(casual.password, 10),
            'is_admin': () => casual.boolean
        })
        .build();

    return prisma.user.create({
        data: data,
    });
}