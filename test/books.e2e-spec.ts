import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {HttpStatus} from "@nestjs/common";

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
        await request(app.getHttpServer())
            .post('/books/register')
            .send({
                name: 'test create',
            })
            .expect(HttpStatus.CREATED);
    });

    it('Can get a list of paginated book', async () => {
        await request(app.getHttpServer())
            .get('/users')
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
                name: 'Test updated',
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
