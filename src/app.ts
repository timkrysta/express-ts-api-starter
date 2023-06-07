import { config } from 'dotenv';
config();

import express from 'express';
import InitializeMiddleware from './middlewares/InitializeMiddleware';
import InitializeRoutes from './routes/InitializeRoutes';
import Database from './utils/Database';

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT) || 3000;
export const app = express();

InitializeMiddleware.initializeCommonMiddleware(app);

export const dbConnection = Database.getMongoDbConnection(process.env.MONGO_CONNECTION_URI);

InitializeMiddleware.initializePassportMiddleware(app);

InitializeRoutes.initialize(app);

InitializeMiddleware.initializeErrorHandlingMiddleware(app);

/**
 * Start server
 */
export const server = app.listen(PORT, HOST, () => console.log(`✅ Server running on http://${HOST}:${PORT}/`));
