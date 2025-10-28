export interface StringValidatorOptions {
  /**
   * If `true`, an empty string (`''`) is considered invalid.
   * @default false
   */
  allowEmpty?: boolean;
  /**
   * When `true`, trims the input (both ends) before all validations.
   * @default true
   * @example
   * // With trim=true, '  ok  ' becomes 'ok' before checking length/pattern.
   */
  trim?: boolean; // default: true  (trim antes de validar)
  /**
   * Minimum allowed string length.
   * Applied after trimming when `trim === true`.
   * @default 1
   * @example
   * // 'a'.length === 1 passes when minLength <= 1
   */
  minLength?: number; // default: 1     (após trim, se trim=true)
  /**
   * Maximum allowed string length.
   * Applied after trimming when `trim === true`.
   * @default Infinity
   * @example
   * // 'hello'.length === 5 fails when maxLength < 5
   */
  maxLength?: number; // default: infinito
  /**
   * Optional regular expression the (possibly trimmed) string must match.
   * Use anchors if you want a full-string match.
   * @default undefined
   * @example
   * // Only lowercase letters:
   * pattern: /^[a-z]+$/
   */
  pattern?: RegExp; // regex opcional para casar
  /**
   * If `false`, strings made only of whitespace are invalid (e.g., `'   '`).
   * Has effect primarily when `trim === false`; with `trim === true`,
   * whitespace-only strings become `''` and are governed by `allowEmpty`.
   * @default false
   * @example
   * // With trim=false and allowWhitespaceOnly=false, '   ' is invalid.
   */
  allowWhitespaceOnly?: boolean; // default: false (ex.: '   ' inválido se trim=false)
}
export interface ArrayValidatorOptions<T> {
  /**
   * When `false`, empty arrays (`[]`) are invalid.
   * When `true`, emptiness is allowed (subject to `minLength`).
   * @default true
   */
  allowEmpty?: boolean;
  /**
   * Minimum allowed array length.
   * Ignored if `allowEmpty === true` and value is `[]` but `minLength > 0` will still fail.
   * @default 0
   */
  minLength?: number;
  /**
   * Maximum allowed array length.
   * @default Infinity
   */
  maxLength?: number;
  /**
   * If `true`, accepts sparse arrays (arrays with "holes", e.g., `[0, , 2]`).
   * If `false`, any missing index invalidates the array.
   * @default false
   */
  allowSparse?: boolean;
  /**
   * Optional type guard applied to each element.
   * If provided, every element must satisfy it; also narrows `T` at compile time.
   * @example
   * const isString = (v: unknown): v is string => typeof v === 'string';
   * elementGuard: isString
   */
  elementGuard?: (val: unknown) => val is T;
  /**
   * Extra per-element validation predicate.
   * Receives the element, its index, and the full (readonly) array.
   * Return `true` to keep it valid, `false` to fail validation.
   * @example
   * // enforce all numbers are even and strictly increasing
   * elementValidate: (v, i, a) => typeof v === 'number'
   *   && v % 2 === 0
   *   && (i === 0 || v > a[i - 1] as number)
   */
  elementValidate?: (val: T, index: number, arr: readonly T[]) => boolean;
  /**
   * Enforces uniqueness by mapping each element to a key.
   * Elements are considered duplicates if `uniqueBy(element)` returns the same key.
   * Use stable, primitive-like keys (string/number/symbol) to avoid pitfalls.
   * @example
   * // unique by id
   * uniqueBy: (u) => u.id
   */
  uniqueBy?: (val: T) => unknown;
}
export type ValidatorSuccess<T> = { ok: true; value: T };
export type ValidatorError = {
  ok: false;
  message?: string;
  errors?: string[];
  code?: string;
};
export type ValidatorResult<T> = ValidatorSuccess<T> | ValidatorError;
