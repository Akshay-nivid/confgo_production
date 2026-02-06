/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Logger
 * @Logger with different level.
 * @author : sarathavs
 */
import winston from 'winston';
import config from '../config';

enum LogTypes {
  DEBUG = 1,
  INFO,
  LOG,
  WARN,
  ERROR,
}
const LogTypeText = {
  [LogTypes.DEBUG]: 'DEBUG',
  [LogTypes.INFO]: 'INFO',
  [LogTypes.LOG]: 'LOG',
  [LogTypes.WARN]: 'WARN',
  [LogTypes.ERROR]: 'ERROR',
};

export class Logger {
  static StartTime: number = new Date().getTime();

  // Configure Winston logger with Console and File transports
  private static winstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
      )
    ),
    transports: [
      new winston.transports.Console(), // Log to console
    ],
  });

  static errorLevel(): number {
    const errorLevel = parseInt(config.logLevel || '4', 10);
    return isNaN(errorLevel) ? LogTypes.ERROR : errorLevel;
  }

  static debug(...log: any) {
    if (this.errorLevel() <= LogTypes.DEBUG) {
      this._log(LogTypes.DEBUG, log);
    }
  }

  static info(...log: any) {
    if (this.errorLevel() <= LogTypes.INFO) {
      this._log(LogTypes.INFO, log);
    }
  }

  static log(...log: any) {
    if (this.errorLevel() <= LogTypes.LOG) {
      this._log(LogTypes.LOG, log);
    }
  }

  static warn(...log: any) {
    if (this.errorLevel() <= LogTypes.WARN) {
      this._log(LogTypes.WARN, log);
    }
  }

  static error(...log: any) {
    if (this.errorLevel() <= LogTypes.ERROR) {
      this._log(LogTypes.ERROR, log);
    }
  }

  private static _log(type: LogTypes, params: any[]) {
    const message = `${LogTypeText[type]} <${new Date().getTime() - Logger.StartTime}ms> ${params.join(' ')}`;

    // Redirect log calls to Winston's logging methods based on the log type
    switch (type) {
      case LogTypes.DEBUG:
        Logger.winstonLogger.debug(message);
        break;
      case LogTypes.INFO:
        Logger.winstonLogger.info(message);
        break;
      case LogTypes.WARN:
        Logger.winstonLogger.warn(message);
        break;
      case LogTypes.ERROR:
        Logger.winstonLogger.error(message);
        break;
    }
  }
}
Logger.debug('Logger.tsx', 'Initializing the logger');
