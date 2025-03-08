import { User } from '../index';
import { assertValidSchema } from './validator';

describe('User', () => {
  test.each([
    ['dymerz'],
    ['Dewderonomy']
  ])('should return user data for %s', async (handle) => {
    const user = new User(handle);
    const data = await user.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'user.json');
  });
});
