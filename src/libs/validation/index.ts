import type {
  ArrayValidatorOptions,
  StringValidatorOptions,
  ValidatorError,
  ValidatorResult,
  ValidatorSuccess,
} from './types.js';
import { Validators } from './validators.js';

export class ESLintConfigBuilderValidator {
  static validateArray<V = unknown>(
    value: unknown,
    options: ArrayValidatorOptions<V>
  ): ValidatorResult<V> {
    if (!Validators.isArray(value))
      return {
        ok: false,
        code: 'NOT_ARRAY',
        message: 'Expected an array.',
      };

    const len = value.length;
    const arr = value;
    const errors: string[] = [];

    const {
      allowEmpty = true,
      minLength = 0,
      maxLength = Number.POSITIVE_INFINITY,
      allowSparse = false,
      elementGuard,
      elementValidate,
      uniqueBy,
    } = options;

    if (!allowEmpty && Validators.isLengthEqual(len, 0))
      errors.push('Empty array is not valid when `allowEmpty` is false.');
    if (Validators.isLengthLessThen(len, minLength))
      errors.push(`Array doesn't contain the minimum number of items (${minLength}).`);
    if (Validators.isLengthBiggerThen(len, maxLength))
      errors.push(
        `Array contains more items than the maximum allowed value (${maxLength}).`
      );
    if (!allowSparse && Validators.isSparsedArray(arr))
      errors.push('Sparsed array not allowed.');

    if (elementGuard && !arr.every(elementGuard)) errors.push('Array with invalid type.');

    if (elementValidate) {
      const cast = arr as V[];
      cast.forEach((el, i) => {
        if (!elementValidate(el, i, cast)) errors.push(`Invalid element at index ${i}.`);
      });
    }

    if (uniqueBy) {
      const set = new Set<unknown>();
      for (const el of arr as V[]) {
        const k = uniqueBy(el);
        if (Validators.hasValue(k, set)) {
          errors.push('Duplicate values are not allowed.');
          break;
        }
        set.add(k);
      }
    }

    if (errors.length) {
      return { ok: false, message: errors[0], errors, code: 'ARRAY_INVALID' };
    }

    return { ok: true, value: value as V };
  }

  static validateString(
    value: unknown,
    options: StringValidatorOptions
  ): ValidatorResult<string> {
    if (!this.isString(value))
      return {
        ok: false,
        code: 'NOT_STRING',
        message: 'Expected an string.',
      };

    const errors: string[] = [];

    const {
      allowEmpty = false,
      trim = true,
      minLength = 1,
      maxLength = Number.POSITIVE_INFINITY,
      pattern,
      allowWhitespaceOnly = false,
    } = options;

    const str = trim ? value.trim() : value;
    const len = str.length;

    if (!allowWhitespaceOnly && !trim) {
      if (!/[^\s]/.test(str))
        errors.push('Whitespace-only string is not allowed when `trim` is false.');
    }

    if (!allowEmpty && Validators.isLengthEqual(len, 0)) {
      errors.push('Empty string is not allowed when `allowEmpty` is false.');
    }

    const effectiveMin = Math.max(minLength, allowEmpty ? 0 : 1);

    if (Validators.isLengthLessThen(len, effectiveMin)) {
      errors.push(`String is shorter than the minimum length (${effectiveMin}).`);
    }

    if (Validators.isLengthBiggerThen(len, maxLength)) {
      errors.push(`String exceeds the maximum length (${maxLength}).`);
    }

    if (pattern && !Validators.isValidPattern(str, pattern)) {
      errors.push('String does not match the required pattern.');
    }

    if (errors.length) {
      return {
        ok: false,
        code: 'STRING_INVALID',
        message: errors[0],
        errors,
      };
    }

    return { ok: true, value };
  }

  private static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static isSuccess<T>(val: ValidatorResult<T>): val is ValidatorSuccess<T> {
    return val.ok;
  }

  static isError<T>(val: ValidatorResult<T>): val is ValidatorError {
    return !val.ok;
  }
}
