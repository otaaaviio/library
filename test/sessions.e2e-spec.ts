import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {userFactory} from '../prisma/factories/UserFactory';
import {HttpStatus} from "@nestjs/common";

describe('Session Routes', () => {
    let app;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Can login a user and logout', async () => {
        const user = await userFactory();

        const response = await request(app.getHttpServer())
            .post('/sessions/login')
            .send({
                email: user.email,
                password: 'password', // default password set in the factory
            })
            .expect(HttpStatus.OK);

        const token = response.header['set-cookie'];

        expect(token).toBeDefined();

        await request(app.getHttpServer())
            .post('/sessions/logout')
            .set('Cookie', token)
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});