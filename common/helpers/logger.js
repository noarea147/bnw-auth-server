const { createLogger, transports, format } = require('winston');
/* eslint no-unused-vars: "off" */
const colors = require('colors');

const customFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    if (info.level === 'error') {
      return `${info.timestamp} - [${info.level.toUpperCase().padEnd(5)}]: ${info.message}`.red;
    }
    if (info.level === 'warn') {
      return `${info.timestamp} - [${info.level.toUpperCase().padEnd(5)}]: ${info.message}`.yellow;
    }
    if (info.level === 'info') {
      return `${info.timestamp} - [${info.level.toUpperCase().padEnd(5)}]: ${info.message}`.white;
    }
  }),
  format.colorize(),
  format.align(),
);
const logger = createLogger({
  format: customFormat,
  transports: [
    new transports.Console({ level: 'debug' }),
    new transports.File({ filename: 'logfile.log', level: 'warn' }),
  ],
});

module.exports = logger;
