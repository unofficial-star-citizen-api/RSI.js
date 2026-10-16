export class RSIOrganizationNotFoundError extends Error
{
  constructor(sid: string)
  {
    super(`Organization not found: ${sid}`);
    this.name = 'RSIOrganizationNotFoundError';
  }
}