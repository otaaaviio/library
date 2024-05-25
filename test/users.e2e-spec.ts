import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';

describe('User ', () => {
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
                email: 'test@test.com',
                password: 'password',
            });

        res_login = await request(app.getHttpServer()).post('/sessions/login').send({
            email: 'test@test.com',
            password: 'password',
        });

        token = res_login.header['set-cookie'];
        console.log('token', token);
    });

    it('Can register a new user', async () => {
        await request(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'test create',
                email: 'testCreate@test.com',
                password: 'password',
            })
            .expect(201);
    });

    it('Can get a list of paginated users', async () => {
        const res = await request(app.getHttpServer())
            .get('/users')
            .set('Cookie', token)
            .send();
        console.log('res', res);
    });

    it('Can get a detailed user', async () => {
        await request(app.getHttpServer())
            .get(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(200);
    });

    it('Can update a user', async () => {
        await request(app.getHttpServer())
            .put(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send({
                name: 'Test updated',
            })
            .expect(200);
    });

    it('Can delete a account', async () => {
        await request(app.getHttpServer())
            .delete(`/users/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
