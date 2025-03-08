import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';

describe('Roadmap', () => {
  test('should return Star Citizen roadmap data', async () => {
    const rsi = new RSI();
    const data = await rsi.roadmap.getBoardReleases('starcitizen', '3.12');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'roadmap_starcitizen.json');
  });

  test('should return Squadron 42 roadmap data', async () => {
    const rsi = new RSI();
    const data = await rsi.roadmap.getBoardReleases('squadron42');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'roadmap_squadron42.json');
  });
});
