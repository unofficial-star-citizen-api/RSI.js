export class HttpHelper {
  public static convertVal(val: unknown): string {
    if (val === null || val === undefined) {
      return '';
    }

    if (Array.isArray(val) && val.length === 1) {
      if (typeof val[0] === 'number') {
        return val[0].toString();
      }
      return val[0];
    }

    return String(val);
  }
}