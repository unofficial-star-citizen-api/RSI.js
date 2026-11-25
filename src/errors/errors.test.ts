import { describe, expect, test } from 'vitest';
import {
  RSICelestialObjectNotFoundError,
  RSIError,
  RSIHttpError,
  RSINotFoundError,
  RSIOrganizationNotFoundError,
  RSIProgressTrackerTeamNotFoundError,
  RSIShipChassisNotFoundError,
  RSIShipNotFoundError,
  RSIStarSystemNotFoundError,
  RSIUserNotFoundError
} from '../index';

describe('Errors', () =>
{
  test('RSIError should default to a 500 status', () =>
  {
    const error = new RSIError('boom');
    expect(error.name).toBe('RSIError');
    expect(error.getStatus()).toBe(500);
  });

  test('RSIHttpError should expose the upstream status and URL, and suggest a 502', () =>
  {
    const cause = new Error('socket hang up');
    const error = new RSIHttpError('RSI is down', 503, 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats', cause);
    expect(error).toBeInstanceOf(RSIError);
    expect(error.name).toBe('RSIHttpError');
    expect(error.message).toBe('RSI is down');
    expect(error.status).toBe(503);
    expect(error.url).toBe('https://robertsspaceindustries.com/api/stats/getCrowdfundStats');
    expect(error.getStatus()).toBe(502);
    expect(error.stack).toContain('Caused by: Error: socket hang up');
  });

  test('RSIHttpError should allow a missing status when no response was received', () =>
  {
    const error = new RSIHttpError('timeout', undefined);
    expect(error.status).toBeUndefined();
    expect(error.url).toBeUndefined();
  });

  test('RSINotFoundError should expose a 404 status, the resource and the identifier', () =>
  {
    const error = new RSINotFoundError('Thing', 42);
    expect(error).toBeInstanceOf(RSIError);
    expect(error.name).toBe('RSINotFoundError');
    expect(error.getStatus()).toBe(404);
    expect(error.resource).toBe('Thing');
    expect(error.identifier).toBe(42);
    expect(error.message).toBe('Thing not found: 42');
  });

  test.each([
    [new RSIUserNotFoundError('Dymerz'), 'RSIUserNotFoundError', 'User', 'Dymerz'],
    [new RSIOrganizationNotFoundError('PROTECTORA'), 'RSIOrganizationNotFoundError', 'Organization', 'PROTECTORA'],
    [new RSIShipNotFoundError(56), 'RSIShipNotFoundError', 'Ship', 56],
    [new RSIShipChassisNotFoundError(6), 'RSIShipChassisNotFoundError', 'Ship chassis', 6],
    [new RSIStarSystemNotFoundError('STANTON'), 'RSIStarSystemNotFoundError', 'Star system', 'STANTON'],
    [new RSICelestialObjectNotFoundError('STANTON.PLANETS.X'), 'RSICelestialObjectNotFoundError', 'Celestial object', 'STANTON.PLANETS.X'],
    [new RSIProgressTrackerTeamNotFoundError('g42qg07ipfday'), 'RSIProgressTrackerTeamNotFoundError', 'Progress tracker team', 'g42qg07ipfday']
  ])('%s should be a 404 RSINotFoundError', (error, name, resource, identifier) =>
  {
    expect(error).toBeInstanceOf(RSINotFoundError);
    expect(error).toBeInstanceOf(RSIError);
    expect(error.name).toBe(name);
    expect(error.getStatus()).toBe(404);
    expect(error.resource).toBe(resource);
    expect(error.identifier).toBe(identifier);
    expect(error.message).toBe(`${resource} not found: ${identifier}`);
  });
});
