import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('User', () => {
  test.each([
    ['dymerz'],
    ['Dewderonomy']
  ])('should return user data for %s', async (handle) => {
    const rsi = new RSI();
    const data = await rsi.user.getUserInfo(handle);

    expect(data).not.toBeNull();
    assertValidSchema(data, 'user.json');
  });
});
