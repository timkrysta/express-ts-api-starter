import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import Logger from '../utils/Logger';
import ErrorHandlingMiddleware from './ErrorHandlingMiddleware';
import passport from 'passport';
import PassportJwtStrategyMiddleware from './PassportJwtStrategyMiddleware';

export default class InitializeMiddleware {
    public static initializeCommonMiddleware(app: Express) {
        app.disable('x-powered-by');
        app.use(cors());
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(compression());

        /**
         * Log requests
         */
        app.use((req: Request, res: Response, next: NextFunction) => {
            const logger = Logger.getLogger();
            logger.info(req.originalUrl);
            next();
        });
    }

    public static initializePassportMiddleware(app: Express) {
        const logger = Logger.getLogger();
        app.use(passport.initialize());
        PassportJwtStrategyMiddleware.initialize(passport);
    }

    public static initializeErrorHandlingMiddleware(app: Express) {
        ErrorHandlingMiddleware.handleErrors(app);
    }
}
