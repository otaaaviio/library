import {Factory} from "rosie";
import * as casual from "casual";
import * as bcrypt from "bcrypt"
import { PrismaService } from '../../src/modules/prisma/prisma.service';

const prisma = new PrismaService();

export async function userFactory() {
    const data = Factory.define('user')
        .attrs({
            'name': () => casual.full_name,
            'email': () => casual.email,
            'password': () => bcrypt.hashSync('password', 10),
            'is_admin': () => casual.boolean
        })
        .build();

    return prisma.user.create({
        data: data,
    });
}