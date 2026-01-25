export interface HeaderBufferResult {
  headersComplete: boolean;
  shouldTerminate: boolean;
  reason?: string;
}

export interface DecodedHeaders {
  raw: string;
  lines: string[];
}
