import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';
import versionSchema from './schemas/version.json';

describe('Version', () => {
  test('should return version data', async () => {
    const rsi = new RSI();
    const data = await rsi.version.getPatchNotes();

    expect(data).not.toBeNull();
    assertValidSchema(data, versionSchema);
  });
});
