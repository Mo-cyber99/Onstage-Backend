import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
    let app: INestApplication;
    jest.setTimeout(35000);
    beforeEach(async() => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('POST', () => {
        it('201 status - create new user', () => {
            const testCreateAccount = {
                username: 'PhenomenalMo',
                email: 'mo123@mail.com'
            };
            return request(app.getHttpServer())
            .post('/api/users')
            .send(testCreateAccount)
            .expect(201)
            .then(({ body }) => {
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('newUser');
                const { newUser } = body;
                expect(newUser).toHaveProperty('username', 'PhenomenalMo');
                expect(newUser).toHaveProperty('email', 'mo123@mail.com');
                expect(newUser).toHaveProperty('_id', expect.any(String));
                expect(newUser).toHaveProperty('location', expect.any(String));
                expect(newUser).toHaveProperty('avatar', expect.any(String));
                expect(newUser).toHaveProperty('bio', expect.any(String));
                expect(newUser).toHaveProperty('DOB', expect.any(String));
            });
        });
        it('201 status: data type converted', () => {
            const testCreateAccount = {
                username: 10,
                email: '12345@mail.com'
            };
            return request(app.getHttpServer())
            .post('/api/users')
            .send(testCreateAccount)
            .expect(201)
            .then(({ body: { newUser } }) => {
                expect(newUser).toHaveProperty('username', expect.any(String));
            });
        });
        it('400 status: malformed body rejection', () => {
            const testCreateAccount = {
                username: 'testuser',
            };
            return request(app.getHttpServer())
            .post('/api/users')
            .send(testCreateAccount)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe(
                    'email must be an email and email should not be empty',
                );
            });
        });
        it('400 status: malformed body', () => {
            const bodyWithWrongField = {
                username: 'PhenomenalMo',
                email: 'mo123@mail.com',
                notafield: 'test123'
            };
            return request(app.getHttpServer())
            .post('/api/users')
            .send(bodyWithWrongField)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('property notafield should not exist');
            });
        });
    });

    describe('PATCH', () => {
        it('200 status - update user profile fields', () => {
            const userPatch = {
                username: 'user to patch',
                email: 'usertopatch@gmail.com',
            };
            const profileUpdates = {
                username: 'updated user',
                email: 'update123@mail.com',
                location: 'new location',
                avatar: 'https://cdn-icons-png.flaticon.com/512/40/40058.png',
                bio: 'new bio information',
                DOB: '22/05/1965',
            };
            return request(app.getHttpServer())
            .post('/api/users')
            .send(userPatch)
            .expect(201)
            .then(
                ({
                    body: { newUser: { _id: id }, },
                }) => {
                    return request(app.getHttpServer())
                    .patch(`/api/users/${id}`)
                    .send(profileUpdates)
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('updatedUser');
                        const { updatedUser } = body;
                        expect(updatedUser).toHaveProperty(
                            'username',
                            'updated user',
                        );
                        expect(updatedUser).toHaveProperty(
                            'email',
                            'update123@mail.com',
                        );
                        expect(updatedUser).toHaveProperty(
                            '_id',
                            id,
                        );
                        expect(updatedUser).toHaveProperty(
                            'location',
                            'new location',
                        );
                        expect(updatedUser).toHaveProperty(
                            'avatar',
                            'https://cdn-icons-png.flaticon.com/512/40/40058.png',
                        );
                        expect(updatedUser).toHaveProperty(
                            'bio',
                            'new bio information',
                        );
                        expect(updatedUser).toHaveProperty(
                            'DOB',
                            '22/05/1965',
                        );
                    }); 
                },
            );
        });
    });

    describe('GET', () => {
        it('200 status', () => {
            return request(app.getHttpServer())
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('users');
                const { users } = body;
                expect(users).toBeInstanceOf(Array);
                // expect(users.length).toBeGreaterThan(0);

                users.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String));
                    expect(user).toHaveProperty('email', expect.any(String));
                    expect(user).toHaveProperty('location', expect.any(String));
                    expect(user).toHaveProperty('avatar', expect.any(String));
                    expect(user).toHaveProperty('bio', expect.any(String));
                    expect(user).toHaveProperty('DOB', expect.any(String));
                });
            });
        });
    });

    // describe('GET by Id', () => {
    //     it('200 status', () => {
    //         const testCreateAccount = {
    //             username: 'PhenomenalMo',
    //             email: 'mo123@mail.com',
    //         };
    //         return request(app.getHttpServer())
    //         .get('/api/users')
    //         .expect(201)
    //         .then(({ body }) => {

    //         })
    //     });
    // });
})