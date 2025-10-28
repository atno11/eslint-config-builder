import { createLogger } from '../logger/index.js';
import type { ValidatorError } from './types.js';

const log = createLogger('ESLintConfigBuilderValidatorError');
export class ESLintConfigBuilderValidatorError {
  constructor(opts: ValidatorError) {
    log.error(opts);
  }
}
