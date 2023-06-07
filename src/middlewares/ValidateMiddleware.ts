/**
 * This middleware is used to check if the express-validator middleware returns an error.
 * If so, it recreates the error object using the param and msg keys and returns the error.
 */

import { FieldValidationError, validationResult } from 'express-validator';
import HTTPStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const error = {};
    errors.array().map((err: FieldValidationError) => (error[err.path] = err.msg));

    return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ error });
};
