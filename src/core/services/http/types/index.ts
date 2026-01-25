export interface HeaderBufferResult {
  headersComplete: boolean;
  shouldTerminate: boolean;
  reason?: string;
}
