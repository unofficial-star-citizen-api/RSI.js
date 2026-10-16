import { RSIError } from '@/errors';

export class RSIOrganizationNotFoundError extends RSIError
{
  constructor(sid: string)
  {
    super(`Organization not found: ${sid}`);
    this.name = 'RSIOrganizationNotFoundError';
  }
}