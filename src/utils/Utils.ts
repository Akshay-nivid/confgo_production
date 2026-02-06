export class Utils {
  static isNotUndefined(terms: unknown): boolean {
    if (
      typeof terms !== 'undefined' &&
      terms !== 'null' && // Assuming you're checking for the string "null"
      terms !== null &&
      terms !== '' &&
      terms !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  }
}
