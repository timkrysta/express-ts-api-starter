import winston from 'winston';
import LoggerConfig from '../config/LoggerConfig';

export default class Logger {
    private logger: winston.Logger;
    private static instance: Logger;

    private constructor() {
        this.logger = winston.createLogger(LoggerConfig);
    }

    public static getLoggerInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public static getLogger() {
        const loggerInstance = Logger.getLoggerInstance();
        return loggerInstance.logger;
    }
}
