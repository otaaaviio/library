import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app.module';
import {HttpStatus} from "@nestjs/common";

describe('Publisher Routes', () => {
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
                email: 'testpublisher@test.com',
                password: 'password',
            });

        res_login = await request(app.getHttpServer()).post('/sessions/login').send({
            email: 'test@test.com',
            password: 'password',
        });

        token = res_login.header['set-cookie'];
    });

    it('Can register a new publisher', async () => {
        await request(app.getHttpServer())
            .post('/publishers/register')
            .send({
                name: 'test create',
            })
            .set('Cookie', token)
            .expect(HttpStatus.CREATED);
    });

    it('Can get a list of paginated publisher', async () => {
        await request(app.getHttpServer())
            .get('/publishers')
            .set('Cookie', token)
            .send({
                page: 1,
                items_per_page: 10
            })
            .expect(HttpStatus.OK);
    });

    it('Can get a detailed publisher', async () => {
        await request(app.getHttpServer())
            .get(`/publishers/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    it('Can update a publisher', async () => {
        await request(app.getHttpServer())
            .put(`/publishers/${res_login.body.id}`)
            .set('Cookie', token)
            .send({
                name: 'Test updated',
            })
            .expect(HttpStatus.OK);
    });

    it('Can delete a publisher', async () => {
        await request(app.getHttpServer())
            .delete(`/publishers/${res_login.body.id}`)
            .set('Cookie', token)
            .send()
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});
