import { Roadmap } from '../index';
import { assertValidSchema } from './validator';

describe('Roadmap', () => {
  test('should return Star Citizen roadmap data', async () => {
    const roadmap = new Roadmap('starcitizen', '3.12');
    const data = await roadmap.list();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'roadmap_starcitizen.json');
  });

  test('should return Squadron 42 roadmap data', async () => {
    const roadmap = new Roadmap('squadron42');
    const data = await roadmap.list();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'roadmap_squadron42.json');
  });
});
