import winston, { LoggerOptions, format } from 'winston';

const LoggerConfig: LoggerOptions = {
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        /* new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
        }), */
        new winston.transports.File({
            level: 'info',
            filename: './logs/activity.log',
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log',
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
};

export default LoggerConfig;
