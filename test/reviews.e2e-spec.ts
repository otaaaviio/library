import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {HttpStatus} from "@nestjs/common";
import {bookFactory} from "../prisma/factories/BookFactory";

describe('Review Routes', () => {
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
                email: 'testreview@test.com',
                password: 'password',
            });

        res_login = await request(app.getHttpServer()).post('/sessions/login').send({
            email: 'test@test.com',
            password: 'password',
        });

        token = res_login.header['set-cookie'];
    });

    it('Can register a new review', async () => {
        const book = await bookFactory();

        await request(app.getHttpServer())
            .post('/reviews/register')
            .send({
                book_id: book.id,
                rating: 5,
                comment: 'Test comment',
            })
            .set('Cookie', token)
            .expect(HttpStatus.CREATED);
    });

    it('Can get a list of paginated review', async () => {
        await request(app.getHttpServer())
            .get('/reviews')
            .set('Cookie', token)
            .send({
                page: 1,
                items_per_page: 10
            })
            .expect(HttpStatus.OK);
    });

    it('Can get a detailed review', async () => {
        await request(app.getHttpServer())
            .get(`/reviews/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    it('Can update a review', async () => {
        await request(app.getHttpServer())
            .put(`/reviews/${res_login.body.id}`)
            .set('Cookie', token)
            .send({
                comment: 'Test updated',
            })
            .expect(HttpStatus.OK);
    });

    it('Can delete a review', async () => {
        await request(app.getHttpServer())
            .delete(`/reviews/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});
