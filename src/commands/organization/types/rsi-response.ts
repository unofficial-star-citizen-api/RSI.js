export type RSIResponse = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: Data;
};

export type Data = {
  readonly totalrows: number;
  readonly html: string;
};
