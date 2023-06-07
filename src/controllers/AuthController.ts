/**
 * The authentication controller includes the following functions:
 * 1. register
 * 2. login
 */

import HTTPStatus from 'http-status';
import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export default class AuthController {
    /**
     * @route POST /api/v1/auth/register
     * @access Public
     * @desc Register a user:
     * The database is queried using the email address to check if the user already exist.
     * If the user's doesn't exist, a new user is created and the generateJWT method is called
     * to generate the authentication token which is then passed to the user along with the user object.
     */
    public static async register(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName } = req.body;
            const result = await AuthService.registerUser(email, password, firstName, lastName);

            if (result.error) {
                return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ message: result.error });
            }

            res.status(HTTPStatus.CREATED).json({ token: result.token });
        } catch (err) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    /**
     * @route POST /api/v1/auth/login
     * @access Public
     * @desc Login a user and return JWT token:
     * The database is queried using the email address to check if the user exist.
     * If the user is found, the user object is used to call the isValidPassword method.
     * If the comparison is successful, the generateJWT method is called
     * to generate the authentication token which is then passed to the user along with the user object.
     */
    public static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.loginUser(email, password);

            if (result.error) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({ message: result.error });
            }

            res.status(HTTPStatus.OK).json({ token: result.token });
        } catch (err) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}
