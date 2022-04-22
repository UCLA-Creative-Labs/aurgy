import path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, printf } = format;

const custom_format = printf( ({level, message, timestamp}) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
  format: combine(
    format.timestamp(),
    custom_format,
  ),
  transports: [
    new transports.Console({ silent: process.env.NODE_ENV === 'PROD' ? true : false }),
  ],
});

if (process.env.NODE_ENV === 'PROD') {
  logger.add(new transports.File({ filename: path.resolve(__dirname, '../logs/error.log'), level: 'error' }));
  logger.add(new transports.File({ filename: path.resolve(__dirname, '../logs/stdout') }));
}
