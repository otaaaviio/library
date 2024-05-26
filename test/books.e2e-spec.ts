import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {HttpStatus} from "@nestjs/common";
import {publisherFactory} from "../prisma/factories/PublisherFactory";
import {authorFactory} from "../prisma/factories/AuthorFactory";

describe('Author Routes', () => {
    let app;
    let token;
    let res_login;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        await request(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'test',
                email: 'testbook@test.com',
                password: 'password',
            });

        res_login = await request(app.getHttpServer()).post('/sessions/login').send({
            email: 'test@test.com',
            password: 'password',
        });

        token = res_login.header['set-cookie'];
    });

    it('Can register a new book', async () => {
        const publisher = await publisherFactory();
        const author = await authorFactory();

        await request(app.getHttpServer())
            .post('/books/register')
            .send({
                title: 'Test Book',
                publisher_id: publisher.id,
                author_id: author.id,
                category_id: 1,
                image_url: 'http://example.com/test-book.jpg',
                description: 'This is a test book.',
                published_at: new Date(),
            })
            .set('Cookie', token)
            .expect(HttpStatus.CREATED);
    });

    it('Can get a list of paginated book', async () => {
        await request(app.getHttpServer())
            .get('/books')
            .set('Cookie', token)
            .send({
                page: 1,
                items_per_page: 10
            })
            .expect(HttpStatus.OK);
    });

    it('Can get a detailed book', async () => {
        await request(app.getHttpServer())
            .get(`/books/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    it('Can update a book', async () => {
        await request(app.getHttpServer())
            .put(`/books/${res_login.body.id}`)
            .set('Cookie', token)
            .send({
                title: 'Test updated',
            })
            .expect(HttpStatus.OK);
    });

    it('Can delete a book', async () => {
        await request(app.getHttpServer())
            .delete(`/books/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});
