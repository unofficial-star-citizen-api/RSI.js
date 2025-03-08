import { Ship } from '../index';
import { assertValidSchema } from './validator';

describe('Ship', () => {
  test('should return ship data', async () => {
    const ship = new Ship({name: 'Cutlass Black'});
    const data = await ship.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'ship.json');
  });
});
