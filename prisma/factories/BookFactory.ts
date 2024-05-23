import {Factory} from "rosie";
import * as casual from "casual";
import {publisherFactory} from "./PublisherFactory";
import {authorFactory} from "./AuthorFactory";

import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { CategoryEnumHelper } from '../../src/enums/CategoryEnum';

const prisma = new PrismaService();

export async function bookFactory() {
    const publisher = await publisherFactory();
    const author = await authorFactory();

    const data = Factory.define('book')
        .attrs({
            'title': casual.title,
            'image_url': casual.url,
            'description': casual.description,
            'published_at': casual.date('YYYY-MM-DDTHH:mm:ssZ')
        })
        .build();

    return prisma.book.create({
        data: {
            ...data,
            Publisher: {connect: {id: publisher.id}},
            Author: {connect: {id: author.id}},
            Category: {connect: {id: CategoryEnumHelper.getRandomId()}}
        },
    });
}