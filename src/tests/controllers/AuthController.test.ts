import request from 'supertest';
import HTTPStatus from 'http-status';
import { app, dbConnection, server } from '../../app';
import User, { IUser } from '../../models/UserModel';
import { ACCOUNT_ALREADY_EXISTS, INVALID_CREDENTIALS } from '../../config/Messages';
import IUserLoginPayload from 'src/interfaces/IUserLoginPayload';

describe('Authentication Controller', () => {
    beforeEach(async () => {
        // Clear the user collection before each test
        await User.deleteMany({});

        // Create a sample user for testing
        const userData: IUser = {
            email: 'AuthController.test@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe',
        };
        await User.create(userData);
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const newUserPayload: IUser = {
                email: 'newuser@example.com',
                password: 'newpassword',
                firstName: 'Jane',
                lastName: 'Doe',
            };

            const response = await request(app).post('/api/v1/auth/register').send(newUserPayload).expect(HTTPStatus.CREATED);

            expect(response.body.token).toBeDefined();
            // Add more assertions as needed
        });

        it('should return an error if the user already exists', async () => {
            const existingUserPayload: IUser = {
                email: 'AuthController.test@example.com', // Existing user email
                password: 'newpassword',
                firstName: 'Jane',
                lastName: 'Doe',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(existingUserPayload)
                .expect(HTTPStatus.UNPROCESSABLE_ENTITY);

            expect(response.body.message).toBe(ACCOUNT_ALREADY_EXISTS);
            // Add more assertions as needed
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login a user and return a JWT token', async () => {
            const userLoginPayload: IUserLoginPayload = {
                email: 'AuthController.test@example.com',
                password: 'password',
            };

            const response = await request(app).post('/api/v1/auth/login').send(userLoginPayload).expect(HTTPStatus.OK);

            expect(response.body.token).toBeDefined();
            // Add more assertions as needed
        });

        it('should return an error if the user does not exist', async () => {
            const nonexistentUserPayload: IUserLoginPayload = {
                email: 'nonexistent@example.com', // Nonexistent user email
                password: 'password',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(nonexistentUserPayload)
                .expect(HTTPStatus.UNAUTHORIZED);

            expect(response.body.message).toBe(INVALID_CREDENTIALS);
            // Add more assertions as needed
        });

        it('should return an error if the password is incorrect', async () => {
            const userLoginPayloadWithIncorrectPassword: IUserLoginPayload = {
                email: 'AuthController.test@example.com',
                password: 'wrongpassword', // Incorrect password
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(userLoginPayloadWithIncorrectPassword)
                .expect(HTTPStatus.UNAUTHORIZED);

            expect(response.body.message).toBe(INVALID_CREDENTIALS);
            // Add more assertions as needed
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
        server.close();
        await dbConnection.close();
    });
});
