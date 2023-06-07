import request from 'supertest';
import HTTPStatus from 'http-status';
import { app, dbConnection, server } from '../../app';
import User, { IUser, IUserDocument } from '../../models/UserModel';
import { ONLY_FOR_ADMINS, USER_NOT_EXISTS, INVALID_ID_FORMAT, USER_UPDATED } from '../../config/Messages';

const userPretendedRequest = request.agent(app);
let user: IUserDocument;

beforeAll(async () => {
    await User.deleteMany({});

    const userData: IUser = {
        email: 'UserController.test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
    };
    user = await User.create(userData);

    const response = await userPretendedRequest.post('/api/v1/auth/login').send({
        email: userData.email,
        password: userData.password,
    });

    const authToken: string = response.body.token;

    // Set the authorization header for all subsequent requests
    userPretendedRequest.set('Authorization', `Bearer ${authToken}`);
});

/**
 * index route
 */
describe('GET /api/v1/user', () => {
    xit('should return all users', async () => {
        const response = await userPretendedRequest.get('/api/v1/user').expect(HTTPStatus.UNAUTHORIZED);

        expect(response.body.message).toBe(ONLY_FOR_ADMINS);
    });
});

/**
 * show route
 */
describe('GET /api/v1/user/{id}', () => {
    it('should return a specific user', async () => {
        const response = await userPretendedRequest.get('/api/v1/user/' + user._id).expect(HTTPStatus.OK);

        expect(response.body.user).toStrictEqual(user.toJSON());
    });

    it('should return an error if the user does not exist', async () => {
        const response = await userPretendedRequest
            .get('/api/v1/user/647ca15de87977ca7e473456') // valid, nonexistent id
            .expect(HTTPStatus.UNAUTHORIZED);

        expect(response.body.message).toBe(USER_NOT_EXISTS);
    });

    it('should return a CastError because id is in invalid format', async () => {
        const response = await userPretendedRequest
            .get('/api/v1/user/nonexistent_invalid_format_of_id')
            .expect(HTTPStatus.BAD_REQUEST);

        expect(response.body.message).toBe(INVALID_ID_FORMAT);
    });
});

/**
 * update route
 */
describe('PUT /api/v1/user/{id}', () => {
    const updatedUserPayload: Partial<IUserDocument> = {
        email: 'updated@example.com',
        password: 'newpassword',
        firstName: 'Jane',
        lastName: 'Foo',
    };

    it('should update user details', async () => {
        const response = await userPretendedRequest.put('/api/v1/user/' + user._id).send(updatedUserPayload);

        expect(response.status).toBe(HTTPStatus.OK);
        expect(response.body.message).toBe(USER_UPDATED);
        expect(response.body.user.email).toBe(updatedUserPayload.email);
        expect(response.body.user.firstName).toBe(updatedUserPayload.firstName);
        expect(response.body.user.lastName).toBe(updatedUserPayload.lastName);
    });

    it('should return an error if the user id does not match the logged-in user', async () => {
        const otherUserData: Partial<IUserDocument> = {
            email: 'other@example.com',
            password: 'password',
            firstName: 'other fname',
            lastName: 'other lname',
        };
        const otherUser = await User.create(otherUserData);

        const response = await userPretendedRequest.put('/api/v1/user/' + otherUser._id).send(updatedUserPayload);

        expect(response.status).toBe(HTTPStatus.UNAUTHORIZED);
        expect(response.body.message).toBe(HTTPStatus[HTTPStatus.UNAUTHORIZED]);
    });
});

/**
 * destroy route
 */
describe('DELETE /api/v1/user/{id}', () => {
    xit('should delete a user', async () => {
        const response = await userPretendedRequest.delete('/api/v1/user/' + user._id).expect(HTTPStatus.UNAUTHORIZED);

        expect(response.body.message).toBe(ONLY_FOR_ADMINS);
    });

    xit('should return an error if the user id does not match the logged-in user', async () => {
        const otherUserData: IUser = {
            email: 'other@example.com',
            password: 'password',
            firstName: 'other fname',
            lastName: 'other lname',
        };
        const otherUser = await User.create(otherUserData);

        const response = await userPretendedRequest.delete('/api/v1/user/' + otherUser._id).expect(HTTPStatus.UNAUTHORIZED);

        expect(response.body.message).toBe(HTTPStatus[HTTPStatus.UNAUTHORIZED]);
    });
});

afterAll(async () => {
    await User.deleteMany({});
    server.close();
    await dbConnection.close();
});
