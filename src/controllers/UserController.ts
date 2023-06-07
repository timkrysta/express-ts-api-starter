/**
 * API Resource controller
 */

import HTTPStatus from 'http-status';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
import User, { IUserDocument } from '../models/UserModel';
import { ONLY_FOR_ADMINS, USER_NOT_EXISTS, USER_UPDATED, USER_DELETED, INVALID_ID_FORMAT } from '../config/Messages';

const { CastError } = Error;

export default class UserController {
    /**
     * @route GET /api/v1/user
     * @access authenticated
     * @desc Returns all users
     */
    public static async index(req: Request, res: Response) {
        return res.status(HTTPStatus.UNAUTHORIZED).json({ message: ONLY_FOR_ADMINS });
        const users = await User.find({});
        res.status(HTTPStatus.OK).json({ users: users.map((user) => user.toJSON()) });
    }

    /**
     * @route GET /api/v1/user/{id}
     * @access authenticated
     * @desc Returns a specific user
     */
    public static async show(req: Request, res: Response) {
        try {
            const passedId = req.params.id;

            const user = await User.findById(passedId);

            if (!user) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({ message: USER_NOT_EXISTS });
            }

            res.status(HTTPStatus.OK).json({ user: user.toJSON() });
        } catch (err) {
            if (err instanceof CastError) {
                return res.status(HTTPStatus.BAD_REQUEST).json({ message: INVALID_ID_FORMAT });
            }

            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                message: HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR],
            });
        }
    }

    /**
     * @route PUT /api/v1/user/{id}
     * @access authenticated
     * @desc Update user details:
     * The user id is extracted from the request, an update object is created using
     * the request body and Mongoose `findByIdAndUpdate` is used to query and update the user’s data.
     */
    public static async update(req: Request, res: Response) {
        try {
            const passedId = req.params.id;
            const userId = (req.user as IUserDocument)._id;

            // Make sure the passed id is that of the logged in user
            if (passedId.toString() !== userId.toString()) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({ message: HTTPStatus[HTTPStatus.UNAUTHORIZED] });
            }

            const { email, password, firstName, lastName } = req.body;

            const updateQuery = {
                $set: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                },
            };

            const queryOptions = {
                new: true,
            };

            const user = await User.findByIdAndUpdate(passedId, updateQuery, queryOptions);

            res.status(HTTPStatus.OK).json({
                user: user.toJSON(),
                message: USER_UPDATED,
            });
        } catch (err) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    /**
     * @route DELETE /api/v1/user/{id}
     * @access authenticated
     * @desc Delete User
     */
    public static async destroy(req: Request, res: Response) {
        return res.status(HTTPStatus.UNAUTHORIZED).json({ message: ONLY_FOR_ADMINS });
        try {
            const passedId = req.params.id;
            const userId = (req.user as IUserDocument)._id;

            // Make sure the passed id is that of the logged in user
            if (passedId.toString() !== userId.toString()) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({ message: HTTPStatus[HTTPStatus.UNAUTHORIZED] });
            }

            await User.findByIdAndDelete(passedId);
            res.status(HTTPStatus.OK).json({ message: USER_DELETED });
        } catch (err) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}
