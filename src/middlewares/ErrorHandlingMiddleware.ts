import HTTPStatus from 'http-status';
import { Express, Response, Request, NextFunction } from 'express';
import Logger from '../utils/Logger';

export default class ErrorHandlingMiddleware {
    public static handleErrors(app: Express) {
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            const logger = Logger.getLogger();
            logger.error('Error occurred: ' + err);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR] });
        });
    }
}
