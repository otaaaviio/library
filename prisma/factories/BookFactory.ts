import {Factory} from "rosie";
import * as casual from "casual";
import {publisherFactory} from "./PublisherFactory";
import {authorFactory} from "./AuthorFactory";

import {PrismaService} from '../../src/modules/prisma/prisma.service';
import {CategoryEnumHelper} from '../../src/enums/CategoryEnum';
import {reviewFactory} from "./ReviewFactory";

const prisma = new PrismaService();

export async function bookFactory() {
    const publisher = await publisherFactory();
    const author = await authorFactory();

    const data = Factory.define('book')
        .attrs({
            'title': casual.title,
            'description': casual.description,
            'published_at': casual.date('YYYY-MM-DDTHH:mm:ssZ')
        })
        .build();

    const random_cover = Math.floor(Math.random() * 3);

    const book = await prisma.book.create({
        data: {
            ...data,
            Publisher: {connect: {id: publisher.id}},
            Author: {connect: {id: author.id}},
            Category: {connect: {id: CategoryEnumHelper.getRandomId()}},
            Images: {
                create: {
                    image_path: `/src/assets/images/default_book_${random_cover}.jpg`
                }
            }
        },
    });

    for(let i = 0; i < Math.floor(Math.random() * 30); i++)
        await reviewFactory(book.id);

    return book;
}