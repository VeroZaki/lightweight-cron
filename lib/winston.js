import _ from 'lodash';
import winston from 'winston';

const JSONFormatter = log => {
  const message = Symbol.for('message');
  const base = { timestamp: new Date(), severity: log.level.toUpperCase() };
  const json = Object.assign(base, log);
  log[message] = JSON.stringify(json);
  return log;
};

class Logger {
  constructor() {
    let level = 'info';
    let silent = false;

    this.logger = winston.createLogger({
      level,
      silent,
      defaultMeta: {
        service: 'lightweight-cron',
        version: '1.0.0'
      },
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          json: true,
          colorize: false,
          format: winston.format(JSONFormatter)()
        })
      ],
      exitOnError: false
    });
  }

  info(message) {
    return this.logger.info(message, {});
  }

  error(message) {
    return this.logger.error(message, {});
  }

  debug(message) {
    return this.logger.debug(message, {});
  }

  warn(message) {
    return this.logger.warn(message, {});
  }

  log(message) {
    return this.logger.log(message, {});
  }
}

const logger = Object.freeze(new Logger());

export default logger;
