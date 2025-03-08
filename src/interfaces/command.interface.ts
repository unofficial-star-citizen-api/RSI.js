/**
 * Provides methods to build components
 */
export interface ICommand<T> {
  /**
   * Execute the module
   */
  execute(): Promise<T | null>;

  /**
   * Convert an object to HTTP parameter
   * @param val - A value to convert to string
   */
  convertVal(val: unknown): string;

  /**
   * Concatenate two objects to create http friendly string
   * @param val1 - First value
   * @param val2 - Second value
   * @returns A string HTTP ready
   */
  httpFormatter(val1: unknown, val2: unknown): string;
}

export abstract class BaseCommand<T> implements ICommand<T> {
  /**
   * Execute the module
   */
  abstract execute(): Promise<T | null>;

  /**
   * Convert an object to HTTP parameter
   * @param val - A value to convert to string
   */
  convertVal(val: unknown): string {
    if (val === null || val === undefined) {
      return "";
    }

    if (Array.isArray(val) && val.length === 1) {
      if (typeof val[0] === 'number') {
        return val[0].toString();
      }
      return val[0];
    }

    return String(val);
  }

  /**
   * Concatenate two objects to create http friendly string
   * @param val1 - First value
   * @param val2 - Second value
   * @returns A string HTTP ready
   */
  httpFormatter(val1: unknown, val2: unknown): string {
    const line = `${val1},${val2}`;
    return line.length === 1 ? '' : line;
  }
}
