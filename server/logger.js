const winston = require('winston');
const { createLogger, format, transports } = require('winston');

const dotenv = require('dotenv');
dotenv.config();

var logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info) =>
            JSON.stringify({
                time: info.timestamp,
                level: info.level,
                message: info.message,
                s: info.splat !== undefined ? `${info.splat}` : '',
            }) + ','
        )
    ),
});

if (process.env.NODE_ENV !== 'PRODUCTION') {
    logger.add(new transports.Console({ format: winston.format.cli() }));
    logger.add(new transports.File({ filename: 'log/dev/error.log', level: 'error' }));
    logger.add(new transports.File({ filename: 'log/dev/warn.log', level: 'warn' }));
    logger.add(new transports.File({ filename: 'log/dev/info.log', level: 'info' }));

    // Turn these on to create logs as if it were production
    // logger.add(new transports.File({ filename: 'log/output/error.log', level: 'error' }));
    // logger.add(new transports.File({ filename: 'log/output/warn.log', level: 'warn' }));
    // logger.add(new transports.File({ filename: 'log/output/info.log', level: 'info' }));
} else {
    logger.add(new transports.File({ filename: 'log/prod/error.log', level: 'error' }));
    logger.add(new transports.File({ filename: 'log/prod/warn.log', level: 'warn' }));
    logger.add(new transports.File({ filename: 'log/prod/info.log', level: 'info' }));
}

module.exports =logger;