import { Express } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import JwtMiddleware from '../middlewares/JwtMiddleware';

export default class InitializeRoutes {
    public static initialize(app: Express) {
        app.use('/api/v1/auth', AuthRouter);
        app.use('/api/v1/user', JwtMiddleware.authenticate, UserRouter);
    }
}
