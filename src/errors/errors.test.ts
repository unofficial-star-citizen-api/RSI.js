import { describe, expect, test } from 'vitest';
import {
  RSICelestialObjectNotFoundError,
  RSIError,
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
