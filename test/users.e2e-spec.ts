import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';

describe('Users Controller', () => {
    let app;

    async function loginUser() {
        return  request(app.getHttpServer())
            .post('/sessions/login')
            .send({
                email: 'test@test.com',
                password: 'password',
            });
    }

    beforeAll(async () => {

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/users/register (POST)', async () => {
        await request(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'Test',
                email: 'test@test.com',
                password: 'password',
            })
            .expect(201);
    });

    it('/users (GET)', async () => {
        const resLogin = await loginUser();

        await request(app.getHttpServer())
            .get('/users')
            .set('Cookie', resLogin.headers['set-cookie'])
            .send()
            .expect(200);
    });

    it('/users/:id (GET)', async () => {
        const resLogin = await loginUser();

        await request(app.getHttpServer())
            .get(`/users/${resLogin.body.id}`)
            .set('Cookie', resLogin.headers['set-cookie'])
            .send()
            .expect(200);
    });

    it('/users/:id (PUT)', async () => {
        const resLogin = await loginUser();

        await request(app.getHttpServer())
            .put(`/users/${resLogin.body.id}`)
            .set('Cookie', resLogin.headers['set-cookie'])
            .send({
                name: 'Test updated',
            })
            .expect(200);
    });

    it('/users/:id (DELETE)', async () => {
        const resLogin = await loginUser();

        await request(app.getHttpServer())
            .delete(`/users/${resLogin.body.id}`)
            .set('Cookie', resLogin.headers['set-cookie'])
            .send()
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
