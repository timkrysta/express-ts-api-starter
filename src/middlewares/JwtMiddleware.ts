/**
 * This middleware is checks and authenticates the jwt token passed in the request.
 * Using `passport.authenticate()` and specifying the `jwt` strategy,
 * the request is authenticated by checking for the standard Authorization header and verifying the verification token, if any.
 *
 * If unable to authenticate request, an error message is returned.
 */

import passport from 'passport';
import HTTPStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/UserModel';

export default class JwtMiddleware {
    public static authenticate(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('jwt', { session: false }, (err, user: IUserDocument, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({ message: HTTPStatus[HTTPStatus.UNAUTHORIZED] });
            }

            req.user = user;

            next();
        })(req, res, next);
    }
}
