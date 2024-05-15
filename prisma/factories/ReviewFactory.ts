import {Factory} from "rosie";
import casual from "casual";
import {userFactory} from "./UserFactory";
import {bookFactory} from "./BookFactory";
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export async function reviewFactory() {
    const book = await bookFactory();
    const user = await userFactory();

    const data = Factory.define('book')
        .attrs({
            'rating': casual.integer(0, 5),
            'comment': casual.description,
        })
        .build();

    return prisma.review.create({
        data: {
            ...data,
            Book: {connect: {id: book.id}},
            User: {connect: {id: user.id}},
        },
    });
}