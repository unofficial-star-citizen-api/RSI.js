export class RSIUserNotFoundError extends Error
{
  constructor(handle: string)
  {
    super(`User not found: ${handle}`);
    this.name = 'RSIUserNotFoundError';
  }
}