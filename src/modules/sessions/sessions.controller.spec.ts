import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {userFactory} from "../../../prisma/factories/UserFactory";

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
        const user = await userFactory();

        const response = await request(app.getHttpServer())
            .post('/sessions/login')
            .send({
                email: user.email,
                password: 'password',
            })
            .expect(200)
            .expect({message: 'Successfully logged in'});

        expect(response.header['set-cookie']).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });
});
