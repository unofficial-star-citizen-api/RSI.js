export class RSIError extends Error
{
  constructor(message: string, originalError?: Error)
  {
    super(message);
    this.name = 'RSIError';
    if (originalError)
    {
      this.stack += '\nCaused by: ' + originalError.stack;
    }
  }

  getStatus(): number
  {
    return 500;
  }
}