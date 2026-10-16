export class RSIError extends Error
{
  constructor(message: string)
  {
    super(message);
    this.name = 'RSIError';
  }
}