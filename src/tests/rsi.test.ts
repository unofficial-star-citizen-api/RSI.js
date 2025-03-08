import { RSI } from '../index';

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
  });
});