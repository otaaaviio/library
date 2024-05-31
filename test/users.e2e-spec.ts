import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {HttpStatus} from "@nestjs/common";

describe('User Routes', () => {
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
                email: 'testusers@test.com',
                password: 'password',
            });

        res_login = await request(app.getHttpServer()).post('/sessions/login').send({
            email: 'test@test.com',
            password: 'password',
        });

        token = res_login.header['set-cookie'];
    });

    it('Can register a new user', async () => {
        await request(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'test create',
                email: 'testCreate@test.com',
                password: 'password',
            })
            .expect(HttpStatus.CREATED);
    });

    it('Can get a list of paginated users', async () => {
        await request(app.getHttpServer())
            .get('/users')
            .set('Cookie', token)
            .send({
                page: 1,
                items_per_page: 10
            })
            .expect(HttpStatus.OK);
    });

    it('Can get a detailed user', async () => {
        await request(app.getHttpServer())
            .get(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    it('Can update a user', async () => {
        await request(app.getHttpServer())
            .put(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send({
                name: 'Test updated',
            })
            .expect(HttpStatus.OK);
    });

    it('Can delete a account', async () => {
        await request(app.getHttpServer())
            .delete(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});
