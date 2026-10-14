export class HttpHelper
{
  /**
   * Converts a value to a string representation.
   * @param val - The value to convert to a string
   * @returns The string representation of the value
   */
  public static stringifyValue(val: unknown): string
  {
    if (val === null || val === undefined)
    {
      return '';
    }

    if (Array.isArray(val) && val.length === 1)
    {
      if (typeof val[0] === 'number')
      {
        return val[0].toString();
      }
      return val[0];
    }

    return String(val);
  }

  /**
 * Convert an empty string to undefined
 * @param val - The value to convert
 * @returns The string representation of the value or undefined if empty
   */
  public static toStringOrUndefined(val: unknown): string | undefined
  {
    if (val === null || val === undefined)
    {
      return undefined;
    }

    if (typeof val === 'string' && val.trim() === '')
    {
      return undefined;
    }

    return String(val);
  }
}