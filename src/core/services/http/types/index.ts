export interface HeaderBufferResult {
  headersComplete: boolean;
  shouldTerminate: boolean;
  reason?: string;
}

export interface DecodedHeaders {
  raw: string;
  lines: string[];
}

export type HttpVersion = "HTTP/1.0" | "HTTP/1.1";

export interface ParsedHttpRequest {
  method: string;
  target: string;
  version: HttpVersion;
  headers: Map<string, string>;
}
