export class Validators {
  public static isArray<T = unknown>(value: unknown): value is T[] {
    return Array.isArray(value);
  }

  public static isSparsedArray<T>(arr: T[]) {
    for (let i = 0; i < arr.length; i++) {
      if (!Object.hasOwn(arr, i)) return true;
    }
    return false;
  }

  public static isLengthEqual(value: number, len: number = 0) {
    return value === len;
  }

  public static isLengthBiggerThen(len: number, maxLength: number = 0) {
    return len > maxLength;
  }

  public static isLengthLessThen(len: number, minLength: number = 0) {
    return len < minLength;
  }

  public static isValidPattern(value: string, pattern: RegExp) {
    return pattern.test(value);
  }

  public static hasValue(value: unknown, set: Set<unknown>) {
    return set.has(value);
  }
}
