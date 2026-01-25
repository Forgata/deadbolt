import type { DecodedHeaders } from "./types/index.js";

export function decodeHttpHeaders(headerBuffer: Buffer): DecodedHeaders {
  // http/1.x decode as latin1
  const raw = headerBuffer.toString("latin1");
  const lines = raw.split("\r\n");
  return { raw, lines };
}
