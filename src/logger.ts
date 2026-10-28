export class Logger
{
  public static enabled = false;

  constructor(private readonly name: string)
  {
  }

  public info(message: string, context?: unknown): void
  {
    this.write('info', message, context);
  }

  public warn(message: string, context?: unknown): void
  {
    this.write('warn', message, context);
  }

  public error(message: string, context?: unknown): void
  {
    this.write('error', message, context);
  }

  private write(level: 'info' | 'warn' | 'error', message: string, context?: unknown): void
  {
    if (!Logger.enabled)
      return;

    const formattedMessage = `[${this.name}] ${message}`;
    if (context === undefined)
      console[level](formattedMessage);
    else
      console[level](formattedMessage, context);
  }
}

export const createLogger = (name: string): Logger => new Logger(name);
