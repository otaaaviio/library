import {Factory} from "rosie";
import * as casual from "casual";
import {userFactory} from "./UserFactory";
import {bookFactory} from "./BookFactory";
import { PrismaService } from '../../src/modules/prisma/prisma.service';

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
            CreatedBy: {connect: {id: user.id}},
            UpdatedBy: {connect: {id: user.id}},
        },
    });
}