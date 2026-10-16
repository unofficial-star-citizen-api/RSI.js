import { RSIError } from '@/errors';

export class RSIUserNotFoundError extends RSIError
{
  constructor(handle: string)
  {
    super(`User not found: ${handle}`);
    this.name = 'RSIUserNotFoundError';
  }
}