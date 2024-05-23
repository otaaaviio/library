import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {AppModule} from "../../app.module";

describe('Sessions Controller', () => {
    let app;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/sessions/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/sessions/login')
            .send({
                email: 'adm@adm.com',
                password: 'password',
            })
            .expect(200)
            .expect({ message: 'Successfully logged in' });

        expect(response.header['set-cookie']).toBeDefined();
    });

    it('/sessions/logout (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/sessions/login')
            .send({
                email: 'adm@adm.com',
                password: 'password',
            });

        const response = await request(app.getHttpServer())
            .post('/sessions/logout')
            .send()
            .expect(200)
            .expect('Logged out successfully');

        expect(response.header['set-cookie']).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });
});