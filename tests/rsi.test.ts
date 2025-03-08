import { RSI } from '../index';
import { User, Organization, ProgressTracker, Roadmap, Ship, Starmap, Stats, Telemetry, Version } from '../commands';

describe('RSI', () => {
  let rsi: RSI;

  beforeEach(() => {
    rsi = new RSI();
  });

  describe('Constructor', () => {
    test('should create instance with default config', () => {
      expect(rsi).toBeInstanceOf(RSI);
    });

    test('should create instance with custom config', () => {
      const customRsi = new RSI({ httpConfig: { userAgent: 'CustomAgent' } });
      expect(customRsi).toBeInstanceOf(RSI);
      expect(customRsi.httpClient.config.userAgent).toBe('CustomAgent');
    });

    test('should initialize all public properties', () => {
      expect(rsi.user).toBeInstanceOf(User);
      expect(rsi.organization).toBeInstanceOf(Organization);
      expect(rsi.progressTracker).toBeInstanceOf(ProgressTracker);
      expect(rsi.roadmap).toBeInstanceOf(Roadmap);
      expect(rsi.ships).toBeInstanceOf(Ship);
      expect(rsi.starmap).toBeInstanceOf(Starmap);
      expect(rsi.stats).toBeInstanceOf(Stats);
      expect(rsi.telemetry).toBeInstanceOf(Telemetry);
      expect(rsi.version).toBeInstanceOf(Version);
    });
  });
});