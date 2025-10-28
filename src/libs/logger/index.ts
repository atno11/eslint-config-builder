import pino from 'pino';
import type { LogFields, PinoLogger } from './types.js';

const base: PinoLogger = pino({
  level: 'debug',
  redact: {
    paths: ['password', 'token', 'headers.authorization', 'authorization'],
    remove: true,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      messageFormat: '["@atno11/eslint-config-builder"]',
    },
  },
});

export class Logger {
  private readonly log: PinoLogger;
  constructor(private readonly context?: string, fields: LogFields = {}) {
    this.log = base.child({ context, ...fields });
  }

  child(fields: LogFields): Logger {
    return new Logger(this.context, fields);
  }

  setLevel(level: pino.LevelWithSilent) {
    base.level = level;
    return this;
  }

  trace(msg: string, obj?: LogFields) {
    this.log.trace({ ...obj, message: msg });
  }

  debug(msg: string, obj?: LogFields) {
    this.log.debug({ ...obj, message: msg });
  }

  info(msg: string, obj?: LogFields) {
    this.log.info({ ...obj, message: msg });
  }

  warn(msg: string, obj?: LogFields) {
    this.log.warn({ ...obj, message: msg });
  }

  error(err: unknown, msg?: string, extra?: LogFields) {
    if (err instanceof Error) this.log.error({ err, message: msg, ...extra });
    else this.log.error({ err, ...extra }, msg ?? 'Error');
  }

  fatal(err: unknown, msg?: string, extra?: LogFields) {
    if (err instanceof Error) this.log.fatal({ err, message: msg, ...extra });
    else this.log.fatal({ err, message: msg, ...extra });
  }
}

export const createLogger = (context: string, fields?: LogFields) =>
  new Logger(context, fields);
